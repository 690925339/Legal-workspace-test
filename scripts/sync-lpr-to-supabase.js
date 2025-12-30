import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Read .env
function readEnv() {
    try {
        const envPath = path.resolve(__dirname, '../.env');
        console.log('Reading .env from:', envPath);
        if (!fs.existsSync(envPath)) return {};

        const content = fs.readFileSync(envPath, 'utf-8');
        const env = {};
        content.split(/\r?\n/).forEach(line => {
            if (!line || line.startsWith('#')) return;
            const match = line.match(/^\s*([^=]+?)\s*=\s*(.*)?\s*$/);
            if (match) {
                env[match[1]] = match[2];
            }
        });
        return env;
    } catch (e) {
        console.error('❌ Error reading .env:', e.message);
        return {};
    }
}

const env = readEnv();
const TOKEN = env.VITE_TUSHARE_TOKEN;
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY;

if (!TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing configuration in .env');
    console.log('Token:', !!TOKEN, 'URL:', !!SUPABASE_URL, 'Key:', !!SUPABASE_KEY);
    process.exit(1);
}

// 2. Init Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. Fetch Tushare
function fetchTushareData() {
    return new Promise((resolve, reject) => {
        console.log('🔄 Fetching data from Tushare (Last 1 year)...');

        // Date range: last 12 months
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth() - 12, 1).toISOString().slice(0, 10).replace(/-/g, '');

        const postData = JSON.stringify({
            api_name: 'shibor_lpr',
            token: TOKEN,
            params: { start_date: startDate },
            fields: 'date,1y,5y'
        });

        const req = http.request({
            hostname: 'api.tushare.pro',
            port: 80,
            path: '/',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.code === 0) resolve(result.data);
                    else reject(result.msg);
                } catch (e) { reject(e); }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// 4. Save to Supabase
async function saveToSupabase(items, fields) {
    console.log(`💾 Saving ${items.length} records to Supabase...`);

    // Transform
    const rows = items.map(item => {
        const obj = {};
        fields.forEach((field, idx) => {
            // YYYYMMDD -> YYYY-MM-DD
            if (field === 'date') obj.effective_date = `${item[idx].slice(0, 4)}-${item[idx].slice(4, 6)}-${item[idx].slice(6, 8)}`;
            else if (field === '1y') obj.rate_1y = item[idx];
            else if (field === '5y') obj.rate_5y = item[idx];
        });
        return obj;
    });

    const { error } = await supabase
        .from('lpr_rates')
        .upsert(rows, { onConflict: 'effective_date' });

    if (error) throw error;
    console.log('✅ Data successfully synced to Supabase!');
}

async function run() {
    try {
        const data = await fetchTushareData();
        if (data.items.length === 0) {
            console.log('⚠️ No data found from Tushare.');
            return;
        }
        await saveToSupabase(data.items, data.fields);
    } catch (e) {
        console.error('❌ Failed:', e);
    }
}

run();
