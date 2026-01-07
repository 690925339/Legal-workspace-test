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

// 5. Create Case
app.post('/api/v1/cases', supabaseMiddleware, async (req, res) => {
  console.log('[BFF] POST /api/v1/cases', req.body)
  const { data, error } = await req.supabase.from('cases').insert(req.body).select().single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// 6. Update Case
app.put('/api/v1/cases/:id', supabaseMiddleware, async (req, res) => {
  console.log('[BFF] PUT /api/v1/cases/' + req.params.id, req.body)
  const { data, error } = await req.supabase
    .from('cases')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// 7. Delete Case
app.delete('/api/v1/cases/:id', supabaseMiddleware, async (req, res) => {
  const caseId = req.params.id
  console.log('[BFF] DELETE /api/v1/cases/' + caseId)
  const startTime = Date.now()

  try {
    // 并行删除关联数据（减少延迟）
    await Promise.all([
      req.supabase.from('financials').delete().eq('case_id', caseId),
      req.supabase.from('stakeholders').delete().eq('case_id', caseId),
      req.supabase.from('evidences').delete().eq('case_id', caseId)
    ])

    // 删除案件本身
    const { error } = await req.supabase.from('cases').delete().eq('id', caseId)

    if (error) return res.status(500).json({ error: error.message })

    console.log(`[BFF] DELETE completed in ${Date.now() - startTime}ms`)
    res.status(200).json({ success: true })
  } catch (err) {
    console.error('[BFF] DELETE error:', err)
    res.status(500).json({ error: err.message })
  }
})

// 8. Upsert Financials (Robust implementation handling duplicates)
app.put('/api/v1/cases/:id/financials', supabaseMiddleware, async (req, res) => {
  console.log('[BFF] PUT financials for case ' + req.params.id, req.body)

  try {
    // 1. Check existing records
    const { data: existings, error: findError } = await req.supabase
      .from('financials')
      .select('id')
      .eq('case_id', req.params.id)

    // Use ID sorting or just take the first one since we will overwrite it anyway
    // If id is uuid, sorting might not imply time, but it's deterministic
    // If we really wanted newest, we'd need created_at, but it's missing.
    // It's safe to pick ANY row because we fully overwrite data.

    if (findError) throw findError

    let resultData

    if (existings && existings.length > 0) {
      // Update the newest one
      const targetId = existings[0].id
      const { data, error: updateError } = await req.supabase
        .from('financials')
        .update({
          ...req.body,
          updated_at: new Date().toISOString()
        })
        .eq('id', targetId)
        .select()
        .single()

      if (updateError) throw updateError
      resultData = data

      // Delete duplicates if any
      if (existings.length > 1) {
        const duplicateIds = existings.slice(1).map(x => x.id)
        console.warn(
          `[BFF] Cleaning up ${duplicateIds.length} duplicate financials for case ${req.params.id}`
        )
        await req.supabase.from('financials').delete().in('id', duplicateIds)
      }
    } else {
      // Insert new
      const { data, error: insertError } = await req.supabase
        .from('financials')
        .insert({
          case_id: req.params.id,
          ...req.body,
          updated_at: new Date().toISOString() // Ensure updated_at is set
        })
        .select()
        .single()

      if (insertError) throw insertError
      resultData = data
    }

    res.json(resultData)
  } catch (error) {
    console.error('[BFF] PUT Financials Error:', error)
    return res.status(500).json({ error: error.message })
  }
})

// 9. Create Stakeholder
app.post('/api/v1/cases/:id/stakeholders', supabaseMiddleware, async (req, res) => {
  console.log('[BFF] POST stakeholder for case ' + req.params.id, req.body)
  const { data, error } = await req.supabase
    .from('stakeholders')
    .insert({
      case_id: req.params.id,
      ...req.body
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// 10. Update Stakeholder
app.put('/api/v1/stakeholders/:id', supabaseMiddleware, async (req, res) => {
  console.log('[BFF] PUT stakeholder ' + req.params.id, req.body)
  const { data, error } = await req.supabase
    .from('stakeholders')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// 11. Delete Stakeholder
app.delete('/api/v1/stakeholders/:id', supabaseMiddleware, async (req, res) => {
  console.log('[BFF] DELETE stakeholder ' + req.params.id)
  const { error } = await req.supabase.from('stakeholders').delete().eq('id', req.params.id)

  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
})

app.listen(port, () => {
  console.log(`Mock BFF listening on port ${port}`)
  console.log(`Mode: Proxy (Forwarding RLS Token)`)
  console.log(`Connected to: ${SUPABASE_URL}`)
})
