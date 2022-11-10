const SkuItemController = require('../../controllers/skuitemcontroller');
const sku = require('../../models/mocks/mock_sku')
const skuItem = require('../../models/mocks/mock_skuitem')
jest.mock('../../models/sku');
jest.mock('../../models/skuitem');

const c = new SkuItemController(sku, skuItem)

describe('SkuItem controller test:', () => {
    describe('getSkuItemsBySkuId', () => {
        const SkuId = 1
        const incorrectSkuId = 2
        const skuItems = [
            {
                "RFID":"12345678901234567890123456789014",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
            },
            {
                "RFID":"12345678901234567890123456789015",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
            }
        ]
    

        beforeEach(() => {
            sku.getSku.mockReset()
            skuItem.getItemsBySkuId.mockReset()
        })

        test('Returns a list of skuItems with correct skuId', async () => {
            sku.getSku.mockReturnValueOnce({
                id:1,
                description : "a new sku",
                weight : 100,
                volume : 50,
                notes : "first SKU",
                position : "800234523412",
                availableQuantity : 50,
                price : 10.99,
                testDescriptors : [1,3,4]
            }
        )
            skuItem.getItemsBySkuId.mockReturnValueOnce(skuItems)
            result = await c.getSkuItemsBySkuId(SkuId)
            expect(result).toEqual(skuItems)
        })

        test('SkuId not found', async () => {
            sku.getSku.mockReturnValueOnce(undefined)
            skuItem.getItemsBySkuId.mockReturnValueOnce(skuItems)
            result = await c.getSkuItemsBySkuId(incorrectSkuId)
            expect(result).toEqual(false)
        })

    })


    describe('updateItem', () => {
        const RFID = "12345678901234567890123456789014"
        const initialSkuItem =   {
            RFID:"12345678901234567890123456789014",
            SKUId:1,
            Available:0,
            DateOfStock:"2021/11/29 12:30",
        }

        const newValidSkuItem =  {
            newRFID:"12345678901234567890123456789015",
            newAvailable:1,
            newDateOfStock:"2021/11/29 12:30"
        }
    
        

        beforeEach(() => {
            skuItem.getItem.mockReset()
            skuItem.update.mockReset()
        })

        test('values are fine, perform the update to the skuItem', async () => {
            skuItem.getItem.mockReturnValueOnce(initialSkuItem)
            skuItem.update.mockReturnValueOnce()

            result = await c.updateItem(RFID, newValidSkuItem)
            expect(skuItem.getItem.mock.calls[0][0]).toEqual(RFID)
            expect(skuItem.update.mock.calls[0][0]).toEqual(newValidSkuItem)
            expect(skuItem.update.mock.calls[0][1]).toEqual(RFID)
            expect(result).toEqual(true)
        })


        test('RFID not found', async () => {
            skuItem.getItem.mockReturnValueOnce(undefined)
            result = await c.updateItem(RFID, newValidSkuItem)
            expect(result).toEqual(false)
        })

        
    })



})