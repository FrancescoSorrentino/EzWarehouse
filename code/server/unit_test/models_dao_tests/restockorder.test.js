const dao = require('../../db/dao');
const path = './db/ezdb.sqlite3'
const RestockOrder = require('../../models/restockorder')
const User = require('../../models/user');
const Sku = require('../../models/sku');
const SkuItem = require('../../models/skuitem')
const Item = require('../../models/item')
const restockOrder = new RestockOrder();
const user = new User();
const sku = new Sku();
const skuitem = new SkuItem();
const item = new Item();
const { clearDB } = require('../../db/reset');

describe('testRestockOrderDAO', () => {

    const supplier = {
        username: "user1333@ezwh.com",
        name: "pippo",
        surname: "baudo",
        password: "testpassword",
        type: "supplier"
    }
    const sku_prova = {
        description: "a new sku",
        weight: 100,
        volume: 50,
        notes: "first SKU",
        price: 10.99,
        availableQuantity: 50
    }

    let i1 = {
        id: 1,
        description: "a new item",
        price: 10.99,
        SKUId: 0,
        supplierId: 0
    }
    let i2 = {
        id: 2,
        description: "a new item",
        price: 10.99,
        SKUId: 0,
        supplierId: 0
    }

    let ro = {
        issueDate: "2021/11/29 09:00",
        products: [{ SKUId: 0, itemId: 1, description: "a product", price: 10.99, qty: 30 },
        { SKUId: 0, itemId: 2, description: "another product", price: 11.99, qty: 20 },],
        supplierId: 0
    }

    let ns = {
        newState: "DELIVERED"
    }


    beforeAll(async () => {
        await dao.connect(path);
        jest.setTimeout(14000)
        try {
            await restockOrder.deleteAll()
            await restockOrder.drop()
        }
        catch (e) {
        }
        await restockOrder.createTable();
        await restockOrder.createTableProducts();
        await restockOrder.createTableSkuItems();
        await restockOrder.createTableTransportNotes();

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
        await skuitem.createTable()

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

        let u = await user.new(supplier)
        let s1 = await sku.new(sku_prova)
        let s2 = await sku.new(sku_prova)

        i1.SKUId = s1.id
        i2.SKUId = s2.id
        i1.supplierId = u.id
        i2.supplierId = u.id
        ro.products[0].SKUId = s1.id
        ro.products[1].SKUId = s2.id
        ro.supplierId = u.id

        await item.new(i1)
        await item.new(i2)

        console.log("deleted")
    });

    test('delete db', async () => {
        var res = await restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(0);
    });

    testNewRestockOrder(i1, i2, ro);
    testUpdateRestockOrderState(ro, ns);

    afterAll(async () => {
        await clearDB()
    })

});

function testNewRestockOrder(i1, i2, ro) {
    test('create new restock order', async () => {
        let id = await restockOrder.new(ro);
        let res = await restockOrder.getRestockOrders();
        expect(res.length).toStrictEqual(1);

        res = await restockOrder.getRestockOrder(id);
        expect(res.id).toStrictEqual(id);
        expect(res.issueDate).toStrictEqual(ro.issueDate);
        expect(res.state).toStrictEqual("ISSUED");
        expect(res.supplierId).toStrictEqual(ro.supplierId);
        expect(res.products.length).toStrictEqual(2);
        expect(res.products[0].SKUId).toStrictEqual(ro.products[0].SKUId);
        expect(res.products[0].description).toStrictEqual(i1.description);
        expect(res.products[0].price).toStrictEqual(i1.price);
        expect(res.products[0].qty).toStrictEqual(ro.products[0].qty);
        expect(res.products[1].SKUId).toStrictEqual(ro.products[1].SKUId);
        expect(res.products[1].description).toStrictEqual(i2.description);
        expect(res.products[1].price).toStrictEqual(i2.price);
        expect(res.products[1].qty).toStrictEqual(ro.products[1].qty);
    });
}

function testUpdateRestockOrderState(ro, ns) {

    test('update restock order state', async () => {
        let id = await restockOrder.new(ro);
        await restockOrder.updateState(id, ns)
        res = await restockOrder.getRestockOrder(id);
        expect(res.state).toStrictEqual(ns.newState);
    });

}
