const dao = require('../../db/dao');
const TestDescriptor = require('../../models/testdescriptor')
const TestDescriptorController = require('../../controllers/testdescriptorcontroller');
const Sku = require('../../models/sku');
const testdescriptor = new TestDescriptor();
const sku = new Sku();
const testdescriptorc = new TestDescriptorController(sku, testdescriptor)
const { clearDB } = require('../../db/reset');
const path = './db/ezdb.sqlite3'

describe('TestDescriptor tests', () => {
    describe('getTestDescriptors', () => {
        let id = "";
        let skuId = "";

        const validSku = [
            {
                description: "a first sku",
                weight: 10,
                volume: 10,
                notes: "first SKU",
                price: 5.99,
                availableQuantity: 1,
            }
        ]
        const tDList = [
            {
                id: 1,
                name: "test descriptor 1",
                procedureDescription: "This test is described by...",
                idSKU: ""

            }
        ]

        beforeEach(async () => {
            jest.setTimeout(10000)
            dao.connect(path)
            try {
                await sku.createTable();
            } catch (err) { }
            res = await sku.new(validSku[0]);
            skuId = res.id;
            tDList[0].idSKU = skuId;
            try {
                await testdescriptor.createTable();
            } catch (err) { }
            td = await testdescriptor.new(tDList[0])
            id = td.id
        })

        test(' Test Descriptor exists,return it', async () => {
            let result = await testdescriptorc.getTestDescriptorByID(id)
            expect(result).toEqual({
                id: id,
                name: "test descriptor 1",
                procedureDescription: "This test is described by...",
                idSKU: skuId
            })
        })
        test(' Test Descriptor doesn\'t exists,return false', async () => {
            let result = await testdescriptorc.getTestDescriptorByID(id + 1)
            expect(result).toBeFalsy()
        })
        afterEach(async () => {
            await testdescriptor.delete(id)
            await sku.delete(skuId)
        })
    })

    describe('addTestDescriptor', () => {
        let id = ""
        let skuId = "";
        const validSku = {
            description: "a first sku",
            weight: 10,
            volume: 10,
            notes: "first SKU",
            price: 5.99,
            availableQuantity: 1,
        }

        const td = {
            id: 1,
            name: "test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU: ""
        }
        const invalidTd = {
            id: 1,
            name: "test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU: ""
        }
        beforeEach(async () => {
            jest.setTimeout(10000)
            // await dao.connect(path)
            res = await sku.new(validSku);
            skuId = res.id;
            td.idSKU = skuId;
            invalidTd.idSKU = skuId + 1;
            // res = await testdescriptor.new(td)
            // id = res.id
        })
        test(' add success', async () => {
            let result = await testdescriptorc.addTestDescriptor(td)
            id = result.id
            expect(result).toBeTruthy()
            // await testdescriptor.delete(id);
        })

        test(' add fail idSKU wrong', async () => {
            let result = await testdescriptorc.addTestDescriptor(invalidTd)
            id = result.id
            expect(result).toBeFalsy()
            // await testdescriptor.delete(id);
        })

        afterEach(async () => {
            await testdescriptor.delete(id)
            await sku.delete(skuId)
        })
    })

    describe('updateTestDescriptor', () => {
        let id = ""
        let skuId = "";
        const validSku = {
            description: "a first sku",
            weight: 10,
            volume: 10,
            notes: "first SKU",
            price: 5.99,
            availableQuantity: 1,
        }

        let td1 = {
            id: 1,
            name: "test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU: ""
        }
        let newValidTd = {
            newName: "test descriptor 1",
            newProcedureDescription: "This test is described by...",
            newIdSKU: ""
        }
        let newInvalidTd = {
            newName: "test descriptor 1",
            newProcedureDescription: "This test is described by...",
            newIdSKU: ""
        }
        beforeAll(async () => {
            jest.setTimeout(10000)
            // await dao.connect(path)
            try {
                await sku.createTable();
            } catch (err) { }
            res = await sku.new(validSku);
            skuId = res.id;
            td1.idSKU = skuId;
            newValidTd.newIdSKU = skuId;
            newInvalidTd.newIdSKU = skuId + 1;
            try {
                await testdescriptor.createTable();
            } catch (err) { }
            td = await testdescriptor.new(td1)
            id = td.id
        })

        test(' update success', async () => {
            let result = await testdescriptorc.updateTestDescriptor(id, newValidTd)
            expect(result.changes).toEqual(1)
        })
        test(' update fail', async () => {
            let result = await testdescriptorc.updateTestDescriptor(id, newInvalidTd)
            expect(result).toBeFalsy()
        })

        afterAll(async () => {
            await clearDB()
        })
    })
})