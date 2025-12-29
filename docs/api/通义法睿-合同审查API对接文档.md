上传合同审查文件
该接口用于将文档上传到合同审查模块中，添加成功之后，系统会自动启动文件的解析，并返回对应的文件id用于后续生成审查规则和审查结果。文件解析有排队机制，如果队列较长，文件可能需要等待一段时间才能解析完成。

授权信息
当前API暂无授权信息透出。

Java依赖
最新版本可通过maven仓库查看：



复制代码
    <dependency>
            <groupId>com.aliyun</groupId>
            <artifactId>alibabacloud-farui20240628</artifactId>
            <version>1.0.7</version>
        </dependency>


     <dependency>
            <groupId>com.aliyun</groupId>
            <artifactId>farui20240628</artifactId>
            <version>1.2.3</version>
        </dependency>
请求语法
复制代码
POST https://farui.cn-beijing.aliyuncs.com/{WorkspaceId}/data/textFile
请求参数
名称	类型	必填	描述	示例值
WorkspaceId	string	是	阿里云百炼平台工作空间 ID	llm-9w5y60lseff0jiqm
ClientToken	string	是	客户端 Token，用于保证请求的幂等性。从您的客户端生成一个参数值，确保不同请求间该参数值唯一。ClientToken 只支持 ASCII 字符。说明 若您未指定，则系统自动使用 API 请求的 RequestId 作为 ClientToken 标识。每次 API 请求的 RequestId 可能不一样。	e9a93201-7e96-4dc1-9678-2832fc132d08
CreateTime	string	否	创建时间	1714476549
TextFileName	string	是	上传文件名(带后缀)	测试文件.docx
TextFileUrl	string	是	上传文件的下载 url。需要通过文件直接上传的请使用 SDK 的 CreateFileAdvanceRequest 请求	https://xx.测试文件.docx
contractId	String	否	任务id，比对审查的场景使用，首次上传文件会返回，非合同比对不关注	2334
请求示例（Python）
复制代码
import json
import hmac
import hashlib
import time
import urllib.parse
import uuid
from datetime import datetime
import requests

# 配置项
access_key_id = "XXX"
access_key_secret = "XXX"
workspace_id = 'llm-XXX'


# RFC3986 编码
def rfc3986_encode(str_value):
    return urllib.parse.quote(str_value, safe='~').replace('~', '%7E').replace('%20', '+')


# 生成阿里云签名
def ali_sign(url, method, headers, body):
    """
    生成阿里云请求签名。

    参数:
    - url: 请求的URL。
    - method: 请求方法，如GET、POST等。
    - headers: 请求头，字典格式。
    - body: 请求体，通常为字典格式。

    返回:
    - 签名字符串。
    """
    # Step 1: 规范化请求
    url_object = urllib.parse.urlparse(url)

    canonical_uri = '/'.join([rfc3986_encode(part) for part in url_object.path.split('/')])
    if not canonical_uri.startswith('/'):
        canonical_uri = '/' + canonical_uri
    query_params = sorted([
        f"{rfc3986_encode(key)}={rfc3986_encode(value)}" if value else rfc3986_encode(key)
        for key, value in urllib.parse.parse_qsl(url_object.query)
    ])
    canonical_query_string = '&'.join(query_params)

    headers1 = {key.lower(): value for key, value in headers.items()}

    canonical_headers = ''.join(
        f"{key.lower()}:{value.strip()}\n"
        for key, value in sorted(headers1.items())
        if key.lower().startswith('x-acs-') or key.lower() in ['host', 'content-type']
    )

    signed_headers = ';'.join(
        key.lower()
        for key in sorted(headers1.keys())
        if key.lower().startswith('x-acs-') or key.lower() in ['host', 'content-type']
    )

    # json_body = json.dumps(body, separators=(',', ':'))
    hashed_request_payload = hashlib.sha256(json.dumps(body).encode()).hexdigest()

    canonical_request = '\n'.join([
        method,
        canonical_uri,
        canonical_query_string,
        canonical_headers,
        signed_headers,
        hashed_request_payload
    ])

    # Step 2: 构造待签名字符串
    signature_algorithm = 'ACS3-HMAC-SHA256'
    hashed_canonical_request = hashlib.sha256(canonical_request.encode()).hexdigest()
    string_to_sign = '\n'.join([signature_algorithm, hashed_canonical_request])

    # Step 3: 计算签名
    signature = hmac.new(
        access_key_secret.encode(),
        string_to_sign.encode(),
        hashlib.sha256
    ).hexdigest()

    # Step 4: 返回签名
    return f"{signature_algorithm} Credential={access_key_id},SignedHeaders={signed_headers},Signature={signature}"


def read_from_file_path(path: str) -> bytes:
    with open(path, 'rb') as file:
        return file.read()


def generate_client_token():
    # 生成一个UUID作为ClientToken，确保不同请求间该参数值唯一。
    # UUID是128位的数字，通常以32个十六进制字符表示，中间用连字符分隔。
    # 这里使用uuid4()函数生成一个随机的UUID。
    return str(uuid.uuid4())


def get_create_time():
    # 获取当前时间并转换为Unix时间戳（自1970年1月1日以来的秒数）。
    # 使用time模块中的time()函数来得到当前时间。
    return int(time.time())


