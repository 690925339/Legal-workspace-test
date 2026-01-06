const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')
const path = require('path')
const dotenv = require('dotenv')
const fs = require('fs')

// Try to load root .env
const envPath = path.resolve(__dirname, '../../.env')
const envConfig = dotenv.parse(fs.readFileSync(envPath))

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

const SUPABASE_URL = envConfig.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = envConfig.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Error: missing Supabase config in .env')
    process.exit(1)
}

// Middleware: Create scoped Supabase client from Token
const supabaseMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
        return res.status(401).json({ error: 'Missing Authorization header' })
    }

    // Proxy Mode: Use the user's token directly
    // This respects RLS policies defined in the database
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    })

    req.supabase = supabase
    next()
}

// --- API Routes ---

// 1. Cases List
app.get('/api/v1/cases', supabaseMiddleware, async (req, res) => {
    const filters = req.query
    console.log('[BFF] GET /api/v1/cases', filters)

    let query = req.supabase.from('cases').select('*')

    // Apply basic filters (mirroring caseService.js logic)
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.case_type) query = query.eq('case_type', filters.case_type)
    if (filters.search) {
        // Note: Simple proxy doesn't easy handle complex 'or' raw logic without care
        // But Supabase client allows it
        query = query.or(`case_title.ilike.%${filters.search}%,case_number.ilike.%${filters.search}%`)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
})

// 2. Case Details
app.get('/api/v1/cases/:id', supabaseMiddleware, async (req, res) => {
    console.log('[BFF] GET /api/v1/cases/' + req.params.id)
    const { data, error } = await req.supabase
        .from('cases')
        .select('*')
        .eq('id', req.params.id)
        .single()

    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
})

// 3. Financials
app.get('/api/v1/cases/:id/financials', supabaseMiddleware, async (req, res) => {
    console.log('[BFF] GET financials for case ' + req.params.id)
    const { data, error } = await req.supabase
        .from('financials')
        .select('*')
        .eq('case_id', req.params.id)
        .single()

    if (error && error.code === 'PGRST116') {
        // Return default
        return res.json({
            case_id: req.params.id,
            claim_items: [],
            attorney_fee: 0,
            court_cost: 0,
            billable_hours: 0
        })
    }
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
})

// 4. Stakeholders
app.get('/api/v1/cases/:id/stakeholders', supabaseMiddleware, async (req, res) => {
    console.log('[BFF] GET stakeholders for case ' + req.params.id)
    const { data, error } = await req.supabase
        .from('stakeholders')
        .select('*')
        .eq('case_id', req.params.id)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true })

    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
})


app.listen(port, () => {
    console.log(`Mock BFF listening on port ${port}`)
    console.log(`Mode: Proxy (Forwarding RLS Token)`)
    console.log(`Connected to: ${SUPABASE_URL}`)
})
