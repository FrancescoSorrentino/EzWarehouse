const dao = require('../../db/dao');
const ReturnOrder = require('../../models/returnorder')
const ReturnOrderController = require('../../controllers/returnordercontroller');
const RestockOrder = require('../../models/restockorder');
const User = require('../../models/user');
const Sku = require('../../models/sku');
const SkuItem = require('../../models/skuitem');
const Item = require('../../models/item');
const skuitem = new SkuItem()
const sku = new Sku();
const returnorder = new ReturnOrder();
const restockorder = new RestockOrder();
const user = new User()
const returnorderc = new ReturnOrderController(returnorder, restockorder)
const item = new Item()
const { clearDB } = require('../../db/reset');
const path = './db/ezdb.sqlite3'

describe('ReturnOrder tests', () => {

    describe('getReturnOrder', () => {

        const ro = {
            returnDate: "2021/11/29 09:33",
            products: [{ SKUId: 1, itemId: 1, description: "a new sku", RFID: "12345678901234567890123456789017" }],
            restockOrderId: 1
        }

        const newsku = {
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }

        const restkOrd =
        {
            issueDate: "2021/11/29 09:33",
            products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, "qty": 30 }],
            supplierId: 1
        }
        const supplier = {
            username: "supplier122@ezwh.com",
            name: "pippo",
            surname: "baudo",
            password: "testpassword",
            type: "supplier"
        }
        const sn = {
            RFID: "12345678901234567890123456789017",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        }

        const i = {
            id: 1,
            description: "a new sku",
            price: 10.99,
            SKUId: 1,
            supplierId: 1
        }


        beforeAll(async () => {
            jest.setTimeout(30000)
            dao.connect(path)
            try {
                await restockorder.deleteAll()
                await restockorder.drop()
            }
            catch (e) {
            }
            try {
                await returnorder.deleteAll()
                await returnorder.drop()
            }
            catch (e) {
            }
            await restockorder.createTable()
            await restockorder.createTableProducts()
            await restockorder.createTableSkuItems()
            await restockorder.createTableTransportNotes()
            await returnorder.createTable()
            await returnorder.createTableProducts()

            try {
                await item.deleteAll()
                await item.drop()
            }
            catch (e) {
            }
            await item.createTable()

            try {
                await skuitem.deleteAll()
                await skuitem.drop()
            }
            catch (e) {
            }
            try {
                await sku.deleteAll()
                await sku.drop()
            }
            catch (e) {
            }
            await sku.createTable()
            await skuitem.createTable()

            try {
                await user.deleteAll()
                await user.drop()
            }
            catch (e) {
            }
            await user.createTable()

            await user.new(supplier)
            await sku.new(newsku)
            await skuitem.new(sn)
            await item.new(i)
            await restockorder.new(restkOrd)
            await returnorder.new(ro, 1)
        })

        test('The return order exist, return the order', async () => {

            result = await returnorderc.getReturnOrder(1)
            console.log(">>>>> ", result)
            expect(result).toEqual({ ...ro, id: 1 })
        })

        test("The return order dosn't exist, return false", async () => {
            result = await returnorderc.getReturnOrder(2)
            console.log(result)
            expect(result).toBeFalsy()
        })

        afterAll(async () => {

        })

    })

    describe('addReturnOrder', () => {
        let returnOrder = {
            returnDate: "2021/11/29 09:33",
            products: [{ SKUId: 1, description: "a new sku", RFID: "12345678901234567890123456789015" }],
            restockOrderId: 1
        }
        let newsku = {
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }

        let restockOrder = {
            issueDate: "2021/11/29 09:33",
            products: [{ SKUId: 1, description: "a product", price: 10.99, "qty": 30 }],
            supplierId: 1
        }
        const supplier = {
            username: "supplier122@ezwh.com",
            name: "pippo",
            surname: "baudo",
            password: "testpassword",
            type: "supplier"
        }

        let skuitem_valid = {
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        }


        let skuid = " "
        let roid = " "
        beforeAll(async () => {
            jest.setTimeout(20000)
            await dao.connect(path)
            skuid = await sku.new(newsku)
            console.log(skuid)
            let s = await user.new(supplier)
            await skuitem.new(skuitem_valid)
            restockOrder.supplierId = s.id
            console.log(s.id)
            roid = await restockorder.new(restockOrder)
            console.log(roid)
            returnOrder.restockOrderId = roid
            console.log(returnOrder)
        })
        test('Restock order exists, return order created correctly, retun true ', async () => {

            let result = await returnorderc.addReturnOrder(returnOrder)
            expect(result).toBeTruthy()
        })
        test("Restock order doesn't exists, return order not created, retun false", async () => {
            returnOrder.restockOrderId = roid + 10
            let result = await returnorderc.addReturnOrder(returnOrder)
            expect(result).toBeFalsy()
        })

        afterAll(async () => {
            await clearDB()
        })

    })
})