# 发送消息并处理响应
def generate_message():
    host = 'farui.cn-beijing.aliyuncs.com'
    url = f'https://{host}/{workspace_id}/data/textFile'

    # stream = read_from_file_path('/Users/Downloads/房屋租赁合同1101.docx')
    body = {
        'ClientToken': generate_client_token(),
        'CreateTime': get_create_time(), # Unix时间戳
        'TextFileUrl': 'https://www.demo.uploadfile/zufang.doc',# 文件URL
        'TextFileName': 'zufang.docx',
         'contractId': '' //合同ID处理逻辑说明：
// 1. 首次上传文件进行合同审查时，不需要设置contractId参数
// 2. 首次请求成功后，接口会返回一个contractId值
// 3. 如果需要进行比对审查（如与模板文件对比），需要在上传模版文件时传入首次返回的contractId
//4.如果进行合同比对，首次上传的文件必须要是待比对文档，带contractId的时候再上传标准文档，顺序固定
   //设置了contractId上传后不会返回fileId
    }

    now = datetime.utcnow()
    timestamp = now.strftime('%Y-%m-%dT%H:%M:%SZ')
    headers = {
        'host': host,
        'Content-Type': 'application/json',
        'x-acs-action': 'CreateTextFile',
        'x-acs-version': '2024-06-28',
        'x-acs-date': timestamp
    }
    method = 'POST'

    authorization = ali_sign(url, method, headers, body)
    headers['Authorization'] = authorization

    response = requests.post(url, headers=headers, json=body)
    if response.status_code != 200:
        raise Exception(f"Request failed with status code {response.status_code}: {response.text}")

    print(f"Final response: {response.text}")


response = generate_message()
请求示例（Java）
复制代码
package org.example;


import com.aliyun.farui20240628.Client;
import com.aliyun.farui20240628.models.CreateTextFileAdvanceRequest;
import com.aliyun.farui20240628.models.CreateTextFileResponse;
import com.aliyun.teaopenapi.models.Config;
import com.aliyun.teautil.models.RuntimeOptions;


import java.io.File;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;


public class CreateTextFile {
    public static void main(String[] args) throws Exception {


        String accessKeyId = "ALIBABA_CLOUD_ACCESS_KEY_ID";
        String accessKeySecret= "ALIBABA_CLOUD_ACCESS_KEY_SECRET";
        String endpoint = "farui.cn-beijing.aliyuncs.com";
        String workspaceId = "your-workspace-id";
        String filePath = "your-file-path";


        Config config = new Config()
        .setAccessKeyId(accessKeyId)
        .setAccessKeySecret(accessKeySecret)
        .setEndpoint(endpoint)
        .setProtocol("HTTPS");


        Client client = new Client(config);


        CreateTextFileAdvanceRequest createFileAdvanceRequest = new CreateTextFileAdvanceRequest();


        File file = new File(filePath);
        createFileAdvanceRequest.setTextFileName(file.getName()).setTextFileUrlObject(Files.newInputStream(file.toPath()))
        ;
     // 合同ID处理逻辑说明：
// 1. 首次上传文件进行合同审查时，不需要设置contractId参数
// 2. 首次请求成功后，接口会返回一个contractId值
// 3. 如果需要进行比对审查（如与模板文件对比），需要在上传新文件时传入首次返回的contractId，
//  4.如果进行合同比对，首次上传的文件必须要是待比对文档，带contractId的时候再上传标准文档，顺序固定
    }
        //设置了contractId上传后不会返回fileId
        createFileAdvanceRequest.setContractId("");
        RuntimeOptions runtime = new RuntimeOptions();
        Map<String, String> headers = new HashMap();
        CreateTextFileResponse createFileResponse = client.createTextFileAdvance(workspaceId, createFileAdvanceRequest, headers, runtime);


        System.out.println(createFileResponse.getStatusCode());
        if (createFileResponse.getStatusCode().equals(200)) {
            String fileId = createFileResponse.getBody().getData().getTextFileId();
       // 首次上传文件且未传入contractId时，API会返回一个contractId
// 此contractId可用于后续上传模板文件执行比对审查（将此值作为参数传入）
            String contractId=createTextFileResponse.getBody().getData().getContractId();
            System.out.println(fileId);
        }


    }


}
返回参数
名称	类型	描述	示例值
object	Schema of Response	
Code	string	错误 Code 码	null
Data	object	调用成功时，返回的文件信息。	
TextFileId	string	创建的文件 ID	36d6447d277c4a1c9fd0def1d16341f1
TextFileName	string	文件名	测试文件.docx
TextFileUrl	string	文件 url	https://xx.测试文
件.docx
contractId

String	任务id，比对审查的时候使用	2345
HttpStatusCode	long	http 状态码	200
Message	string	请求异常，返回具体异常错误信息。	null
RequestId	string	Id of the request	81E6F6D2-8ACB-5BDA-9C7C-4D6268CD9652
Success	boolean	是否调用成功。true：调用成功。false：调用失败。	True
示例
正常返回示例

JSON格式

复制代码
{
  "Code": "null",
  "Data": {
    "TextFileId": "36d6447d277c4a1c9fd0def1d16341f1",
    "TextFileName": "测试文件.docx",
    "TextFileUrl": "https://xx.测试文件.docx",
    "contractId":"23345"
  },
  "HttpStatusCode": 200,
  "Message": "null",
  "RequestId": "81E6F6D2-8ACB-5BDA-9C7C-4D6268CD9652",
  "Success": true
}
错误码
http_status_code	错误码	错误信息	解决方式
400	Request.Params.Error	抱歉，不支持表情和特殊字符的输入，请输入正确的文本信息	入参有非法字符，参考接口示例检查入参格式
Request.Signature.Error	请求签名错误	检查调用时的accessKey和accessSecret是否正确
403	Auth.AccessDenied.WorkSpace	无权访问此工作空间	检查账号在百炼平台的workspace访问权限，如果是子账号则需要主账号授权
权限管理_大模型服务平台百炼(Model Studio)-阿里云帮助中心
Auth.InstanceInvalid.PostPay	商品后付费实例不可用,请检查是否开通或欠费	检查账号是否开通了法睿商品实例
计量计费_大模型服务平台百炼(Model Studio)-阿里云帮助中心
Request.Params.Missing	入参用户ID缺失	检查必填的入参UserID是否为空
404	Request.Params.NotFound	入参file ID未找到	检查是否传入入参fileID
500	Internal.Server.Error	抱歉，服务器出错了，请稍后再试	后端服务出错，可以在通义法睿交流群联系开发人员检查
生成合同审查规则
该接口用于合同审查模块的智能规则生成，调用大模型返回合同的审查规则和对应风险。传入合同审查文件的ID、审查立场，会通过sse的方式增量式返回模型生成的审查规则。

