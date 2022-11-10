const ItemController = require('../../controllers/itemcontroller');
const item = require('../../models/mocks/mock_item')
const user = require('../../models/mocks/mock_user')
const sku = require('../../models/mocks/mock_sku')
jest.mock('../../models/item');
jest.mock('../../models/user');
jest.mock('../../models/sku');
const { ValidationError } = require('../../middlewares/errors');

const c = new ItemController(item, user, sku)

describe('Item controller test:', () => {

    describe('addItem', () => {
        const i = {
            id : 12,
            description : "a new item",
            price : 10.99,
            SKUId : 1,
            supplierId : 6
        }
    

        beforeEach(() => {
            item.new.mockReset()
            sku.getSku.mockReset()
            user.getUser.mockReset()
        })

        test('Add a new item successfully', async () => {
            item.new.mockReturnValueOnce()
            sku.getSku.mockReturnValueOnce(true)
            user.getUser.mockReturnValueOnce({
                id:1,
                name:"John",
                surname:"Snow",
                email:"john.snow@supplier.ezwh.com",
                type:"supplier"
            })
            result = await c.addItem(i)
            expect(sku.getSku.mock.calls[0][0]).toBe(i.SKUId)
            expect(user.getUser.mock.calls[0][0]).toBe(i.supplierId)
            expect(item.new.mock.calls[0][0]).toEqual(i)
            expect(result).toBe(true)
        })


        test('skuId not found', async () => {
            item.new.mockReturnValueOnce()
            sku.getSku.mockReturnValueOnce(false)
            user.getUser.mockReturnValueOnce({
                id:1,
                name:"John",
                surname:"Snow",
                email:"john.snow@supplier.ezwh.com",
                type:"supplier"
            })
            result = await c.addItem(i)
            expect(user.getUser.mock.calls[0][0]).toBe(i.supplierId)
            expect(sku.getSku.mock.calls[0][0]).toBe(i.SKUId)
            expect(result).toBe(false)
        })

        test('supplierId not found in user table', async () => {
            item.new.mockReturnValueOnce()
            sku.getSku.mockReturnValueOnce(true)
            user.getUser.mockReturnValueOnce(false)
            result = await c.addItem(i)
            expect(user.getUser.mock.calls[0][0]).toBe(i.supplierId)
            expect(result).toBe(false)
        })

        test('type of user is not supplier', async () => {
            item.new.mockReturnValueOnce()
            sku.getSku.mockReturnValueOnce(true)
            user.getUser.mockReturnValueOnce({
                id:1,
                name:"John",
                surname:"Snow",
                email:"john.snow@supplier.ezwh.com",
                type:"customer"
            })
            expect(c.addItem(i))
                 .rejects
                 .toEqual(new ValidationError('type of this.user is not supplier.'))
        })
        

    })

    describe('updateItem', () => {
        const id = 1
        const supplierId = 3
        const newItem = {
            newDescription: "a new item description",
            newPrice: 8.99
        }
        const i = {
            id: 1,
            description: "a new item",
            price: 10.99,
            SKUId: 2,
            supplierId: 3
        }

        beforeEach(() => {
            item.getItem.mockReset()
            item.update.mockReset()
        })

        test('item is updated successfully', async () => {
            item.getItem.mockReturnValueOnce(i)
            item.update.mockReturnValueOnce(true)
            result = await c.updateItem(newItem, id, supplierId)
            expect(item.getItem.mock.calls[0][0]).toEqual(id)
            expect(item.getItem.mock.calls[0][1]).toEqual(supplierId)
            expect(item.update.mock.calls[0][0]).toEqual(id)
            expect(item.update.mock.calls[0][1]).toEqual(supplierId)
            expect(item.update.mock.calls[0][2]).toEqual(newItem)
            expect(result).toEqual(true)
        })

        test('item not updated, item to updated is not found', async () => {
            item.getItem.mockReturnValueOnce(undefined)
            result = await c.updateItem(newItem, id, supplierId)
            expect(item.getItem.mock.calls[0][0]).toEqual(id)
            expect(item.getItem.mock.calls[0][1]).toEqual(supplierId)
            expect(result).toEqual(false)
        })

    })


    describe('deleteItem', () => {
        const id = 1
        const supplierId = 3

        const i = {
            id: 1,
            description: "a new item",
            price: 10.99,
            SKUId: 2,
            supplierId: 3
        }

        beforeEach(() => {
            item.getItem.mockReset()
            item.update.mockReset()
        })

        test('item is deleted successfully', async () => {
            item.getItem.mockReturnValueOnce(i)
            item.delete.mockReturnValueOnce(true)
            result = await c.deleteItem(id, supplierId)
            expect(item.getItem.mock.calls[0][0]).toEqual(id)
            expect(item.getItem.mock.calls[0][1]).toEqual(supplierId)
            expect(item.delete.mock.calls[0][0]).toEqual(id)
            expect(item.delete.mock.calls[0][1]).toEqual(supplierId)
            expect(result).toEqual(true)
        })

        test('item not deleted, item to updated is not found', async () => {
            item.getItem.mockReturnValueOnce()
            result = await c.deleteItem(id, supplierId)
            expect(item.getItem.mock.calls[0][0]).toEqual(id)
            expect(item.getItem.mock.calls[0][1]).toEqual(supplierId)
            expect(result).toEqual()
        })

    })



})