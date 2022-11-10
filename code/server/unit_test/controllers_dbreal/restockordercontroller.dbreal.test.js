const dao = require('../../db/dao');
const RestockOrder = require('../../models/restockorder')
const RestockOrderController = require('../../controllers/restockordercontroller');
const User = require('../../models/user')
const Sku = require('../../models/sku')
const SkuItem = require('../../models/skuitem')
const Item = require('../../models/item');
const user = new User();
const sku = new Sku();
const skuitem = new SkuItem();
const restockorder = new RestockOrder();
const restockorderc = new RestockOrderController(restockorder)
const { clearDB } = require('../../db/reset');
const item = new Item()
const path = './db/ezdb.sqlite3'

describe('RestockOrder tests', () => {
    describe('getRestockOrdersIssued', () => {
        /** 
         * 1. create supplier user 
         * 2. create sku 
         * 3. create RO 
         */
        let skuId = "";
        let roId = "";
        let userId = "";
        const supplier = {
            username: "suppliernew@ezwh.com",
            name: "pippo",
            surname: "baudo",
            password: "testpassword",
            type: "supplier"
        }
        const validSku = {
            description: "a new sku",
            weight: 10,
            volume: 10,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 21,
        }
        // this.updatePosition(res.id, "800234543413") 
        let validRO = {
            issueDate: "2021/11/29 09:33",
            products: [
                {
                    SKUId: 1,
                    itemId: 1,
                    description: validSku.description,
                    price: validSku.price,
                    qty: 1  // 要进多少货 
                }
            ],
            supplierId: 1
        }

        const i = {
            id: 1,
            description: "a new sku",
            price: 10.99,
            SKUId: 1,
            supplierId: 1
        }

        beforeAll(async () => {
            jest.setTimeout(40000)
            dao.connect(path);

            try {
                await restockorder.deleteAll()
                await restockorder.drop()
            }
            catch (e) {
            }
            await restockorder.createTable();
            await restockorder.createTableProducts();
            await restockorder.createTableSkuItems();
            await restockorder.createTableTransportNotes();

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


            res = await user.new(supplier);
            userId = res.id;
            res = await sku.new(validSku);
            skuId = res.id;
            validRO.products[0].SKUId = skuId;
            validRO.supplierId = userId;

            await item.new(i)

            res = await restockorder.new(validRO);//这个直接返回的id所以不用res.id了 
            roId = res;
        })

        test('get Issued Restock Order success', async () => {
            let result = await restockorderc.getRestockOrdersIssued()
            expect(result).toEqual([
                { ...validRO, id: 1, state: "ISSUED"}
            ])
        })
        afterAll(async () => {
            await restockorder.deleteAll();
            await item.deleteAll();
            await sku.deleteAll();
            await user.deleteAll();
            await restockorder.drop()
            await sku.drop()
            await user.drop()
        })
    })

    describe('addRestockOrder', () => {
        /** 
         * 1. create supplier user 
         * 2. create sku 
         *  
         */
        let skuId = "";
        let roId = "";
        let userId = "";
        const supplier = {
            username: "suppliernew@ezwh.com",
            name: "pippo",
            surname: "baudo",
            password: "testpassword",
            type: "supplier"
        }
        const validSku = {
            description: "a first sku",
            weight: 10,
            volume: 10,
            notes: "first SKU",
            price: 5.99,
            availableQuantity: 21,
        }
        // this.updatePosition(res.id, "800234543413") 
        let validRO = {
            issueDate: "2021/11/29 09:33",
            products: [
                {
                    SKUId: "",
                    description: validSku.description,
                    price: validSku.price,
                    qty: 2  // 要进多少货 
                }
            ],
            supplierId: ""
        }
        beforeAll(async () => {
            jest.setTimeout(40000)
            // await dao.connect(path); 
            try {
                await user.createTable()
            } catch (err) { }
            res = await user.new(supplier);
            userId = res.id;

            try {
                await sku.createTable()
            } catch (err) { }
            res = await sku.new(validSku);
            skuId = res.id;
            validRO.products[0].SKUId = skuId;
            validRO.supplierId = userId;
            // res = await restockorder.new(validRO);//这个直接返回的id所以不用res.id了 
            // roId = res; 
            try {
                await restockorder.createTable()
                await restockorder.createTableProducts()
                await restockorder.createTableSkuItems()
                await restockorder.createTableTransportNotes()
            } catch (err) { }
        })

        test('add Restock Order success', async () => {
            let result = await restockorderc.addRestockOrder(validRO)
            expect(result).toBeTruthy();
            roId = result;
            console.log(result)
            await restockorder.delete(roId)
        })
        afterAll(async () => {
            await restockorder.deleteAll();
            await sku.deleteAll();
            await user.deleteAll();
            await restockorder.drop()
            await sku.drop()
            await user.drop()
        })

    })

    describe('updateRestockOrderState', () => {
        /** 
         * 1. create supplier user 
         * 2. create sku 
         * 3. create sku item 
         * 4. create RO 
         */
        let skuId = "";
        let roId = "";
        let userId = "";
        const supplier = {
            username: "suppliernew@ezwh.com",
            name: "pippo",
            surname: "baudo",
            password: "testpassword",
            type: "supplier"
        }
        const validSku = {
            description: "a first sku",
            weight: 10,
            volume: 10,
            notes: "first SKU",
            price: 5.99,
            availableQuantity: 21,
        }
        // this.updatePosition(res.id, "800234543413") 
        let validSkuItem = [
            {
                RFID: "12345678901234567890123456789016",
                SKUId: "",
                DateOfStock: "2021/11/29 12:30"
            }
        ]
        let validRO = {
            issueDate: "2021/11/29 09:33",
            products: [
                {
                    SKUId: "",
                    description: validSku.description,
                    price: validSku.price,
                    qty: 3  // 要进多少货 
                }
            ],
            supplierId: ""
        }

        beforeAll(async () => {
            jest.setTimeout(40000)
            await dao.connect(path);
            try {
                await user.createTable()
            } catch (err) { }
            res = await user.new(supplier);
            userId = res.id;
            try {
                await sku.createTable()
            } catch (err) { }
            res = await sku.new(validSku);
            skuId = res.id;
            validSkuItem[0].SKUId = skuId;
            try {
                await skuitem.createTable();
            } catch (err) { }
            res = await skuitem.new(validSkuItem[0]);
            validRO.products[0].SKUId = skuId;
            validRO.supplierId = userId;
            try {
                await restockorder.createTable()
                await restockorder.createTableProducts()
                await restockorder.createTableSkuItems()
                await restockorder.createTableTransportNotes()
            } catch (err) { }
            res = await restockorder.new(validRO);//这个直接返回的id所以不用res.id了 
            roId = res;
        })

        test('update Restock Order SkuItems success', async () => {
            let result = await restockorderc.updateRestockOrderSkuItems(roId, validSkuItem);

            expect(result).toBeTruthy();
        })

        afterAll(async () => {
            await clearDB()
        })
    })
})