接口说明
请确保在使用该接口前，已充分了解法睿产品的收费方式和价格。

该接口需要开通法睿商品相关的后付费服务（开通免费），可以使用该账号的 AccessKey 和 AccessSecret 来调用我们的 OpenApi 服务
服务的响应结果是以流式的形式来返回（SSE）。
接口的调用需要百炼平台的工作空间权限。
授权信息
当前API暂无授权信息透出。

请求语法
复制代码
POST https://farui.cn-beijing.aliyuncs.com/{workspaceId}/farui/contract/rule/genarate
请求参数
名称	类型	必填	描述	示例值
appId	string	是	应用 ID	farui
stream	boolean	是	是否是流式输出	true
workspaceId	string	是	阿里云百炼平台工作空间 ID	llm-9w5y60lseff0jiqm
assistant	object	是	智能体	
metaData	object	是	智能体元数据	
fileId	string	是	文件 ID。	9a6b1ba60d9944249363ec3cc1529b7b
position	string	是	审查立场，0=中立，1=甲方，2=乙方	1
type	string	是	智能体类型	contract_examime
version	string	是	智能体版本	1.0.0
请求示例（Python）
复制代码
import hmac
import hashlib
import json
from datetime import datetime
from urllib.parse import urlparse, urlencode, quote
import requests

# 配置项
access_key_id = "XXX"
access_key_secret = "XXX"
workspace_id = 'llm-XXX'

# RFC3986 编码
def rfc3986_encode(str_value):
    return quote(str_value, safe="-._~")


# 生成阿里云签名
def ali_sign(url, method, headers, body, access_key_id, access_key_secret):
    url_object = urlparse(url)
    canonical_uri = url_object.path if url_object.path else '/'

    query_params = {}
    if url_object.query:
        query_params = dict([part.split('=') for part in url_object.query.split('&')])
    canonical_query_string = urlencode({rfc3986_encode(k): rfc3986_encode(v) for k, v in sorted(query_params.items())})

    headers1 = {k.lower(): v for k, v in headers.items()}
    canonical_headers = ''.join(f"{k}:{v.strip()}\n" for k, v in sorted(headers1.items()) if
                                k.startswith('x-acs-') or k in ['host', 'content-type'])
    signed_headers = ';'.join(
        sorted([k for k in headers1.keys() if k.startswith('x-acs-') or k in ['host', 'content-type']]))

    hashed_request_payload = hashlib.sha256(json.dumps(body).encode()).hexdigest()

    canonical_request = '\n'.join([
        method,
        canonical_uri,
        canonical_query_string,
        canonical_headers,
        signed_headers,
        hashed_request_payload
    ])

    signature_algorithm = 'ACS3-HMAC-SHA256'
    hashed_canonical_request = hashlib.sha256(canonical_request.encode()).hexdigest()
    string_to_sign = f"{signature_algorithm}\n{hashed_canonical_request}"

    signature = hmac.new(access_key_secret.encode(), string_to_sign.encode(), hashlib.sha256).hexdigest()

    return f"{signature_algorithm} Credential={access_key_id},SignedHeaders={signed_headers},Signature={signature}"


# 发送消息并处理响应
def generate_message(on_message):
    host = 'farui.cn-beijing.aliyuncs.com'
    url = f"https://{host}/{workspace_id}/farui/contract/rule/genarate"
    body = {
        'appId': 'farui',
        'stream': True,
        'workspaceId': workspace_id,
        'assistant ': {
            'metaData': {
                'fileId': 'a7e658b29cd14fedb2b1adf63de708f9',
                'position': '1',
                'type': 'contract_examime',
                'version': '1.0.0',
            },
        },
    }

    timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
    headers = {
        'host': host,
        'Content-Type': 'application/json',
        'x-acs-action': 'RunContractRuleGeneration',
        'x-acs-version': '2024-06-28',
        'x-acs-date': timestamp,
    }

    authorization = ali_sign(url, 'POST', headers, body, access_key_id, access_key_secret)
    headers['Authorization'] = authorization

    response = requests.post(url, headers=headers, data=json.dumps(body), stream=True)
    if response.status_code != 200:
        print(f"HTTP Error: {response.status_code}\nResponse: {response.text}")
        return

    for line in response.iter_lines():
        if line:
            decoded_line = line.decode('utf-8')
            if decoded_line.startswith('data:'):
                json_data = decoded_line[5:]
                on_message(json.loads(json_data))


generate_message(lambda data: print("Received message:", data))
请求示例（Java）
复制代码
package org.example;

import com.aliyun.auth.credentials.Credential;
import com.aliyun.auth.credentials.provider.StaticCredentialProvider;
import com.aliyun.sdk.gateway.pop.Configuration;
import com.aliyun.sdk.gateway.pop.auth.SignatureVersion;
import com.aliyun.sdk.service.farui20240628.AsyncClient;
import com.aliyun.sdk.service.farui20240628.models.RunContractRuleGenerationRequest;
import com.aliyun.sdk.service.farui20240628.models.RunContractRuleGenerationResponseBody;
import darabonba.core.RequestConfiguration;
import darabonba.core.ResponseIterable;
import darabonba.core.ResponseIterator;
import darabonba.core.client.ClientOverrideConfiguration;

import java.time.Duration;

