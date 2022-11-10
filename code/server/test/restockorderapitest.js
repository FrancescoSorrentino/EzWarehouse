const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { it } = require('mocha');
chai.use(chaiHttp);
chai.should();
const RestockOrder = require('../models/restockorder')
const User = require('../models/user');
const Sku = require('../models/sku');
const SkuItem = require('../models/skuitem')
const Item = require('../models/item')
const restockOrder = new RestockOrder();
const user = new User();
const sku = new Sku();
const skuitem = new SkuItem();
const item = new Item();
const { clearDB } = require('../db/reset');

(async function () {
    var app;
    var agent

    before(async () => {
        app = await require('../server');
        agent = chai.request.agent(app)
    })

    describe('Restock Order Api Test', async () => {
        let ro = {
            issueDate: "2021/11/29 09:33",
            products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 }],
            supplierId: 1
        }

        let ro_invalid = {
            issueDate: "asddas",
            products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 }],
            supplierId: 1
        }

        const skuitem_prova = {
            RFID: "12345678901234567890123456789016",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        }

        const ski = {
            skuItems: [{ SKUId: 1, itemId: 1, rfid: "12345678901234567890123456789016" }]
        }

        const ski_invalid = {
            skuItems: [{ SKUId: "asda", itemId: 1, rfid: "12345678901234567890123456789016" }]
        }

        const supplier = {
            username: "user1333@ezwh.com",
            name: "pippo",
            surname: "baudo",
            password: "testpassword",
            type: "supplier"
        }

        const sku_prova = {
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }

        const i = {
            id: 1,
            description: "a new item",
            price: 10.99,
            SKUId: 1,
            supplierId: 1
        }

        before(async function () {
            this.timeout(5000);
            try {
                await restockOrder.deleteAll()
                await restockOrder.drop()
            }
            catch (e) {
            }
            await restockOrder.createTable();
            await restockOrder.createTableProducts();
            await restockOrder.createTableSkuItems();
            await restockOrder.createTableTransportNotes();

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

            await user.new(supplier)
            await sku.new(sku_prova)
            await skuitem.new(skuitem_prova)
            await item.new(i)
        })

        after(async () => {
            await clearDB()
        })


        newRestockOrder("add one restock order", 201, ro)
        newRestockOrder("invalid restock order", 422, ro_invalid)
        getRestockOrders("get restock orders", 200)
        getRestockOrdersIssued("get restock orders issued", 200)
        getRestockOrder("get existing restock order", 200, 1)
        getRestockOrder("not restock order associated to this id", 404, 100)
        getRestockOrder("validation param failed", 422, "a")
        updateRestockOrderSkuItems("update return items", 200, 1, ski)
        updateRestockOrderSkuItems("invalid return items", 422, 1, ski_invalid)
        updateRestockOrderSkuItems("not found", 404, 100, ski)
        updateRestockOrder("restock order update state to COMPLETEDRETURN", 200, 1, { newState: "COMPLETEDRETURN" })
        getRestockOrderReturnItems("get return items", 200, 1)
        getRestockOrderReturnItems("invalid restock order", 422, "invalid")
        updateRestockOrder("restock order accepted updated", 200, 1, { newState: "DELIVERY" })
        updateRestockOrder("invalid state", 422, 1, { newState: "INVALID" })
        updateRestockOrderTransportNote("update  transport note", 200, 1, { transportNote: { deliveryDate: "2021/12/29" } })
        updateRestockOrderTransportNote("invalid transport note", 422, 1, { transportNote: { deliveryDate: "invalid" } })
        deleteRestockOrder("delete validation failed", 422, "a")
        deleteRestockOrder("delete restock order", 204, 1)


    });

    async function getRestockOrders(desc, expectedHTTPStatus) {
        it('get restock orders: ' + desc, function (done) {
            agent.get('/api/restockOrders')
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    async function getRestockOrdersIssued(desc, expectedHTTPStatus) {
        it('get restock order issued: ' + desc, function (done) {
            agent.get(`/api/restockOrdersIssued`)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }

    function getRestockOrder(desc, expectedHTTPStatus, id) {
        it('get restock order: ' + desc, function (done) {
            agent.get(`/api/restockOrders/` + id)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }

    function getRestockOrderReturnItems(desc, expectedHTTPStatus, id) {
        it('get restock order return items: ' + desc, function (done) {
            agent.get(`/api/restockOrders/${id}/returnItems`)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }

    function newRestockOrder(desc, expectedHTTPStatus, ro) {
        it('new restock order: ' + desc, function (done) {
            agent.post('/api/restockOrder')
                .send(ro)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }

    function updateRestockOrder(desc, expectedHTTPStatus, id, newState) {
        it('update restock order: ' + desc, function (done) {
            agent.put(`/api/restockOrder/${id}`)
                .send(newState)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }

    function updateRestockOrderSkuItems(desc, expectedHTTPStatus, id, ski) {
        it('update restock order sku items: ' + desc, function (done) {
            agent.put(`/api/restockOrder/${id}/skuItems`)
                .send(ski)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }

    function updateRestockOrderTransportNote(desc, expectedHTTPStatus, id, tn) {
        it('update restock order transport note: ' + desc, function (done) {
            agent.put(`/api/restockOrder/${id}/transportNote`)
                .send(tn)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }

    function deleteRestockOrder(desc, expectedHTTPStatus, id) {
        it('delete restock order: ' + desc, function (done) {
            agent.delete(`/api/restockOrder/${id}`)
                .send()
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }



    run();
})();