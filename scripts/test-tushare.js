import fs from 'fs'
import path from 'path'
import http from 'http'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Tushare API endpoint is hardcoded in request options (api.tushare.pro)

function readEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env')
    if (!fs.existsSync(envPath)) {
      console.error('❌ .env file found at:', envPath)
      return null
    }
    const content = fs.readFileSync(envPath, 'utf-8')
    const match = content.match(/VITE_TUSHARE_TOKEN=(.+)/)
    if (match && match[1]) {
      return match[1].trim()
    }
    return null
  } catch (e) {
    console.error('❌ Error reading .env:', e.message)
    return null
  }
}

function testTushare(token) {
  console.log('🔄 Testing Tushare API with token (hidden)...')

  // shibor_lpr request
  const postData = JSON.stringify({
    api_name: 'shibor_lpr',
    token: token,
    params: { start_date: '20230101', end_date: '20230201' },
    fields: 'date,1y,5y'
  })

  const options = {
    hostname: 'api.tushare.pro',
    port: 80,
    path: '/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  const req = http.request(options, res => {
    let data = ''
    res.on('data', chunk => {
      data += chunk
    })
    res.on('end', () => {
      try {
        const result = JSON.parse(data)
        if (result.code === 0) {
          console.log('✅ Tushare API Connection Successful!')
          console.log(`📦 Received ${result.data.items.length} records.`)
          if (result.data.items.length > 0) {
            console.log('📝 Sample Data:', result.data.items[0])
          }
        } else {
          console.error('❌ Tushare API Error:', result.msg)
          console.error(
            '⚠️  Please check if your Token is correct and has "shibor_lpr" permission (120 points required).'
          )
        }
      } catch (e) {
        console.error('❌ Failed to parse response:', data)
      }
    })
  })

  req.on('error', e => {
    console.error('❌ Network Error:', e.message)
  })

  req.write(postData)
  req.end()
}

console.log('🔍 Starting Diagnostic...')
const token = readEnv()

if (!token) {
  console.error('❌ VITE_TUSHARE_TOKEN not found in .env file.')
  console.log('👉 Please open .env and ensure it contains: VITE_TUSHARE_TOKEN=your_token_here')
} else {
  console.log('✅ Token found in .env')
  testTushare(token)
}
