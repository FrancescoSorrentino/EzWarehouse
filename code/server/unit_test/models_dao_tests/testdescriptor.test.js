const dao = require('../../db/dao');
const path = './db/ezdb.sqlite3'
const TestDescriptor = require('../../models/testdescriptor')
const Sku = require('../../models/sku');
const testdescriptor = new TestDescriptor();
const sku = new Sku();
const { clearDB } = require('../../db/reset');

describe('testTestDescriptorDao', () => {


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
            await testdescriptor.deleteAll()
            await testdescriptor.drop();
        } catch (e) { }
        await testdescriptor.createTable();

        try {
            await sku.deleteAll()
            await sku.drop();
        } catch (e) { }
        await sku.createTable();
        await sku.new(sku_prova)

    });

    afterAll(async () => {
        await clearDB()
    })

    testNewTestDescriptor("test descriptor 3", "This test is described by...", 1)
    testUpdateTestDescriptor(1, "test descriptor 4", "bla bla bla", 1)


});


function testNewTestDescriptor(name, procedureDescription, idSKU) {
    test('create new test descriptor', async () => {
        const newTestDescriptor = { name: name, procedureDescription: procedureDescription, idSKU: idSKU }
        await testdescriptor.new(newTestDescriptor);

        let res = await testdescriptor.getTestDescriptors();
        expect(res.length).toStrictEqual(1);

        res = await testdescriptor.getTestDescriptorByID(1);

        expect(res.name).toStrictEqual(name);
        expect(res.procedureDescription).toStrictEqual(procedureDescription);
        expect(res.idSKU).toStrictEqual(idSKU);


    });

    test('create new test descriptor not success, idSKU wrong', async () => {
        const newTestDescriptor = { name: name, procedureDescription: procedureDescription, idSKU: idSKU + 100 }

        try {
            res = await testdescriptor.new(newTestDescriptor);
        } catch (e) {
            expect(e.code).toStrictEqual("SQLITE_CONSTRAINT")
        }


    });
}


function testUpdateTestDescriptor(id, newName, newProcedureDescription, newIdSKU) {
    test('update test descriptor', async () => {
        const newTestDescriptor = { newName: newName, newProcedureDescription: newProcedureDescription, newIdSKU: newIdSKU }

        await testdescriptor.update(id, newTestDescriptor)

        res = await testdescriptor.getTestDescriptorByID(1);

        expect(res.name).toStrictEqual(newName);
        expect(res.procedureDescription).toStrictEqual(newProcedureDescription);
        expect(res.idSKU).toStrictEqual(newIdSKU);


    });

    test('update test descriptor not success, idSKU wrong', async () => {
        const newTestDescriptor = { newName: newName, newProcedureDescription: newProcedureDescription, newIdSKU: newIdSKU + 100 }

        try {
            res = await testdescriptor.update(id, newTestDescriptor);
        } catch (e) {
            expect(e.code).toStrictEqual("SQLITE_CONSTRAINT")
        }


    });

    test('update test descriptor not success, id not found', async () => {
        const newTestDescriptor = { newName: newName, newProcedureDescription: newProcedureDescription, newIdSKU: newIdSKU }

        let result = await testdescriptor.update(400, newTestDescriptor);
        expect(result.changes).toStrictEqual(0)

    });
}
