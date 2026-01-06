
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { caseService } from '../caseService'
import { apiClient } from '@/services/api-client'
import { getSupabaseClient } from '@/config/supabase'

// Mock dependencies
vi.mock('../../../services/api-client', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
    }
}))

vi.mock('@/config/supabase', () => ({
    getSupabaseClient: vi.fn()
}))

// Mock environment variable
vi.mock('../../../shared/constants', () => ({
    API_ENDPOINTS: {
        CASES: '/api/cases',
        CASE_BY_ID: (id) => `/api/cases/${id}`
    },
    CACHE_CONFIG: {
        DEFAULT_EXPIRY: 60000
    }
}))

describe('caseService', () => {
    const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        like: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis()
    }

    beforeEach(() => {
        vi.clearAllMocks()
        getSupabaseClient.mockReturnValue(mockSupabase)
    })

    describe('getList', () => {
        it('should query Supabase when BFF is disabled (default mock assumes false)', async () => {
            // Mock successful response
            mockSupabase.order.mockResolvedValueOnce({ data: [{ id: 1 }], error: null })

            const result = await caseService.getList()

            expect(mockSupabase.from).toHaveBeenCalledWith('cases')
            expect(result).toEqual([{ id: 1 }])
        })

        it('should apply filters correctly', async () => {
            mockSupabase.order.mockResolvedValueOnce({ data: [], error: null })

            await caseService.getList({ status: 'active', search: 'Test' })

            expect(mockSupabase.eq).toHaveBeenCalledWith('status', 'active')
            expect(mockSupabase.or).toHaveBeenCalledWith(expect.stringContaining('Test'))
        })
    })

    describe('getById', () => {
        it('should fetch single case by ID', async () => {
            const mockCase = { id: 123, name: 'Case' }
            mockSupabase.single.mockResolvedValueOnce({ data: mockCase, error: null })

            const result = await caseService.getById(123)

            expect(mockSupabase.eq).toHaveBeenCalledWith('id', 123)
            expect(result).toEqual(mockCase)
        })
    })

    describe('create', () => {
        it('should generate case number if missing and insert', async () => {
            const newCase = { name: 'New Case' }
            // Mock generateCaseNumber internal call mechanism isn't directly mockable without spy, 
            // but we can mock the potential database call it makes or just let it run if it's pure enough.
            // Ideally we spy on generateCaseNumber if it was separate, here we test the flow.

            // Mock generate number query
            mockSupabase.limit.mockResolvedValueOnce({ data: [], error: null }) // No existing cases today
            // Mock insert
            mockSupabase.single.mockResolvedValueOnce({ data: { ...newCase, id: 1 }, error: null })

            const result = await caseService.create(newCase)

            expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
                name: 'New Case',
                case_number: expect.stringMatching(/^CASE-\d{8}-\d{3}$/)
            }))
            expect(result.id).toBe(1)
        })
    })

    describe('update', () => {
        it('should update case', async () => {
            const updates = { name: 'Updated' }
            mockSupabase.single.mockResolvedValueOnce({ data: { id: 1, ...updates }, error: null })

            await caseService.update(1, updates)

            expect(mockSupabase.update).toHaveBeenCalledWith(updates)
            expect(mockSupabase.eq).toHaveBeenCalledWith('id', 1)
        })
    })
})
