const RestockOrderController = require('../../controllers/restockordercontroller');
const restockOrder = require('../../models/mocks/mock_restockorder')
jest.mock('../../models/restockorder');

const c = new RestockOrderController(restockOrder)

describe('RestockOrder controller test:', () => {
    describe('add RestockOrder', () => {
        const newValidRO = {
            "issueDate": "2021/11/29 09:33",
            "products": [
                { "SKUId": 1, "itemId": 1, "description": "a product", "price": 10.99, "qty": 30 },
                { "SKUId": 2, "itemId": 1, "description": "another product", "price": 11.99, "qty": 20 }
            ],
            "supplierId": 3
        }
        beforeEach(() => {
            restockOrder.new.mockReset()
        })

        test('add successed', async () => {
            restockOrder.new.mockReturnValueOnce()
            result = await c.addRestockOrder(newValidRO)
            expect(restockOrder.new.mock.calls[0][0]).toEqual(newValidRO)
        })
    })

    describe('update RestockOrder State', () => {
        const newValidState = {
            newState: "DELIVERED"
        }

        const roID = 1
        beforeEach(() => {
            restockOrder.updateState.mockReset()
        })

        test('update state successed', async () => {
            restockOrder.updateState.mockReturnValueOnce({ changes: 1 })
            result = await c.updateRestockOrderState(roID, newValidState)

            // expect(restockOrder.updateState.mock.calls[0][0]).toEqual(roID)
            // expect(restockOrder.updateState.mock.calls[0][1]).toEqual(newValidState)
            expect(result).toEqual(true)
        })

        test('update state failed', async () => {
            restockOrder.updateState.mockReturnValueOnce({ changes: 0 })
            result = await c.updateRestockOrderState(roID, newValidState)

            // expect(restockOrder.updateState.mock.calls[0][0]).toEqual(roID)
            // expect(restockOrder.updateState.mock.calls[0][1]).toEqual(newValidState)
            expect(result).toEqual(false)
        })
    })

    describe('update RestockOrder TransportNote', () => {
        const newValidTransportNote = {
            deliveryDate: "2021/12/29"
        }

        const roID = 1
        beforeEach(() => {
            restockOrder.newTransportNote.mockReset()
        })

        test('update transportNote successed', async () => {
            restockOrder.getRestockOrder.mockReturnValueOnce({state: "DELIVERY"})
            restockOrder.newTransportNote.mockReturnValueOnce({ changes: 1 })
            result = await c.updateRestockOrderTransportNote(roID, newValidTransportNote)

            // expect(restockOrder.updateState.mock.calls[0][0]).toEqual(roID)
            // expect(restockOrder.updateState.mock.calls[0][1]).toEqual(newValidState)
            expect(result).toEqual(true)
        })

        test('update transportNote failed', async () => {
            restockOrder.newTransportNote.mockReturnValueOnce({ changes: 0 })
            result = await c.updateRestockOrderTransportNote(roID, newValidTransportNote)
            expect(result).toEqual(false)
        })
    })

})