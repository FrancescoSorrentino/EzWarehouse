const ReturnOrderController = require('../../controllers/returnordercontroller');
const returnOrder = require('../../models/mocks/mock_returnorder')
const restockOrder = require('../../models/mocks/mock_restockorder')
jest.mock('../../models/returnorder');
jest.mock('../../models/restockorder');

const c = new ReturnOrderController(returnOrder, restockOrder)

describe('ReturnOrder controller test:', () => {
    describe('listsReturnOrders', () => {
        const returnOrders = [{
            id:1,
            returnDate:"2021/11/29 09:33",
            products: [{SKUId:12,description:"a product",price:10.99,RFID:"12345678901234567890123456789016"},
                        {SKUId:180,description:"another product",price:11.99,RFID:"12345678901234567890123456789038"}],
            restockOrderId : 1
        }]

        beforeEach(() => {
            returnOrder.getReturnOrders.mockReset()
        })

        test('returns a list of return orders', async () => {
            returnOrder.getReturnOrders.mockReturnValueOnce(returnOrders)
            result = await c.listsReturnOrders()
            expect(result).toEqual(returnOrders)
        })

    })

    describe('addReturnOrder', () => {
        const ro = {
            id:1,
            returnDate:"2021/11/29 09:33",
            products: [{SKUId:12,description:"a product",price:10.99,RFID:"12345678901234567890123456789016"},
                        {SKUId:180,description:"another product",price:11.99,RFID:"12345678901234567890123456789038"}],
            restockOrderId : 1
        }

        beforeEach(() => {
            returnOrder.new.mockReset()
            restockOrder.getRestockOrder.mockReset()
        })

        test('Add a new return order', async () => {
            returnOrder.new.mockReturnValueOnce(" ")
            restockOrder.getRestockOrder.mockReturnValueOnce(true)
            result = await c.addReturnOrder(ro)
            expect(restockOrder.getRestockOrder.mock.calls[0][0]).toBe(ro.restockOrderId)
            expect(returnOrder.new.mock.calls[0][0]).toEqual(ro)
            expect(result).toBe(true)
        })

        test('restock order not found', async () => {
            returnOrder.new.mockReturnValueOnce(" ")
            restockOrder.getRestockOrder.mockReturnValueOnce(false)
            result = await c.addReturnOrder(ro)
            expect(restockOrder.getRestockOrder.mock.calls[0][0]).toBe(ro.restockOrderId)
            expect(result).toBe(false)
            
        })

    })

    describe('deleteReturnOrder', () => {
        const returnOrderId = 1;

        beforeEach(() => {
            returnOrder.delete.mockReset()
        })

        test('return undefined if returnOrder is deleted', async () => {
            returnOrder.delete.mockReturnValueOnce()
            result = await c.deleteReturnOrder(returnOrderId)
            expect(result).toBeUndefined()
        })

    })

})