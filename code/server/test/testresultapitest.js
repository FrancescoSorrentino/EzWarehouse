const Sku = require('../models/sku');
const SkuItem = require('../models/skuitem');
const TestDescriptor = require('../models/testdescriptor');
const TestResult = require('../models/testresult');

const chai = require('chai');
const chaiHttp = require('chai-http');
const { it } = require('mocha');
const sku = new Sku();
const skuitem = new SkuItem();
const testdescriptor = new TestDescriptor();
const testresult = new TestResult();
chai.use(chaiHttp);
chai.should();
const { clearDB } = require('../db/reset');


(async function () {
    var app;
    var agent;

    before(async () => {
        app = await require('../server');
        agent = chai.request.agent(app)
    })

    describe('testresult Api Test', async () => {
        const _skuId = 1;
        const _rfid = "12345678901234567890123456789019"
        const _rfid_not_found = "12345678901234567890123456789018"
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
        let validTr = {
            rfid: _rfid,
            idTestDescriptor: _tdId,
            Date: "2021/11/28",
            Result: 1
        }
        let tr = {
            rfid: _rfid,
            idTestDescriptor: _tdId,
            Date: "2021/11/28",
            Result: true
        }
        let tr_invalid = {
            rfid: "invalid",
            idTestDescriptor: _tdId,
            Date: "2021/11/28",
            Result: true
        }
        let tr_not_found = {
            rfid: _rfid_not_found,
            idTestDescriptor: _tdId,
            Date: "2021/11/28",
            Result: true
        }
        let new_tr = {
            newIdTestDescriptor: _tdId,
            newDate: "2021/11/28",
            newResult: true
        }
        let new_invalid_tr = {
            newIdTestDescriptor: _tdId,
            newDate: "invalid",
            newResult: true
        }
        let new_not_found_tr = {
            newIdTestDescriptor: 100,
            newDate:  "2021/11/28",
            newResult: true
        }




        before(async () => {
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
        })

        after(async () => {
            await clearDB()
        })

        newTestResult("valid testResult", 201, tr);
        newTestResult("invalid testResult", 422, tr_invalid);
        newTestResult("not found rfid", 404, tr_not_found);
        getTestResults("get testResults", 200, _rfid)
        getTestResults("invalid rfid", 422, "invalid")
        getTestResults("not found rfid", 404, _rfid_not_found)
        getTestResult("get testResult", 200, _rfid, 1)
        getTestResult("invalid id", 422, _rfid, "invalid")
        getTestResult("not found rfid", 404, _rfid_not_found, 1)
        getTestResult("not found id", 404, _rfid, 100)
        updateTestResult("update testResult", 200, _rfid, 1, new_tr)
        updateTestResult("invalid new testResult", 422, _rfid, 1, new_invalid_tr)
        updateTestResult("not found rfid", 404, _rfid_not_found, 1, new_tr)
        updateTestResult("new test descriptor not found", 404, _rfid, 1, new_not_found_tr)
        deleteTestResult("delete validation failed", 422, _rfid, "a")
        deleteTestResult("delete testResult order", 204, _rfid, 1)

    });

    function getTestResults(desc, expectedHTTPStatus, rfid) {
        it('get testresults: ' + desc, function (done) {
            agent.get(`/api/skuitems/${rfid}/testResults`)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    function getTestResult(desc, expectedHTTPStatus, rfid, id) {
        it('get testresult: ' + desc, function (done) {
            agent.get(`/api/skuitems/${rfid}/testResults/${id}`)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }


    function newTestResult(desc, expectedHTTPStatus, tr) {
        it('new testresult: ' + desc, function (done) {
            agent.post('/api/skuitems/testResult')
                .send(tr)
                .then(function (res) {
                    res.should.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    function updateTestResult(desc, expectedHTTPStatus, rfid, id, tr) {
        it('update testresult: ' + desc, function (done) {
            agent.put(`/api/skuitems/${rfid}/testResult/${id}`)
                .send(tr)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    function deleteTestResult(desc, expectedHTTPStatus, rfid, id) {
        it('update testdescriptor: ' + desc, function (done) {
            agent.delete(`/api/skuitems/${rfid}/testResult/${id}`)
                .send()
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }






    run();
})();


