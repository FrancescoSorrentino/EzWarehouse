const dao = require('../../db/dao');
const TestResult  = require('../../models/testresult')
const TestResultController = require('../../controllers/testresultcontroller');
const TestDescriptor = require('../../models/testdescriptor');
const SkuItem = require('../../models/skuitem');
const Sku = require('../../models/sku');
const testdescriptor = new TestDescriptor();
const testresult  = new TestResult();
const skuitem = new SkuItem();
const sku = new Sku();
const testresultc  = new TestResultController(testdescriptor,testresult,skuitem)
const { clearDB } = require('../../db/reset');
const path = './db/ezdb.sqlite3'

describe('TestResult tests', () => {
    describe('getTestResults', () =>{
        /**
         * 1.create sku
         * 2.creat sku item
         * 3.create test descriptor
         * 4.create test result
         */
        let id =""
        let skuId = "";
        // let rfid="";
        let tdId = "";
        const validSku = {
            description: "a first sku",
            weight: 10,
            volume: 10,
            notes: "first SKU",
            price: 5.99,
            availableQuantity: 1,
        }
        let validSkuItem = {
            RFID:"12345678901234567890123456789019",
            SKUId:"",
            DateOfStock:"2021/11/29 12:30"
        }
        let validTd = {
            id:1,
            name:"test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU :""
        }
        let newValidTr={
            rfid:validSkuItem.RFID,
            idTestDescriptor:"",
            Date:"2021/11/28",
            Result: 1
        }
        beforeEach(async() =>{
            jest.setTimeout(6000)
            dao.connect(path)
            try{
                await sku.createTable();
            }catch(err){}
            res = await sku.new(validSku);
            skuId = res.id;
            validSkuItem.SKUId = skuId;
            validTd.idSKU = skuId;
            try{
                await skuitem.createTable();
            }catch(err){}
            res = await skuitem.new(validSkuItem);
            try{
                await testdescriptor.createTable();
            }catch(err){}
            res = await testdescriptor.new(validTd);
            tdId = res.id;
            newValidTr.idTestDescriptor = tdId;
            try{
                await testresult.createTable();
            }catch(err){}
            tr = await testresult.new(newValidTr)
            id = tr.id
        })

        test(' get TestResult success', async ()=> {
            let result = await testresultc.getTestResultByID( newValidTr.rfid,id)
            expect(result).toEqual({
                id:id,
                idTestDescriptor:tdId,
                Date:"2021/11/28",
                Result: newValidTr.Result      
            })
        })
        afterEach(async() =>{
            await testresult.delete(id);
            await testdescriptor.delete(tdId);
            await skuitem.delete(validSkuItem.RFID);
            await sku.delete(skuId);

        })
    })

    describe('addTestResult', () =>{
        let id =""
        let skuId = "";
        // let rfid="";
        let tdId = "";
        const validSku = {
            description: "a first sku",
            weight: 10,
            volume: 10,
            notes: "first SKU",
            price: 5.99,
            availableQuantity: 1,
        }
        let validSkuItem = {
            RFID:"12345678901234567890123456789019",
            SKUId:"",
            DateOfStock:"2021/11/29 12:30"
        }
        let validTd = {
            id:1,
            name:"test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU :""
        }
        const newValidTr={
            rfid:validSkuItem.RFID,
            idTestDescriptor:"",
            Date:"2021/01/21",
            Result: 0
        }
        const newInvalidTr={
            rfid: validSkuItem.RFID+1,
            idTestDescriptor:"",
            Date:"2021/01/21",
            Result: 0
        }
        beforeEach(async() =>{
            jest.setTimeout(6000)
            // await dao.connect(path)
            res = await sku.new(validSku);
            skuId = res.id;
            validSkuItem.SKUId = skuId;
            validTd.idSKU = skuId;
            res = await skuitem.new(validSkuItem);
            res = await testdescriptor.new(validTd);
            tdId = res.id;
            newValidTr.idTestDescriptor = tdId;
            newInvalidTr.idTestDescriptor = tdId;
            // tr = await testresult.new(newValidTr)
            // id = tr.id
        })

        test(' add success', async ()=> {
            let result = await testresultc.addTestResult(newValidTr)
            id = result.id
            expect(result.changes).toEqual(1)
        })
        test(' add fail', async ()=> {
            let result = await testresultc.addTestResult(newInvalidTr)
            id = result.id
            expect(result).toBeFalsy()
        })
        afterEach(async() =>{
            await testresult.delete(id)
            await testdescriptor.delete(tdId);
            await skuitem.delete(validSkuItem.RFID);
            await sku.delete(skuId);
        })
    })

    describe('updateTestResult', () =>{
        let id =""
        let skuId = "";
        // let rfid="";
        let tdId = "";
        const validSku = {
            description: "a first sku",
            weight: 10,
            volume: 10,
            notes: "first SKU",
            price: 5.99,
            availableQuantity: 1,
        }
        let validSkuItem = {
            RFID:"12345678901234567890123456789019",
            SKUId:"",
            DateOfStock:"2021/11/29 12:30"
        }
        let validTd = {
            id:1,
            name:"test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU :""
        }
        let validTr={
            rfid:validSkuItem.RFID,
            idTestDescriptor:"",
            Date:"2021/11/28",
            Result: 1
        }
        const newValidTr={
            newIdTestDescriptor:"",
            newDate:"2021/01/28",
            newResult: 0
        }
        const newInvalidTr={
            newIdTestDescriptor:"",
            newDate:"2021/11/28",
            newResult: true
        }
        
        beforeAll(async() =>{
            jest.setTimeout(6000)
            // await dao.connect(path)
            try{
                await sku.createTable();
            }catch(err){}
            res = await sku.new(validSku)
            skuId = res.id;
            validSkuItem.SKUId = skuId;
            validTd.idSKU = skuId;
            try{
                await skuitem.createTable();
            }catch(err){}
            res = await skuitem.new(validSkuItem);
            try{
                await testdescriptor.createTable();
            }catch(err){}
            res = await testdescriptor.new(validTd);
            tdId = res.id;
            validTr.idTestDescriptor = tdId;
            newValidTr.newIdTestDescriptor = tdId;
            newInvalidTr.newIdTestDescriptor = tdId+1;
            try{
                await testresult.createTable();
            }catch(err){}
            tr = await testresult.new(validTr)
            id = tr.id
        })

        test(' update success', async ()=> {
            let result = await testresultc.updateTestResult(validSkuItem.RFID,id,newValidTr)
            expect(result.changes).toEqual(1)
            let updatedTd = await testresultc.getTestResultByID(validSkuItem.RFID,id)
            expect(updatedTd).toEqual({
                id:id,
                idTestDescriptor:newValidTr.newIdTestDescriptor,
                Date:newValidTr.newDate,
                Result:newValidTr.newResult
            })
        })
        test(' update fail:wrong rfid', async ()=> {
            let result = await testresultc.updateTestResult(validSkuItem.RFID+1,id,newValidTr)
            expect(result).toBeFalsy()
        })
        test(' update fail:wrong id', async ()=> {
            let result = await testresultc.updateTestResult(validSkuItem.RFID,id+1,newValidTr)
            expect(result).toBeFalsy()
        })
        test(' update fail:wrong tdId', async ()=> {
            let result = await testresultc.updateTestResult(validSkuItem.RFID,id,newInvalidTr)
            expect(result).toBeFalsy()
        })
        afterAll(async() =>{
            await clearDB()
        })
    })
})