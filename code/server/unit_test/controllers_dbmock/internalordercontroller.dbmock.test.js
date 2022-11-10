const InternalOrder = require('../../controllers/internalordercontroller');
const internalOrder = require('../../models/mocks/mock_internalorder')
const skuItem = require('../../models/mocks/mock_skuitem')
const user = require('../../models/mocks/mock_user')
const { ValidationError } = require('../../middlewares/errors');
jest.mock('../../models/internalOrder');
jest.mock('../../models/skuItem');
jest.mock('../../models/user');

const c = new InternalOrder(internalOrder, skuItem, user)

describe('InternalOrder controller test:', () => {
    describe('getInternalOrders', () => {
        const internalOrders = [
            {
                id:1,
                issueDate:"2021/11/29 09:33",
                state: "ACCEPTED",
                products: [{SKUId:12,description:"a product",price:10.99,qty:2},
                            {SKUId:180,description:"another product",price:11.99,qty:3}],
                customerId : 1
            },
            {id:2,
                issueDate:"2021/11/29 09:33",
                state: "COMPLETED",
                products: [{SKUId:12,description:"a product",price:10.99,RFID:"12345678901234567890123456789016"},
                            {SKUId:180,description:"another product",price:11.99,RFID:"12345678901234567890123456789038"}],
                customerId : 1
            }
        ]
    

        beforeEach(() => {
            internalOrder.getInternalOrders.mockReset()
        })

        test('returns a list of internal orders', async () => {
            internalOrder.getInternalOrders.mockReturnValueOnce(internalOrders)
            result = await c.getInternalOrders()
            expect(result).toEqual(internalOrders)
        })

    })

    describe('addInternalOrder', () => {
        const io = {
            issueDate:"2021/11/29 09:33",
            products: [{SKUId:12,description:"a product",price:10.99,qty:3},
                        {SKUId:180,description:"another product",price:11.99,qty:3}],
            customerId : 1
        }


        beforeEach(() => {
            internalOrder.new.mockReset()
            user.getUser.mockReset()
        })

        test('Add a new internal order', async () => {
            internalOrder.new.mockReturnValueOnce(" ")
            user.getUser.mockReturnValueOnce({
                id:1,
                name:"John",
                surname:"Snow",
                email:"john.snow@supplier.ezwh.com",
                type:"customer"
            })
            result = await c.addInternalOrder(io)
            expect(user.getUser.mock.calls[0][0]).toBe(io.customerId)
            expect(internalOrder.new.mock.calls[0][0]).toEqual(io)
            expect(result).toBe(" ")
        })

        test('User not found', async () => {
            internalOrder.new.mockReturnValueOnce(" ")
            user.getUser.mockReturnValueOnce(false)
            expect(c.addInternalOrder(io))
                .rejects
                .toEqual(new ValidationError('customerId missing'))
        })

        test('Type of user is not a customer', async () => {
            internalOrder.new.mockReturnValueOnce(" ")
            user.getUser.mockReturnValueOnce({
                id:1,
                name:"John",
                surname:"Snow",
                email:"john.snow@supplier.ezwh.com",
                type:"supplier"
            })
            expect(c.addInternalOrder(io))
                .rejects
                .toEqual(new ValidationError('type of this.user is not customer.'))
        })
       
    })

})





