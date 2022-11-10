const dao = require('../../db/dao');
const path = './db/ezdb.sqlite3'
const InternalOrder = require('../../models/internalorder')
const User = require('../../models/user');
const Sku = require('../../models/sku');
const internalOrder = new InternalOrder();
const user = new User();
const sku = new Sku();
const { clearDB } = require('../../db/reset');


describe('testItemDao', () => {

    let i = {
        issueDate: "2021/11/29 09:33",
        products: [{ SKUId: 1, description: "a product", price: 10.99, qty: 3 }],
        customerId: 1
    }

    let i1 = {
        issueDate: "2021/11/29 09:33",
        products: [{ SKUId: 1, description: "a product", price: 10.99, qty: 3 }],
        customerId: 100
    }

    let i2 = {
        issueDate: "2021/11/29 09:33",
        products: [{ SKUId: 100, description: "a product", price: 10.99, qty: 3 }],
        customerId: 1
    }

    let i3 = {
        products: [{ SKUId: 1, description: "a product", price: 10.99, qty: 3 }],
        customerId: 1
    }


    const customer = {
        username: "user1333@ezwh.com",
        name: "pippo",
        surname: "baudo",
        password: "testpassword",
        type: "customer"
    }


    const sku_prova = {
        description: "a new sku",
        weight: 100,
        volume: 50,
        notes: "first SKU",
        price: 10.99,
        availableQuantity: 50
    }


    beforeAll(async () => {
        jest.setTimeout(20000);
        await dao.connect(path);
        try {
            await internalOrder.deleteAll()
            await internalOrder.drop()
        }
        catch (e) {
        }
        await internalOrder.createTable();
        await internalOrder.createTableProducts();
        await internalOrder.createTableSkuItems();

        try {
            await sku.deleteAll()
            await sku.drop()
        }
        catch (e) {
        }
        await sku.createTable()

        try {
            await user.deleteAll()
            await user.drop()
        }
        catch (e) {
        }
        await user.createTable()


        let res = await sku.new(sku_prova)
        //i.SKUId = result.id
        res = await user.new(customer)
        //i.supplierId = result2.id
    });


    afterAll(async () => {
        await clearDB()
    })



    test('new internal order success', async () => {
        console.log(i)
        res = await internalOrder.new(i)

        expect(res.issueDate).toStrictEqual(internalOrder.issueDate);
        expect(res.customerId).toStrictEqual(internalOrder.customerId);

        res = await internalOrder.delete(res.id)

    });


});