public class RunContractRuleGeneration {
    public static void main(String[] args) throws Exception {
        String accessKeyId = "ALIBABA_CLOUD_ACCESS_KEY_ID";
        String accessKeySecret= "ALIBABA_CLOUD_ACCESS_KEY_SECRET";
        String endpoint = "farui.cn-beijing.aliyuncs.com";
        String workspaceId = "your-workspace-id";
        //CreateTextFile返回的fileId
        String fileId = "your-file-id";

        StaticCredentialProvider provider = StaticCredentialProvider.create(
                Credential.builder()
                        .accessKeyId(accessKeyId)
                        .accessKeySecret(accessKeySecret)
                        .build()
        );

        AsyncClient clientAs = AsyncClient.builder()// Region ID
                .credentialsProvider(provider)
                // Service-level configuration
                .serviceConfiguration(Configuration.create()
                        .setSignatureVersion(SignatureVersion.V3)
                )
                // Client-level configuration rewrite, can set Endpoint, Http request parameters, etc.
                .overrideConfiguration(
                        ClientOverrideConfiguration.create()
                                .setProtocol("HTTPS")
                                .setEndpointOverride(endpoint)
                )
                .build();

        RunContractRuleGenerationRequest.MetaData metaData = RunContractRuleGenerationRequest.MetaData.builder()
                .fileId(fileId).position("1").build();

        RunContractRuleGenerationRequest.Assistant ruleAssistant = RunContractRuleGenerationRequest.Assistant.builder()
                .type("contract_examime")
                .version("1")
                .metaData(metaData)
                .build();

        RequestConfiguration requestConfiguration = RequestConfiguration.create()
                .setConnectTimeout(Duration.ofSeconds(3*60))
                .setResponseTimeout(Duration.ofSeconds(3*60));

        RunContractRuleGenerationRequest runContractRuleGenerationRequest = RunContractRuleGenerationRequest.builder()
                .appId("farui")
                .stream(true)
                .workspaceId(workspaceId).requestConfiguration(requestConfiguration)
                .assistant(ruleAssistant)
                .build();

        ResponseIterable<RunContractRuleGenerationResponseBody> x = clientAs.runContractRuleGenerationWithResponseIterable(runContractRuleGenerationRequest);

        ResponseIterator<RunContractRuleGenerationResponseBody> iterator = x.iterator();
        while (iterator.hasNext()) {
            System.out.println("----event----");
            RunContractRuleGenerationResponseBody event = iterator.next();
            if (event.getOutput().getRuleTaskId()!=null) {
                System.out.println(event.getOutput().getRuleTaskId());
            }
            if (event.getOutput().getRules()!=null && event.getOutput().getRules().size()>0) {
                System.out.println(event.getOutput().getRules().get(0).getRuleSequence());
                System.out.println(event.getOutput().getRules().get(0).getRuleTag());
                System.out.println(event.getOutput().getRules().get(0).getRuleTitle());
                System.out.println(event.getOutput().getRules().get(0).getRiskLevel());
            }
        }
    }
}
返回参数
名称	类型	描述	示例值
object	Schema of Response	
Code	string	错误 Code 码	null
Message	string	请求异常，返回具体异常错误信息。	null
Output	object	输出信息	
ruleTaskId	string	生成规则任务的 ID	b265b416-ca1f-425d-9340-c968f39624e9
rules	array	模型生成的规则（增量式）	
object		
riskLevel	string	规则风险等级(high-高风险、medium-中风险、low-低风险)	medium
ruleSequence	string	规则序号	1.1
ruleTag	string	规则标签（类型）	审查条款的合法性
ruleTitle	string	规则标题	审查该合同标的条款中，标的合法性相关的风险
RequestId	string	阿里云为该请求生成的唯一标识符。	744419D0-671A-5997-9840-E8AE48356194
Success	boolean	是否调用成功。true：调用成功。 false：调用失败。	True
Usage	object	本次调用的使用量（合同审查按页码计费）	
input	long	输入的文档页数	5
unit	string	单元（固定为 page）	page
httpStatusCode	integer	HTTP 状态码	200
示例
正常返回示例

JSON格式

复制代码
{
  "Code": "null",
  "Message": "null",
  "Output": {
    "ruleTaskId": "b265b416-ca1f-425d-9340-c968f39624e9",
    "rules": [
      {
        "riskLevel": "medium",
        "ruleSequence": "1.1",
        "ruleTag": "审查条款的合法性",
        "ruleTitle": "审查该合同标的条款中，标的合法性相关的风险"
      }
    ]
  },
  "RequestId": "744419D0-671A-5997-9840-E8AE48356194",
  "Success": true,
  "Usage": {
    "input": 5,
    "unit": "page"
  },
  "httpStatusCode": 200
}
错误码
http_status_code	错误码	错误信息	解决方式
400	Request.Params.Error	抱歉，不支持表情和特殊字符的输入，请输入正确的文本信息	入参有非法字符，参考接口示例检查入参格式
Request.Signature.Error	请求签名错误	检查调用时的accessKey和accessSecret是否正确
403	Auth.AccessDenied.WorkSpace	无权访问此工作空间	检查账号在百炼平台的workspace访问权限，如果是子账号则需要主账号授权
权限管理_大模型服务平台百炼(Model Studio)-阿里云帮助中心
Auth.InstanceInvalid.PostPay	商品后付费实例不可用,请检查是否开通或欠费	检查账号是否开通了法睿商品实例
计量计费_大模型服务平台百炼(Model Studio)-阿里云帮助中心
Request.Params.Missing	入参用户ID缺失	检查必填的入参UserID是否为空
404	Request.Params.NotFound	入参file ID未找到	检查是否传入入参fileID
500	Internal.Server.Error	抱歉，服务器出错了，请稍后再试	后端服务出错，可以在通义法睿交流群联系开发人员检查
生成合同审查结果
该接口用于合同审查模块的审查结果生成，调用大模型返回合同的审查结果、审查风险项、建议修改内容等。传入合同审查文件的ID、审查立场、审查规则，会通过sse的方式增量式返回模型生成的审查结果。

接口说明
请确保在使用该接口前，已充分了解法睿产品的收费方式和价格。

该接口需要开通法睿商品相关的后付费服务（开通免费），可以使用该账号的 AccessKey 和 AccessSecret 来调用我们的 OpenApi 服务
服务的响应结果是以流式的形式来返回（SSE）。
接口的调用需要百炼平台的工作空间权限。
授权信息
当前API暂无授权信息透出。

