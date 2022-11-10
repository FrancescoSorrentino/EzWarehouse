const TestResultController = require('../../controllers/testresultcontroller');
const testDescriptor = require('../../models/mocks/mock_testdescriptor')
const testResult = require('../../models/mocks/mock_testresult')
const skuItem = require('../../models/mocks/mock_skuitem')
jest.mock('../../models/testdescriptor');
jest.mock('../../models/testresult');
jest.mock('../../models/skuitem');

const c = new TestResultController(testDescriptor, testResult, skuItem)

describe('TestResult controller test:', () => {
    describe('add TestResult',()=>{
        const newValidTR =
        {
            rfid:"12345678901234567890123456789015",
            idTestDescriptor:1,
            Date:"2021/11/28",
            Result: 1
        }
        const s= {
            RFID:"12345678901234567890123456789015",
            SKUId:2,
            Available:1,
            DateOfStock:"2021/11/29 12:30"
        }
        const td = {
            id: 1,
            name: "test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU: 1
        }
        beforeEach(() => {
            testResult.new.mockReset()
            skuItem.getItem.mockReset()
            testDescriptor.getTestDescriptorByID.mockReset()
        })

        test('add successed', async () => {
            skuItem.getItem.mockReturnValueOnce(s)
            testDescriptor.getTestDescriptorByID.mockReturnValueOnce(td)
            testResult.new.mockReturnValueOnce({changes:1})
            result = await c.addTestResult(newValidTR)
            expect(testResult.new.mock.calls[0][0]).toEqual(newValidTR)
            expect(result).toBeTruthy()
        })
        
        test('add failed:doesnt have sku item associated to this RFID', async () => {
            skuItem.getItem.mockReturnValueOnce()
            testDescriptor.getTestDescriptorByID.mockReturnValueOnce(td)
            testResult.new.mockReturnValueOnce()
            result = await c.addTestResult(newValidTR)
            expect(result).toEqual(false)
        })

        test('add failed:doesnt have testDescriptor associated to this tdid', async () => {
            skuItem.getItem.mockReturnValueOnce(s)
            testDescriptor.getTestDescriptorByID.mockReturnValueOnce()
            testResult.new.mockReturnValueOnce()
            result = await c.addTestResult(newValidTR)
            expect(result).toEqual(false)
        })

        test('add failed:other error', async () => {
            skuItem.getItem.mockReturnValueOnce(s)
            testDescriptor.getTestDescriptorByID.mockReturnValueOnce(td)
            testResult.new.mockReturnValueOnce({changes:0})
            result = await c.addTestResult(newValidTR)
            expect(testResult.new.mock.calls[0][0]).toEqual(newValidTR)
            expect(result.changes).toEqual(0)
        })
    })
    
    describe('delete TestResult',()=>{
        const tr =
        {
            rfid:"12345678901234567890123456789016",
            idTestDescriptor:1,
            Date:"2021/11/28",
            Result: 1
        }
        const validTR =
        {
            rfid:"12345678901234567890123456789015",
            idTestDescriptor:1,
            Date:"2021/11/28",
            Result: 1
        }
        const rfid="12345678901234567890123456789015"
        const trID = 1

        beforeEach(() => {
            testResult.new.mockReset()
        })

        test('delete successed', async () => {
            testResult.getTestResultByID.mockReturnValueOnce(validTR)
            testResult.delete.mockReturnValueOnce({id:trID,changes:1})
            result = await c.deleteTestResult(rfid, trID)
            expect(result.changes).toEqual(1)
        })
        
        test('delete failed:doesnt have test result associated to this rfid and id', async () => {
            testResult.getTestResultByID.mockReturnValueOnce()
            testResult.delete.mockReturnValueOnce()
            result = await c.deleteTestResult(rfid, trID)
            expect(result).toEqual(false)
        })
        // test('delete failed:other error', async () => {
        //     testResult.getTestResultByID.mockReturnValueOnce(validTR)
        //     testResult.delete.mockReturnValueOnce({changes:0})
        //     result = await c.deleteTestResult(rfid, trID)
        //     expect(result).toEqual(false)
        // })
    })

})