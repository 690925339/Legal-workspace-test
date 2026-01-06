
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCaseBasicInfo } from '../useCaseBasicInfo'
import { caseService } from '../../services/caseService'

// Mock caseService
vi.mock('../../services/caseService', () => ({
    caseService: {
        update: vi.fn(),
        create: vi.fn()
    }
}))

describe('useCaseBasicInfo', () => {
    let basicInfo

    beforeEach(() => {
        vi.clearAllMocks()
        // Initialize with mock data
        basicInfo = useCaseBasicInfo()
    })

    describe('Initialization', () => {
        it('should initialize with empty default values', () => {
            expect(basicInfo.editForm.value.name).toBeUndefined()
            // Note: initForm sets values, default is empty object
        })

        it('should initialize from existing case data', () => {
            const mockCase = {
                name: 'Test Case',
                caseNumber: 'CASE-001',
                type: 'civil',
                stage: 'filing',
                category: 'contract',
                court: 'Court A',
                filingDate: '2023-01-01'
            }

            basicInfo.initBasicInfoForm(mockCase)

            expect(basicInfo.editForm.value.name).toBe('Test Case')
            expect(basicInfo.editForm.value.caseNumber).toBe('CASE-001')
        })
    })

    describe('Saving Data', () => {
        it('should call caseService.update when saving basic info', async () => {
            const mockCase = { id: '123', name: 'Original' }
            basicInfo.initBasicInfoForm(mockCase)

            basicInfo.editForm.value.name = 'Updated Name'
            // Mock successful update
            caseService.update.mockResolvedValueOnce({ ...mockCase, name: 'Updated Name' })

            const currentData = { ...mockCase }
            await basicInfo.saveBasicInfo('123', currentData)

            expect(caseService.update).toHaveBeenCalledWith('123', expect.objectContaining({
                case_title: 'Updated Name'
            }))
            expect(basicInfo.saving.value).toBe(false)
            expect(currentData.name).toBe('Updated Name')
        })

        it('should call caseService.update when saving facts', async () => {
            const factsData = { description: 'Old', disputeFocus: [], objective: 'Obj' }
            basicInfo.initFactsForm(factsData)

            basicInfo.editForm.value.description = 'Updated facts'
            caseService.update.mockResolvedValueOnce({})

            const caseDataRef = { ...factsData }
            await basicInfo.saveCaseFacts('123', caseDataRef)

            expect(caseService.update).toHaveBeenCalledWith('123', expect.objectContaining({
                description: 'Updated facts'
            }))
            expect(caseDataRef.description).toBe('Updated facts')
        })
    })

    describe('Tag Management', () => {
        it('should add new tags', () => {
            // Setup form first
            basicInfo.initFactsForm({ disputeFocus: [] })

            basicInfo.newFocusInput.value = 'New Tag'
            basicInfo.addFocusTag()
            expect(basicInfo.editForm.value.disputeFocus).toContain('New Tag')
            expect(basicInfo.newFocusInput.value).toBe('')
        })
    })
})
