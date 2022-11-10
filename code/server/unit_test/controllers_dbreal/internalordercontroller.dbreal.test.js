const dao = require('../../db/dao');
const InternalOrder = require('../../models/internalorder')
const User = require('../../models/user');
const Sku = require('../../models/sku');
const SkuItem  = require('../../models/skuitem')
const InteralOrderController = require('../../controllers/internalordercontroller');
const { clearDB } = require('../../db/reset');
const internalOrder = new InternalOrder();
const user = new User();
const sku = new Sku();
const skuitem  = new SkuItem();
const internalordercontroller = new InteralOrderController(internalOrder, skuitem, user, sku)
const path = './db/ezdb.sqlite3'

describe('InteralOrder tests', () => {
    describe('addInternalOrder', () =>{
        let i = {
            issueDate:"2021/11/29 09:33",
            products: [{SKUId:2,description:"a product",price:10.99,qty:3}],
            customerId : 1
        }

        const customer = {
            username: "user1333@ezwh.com",
            name: "pippo",
            surname: "baudo",
            password: "testpassword",
            type: "customer"
          }


        const sku_prova = {
            description : "a new sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            price : 10.99,
            availableQuantity : 50
        }
    

        let customerId = " ";
        let skuid = " ";

        beforeAll(async() =>{
            jest.setTimeout(80000)
            dao.connect(path)
            try{
                await internalOrder.createTable();
                await internalOrder.createTableProducts();
                await internalOrder.createTableSkuItems()
            }catch(err){}
            try{
                await user.createTable();
            }catch(err){}
            customerId = await user.new(customer)
            i.customerId = customerId.id
            try{
                await sku.createTable();
            }catch(err){}
            skuid = await sku.new(sku_prova)
            i.products[0].SKUId = skuid.id
            
            // try{
            //     await internalOrder_product.createTable();
            // }catch(err){}
        })

        test('Add a new internal order successfully', async ()=> {
            result = await internalordercontroller.addInternalOrder(i)
            expect(result).toBeTruthy()       
        })

        
        test("SKU doesn't exist", async ()=> {
            i.products[0].SKUId = skuid.id + 1
            try{
                result = await internalordercontroller.addInternalOrder(i)
            }catch(e){
                expect(e.code).toBe("SQLITE_CONSTRAINT")
            }
        })
/*
        test("User doesn't exist", async ()=> {
            i.customerId = customerId.id + 1
            try{
                result = await internalordercontroller.addInternalOrder(i)
            }catch(e){
                expect(e).toBeInstanceOf(ValidationError)
            }
        })*/
/*
        test("User.type is not a customer", async ()=> {
            i.customerId = customerId2.id
            try{
                result = await internalordercontroller.addInternalOrder(i)
            }catch(e){
                expect(e).toBeInstanceOf(ValidationError)
            }
        })*/

        afterAll(async() =>{
            await clearDB()
        })
        
    })
})