请求语法
复制代码
POST https://farui.cn-beijing.aliyuncs.com/{workspaceId}/farui/contract/result/genarate
请求参数
名称	类型	必填	描述	示例值
appId	string	是	应用 ID	farui
stream	boolean	是	是否是流式输出	true
workspaceId	string	是	阿里云百炼平台工作空间 ID	llm-kqtrcpdee4xm29xc
assistant	object	是	智能体	
metaData	object	是	智能体元数据	
customRuleConfig	object	否	自定义规则配置	
customRules	array	否	自定义规则列表	
object	否		
riskLevel	string	是	规则风险等级(high-高风险、medium-中风险、low-低风险)	high
ruleDesc	string	是	规则描述	所有涉及法律引用的合同条款，包括但不限于合同的管辖法律、争议解决机制、合规要求、特定行业法规以及其他法律义务和权利的引用。
ruleTitle	string	是	规则标题	审查条款的合法性
fileId	string	是	文件 ID。	9a6b1ba60d9944249363ec3cc1529b7b
position	string	是	审查立场，0=中立，1=甲方，2=乙方	1
ruleTaskId	string	是	生成审查规则任务的 ID	b265b416-ca1f-425d-9340-c968f39624e1
rules	array	否	模型生成的规则列表	
object	否		
riskLevel	string	是	规则风险等级(high-高风险、medium-中风险、low-低风险)	medium
ruleSequence	string	是	规则序号	2.1
ruleTag	string	是	规则标签（类型）	审查通用条款的常见风险
ruleTitle	string	是	规则标题	审查该合同免责条款中，法定免责情形审查相关的风险。
type	string	是	智能体类型	contract_examime
version	string	是	智能体版本	1.0.0
请求示例(Python)
复制代码
import hmac
import hashlib
import json
from datetime import datetime
from urllib.parse import urlparse, urlencode, quote
import requests

# 配置项
access_key_id = "XXX"
access_key_secret = "XXX"
workspace_id = 'llm-XXX'


# RFC3986 编码
def rfc3986_encode(str_value):
    return quote(str_value, safe="-._~")


# 生成阿里云签名
def ali_sign(url, method, headers, body, access_key_id, access_key_secret):
    url_object = urlparse(url)
    canonical_uri = url_object.path if url_object.path else '/'

    query_params = {}
    if url_object.query:
        query_params = dict([part.split('=') for part in url_object.query.split('&')])
    canonical_query_string = urlencode({rfc3986_encode(k): rfc3986_encode(v) for k, v in sorted(query_params.items())})

    headers1 = {k.lower(): v for k, v in headers.items()}
    canonical_headers = ''.join(f"{k}:{v.strip()}\n" for k, v in sorted(headers1.items()) if
                                k.startswith('x-acs-') or k in ['host', 'content-type'])
    signed_headers = ';'.join(
        sorted([k for k in headers1.keys() if k.startswith('x-acs-') or k in ['host', 'content-type']]))

    hashed_request_payload = hashlib.sha256(json.dumps(body).encode()).hexdigest()

    canonical_request = '\n'.join([
        method,
        canonical_uri,
        canonical_query_string,
        canonical_headers,
        signed_headers,
        hashed_request_payload
    ])

    signature_algorithm = 'ACS3-HMAC-SHA256'
    hashed_canonical_request = hashlib.sha256(canonical_request.encode()).hexdigest()
    string_to_sign = f"{signature_algorithm}\n{hashed_canonical_request}"

    signature = hmac.new(access_key_secret.encode(), string_to_sign.encode(), hashlib.sha256).hexdigest()

    return f"{signature_algorithm} Credential={access_key_id},SignedHeaders={signed_headers},Signature={signature}"


# 发送消息并处理响应
def generate_message(on_message):
    host = 'farui.cn-beijing.aliyuncs.com'
    url = f"https://{host}/{workspace_id}/farui/contract/result/genarate"
    body = {
        'appId': 'farui',
        'stream': True,
        'workspaceId': workspace_id,
        'assistant	': {
            'metaData': {
                "rules": [{
                            "ruleSequence": "1.1",
                            "riskLevel": "high",
                            "ruleTag": "审查合同的合法性",
                            "ruleTitle": "投标保证金要求，收取金额计算"
                        }],
                "customRuleConfig": {
                    "customRules": [
                        {
                            "riskLevel": "high",
                            "ruleDesc": "《中华人民共和国招标投标法实施条例》第二十六条 招标人在招标文件中要求投标人提交投标保证金的，投标保证金不得超过招标项目估算价的 2%。",
                            "ruleTitle": "投标保证金要求，收取金额计算"
                        }
                    ]
                },
                "fileId": "5cd75d1f473848a58a4e5ffb78741ff0",
                "position": "1",
                "ruleTaskId": "7243c029-74ee-466a-bf42-0529ad142d26"
            },
            "type": "contract_examime",
            "version": "1"
        },
    }

    timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
    headers = {
        'host': host,
        'Content-Type': 'application/json',
        'x-acs-action': 'RunContractResultGeneration',
        'x-acs-version': '2024-06-28',
        'x-acs-date': timestamp,
    }

    authorization = ali_sign(url, 'POST', headers, body, access_key_id, access_key_secret)
    headers['Authorization'] = authorization

    response = requests.post(url, headers=headers, data=json.dumps(body), stream=True)
    if response.status_code != 200:
        print(f"HTTP Error: {response.status_code}\nResponse: {response.text}")
        return

    for line in response.iter_lines():
        if line:
            decoded_line = line.decode('utf-8')
            if decoded_line.startswith('data:'):
                json_data = decoded_line[5:]
                on_message(json.loads(json_data))


generate_message(lambda data: print("Received message:", data))
请求示例(Java)
复制代码
package org.example;

import com.aliyun.auth.credentials.Credential;
import com.aliyun.auth.credentials.provider.StaticCredentialProvider;
import com.aliyun.sdk.gateway.pop.Configuration;
import com.aliyun.sdk.gateway.pop.auth.SignatureVersion;
import com.aliyun.sdk.service.farui20240628.AsyncClient;
import com.aliyun.sdk.service.farui20240628.models.RunContractResultGenerationRequest;
import com.aliyun.sdk.service.farui20240628.models.RunContractResultGenerationResponseBody;
import darabonba.core.ResponseIterable;
import darabonba.core.ResponseIterator;
import darabonba.core.client.ClientOverrideConfiguration;

