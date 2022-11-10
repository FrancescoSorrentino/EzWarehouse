const dao = require('../../db/dao');
const path = './db/ezdb.sqlite3'
const Item = require('../../models/item')
const User = require('../../models/user');
const Sku = require('../../models/sku');
const item = new Item();
const user = new User();
const sku = new Sku();
const { clearDB } = require('../../db/reset');


describe('testItemDao', () => {

    let i = {
        id: 12,
        description: "a new item",
        price: 10.99,
        SKUId: 1,
        supplierId: 1
    }

    const supplier = {
        username: "supplier122@ezwh.com",
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


    beforeAll(async () => {
        await dao.connect(path);
        jest.setTimeout(14000)
        try {
            await item.deleteAll()
            await item.drop()
        }
        catch (e) {
        }
        await item.createTable()

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

        result = await sku.new(sku_prova)
        i.SKUId = result.id
        result2 = await user.new(supplier)
        i.supplierId = result2.id
        result = await item.new(i)
    });

    test('delete db', async () => {
        var res = await item.getItems();
        expect(res.length).toStrictEqual(1);
    });

    testUpdateItem(i.id, i.supplierId, "a new item", 10.99)
    testDeleteItem(i.id, i.supplierId)

    afterAll(async () => {
        await clearDB()
    })

});

function testUpdateItem(id, supplierId, newDescription, newPrice) {


    test('update item success', async () => {
        const newItem = { newDescription: newDescription, newPrice: newPrice }
        res = await item.update(id, supplierId, newItem)


        res = await item.getItem(id, supplierId);

        expect(res.description).toStrictEqual(newDescription);
        expect(res.price).toStrictEqual(newPrice);


    });


    test('update item not success, value of supplierID', async () => {
        const newItem = { newDescription: newDescription, newPrice: newPrice }


        supplierId = supplierId + 100


        let result = await item.update(id, supplierId, newItem)
        expect(result.changes).toStrictEqual(0)


    });

    test('update item not success, value of id wrong', async () => {
        const newItem = { newDescription: newDescription, newPrice: newPrice }


        id = id + 100


        let result = await item.update(id, supplierId, newItem)
        expect(result.changes).toStrictEqual(0)


    });
}


function testDeleteItem(id, supplierId) {
    test('delete item not success, id wrong', async () => {
        id = id + 100
        let result = await item.delete(id, supplierId)
        expect(result.changes).toStrictEqual(0)

    });

    test('delete item not success, supplierId wrong', async () => {
        supplierId = supplierId + 100
        let result = await item.delete(id, supplierId)
        expect(result.changes).toStrictEqual(0)

    });

    test('delete item success', async () => {

        await item.delete(id, supplierId)
        let res = await item.getItem(id, supplierId)
        expect(res).toBeFalsy()

    });



}


