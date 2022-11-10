const Sku = require('../models/sku');
const TestDescriptor = require('../models/testdescriptor');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { it } = require('mocha');
const sku = new Sku();
const testdescriptor = new TestDescriptor();
chai.use(chaiHttp);
chai.should();
const { clearDB } = require('../db/reset');

// const app  = require('../server');
// var agent = chai.request.agent(app);



(async function () {
    var app;
    var agent;

    before(async () => {
        app = await require('../server');
        agent = chai.request.agent(app)
    })

    describe('testdescriptor Api Test', async () => {

        let skuId = 1;
        const validSku = {
            description: "a first sku",
            weight: 10,
            volume: 10,
            notes: "first SKU",
            price: 5.99,
            availableQuantity: 1,
        }
        let validTd = {
            id: 1,
            name: "test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU: skuId
        }
        before(async () => {
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

            await sku.new(validSku);
        })

        after(async () => {
            await clearDB()
        })

        newTestDescriptor("add a td: valid", 201, validTd.name, validTd.procedureDescription, validTd.idSKU);
        newTestDescriptor("add a td: invalid idSKU", 404, validTd.name, validTd.procedureDescription, validTd.idSKU + 100)

        getTestDescriptors("get all tds", 200);

        getTestDescriptorByID("get td by id: success", 200,  1);
        getTestDescriptorByID("get td by id: not exist", 404, 123);
        getTestDescriptorByID("get td by id: not numeric tdId", 422, "qwd");
        getTestDescriptorByID("get td by id: tdId is a numeric string", 200, "1");
        getTestDescriptorByID("get td by id: tdId is a not exists numeric string", 404, "41");

        updateTestDescriptor("update a td: valid", 200, 1, "new name", "new pro", skuId);
        updateTestDescriptor("update a td: which not exists", 404, 2, "new name", "new pro", skuId);
        updateTestDescriptor("update a td: invalid idSKU", 404, 1, "new name", "new pro", skuId + 100);
        updateTestDescriptor("update a td: id is not numeric", 422, "a", "new name", "new pro", skuId);
        updateTestDescriptor("update a td: id is a numeric string", 200, "1", "new name", "new pro", skuId);
        updateTestDescriptor("update a td: skuId is a numeric string", 200, "1", "new name", "new pro", `${skuId}`);
        updateTestDescriptor("update a td: skuId is a invalid numeric string", 404, "1", "new name", "new pro", `${skuId + 100}`);
        updateTestDescriptor("update a td: skuId is a not numeric", 422, "1", "new name", "new pro", "skuid");

        deleteTestDescriptor("delete a td: id not exists", 404, 31)
        deleteTestDescriptor("delete a td: id not numeric string", 422, "asd")
        deleteTestDescriptor("delete a td: success", 204, 1)

    });

    //Write functions here
    function newTestDescriptor(desc, expectedHTTPStatus, name, procedureDescription, idSKU) {
        it('new testdescriptor: ' + desc, function (done) {
            const td = {
                name: name,
                procedureDescription: procedureDescription,
                idSKU: idSKU
            }
            agent.post('/api/testDescriptor')
                .send(td)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }
    function getTestDescriptors(desc, expectedHTTPStatus) {
        it('get testdescriptors: ' + desc, function (done) {
            agent.get(`/api/testDescriptors`)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }
    function getTestDescriptorByID(desc, expectedHTTPStatus, id) {
        it('get testdescriptors: ' + desc, function (done) {
            agent.get(`/api/testDescriptors/${id}`)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }
    function updateTestDescriptor(desc, expectedHTTPStatus, id, newName, newProcedureDescription, newIdSKU) {
        it('update testdescriptor: ' + desc, function (done) {
            const td = {
                newName: newName,
                newProcedureDescription: newProcedureDescription,
                newIdSKU: newIdSKU
            }
            agent.put(`/api/testDescriptor/${id}`)
                .send(td)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    function deleteTestDescriptor(desc, expectedHTTPStatus, id) {
        it('update testdescriptor: ' + desc, function (done) {

            agent.delete(`/api/testDescriptor/${id}`)
                .send()
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    run();
})();


