const dao = require('../../db/dao');
const Sku = require('../../models/sku')
const SkuController = require('../../controllers/skucontroller');
const Position = require('../../models/position');
const { ValidationError } = require('../../middlewares/errors');
const sku  = new Sku() ;
const position = new Position()
const skucontroller  = new SkuController(sku , position)
const { clearDB } = require('../../db/reset');
const path = './db/ezdb.sqlite3'

describe('Sku tests', () => {
    describe('getSku', () =>{

        const skuList = [
            {
                description: "a new sku",
                weight: 100,
                volume: 50,
                notes: "Test SKU",
                availableQuantity: 50,
                price: 10.99,
            },
            {
                id: 2,
                description: "a new sku",
                weight: 100,
                volume: 50,
                notes: "second SKU",
                availableQuantity: 50,
                price: 15.99,
                position: "800234543412",
            },]
        let id = " "
        beforeEach(async() =>{
            jest.setTimeout(10000)
            dao.connect(path)
            try{
                await sku.createTable();
            }catch(err){}
            s = await sku.new(skuList[0])
            id = s.id
        })

        test('Sku exists, return it', async ()=> {
            let result = await skucontroller.getSku(id)
            expect(result).toEqual({
                id: id,
                description: "a new sku",
                weight: 100,
                volume: 50,
                notes: "Test SKU",
                availableQuantity: 50,
                price: 10.99,
                position: null ,
            }) 
        })

        test("Sku doesn't exists, return false", async ()=> {
            let result = await skucontroller.getSku(id+1)
            expect(result).toBeFalsy() 
        })

        afterEach(async() =>{
            await sku.drop()
        })
    })

    describe('addSku', () =>{
        const skuList = [
            {
                description: "a new sku",
                weight: 100,
                volume: 50,
                notes: "Test SKU",
                availableQuantity: 50,
                price: 10.99,
            },
            {
                id: 2,
                description: "a new sku",
                weight: 100,
                volume: 50,
                notes: "second SKU",
                availableQuantity: 50,
                price: 15.99,
                position: "800234543412",
            },]
        let id = " ";
        beforeEach(async() =>{
            jest.setTimeout(10000)
            // await dao.connect(path)
            try{
                await sku.createTable();
            }catch(err){}
        })

        test("adding sku", async ()=> {
            let result = await skucontroller.addSku(skuList[0])
            id = result.id
            expect(result).toBeTruthy() 
        })

        afterEach(async() =>{
            await sku.drop()
        })
    })

    describe('updateSku', () =>{
        let skuList = [
            {
                description: "a new sku",
                weight: 100,
                volume: 50,
                notes: "Test SKU",
                availableQuantity: 50,
                price: 10.99,
            },
            {
                newDescription : "a new sku",
                newWeight : 100,
                newVolume : 50,
                newNotes : "first SKU",
                newPrice : 10.99,
                newAvailableQuantity : 3
            }
            ,]

            let position_prova = {
                positionID:"800234543413",
                aisleID: "8002",
                row: "3454",
                col: "3413",
                maxWeight: 1000,
                maxVolume: 1000
            }
    

        let id = " ";
        let p = " ";

        beforeAll(async() =>{
            jest.setTimeout(10000)
            // await dao.connect(path)
            try{
                await sku.createTable();
            }catch(err){}
            s = await sku.new(skuList[0])
            id = s.id
            try{
                await position.createTable();
            }catch(err){}
            p = await position.new(position_prova)
            await sku.updatePosition(id,position_prova.positionID)
        })

        test("Update sku", async ()=> {
            let result = await skucontroller.updateSku(id,skuList[1])
            expect(result).toBeTruthy() 
        })

        test("Update sku 1st error", async ()=> {
            let result = await skucontroller.updateSku(id+1,skuList[1])
            expect(result).toBeFalsy() 
        })

        test("Update sku 2nd error", async ()=> {
            skuList[1].newVolume = 10000;
            try{
                await skucontroller.updateSku(id,skuList[1])
            }
            catch(e){
                expect(e).toBeInstanceOf(ValidationError)
            }
        })

        afterAll(async() =>{
            await clearDB()
        })
    })


})