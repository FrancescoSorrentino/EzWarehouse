const SkuController = require('../../controllers/skucontroller');
const sku = require('../../models/mocks/mock_sku')
const position = require('../../models/mocks/mock_position');
const { ValidationError } = require('../../middlewares/errors');
jest.mock('../../models/sku');
jest.mock('../../models/position');

const c = new SkuController(sku, position)

describe('Sku controller test:', () => {

    describe('getSkus', () => {
        const skuList = [
            {
                id: 1,
                description: "a new sku",
                weight: 100,
                volume: 50,
                notes: "first SKU",
                availableQuantity: 50,
                price: 10.99,
                position: "800234543412",
            },
            {
                id: 2,
                description: "a new sku",
                weight: 100,
                volume: 50,
                notes: "second SKU",
                availableQuantity: 50,
                price: 15.99,
                position: "800234543412",
            },]

        beforeEach(() => {
            sku.getSkus.mockReset()
        })

        test('returns a list of skus', async () => {
            sku.getSkus.mockReturnValueOnce(skuList)
            result = await c.getSkus()
            expect(result).toEqual(skuList)
        })
    })

    describe('addSku', () => {
        const s =
        {
            id: 1,
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            availableQuantity: 50,
            price: 10.99,
            position: "800234543412",
        }

        beforeEach(() => {
            sku.new.mockReset()
        })

        test('returns a list of skus', async () => {
            sku.new.mockReturnValueOnce()
            result = await c.addSku(s)
            expect(sku.new.mock.calls[0][0]).toEqual(s)
        })
    })

    describe('updateSku', () => {
        const skuID = 1
        const sNoPosition = {
            id: 1,
            description: "a new sku",
            weight: 10,
            volume: 5,
            notes: "first SKU",
            availableQuantity: 50,
            price: 10.99
        }
        const s = {
            ...sNoPosition, ...{
                position: "800234543412",
            }
        }

        const newValidSku = {
            newDescription: "a new description",
            newWeight: 20,
            newVolume: 5,
            newAvailableQuantity: 30,
        }
        const newInvalidSku = {
            newDescription: "a new description",
            newWeight: 20,
            newVolume: 5,
            newAvailableQuantity: 1000,
        }
        const p = {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 500,
            occupiedVolume: 250
        }

        beforeEach(() => {
            sku.getSku.mockReset()
            sku.update.mockReset()
            position.getPosition.mockReset()
            position.updatePositionSpace.mockReset()
        })

        test('values are fine, perform the update to the sku and related position', async () => {
            sku.getSku.mockReturnValueOnce(s)
            sku.update.mockReturnValueOnce()
            position.getPosition.mockReturnValueOnce(p)
            position.updatePositionSpace.mockReturnValueOnce()
            result = await c.updateSku(skuID, newValidSku)
            expect(sku.getSku.mock.calls[0][0]).toEqual(skuID)
            expect(position.getPosition.mock.calls[0][0]).toEqual(s.position)
            expect(position.updatePositionSpace.mock.calls[0][0]).toEqual(s.position)
            let weight = newValidSku.newWeight * newValidSku.newAvailableQuantity
            let volume = newValidSku.newVolume * newValidSku.newAvailableQuantity
            expect(position.updatePositionSpace.mock.calls[0][1]).toEqual(weight)
            expect(position.updatePositionSpace.mock.calls[0][2]).toEqual(volume)
            expect(sku.update.mock.calls[0][0]).toEqual(skuID)
            expect(sku.update.mock.calls[0][1]).toEqual(newValidSku)
            expect(result).toEqual(true)
        })

        test('values are fine, no position related, perform the update only to the sku', async () => {
            sku.getSku.mockReturnValueOnce(sNoPosition)
            sku.update.mockReturnValueOnce()
            result = await c.updateSku(skuID, newValidSku)
            expect(sku.getSku.mock.calls[0][0]).toEqual(skuID)
            expect(sku.update.mock.calls[0][0]).toEqual(skuID)
            expect(sku.update.mock.calls[0][1]).toEqual(newValidSku)
            expect(result).toEqual(true)
        })

        test('values of weight and volume are not fine, throw error', async () => {
            sku.getSku.mockReturnValueOnce(s)
            position.getPosition.mockReturnValueOnce(p)
            expect(() => c.updateSku(skuID, newInvalidSku))
                .rejects
                .toEqual(new ValidationError("MaxWeight or MaxVolume exeeded"))
        })

        test('sku to be updates is not found, return false', async () => {
            sku.getSku.mockReturnValueOnce(undefined)
            result = await c.updateSku(skuID, newValidSku)
            expect(result).toEqual(false)
        })
    })

})