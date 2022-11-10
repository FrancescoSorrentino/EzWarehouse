const dao = require('../../db/dao');
const Item  = require('../../models/item')
const User = require('../../models/user');
const Sku = require('../../models/sku');
const ItemController = require('../../controllers/itemcontroller');
const item = new Item();
const user = new User();
const sku = new Sku();
const itemcontroller = new ItemController(item, user, sku)
const { clearDB } = require('../../db/reset');
const path = './db/ezdb.sqlite3'

describe('Item tests', () => {
    
    describe('addItem', () =>{
        let i = {
            id : 12,
            description : "a new item",
            price : 10.99,
            SKUId : 2,
            supplierId : 1
        }

        const supplier = {
            username: "supplier122@ezwh.com",
            name: "pippo",
            surname: "baudo",
            password: "testpassword",
            type: "supplier"
          }

        const sku_prova = {
            description : "a new sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            price : 10.99,
            availableQuantity : 50
        }

        let s = " ";
        let id2 = " ";
        let result;

        beforeAll(async() =>{
            jest.setTimeout(10000)
            dao.connect(path)
            try{
            await user.createTable()
            }catch(err){}
            s = await user.new(supplier)
            i.supplierId = s.id
            try{
                await sku.createTable()
            }catch(err){}
            id2 = await sku.new(sku_prova)
            i.SKUId = id2.id
            try{
                await item.createTable()
            }catch(err){}
        })

        test('Add a new item successfully', async ()=> {
            result = await itemcontroller.addItem(i)
            expect(result).toBeTruthy() 
        })

        test('SKU not found', async ()=> {
            i.SKUId = id2.id + 10
            result = await itemcontroller.addItem(i)
            expect(result).toBeFalsy() 
        })

        test('supplierId not found in user table', async ()=> {
            i.supplierId = i.supplierId + 10
            result = await itemcontroller.addItem(i)
            expect(result).toBeFalsy() 
        })

        afterAll(async() =>{
            await item.drop()
            await sku.drop()
            await user.drop()
        })
    })

    describe('updateItem', () => {
       
        let itemList = [{
                id: 1,
                description: "a new item",
                price: 10.99,
                SKUId: 1,
                supplierId: 3
            },
            {
                newDescription: "a new item description",
                newPrice: 8.99
            }
        ]

        const supplier = {
            username: "supplier122@ezwh.com",
            name: "pippo",
            surname: "baudo",
            password: "testpassword",
            type: "supplier"
          }

        const sku_prova = {
            description : "a new sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            price : 10.99,
            availableQuantity : 50
        }

        let id = " ";
        let s = " ";
        let id2 = " ";
        let result;

        beforeAll(async() => {
            jest.setTimeout(10000)
            // await dao.connect(path)
            try{
                await user.createTable()
            }catch(err){}
            s = await user.new(supplier)
            itemList[0].supplierId = s.id
            try{
                await sku.createTable()
            }catch(err){}
            id2 = await sku.new(sku_prova)
            itemList[0].SKUId = id2.id
            try{
                await item.createTable()
            }catch(err){}
            i = await item.new(itemList[0])
            id = i.id
        })

        test('update item success', async () => {
            let result = await itemcontroller.updateItem(itemList[1], id, itemList[0].supplierId)
            expect(result).toBeTruthy()
        })

        test('item not updated, value of id wrong', async () => {
            let result = await itemcontroller.updateItem(itemList[1], id+1, itemList[1].supplierId)
            expect(result).toBeFalsy()
        })

        afterAll(async() =>{
            await clearDB()
        })

    })

    
})