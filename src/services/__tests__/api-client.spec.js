import { describe, it, expect, vi, beforeEach } from 'vitest'
import ApiClient from '../api-client'

// Mock config and supabase
vi.mock('@/config/supabase', () => ({
    getSupabaseClient: vi.fn(() => ({
        auth: {
            getSession: vi.fn().mockResolvedValue({
                data: { session: { access_token: 'mock-token' } }
            })
        }
    }))
}))

vi.mock('@shared/constants', () => ({
    CACHE_CONFIG: { DEFAULT_EXPIRY: 1000 }
}))

// Mock global fetch
global.fetch = vi.fn()

describe('ApiClient', () => {
    let client

    beforeEach(() => {
        client = new ApiClient('https://api.example.com')
        vi.clearAllMocks()
        global.fetch.mockReset()
    })

    it('should initialize with base URL', () => {
        expect(client.baseUrl).toBe('https://api.example.com')
    })

    it('should inject auth token', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true })
        })

        await client.get('/test')

        expect(global.fetch).toHaveBeenCalledWith(
            'https://api.example.com/test',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Bearer mock-token'
                })
            })
        )
    })

    it('should support request interceptors', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true })
        })

        client.addRequestInterceptor((config) => {
            config.headers['X-Custom-Header'] = 'custom-value'
            return config
        })

        await client.get('/test')

        expect(global.fetch).toHaveBeenCalledWith(
            'https://api.example.com/test',
            expect.objectContaining({
                headers: expect.objectContaining({
                    'X-Custom-Header': 'custom-value'
                })
            })
        )
    })

    it('should support response interceptors', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: 'original' })
        })

        client.addResponseInterceptor(async (response) => {
            // mock transforming response
            const data = await response.json()
            data.data = 'transformed'
            // mock return new response-like object or just checking call
            return { ok: true, json: async () => data }
        })

        const result = await client.get('/test')
        expect(result.data).toBe('transformed')
    })

    it('should handle request cancellation', async () => {
        global.fetch.mockImplementation((url, options) => {
            return new Promise((resolve, reject) => {
                if (options.signal) {
                    if (options.signal.aborted) {
                        const err = new Error('Aborted')
                        err.name = 'AbortError'
                        return reject(err)
                    }
                    options.signal.addEventListener('abort', () => {
                        const err = new Error('Aborted')
                        err.name = 'AbortError'
                        reject(err)
                    })
                }
            })
        })

        const promise = client.get('/test', { requestId: 'req1' })

        // waiting a bit to ensure promise started
        await new Promise(r => setTimeout(r, 0))

        client.cancelRequest('req1')

        const result = await promise
        expect(result).toBeNull() // Cancelled returns null
        expect(client.pendingRequests.has('req1')).toBe(false)
    })
})
