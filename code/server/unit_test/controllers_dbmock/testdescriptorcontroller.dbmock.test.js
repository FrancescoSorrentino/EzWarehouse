const TestDescriptorController = require('../../controllers/testdescriptorcontroller');
const sku = require('../../models/mocks/mock_sku')
const testDescriptor = require('../../models/mocks/mock_testdescriptor')
jest.mock('../../models/sku');
jest.mock('../../models/testdescriptor');

const c = new TestDescriptorController(sku, testDescriptor)

describe('TestDesriptor controller test:', () => {
    describe('getTestDescriptors', () => {
        const testDescriptorList = [
            {
                id: 1,
                name: "test descriptor 1",
                procedureDescription: "This test is described by...",
                idSKU: "1"
            },]

        beforeEach(() => {
            testDescriptor.getTestDescriptors.mockReset()
        })

        test('returns a list of skus', async () => {
            testDescriptor.getTestDescriptors.mockReturnValueOnce(testDescriptorList)
            result = await c.getTestDescriptors()
            expect(result).toEqual(testDescriptorList)
        })
    })

    describe("updateTestDescriptor",()=>{
        const tdId = 1
        const wrongTdId = 99
        const newValidTD={
            newName:"tppp 1",
            newProcedureDescription:"This test is described by...",
            newIdSKU :1
        }
        const s={
            id: 1,
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            availableQuantity: 50,
            price: 10.99,
            position: "800234543412"
        }
        const td={
            id: 1,
            name: "test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU: 1
        }
        

        beforeEach(()=>{
            testDescriptor.update.mockReset()
            testDescriptor.getTestDescriptorByID.mockReset()
            sku.getSku.mockReset()
        })
        test('values are fine, perform the update to the test descriptor',async()=>{
            testDescriptor.getTestDescriptorByID.mockReturnValueOnce(td)
            sku.getSku.mockReturnValueOnce(s)
            testDescriptor.update.mockReturnValueOnce({id:tdId,changes:1})
            result = await c.updateTestDescriptor(tdId, newValidTD)
            expect(result.changes).toEqual(1)
            // expect(result).toEqual(true)
        })
        test('testDescriptor to be updates is not found, return false',async()=>{
            testDescriptor.getTestDescriptorByID.mockReturnValueOnce()//get不到任何东西
            sku.getSku.mockReturnValueOnce(s)
            testDescriptor.update.mockReturnValueOnce()//这里不用传了，在此之前就t==undefined 返回了
            result = await c.updateTestDescriptor(wrongTdId, newValidTD)
            
            expect(result).toEqual(false)
        })
        test('sku to be updates is not found, return false',async()=>{
            testDescriptor.getTestDescriptorByID.mockReturnValueOnce(td)//get不到任何东西
            sku.getSku.mockReturnValueOnce()
            testDescriptor.update.mockReturnValueOnce()
            result = await c.updateTestDescriptor(wrongTdId, newValidTD)
            
            expect(result).toEqual(false)
        })
    })

})