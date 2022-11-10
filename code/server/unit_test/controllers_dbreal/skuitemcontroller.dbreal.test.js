const dao = require('../../db/dao');
const SkuItem  = require('../../models/skuitem')
const Sku = require('../../models/sku');
const SkuItemController = require('../../controllers/skuitemcontroller');
const skuitem  = new SkuItem();
const sku = new Sku();
const skuitemcontroller  = new SkuItemController(sku, skuitem)
const { clearDB } = require('../../db/reset');
const path = './db/ezdb.sqlite3'

describe('SkuItem tests', () => {
    describe('addItem', () =>{
        const sku_prova = {
            description : "a new sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            price : 10.99,
            availableQuantity : 50
        }

        const skuItem = {
            RFID:"12345678901234567890123456789070",
            SKUId:1,
            DateOfStock:"2021/11/29 12:30"
        }

        let skuid = " ";
        let result;

        beforeAll(async() =>{
            jest.setTimeout(10000)
            dao.connect(path)
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
            skuid = await sku.new(sku_prova)
            skuItem.SKUId = skuid.id
        })

        test('Add a new sku item successfully', async ()=> {
            result = await skuitemcontroller.addItem(skuItem)
            expect(result).toBeTruthy() 
        })

        test('SKU not found', async ()=> {
            skuItem.SKUId = skuid.id + 10
            result = await skuitemcontroller.addItem(skuItem)
            expect(result).toBeFalsy() 
        })

        afterAll(async() =>{
            await skuitem.deleteAll()
            await sku.deleteAll()
            await skuitem.drop()
            await sku.drop()

        })
    })

    describe('updateItem', () => {
        let initialSkuItem =   {
            RFID:"12345678901234567890123456789097",
            SKUId:1,
            DateOfStock:"2021/11/29 12:30"
        }

        const newValidSkuItem =  {
            newRFID:"12345678901234567890123456789101",
            newAvailable:1,
            newDateOfStock:"2021/11/29 12:30"
        }

        const sku_prova = {
            description : "a new sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            price : 10.99,
            availableQuantity : 50
        }

        let skuid = " ";
    

        beforeAll(async() => {
            jest.setTimeout(10000)
            await dao.connect(path)
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
            skuid = await sku.new(sku_prova)
            initialSkuItem.SKUId = skuid.id
            await skuitem.new(initialSkuItem)
        })
        

        test('skuItem is updated successfully', async () => {
            let result = await skuitemcontroller.updateItem(initialSkuItem.RFID, newValidSkuItem)
            initialSkuItem.RFID = newValidSkuItem.newRFID
            expect(result).toBeTruthy()
        })

        test('skuItem not updated, skuItem to be updated is not found', async () => {
            let result = await skuitemcontroller.updateItem("123456789101", newValidSkuItem) 
            expect(result).toBeFalsy()
        })

        afterAll(async() =>{
            await clearDB()
        })

    })

})