const dao = require('../../db/dao');
const path = './db/ezdb.sqlite3'
const Sku = require('../../models/sku');
const SkuItem = require('../../models/skuitem');
const TestDescriptor = require('../../models/testdescriptor');
const TestResult = require('../../models/testresult');
const sku = new Sku();
const skuitem = new SkuItem();
const testdescriptor = new TestDescriptor();
const testresult = new TestResult();
const { clearDB } = require('../../db/reset');

describe('testTestResultDao', () => {
    
    const _skuId = 1;
    const _rfid = "12345678901234567890123456789019"
    const _tdId = 1;
    const validSku = {
        description: "a first sku",
        weight: 10,
        volume: 10,
        notes: "first SKU",
        price: 5.99,
        availableQuantity: 1,
    }
    let validSkuItem = {
        RFID: _rfid,
        SKUId: _skuId,
        DateOfStock: "2021/11/29 12:30"
    }
    let validTd = {
        id: _tdId,
        name: "test descriptor 1",
        procedureDescription: "This test is described by...",
        idSKU: _skuId
    }

    beforeAll(async () => {
        await dao.connect(path);

        jest.setTimeout(14000)
        try {
            await testresult.deleteAll()
            await testresult.drop()
        }
        catch (e) {
        }

        try {
            await testdescriptor.deleteAll();
            await testdescriptor.drop();
        } catch (e) { }

        try {
            await skuitem.deleteAll();
            await skuitem.drop();
        } catch (e) { }

        try {
            await sku.deleteAll();
            await sku.drop();
        } catch (e) { }

        await sku.createTable();
        await skuitem.createTable();
        await testdescriptor.createTable();
        await testresult.createTable()
        
        await sku.new(validSku);
        await skuitem.new(validSkuItem);
        await testdescriptor.new(validTd);

    });
    

    testNewTestResult(_rfid, _tdId, "2021/11/28", true)
    testUpdateTestResult(_rfid, _tdId, "2021/11/29 12:30", false)
    
    afterAll(async() =>{
        await clearDB()
    })

});


function testNewTestResult(rfid, idTestDescriptor, Date, Result) {
    test('create new test result', async () => {
        const newTestResult = {rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result}
        let res = await testresult.new(newTestResult);
        console.log(res)
        
        res = await testresult.getTestResults(rfid);
        expect(res.length).toStrictEqual(1);
        
        expect(res[0].idTestDescriptor).toStrictEqual(idTestDescriptor);
        expect(res[0].Date).toStrictEqual(Date);
        expect(res[0].Result).toStrictEqual(1);
        

    });

    test('create new test descriptor not success, test descriptor wrong', async () => {
        const newTestResult = {rfid: rfid, idTestDescriptor: idTestDescriptor+100, Date: Date, Result: Result}
        try{
            res = await testresult.new(newTestResult);
        }catch(e){
            expect(e.code).toStrictEqual("SQLITE_CONSTRAINT")
        }
    });

    
}


function testUpdateTestResult(rfid, newIdTestDescriptor, newDate, newResult) {
    test('update test result success', async () => {
        const newTestResult = {newIdTestDescriptor: newIdTestDescriptor, newDate: newDate, newResult: newResult}
        
        res = await testresult.getTestResults(rfid);
        expect(res.length).toStrictEqual(2);

        await testresult.update(rfid, res[0].id, newTestResult)

        res = await testresult.getTestResults(rfid);
        expect(res.length).toStrictEqual(2);
        
        expect(res[0].idTestDescriptor).toStrictEqual(newIdTestDescriptor);
        expect(res[0].Date).toStrictEqual(newDate);
        expect(res[0].Result).toStrictEqual(0);
        

    });

    test('update test result not success, new idTestDescriptor wrong', async () => {
        const newTestResult = {newIdTestDescriptor: newIdTestDescriptor+100, newDate: newDate, newResult: newResult}
        
        res = await testresult.getTestResults(rfid);

        try{
            res = await testresult.update(rfid, res[0].id, newTestResult);
        }catch(e){
            expect(e.code).toStrictEqual("SQLITE_CONSTRAINT")
        }
        

    });

    
}




