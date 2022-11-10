const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { it } = require('mocha');
const Sku = require('../models/sku');
const sku = new Sku()
chai.use(chaiHttp);
chai.should();
const { clearDB } = require('../db/reset');

(async function () {
    var app;
    var agent

    before(async () => {
        app = await require('../server');
        agent = chai.request.agent(app)
    })


    describe('Sku Api Test', async () => {

        const s = {
            description: "a new sku",
            weight: 10,
            volume: 10,
            notes: "first SKU",
            price: 10,
            availableQuantity: 50
        }
        const is = {
            description: "a new sku",
            volume: 10,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }
        const ns = {
            newDescription: "a new sku",
            newWeight: 10,
            newVolume: 5,
            newNotes: "first SKU",
            newPrice: 10.99,
            newAvailableQuantity: 50
        }
        const nsEx = {
            newDescription: "a new sku",
            newWeight: 1000,
            newVolume: 5000,
            newNotes: "first SKU",
            newPrice: 10.99,
            newAvailableQuantity: 50
        }
        const ins = {
            newVolume: "sdf",
            newNotes: "first SKU",
            newAvailableQuantity: 50
        }
        const np = {
            position: "800234543412"
        }
        const inp = {
        }
        const npnEx = {
            position: "800234543415"
        }


        before(async () => {
            try {
                await sku.deleteAll()
                await sku.drop()
            }
            catch (e) {
            }
            await sku.createTable()
        })

        after(async () => {
            await clearDB()
        })

        newSku("add one sku", 201, s)
        newSku("try to add invalid sku", 422, is)
        getSkus("get skus", 200)
        getSku("get existing sku", 200, 1)
        getSku("get sku not found", 404, 6)
        getSku("get sku invalid id", 422, "invalid")
        updateSku("update sku", 200, 1, ns)
        updateSku("update sku not found", 404, 6, ns)
        updateSku("update sku invalid ID", 422, "invalid", ns)
        //updateSku("update sku exeeded", 422, 1, nsEx)
        updateSku("update sku invalid body", 422, 1, ins)
        deleteSku("delete sku", 204, 5)
        deleteSku("delete sku invalid ID", 422, "invalid")
        //updateSkuPosition("update sku position", 200, 1, np)
        updateSkuPosition("update sku position, invalid ID", 422, "invalid", np)
        updateSkuPosition("update sku position, sku ID not found", 404, 6, np)
        updateSkuPosition("update sku position, invalid position", 422, 1, inp)
        updateSkuPosition("update sku position, position not available", 422, 1, npnEx)
    });

    async function getSkus(desc, expectedHTTPStatus) {
        it('get skus: ' + desc, function (done) {
            agent.get('/api/skus')
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    function getSku(desc, expectedHTTPStatus, skuId) {

        it('get sku: ' + desc, function (done) {
            agent.get(`/api/skus/${skuId}`)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    function newSku(desc, expectedHTTPStatus, sku) {
        it('new sku: ' + desc, function (done) {
            agent.post('/api/sku')
                .send(sku)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    function updateSku(desc, expectedHTTPStatus, skuId, newSku) {
        it('updates sku: ' + desc, function (done) {
            agent.put(`/api/sku/${skuId}`)
                .send(newSku)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    function updateSkuPosition(desc, expectedHTTPStatus, skuId, position) {
        it('update sku position: ' + desc, function (done) {
            agent.put(`/api/sku/${skuId}/position`)
                .send(position)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    function deleteSku(desc, expectedHTTPStatus, skuId) {
        it('delete sku: ' + desc, function (done) {
            agent.delete(`/api/skus/${skuId}`)
                .send()
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }


    run();
})();