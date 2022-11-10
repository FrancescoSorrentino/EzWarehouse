const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { it } = require('mocha');
chai.use(chaiHttp);
chai.should();
const InternalOrder = require('../models/internalorder')
const User = require('../models/user');
const Sku = require('../models/sku');
const SkuItem = require('../models/skuitem')
const internalOrder = new InternalOrder();
const user = new User();
const sku = new Sku();
const skuitem = new SkuItem();
const { clearDB } = require('../db/reset');

(async function () {
    var app;
    var agent

    before(async () => {
        app = await require('../server');
        agent = chai.request.agent(app)
    })

    describe('Internal Order Api Test', async () => {
        let i = {
            issueDate: "2021/11/29 09:33",
            products: [{ SKUId: 1, description: "a product", price: 10.99, qty: 3 }],
            customerId: 1
        }

        let i_invalid = {
            issueDate: "aa",
            products: [{ SKUId: 1, description: "a product", price: 10.99, qty: 3 }],
            customerId: 1
        }

        let i_put_accepted = {
            newState: "ACCEPTED"
        }

        let i_put_completed = {
            newState: "COMPLETED",
            products: [{ SkuID: 1, RFID: "12345678901234567890123456789016" }]
        }

        const skuitem_prova = {
            RFID: "12345678901234567890123456789016",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        }


        const customer = {
            username: "user1333@ezwh.com",
            name: "pippo",
            surname: "baudo",
            password: "testpassword",
            type: "customer"
        }


        const sku_prova = {
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }


        before(async () => {
            try {
                await internalOrder.deleteAll()
                await internalOrder.drop()
            }
            catch (e) {
            }
            await internalOrder.createTable();
            await internalOrder.createTableProducts();
            await internalOrder.createTableSkuItems();

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

            const res = await user.new(customer)
            await sku.new(sku_prova)
            await skuitem.new(skuitem_prova)
        })


        newInternalOrder("date format invalid", 422, i_invalid)
        newInternalOrder("add one internal order", 201, i)
        getInternalOrders("get internal orders", 200)
        getInternalOrdersIssued("get internal orders issued", 200)

        getInternalOrder("get existing internal order", 200, 1)
        getInternalOrder("not internal order associated to this id", 404, 100)
        getInternalOrder("validation param failed", 422, "a")
        updateInternalOrder("internal order accepted updated", 200, 1, i_put_accepted)
        updateInternalOrder("internal order completed updated", 200, 1, i_put_completed)
        getInternalOrdersAccepted("get internal orders accepted", 200)
        updateInternalOrder("id not found", 404, 100, i_put_accepted)
        deleteInternalOrder("delete validation failed", 422, "a")
        deleteInternalOrder("delete internal order", 204, 1)


        after(async () => {
            await clearDB()
        })

    });

    async function getInternalOrders(desc, expectedHTTPStatus) {
        it('get internal orders: ' + desc, function (done) {
            agent.get('/api/internalOrders')
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    async function getInternalOrdersIssued(desc, expectedHTTPStatus) {
        it('get internal order issued: ' + desc, function (done) {
            agent.get(`/api/internalOrdersIssued`)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }

    async function getInternalOrdersAccepted(desc, expectedHTTPStatus) {
        it('get internal order accepted: ' + desc, function (done) {
            agent.get(`/api/internalOrdersAccepted`)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }


    function getInternalOrder(desc, expectedHTTPStatus, id) {
        it('get internal order: ' + desc, function (done) {
            agent.get(`/api/internalOrders/` + id)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }

    function newInternalOrder(desc, expectedHTTPStatus, i) {
        it('new internal order: ' + desc, function (done) {
            agent.post('/api/internalOrders')
                .send(i)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }




    function updateInternalOrder(desc, expectedHTTPStatus, id, newState) {
        it('update internal order: ' + desc, function (done) {
            agent.put(`/api/internalOrders/${id}`)
                .send(newState)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }


    function deleteInternalOrder(desc, expectedHTTPStatus, id) {
        it('delete internal order: ' + desc, function (done) {
            agent.delete(`/api/internalOrders/${id}`)
                .send()
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }



    run();
})();