import java.util.ArrayList;
import java.util.List;

public class RunContractResultGeneration {
    public static void main(String[] args) throws Exception {
        String accessKeyId = "ALIBABA_CLOUD_ACCESS_KEY_ID";
        String accessKeySecret= "ALIBABA_CLOUD_ACCESS_KEY_SECRET";
        String endpoint = "farui.cn-beijing.aliyuncs.com";
        String workspaceId = "your-workspace-id";
        //CreateTextFile返回的fileId
        String fileId = "your-file-id";
        //RunContractRuleGeneration返回的ruleTaskId
        String ruleTaskId = "your-rule-task-id";

        StaticCredentialProvider provider = StaticCredentialProvider.create(
                Credential.builder()
                        .accessKeyId(accessKeyId)
                        .accessKeySecret(accessKeySecret)
                        .build()
        );
        AsyncClient client = AsyncClient.builder()// Region ID
                .credentialsProvider(provider)
                .serviceConfiguration(Configuration.create()
                        .setSignatureVersion(SignatureVersion.V3)
                )
                .overrideConfiguration(
                        ClientOverrideConfiguration.create()
                                .setProtocol("HTTPS")
                                .setEndpointOverride(endpoint)
                )
                .build();

        //这里是 runContractRuleGeneration生成的规则，规则内容需要和生成时保持一致
        //规则也可以通过 RunContractResultGenerationRequest.MetaData.CustomRuleConfig 传入自定义规则
        RunContractResultGenerationRequest.Rules rule = RunContractResultGenerationRequest.Rules.builder()
                .ruleSequence("1.1")
                .ruleTag("审查合同的合法性")
                .ruleTitle("审查该合同标的条款中，标的合法性相关的风险")
                .riskLevel("high")
                .build();
        List<RunContractResultGenerationRequest.Rules> rules = new ArrayList<>();
        rules.add(rule);

        RunContractResultGenerationRequest.MetaData metaData = RunContractResultGenerationRequest.MetaData.builder()
                .fileId(fileId)
                .position("1")
                .ruleTaskId(ruleTaskId)
                .rules(rules)
                .build();

        RunContractResultGenerationRequest.Assistant assistant = RunContractResultGenerationRequest.Assistant.builder()
                .type("contract_examime")
                .metaData(metaData)
                .version("1")
                .build();

        RunContractResultGenerationRequest request = RunContractResultGenerationRequest.builder()
                .appId("farui")
                .stream(true)
                .workspaceId(workspaceId)
                .assistant(assistant)
                .build();

        ResponseIterable<RunContractResultGenerationResponseBody> x = client.runContractResultGenerationWithResponseIterable(request);

        ResponseIterator<RunContractResultGenerationResponseBody> iterator = x.iterator();
        while (iterator.hasNext()) {
            System.out.println("----event----");
            RunContractResultGenerationResponseBody event = iterator.next();
            if (event.getOutput()!=null) {
                System.out.println(event.toMap().toString());
            }
        }
    }
}
返回参数
名称	类型	描述	示例值
object	Schema of Response	
Code	string	错误 Code 码	null
Message	string	请求异常，返回具体异常错误信息。	null
Output	object	输出信息	
result	object	合同审查结果	
examineBrief	string	审查结果概述	合同中未明确法定免责条款，尤其是不可抗力的定义和后果，可能在发生不可抗力事件时导致双方权益不明，因此需要进行补充
examineResult	string	审查结论	需要修改
riskLevel	string	规则风险等级(high-高风险、medium-中风险、low-低风险)	high
ruleSequence	string	该审查结果对应的规则序号	1.1
ruleTag	string	该审查结果对应的规则标签	审查通用条款的常见风险
ruleTitle	string	该审查结果对应的规则标题	审查该合同免责条款中，法定免责情形审查相关的风险。
subRisks	array	审查结果的风险子项	
object		
originalContent	string	风险项对应的合同原文	14. 其他约定事项：
resultContent	string	修改后文本	14.1 不可抗力条款14.1.1 不可抗力定义：指在本协议签署后发生的、本协议签署时不能预见的、其发生与后果是无法避免或克服的、妨碍任何一方全部或部分履约的所有事件。上述事件包括但不限于地震、台风、洪水、火灾、战争、国际或国内运输中断、流行病、罢工，以及根据中国法律或一般国际商业惯例认作不可抗力的其他事件。14.1.2 不可抗力的后果：14.1.2.1 如果发生不可抗力事件，影响一方履行其在本协议项下的义务，则在不可抗力造成的延误期内中止履行，而不视为违约。14.1.2.2 宣称发生不可抗力的一方应迅速书面通知其他各方，并在其后的十五(15)天内提供证明不可抗力发生及其持续时间的足够证据。14.1.2.3 如果发生不可抗力事件，各方应立即互相协商，以找到公平的解决办法，并且应尽一切合理努力将不可抗力的影响减少到最低限度。14.1.2.4 金钱债务的迟延责任不得因不可抗力而免除。14.1.2.5 迟延履行期间发生的不可抗力不具有免责效力。
standardOriginalContent	string	标准文档字段，合同比对模式下有该字段	
resultType	string	风险项审查结果建议（需修改/需删除/需新增/通过）	需修改
riskBrief	string	风险简述	未定义不可抗力及其后果，可能导致在发生不可抗力时，双方权益无法得到保障
riskClause	string	风险条款名称	不可抗力条款
riskExplain	string	风险点说明	未明确法定免责情形—不可抗力
resultTaskId	string	生成审查结果任务的 ID	eaa56e1e-e205-4f5e-926e-5e2269ae7f68
RequestId	string	阿里云为该请求生成的唯一标识符。	744419D0-671A-5997-9840-E8AE48356194
Success	boolean	是否调用成功。true：调用成功。 false：调用失败。	True
Usage	object	本次调用的使用量	
input	long	输入的文档页数	5
unit	string	单元（固定为 page）	page
httpStatusCode	string	HTTP 状态码	200
示例
正常返回示例

JSON格式

