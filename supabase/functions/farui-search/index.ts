// @ts-ignore: Deno global
// deno-lint-ignore-file
// Supabase Edge Function: 通义法睿案例检索代理
// 处理 ACS3-HMAC-SHA256 签名和 API 请求转发

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Deno 类型声明（仅用于IDE，不影响运行）
declare const Deno: {
    env: {
        get(key: string): string | undefined;
    };
};

// 从环境变量获取凭证（不要在代码中硬编码）
const ACCESS_KEY_ID = Deno.env.get('FARUI_ACCESS_KEY_ID') || '';
const ACCESS_KEY_SECRET = Deno.env.get('FARUI_ACCESS_KEY_SECRET') || '';

const FARUI_HOST = 'farui.cn-beijing.aliyuncs.com';
const API_VERSION = '2024-06-28';
const ACTION = 'RunSearchCaseFullText';

/**
 * 生成随机字符串
 */
function generateNonce(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * SHA256 哈希
 */
async function sha256(message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * HMAC-SHA256 签名
 */
async function hmacSha256(key: Uint8Array, message: string): Promise<Uint8Array> {
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key.buffer as ArrayBuffer,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const encoded = new TextEncoder().encode(message);
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoded);
    return new Uint8Array(signature);
}

/**
 * 将 Uint8Array 转为十六进制字符串
 */
function toHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * URL 编码（符合阿里云规范）
 */
function percentEncode(str: string): string {
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
}

/**
 * 构建规范化请求头字符串
 */
function buildCanonicalHeaders(headers: Record<string, string>): string {
    const signedHeaders = Object.keys(headers)
        .filter(key => key.toLowerCase().startsWith('x-acs-') || key.toLowerCase() === 'host' || key.toLowerCase() === 'content-type')
        .sort()
        .map(key => `${key.toLowerCase()}:${headers[key].trim()}`);

    return signedHeaders.join('\n') + '\n';
}

/**
 * 构建签名头列表
 */
function buildSignedHeaders(headers: Record<string, string>): string {
    return Object.keys(headers)
        .filter(key => key.toLowerCase().startsWith('x-acs-') || key.toLowerCase() === 'host' || key.toLowerCase() === 'content-type')
        .sort()
        .map(key => key.toLowerCase())
        .join(';');
}

/**
 * 生成 ACS3-HMAC-SHA256 签名
 */
async function generateSignature(
    method: string,
    path: string,
    headers: Record<string, string>,
    body: string
): Promise<string> {
    // 1. 构建规范化请求
    const hashedPayload = await sha256(body);
    const canonicalHeaders = buildCanonicalHeaders(headers);
    const signedHeaders = buildSignedHeaders(headers);

    const canonicalRequest = [
        method,
        path,
        '', // query string (empty for POST)
        canonicalHeaders,
        signedHeaders,
        hashedPayload
    ].join('\n');

    // 2. 构建待签名字符串
    const hashedCanonicalRequest = await sha256(canonicalRequest);
    const stringToSign = `ACS3-HMAC-SHA256\n${hashedCanonicalRequest}`;

    // 3. 计算签名
    const secretKey = new TextEncoder().encode(ACCESS_KEY_SECRET);
    const signature = await hmacSha256(secretKey, stringToSign);

    return toHex(signature);
}

serve(async (req: Request) => {
    // 处理 CORS 预检请求
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
            },
        });
    }

    try {
        // 检查凭证是否配置
        if (!ACCESS_KEY_ID || !ACCESS_KEY_SECRET) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'API credentials not configured'
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // 解析请求体
        const requestBody = await req.json();
        const { workspaceId } = requestBody;

        if (!workspaceId) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'workspaceId is required'
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // 构建 API URL
        const apiPath = `/${workspaceId}/farui/search/case/fulltext`;
        const apiUrl = `https://${FARUI_HOST}${apiPath}`;

        // 生成请求时间
        const now = new Date();
        const timestamp = now.toISOString().replace(/\.\d{3}Z$/, 'Z');
        const nonce = generateNonce();

        // 构建请求头
        const bodyString = JSON.stringify(requestBody);
        const headers: Record<string, string> = {
            'host': FARUI_HOST,
            'content-type': 'application/json',
            'x-acs-action': ACTION,
            'x-acs-version': API_VERSION,
            'x-acs-date': timestamp,
            'x-acs-signature-nonce': nonce,
        };

        // 生成签名
        const signature = await generateSignature('POST', apiPath, headers, bodyString);
        const signedHeaders = buildSignedHeaders(headers);

        // 构建 Authorization 头
        const authorization = `ACS3-HMAC-SHA256 Credential=${ACCESS_KEY_ID},SignedHeaders=${signedHeaders},Signature=${signature}`;
        headers['Authorization'] = authorization;

        // 发送请求到通义法睿 API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: bodyString
        });

        const responseData = await response.json();

        // 返回响应
        return new Response(
            JSON.stringify(responseData),
            {
                status: response.status,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }
        );

    } catch (error: any) {
        console.error('Farui API Error:', error);
        return new Response(
            JSON.stringify({
                success: false,
                message: error.message || 'Internal server error'
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }
        );
    }
});