复制代码
{
  "Code": "null",
  "Message": "null",
  "Output": {
    "result": {
      "examineBrief": "合同中未明确法定免责条款，尤其是不可抗力的定义和后果，可能在发生不可抗力事件时导致双方权益不明，因此需要进行补充",
      "examineResult": "需要修改",
      "riskLevel": "high",
      "ruleSequence": "1.1",
      "ruleTag": "审查通用条款的常见风险",
      "ruleTitle": "审查该合同免责条款中，法定免责情形审查相关的风险。",
      "subRisks": [
        {
          "originalContent": "14. 其他约定事项：",
          "resultContent": "14.1 不可抗力条款14.1.1 不可抗力定义：指在本协议签署后发生的、本协议签署时不能预见的、其发生与后果是无法避免或克服的、妨碍任何一方全部或部分履约的所有事件。上述事件包括但不限于地震、台风、洪水、火灾、战争、国际或国内运输中断、流行病、罢工，以及根据中国法律或一般国际商业惯例认作不可抗力的其他事件。14.1.2 不可抗力的后果：14.1.2.1 如果发生不可抗力事件，影响一方履行其在本协议项下的义务，则在不可抗力造成的延误期内中止履行，而不视为违约。14.1.2.2 宣称发生不可抗力的一方应迅速书面通知其他各方，并在其后的十五(15)天内提供证明不可抗力发生及其持续时间的足够证据。14.1.2.3 如果发生不可抗力事件，各方应立即互相协商，以找到公平的解决办法，并且应尽一切合理努力将不可抗力的影响减少到最低限度。14.1.2.4 金钱债务的迟延责任不得因不可抗力而免除。14.1.2.5 迟延履行期间发生的不可抗力不具有免责效力。",
          "resultType": "需修改",
          "riskBrief": "未定义不可抗力及其后果，可能导致在发生不可抗力时，双方权益无法得到保障",
          "riskClause": "不可抗力条款",
          "riskExplain": "未明确法定免责情形—不可抗力"
        }
      ]
    },
    "resultTaskId": "eaa56e1e-e205-4f5e-926e-5e2269ae7f68"
  },
  "RequestId": "744419D0-671A-5997-9840-E8AE48356194",
  "Success": true,
  "Usage": {
    "input": 5,
    "unit": "page"
  },
  "httpStatusCode": "200"
}
错误码
http_status_code	错误码	错误信息	解决方式
400	Request.Params.Error	抱歉，不支持表情和特殊字符的输入，请输入正确的文本信息	入参有非法字符，参考接口示例检查入参格式
Request.Signature.Error	请求签名错误	检查调用时的accessKey和accessSecret是否正确
403	Auth.AccessDenied.WorkSpace	无权访问此工作空间	检查账号在百炼平台的workspace访问权限，如果是子账号则需要主账号授权
权限管理_大模型服务平台百炼(Model Studio)-阿里云帮助中心
Auth.InstanceInvalid.PostPay	商品后付费实例不可用,请检查是否开通或欠费	检查账号是否开通了法睿商品实例
计量计费_大模型服务平台百炼(Model Studio)-阿里云帮助中心
Request.Params.Missing	入参用户ID缺失	检查必填的入参UserID是否为空
404	Request.Params.NotFound	入参file ID未找到	检查是否传入入参fileID
500	Internal.Server.Error	抱歉，服务器出错了，请稍后再试	后端服务出错，可以在通义法睿交流群联系开发人员检查




合同抽取
该接口用于用于根据合同内容抽取相应的字段。用户输入合同链接和抽取字段信息后会进行对应字段抽取。

授权信息
当前API暂无授权信息透出。

请求语法
复制代码
POST https://farui.cn-beijing.aliyuncs.com/{WorkspaceId}/pop/contract/extraction
请求参数
名称	类型	必填	描述	示例值
WorkspaceId	string	是	阿里云百炼平台工作空间 ID	llm-9w5y60lseff0jiqm
ClientToken	string	是	客户端 Token，用于保证请求的幂等性。从您的客户端生成一个参数值，确保不同请求间该参数值唯一。ClientToken 只支持 ASCII 字符。说明 若您未指定，则系统自动使用 API 请求的 RequestId 作为 ClientToken 标识。每次 API 请求的 RequestId 可能不一样。	e9a93201-7e96-4dc1-9678-2832fc132d08
fileOssUrl	string	是	可使用的文件ossUrl	https://xxxxx.oss-cn-hangzhou.aliyuncs.com/legalmind/userdownload/4a83e0fe-baee-41d5-89f6-e33c8d462839/contract/report/9ce843d2-a05e-4351-9d69-15ae96bd910a_1713348901026.pdf
fieldsToExtract	List	是	需要抽取的字段名列表，
抽取字段最多10个。	
FieldsToExtractVo参数

名称	类型	必填	描述
extractItem	string	是	抽取字段的名称
option	List	否	抽取字段的固定枚举值
desc	string	否	抽取字段描述
请求示例（python3.8）
复制代码
import json
import hmac
import hashlib
import time
import urllib.parse
import uuid
from datetime import datetime
import requests

# 配置项
access_key_id = "XXX"
access_key_secret = "XXX"
workspace_id = 'llm-XXX'


# RFC3986 编码
def rfc3986_encode(str_value):
    return urllib.parse.quote(str_value, safe='~').replace('~', '%7E').replace('%20', '+')


# 生成阿里云签名
def ali_sign(url, method, headers, body):
    """
    生成阿里云请求签名。

    参数:
    - url: 请求的URL。
    - method: 请求方法，如GET、POST等。
    - headers: 请求头，字典格式。
    - body: 请求体，通常为字典格式。

    返回:
    - 签名字符串。
    """
    # Step 1: 规范化请求
    url_object = urllib.parse.urlparse(url)

    canonical_uri = '/'.join([rfc3986_encode(part) for part in url_object.path.split('/')])
    if not canonical_uri.startswith('/'):
        canonical_uri = '/' + canonical_uri
    query_params = sorted([
        f"{rfc3986_encode(key)}={rfc3986_encode(value)}" if value else rfc3986_encode(key)
        for key, value in urllib.parse.parse_qsl(url_object.query)
    ])
    canonical_query_string = '&'.join(query_params)

    headers1 = {key.lower(): value for key, value in headers.items()}

    canonical_headers = ''.join(
        f"{key.lower()}:{value.strip()}\n"
        for key, value in sorted(headers1.items())
        if key.lower().startswith('x-acs-') or key.lower() in ['host', 'content-type']
    )

    signed_headers = ';'.join(
        key.lower()
        for key in sorted(headers1.keys())
        if key.lower().startswith('x-acs-') or key.lower() in ['host', 'content-type']
    )

    # json_body = json.dumps(body, separators=(',', ':'))
    hashed_request_payload = hashlib.sha256(json.dumps(body).encode()).hexdigest()

    canonical_request = '\n'.join([
        method,
        canonical_uri,
        canonical_query_string,
        canonical_headers,
        signed_headers,
        hashed_request_payload
    ])

    # Step 2: 构造待签名字符串
    signature_algorithm = 'ACS3-HMAC-SHA256'
    hashed_canonical_request = hashlib.sha256(canonical_request.encode()).hexdigest()
    string_to_sign = '\n'.join([signature_algorithm, hashed_canonical_request])

    # Step 3: 计算签名
    signature = hmac.new(
        access_key_secret.encode(),
        string_to_sign.encode(),
        hashlib.sha256
    ).hexdigest()

    # Step 4: 返回签名
    return f"{signature_algorithm} Credential={access_key_id},SignedHeaders={signed_headers},Signature={signature}"


def read_from_file_path(path: str) -> bytes:
    with open(path, 'rb') as file:
        return file.read()


def generate_client_token():
    # 生成一个UUID作为ClientToken，确保不同请求间该参数值唯一。
    # UUID是128位的数字，通常以32个十六进制字符表示，中间用连字符分隔。
    # 这里使用uuid4()函数生成一个随机的UUID。
    return str(uuid.uuid4())


def get_create_time():
    # 获取当前时间并转换为Unix时间戳（自1970年1月1日以来的秒数）。
    # 使用time模块中的time()函数来得到当前时间。
    return int(time.time())


# 发送消息并处理响应

def generate_message():
    host = 'farui.cn-beijing.aliyuncs.com'
    url = f'https://{host}/{workspace_id}/pop/contract/extraction'
# 抽取字段最多10个。
    body = {
        'ClientToken': generate_client_token(),
        'fileOssUrl': 'https://xxxxx.oss-cn-hangzhou.aliyuncs.com/legalmind/xxxxx.pdf', 
        'fieldsToExtract': [
            {
                'extractItem': '金额类型',
                'option': ['收入', '支出', '无金额'],
                'desc': '合同涉及的金额类型，三选一'
            }
        ]
    }

    now = datetime.utcnow()
    timestamp = now.strftime('%Y-%m-%dT%H:%M:%SZ')
    headers = {
        'host': host,
        'Content-Type': 'application/json',
        'x-acs-action': 'extraction',
        'x-acs-version': '2024-06-28',
        'x-acs-date': timestamp
    }
    method = 'POST'

    authorization = ali_sign(url, method, headers, body)
    headers['Authorization'] = authorization

    response = requests.post(url, headers=headers, json=body)
    if response.status_code != 200:
        raise Exception(f"Request failed with status code {response.status_code}: {response.message}")

    print(f"Final response: {response.data}")


response = generate_message()
返回参数
名称	类型	描述	示例值
object	Schema of Response	
Code	string	错误 Code 码	null
Data	object	调用成功时，返回的文件信息。	
HttpStatusCode	long	http 状态码	200
Message	string	请求异常，返回具体异常错误信息。	null
RequestId	string	Id of the request	81E6F6D2-8ACB-5BDA-9C7C-4D6268CD9652
Success	boolean	是否调用成功。true：调用成功。false：调用失败。	True
data属性

名称	类型	描述
contractText	string	合同内容
extractResult	List<FieldsToExtractResponseVo>	抽取结果
成功则展示入参对应字段信息、若失败显示空数组
FieldsToExtractResponseVo属性

名称	类型	描述
extractItem	String	抽取字段的名称
option	List	抽取字段的固定枚举值
desc	String	抽取字段描述
value	List<ExtractValueVo>	抽取结果，若没有显示空数组
ExtractValueVo属性

名称	类型	描述
data	String	抽取字段的值
originalText	String	抽取字段的原文内容
示例
正常返回示例

JSON格式

复制代码
{
  "code": "200",
  "data": {
    "text": "甲方与乙方签署的技术服务合作协议...",
    "extractResult": [
       {
         "extractItem": "金额类型",
        "option": ["收入", "支出", "无金额"],
        "desc": "合同涉及的金额类型，三选一",
        "value": [
          {
            "data": "收入",
            "originalText": "金额类型：收入"
          }
        ]
       }
    ],
   
  },
  "httpStatusCode": 200,
  "message": "null",
  "requestId": "81E6F6D2-8ACB-5BDA-9C7C-4D6268CD9652",
  "success": true
}
错误码
http_status_code	错误码	错误信息	解决方式
400	Request.Params.Error	抱歉，不支持表情和特殊字符的输入，请输入正确的文本信息	入参有非法字符，参考接口示例检查入参格式
Request.Signature.Error	请求签名错误	检查调用时的accessKey和accessSecret是否正确
403	Auth.AccessDenied.WorkSpace	无权访问此工作空间	检查账号在百炼平台的workspace访问权限，如果是子账号则需要主账号授权
权限管理_大模型服务平台百炼(Model Studio)-阿里云帮助中心
Auth.InstanceInvalid.PostPay	商品后付费实例不可用,请检查是否开通或欠费	检查账号是否开通了法睿商品实例
计量计费_大模型服务平台百炼(Model Studio)-阿里云帮助中心
500	Internal.Server.Error	抱歉，服务器出错了，请稍后再试	后端服务出错，可以在通义法睿交流群联系开发人员检查