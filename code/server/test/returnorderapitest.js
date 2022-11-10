const chai = require('chai');
const chaiHttp = require('chai-http');
const { it } = require('mocha');
const RestockOrder = require('../models/restockorder');
const ReturnOrder = require('../models/returnorder');
const Sku = require('../models/sku');
const SkuItem = require('../models/skuitem');
const User = require('../models/user');
const Item = require('../models/item')
const sku = new Sku();
const user = new User();
const restockorder = new RestockOrder();
const skuitem = new SkuItem()
const returnorder = new ReturnOrder()
const item = new Item();
const { clearDB } = require('../db/reset');

chai.use(chaiHttp);
chai.should();

(async function () {
    var app;
    var agent

    before(async () => {
        app = await require('../server');
        agent = chai.request.agent(app)
    })

    describe('Return Order Api Test', async () => {
        const ro = {
            returnDate: "2021/11/29 09:33",
            products: [{ SKUId: 1, itemId: 1, description: "a new sku", RFID: "12345678901234567890123456789017" }],
            restockOrderId: 1
        }
        const invalidDateRo = {
            returnDate: "invalid",
            products: [{ SKUId: 1, itemId: 1, description: "a new sku", RFID: "12345678901234567890123456789017" }],
            restockOrderId: 1
        }
        const invalidProductRo = {
            returnDate: "2021/11/29 09:33",
            products: [{ SKUId: "invalid", itemId: 1, description: "a new sku", RFID: "12345678901234567890123456789017" }],
            restockOrderId: 1
        }
        const invalidRestockOrderRo = {
            returnDate: "2021/11/29 09:33",
            products: [{ SKUId: 1, itemId: 1, description: "a new sku", RFID: "12345678901234567890123456789017" }],
            restockOrderId: "invalid"
        }
        const notFoundRestockOrderRo = {
            returnDate: "2021/11/29 09:33",
            products: [{ SKUId: 1, itemId: 1, description: "a new sku", RFID: "12345678901234567890123456789017" }],
            restockOrderId: 400
        }

        const invalidprod = [
            { SKUId: 33, itemId: 1, description: "a new sku", RFID: "pietro" }
        ]

        const newsku = {
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }

        const restkOrd =
        {
            issueDate: "2021/11/29 09:33",
            products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, "qty": 30 }],
            supplierId: 1
        }
        const supplier = {
            username: "supplier122@ezwh.com",
            name: "pippo",
            surname: "baudo",
            password: "testpassword",
            type: "supplier"
        }
        const sn = {
            RFID: "12345678901234567890123456789017",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        }

        const i = {
            id: 1,
            description: "a new item",
            price: 10.99,
            SKUId: 1,
            supplierId: 1
        }

        before(async function() {
            this.timeout(5000);

            try {
                await returnorder.deleteAll()
                await returnorder.drop()
            }
            catch (e) {
            }
            await returnorder.createTable()
            await returnorder.createTableProducts()

            try {
                await restockorder.deleteAll()
                await restockorder.drop()
            }
            catch (e) {
            }
            await restockorder.createTable()
            await restockorder.createTableProducts()
            await restockorder.createTableSkuItems()
            await restockorder.createTableTransportNotes()

            try {
                await item.deleteAll()
                await item.drop()
            }
            catch (e) {
            }
            await item.createTable()

            try {
                await sku.deleteAll()
                await sku.drop()
            }
            catch (e) {
            }
            await sku.createTable()
            try {
                await skuitem.deleteAll()
                await skuitem.drop()
            }
            catch (e) {
            }
            await skuitem.createTable()

            try {
                await user.deleteAll()
                await user.drop()
            }
            catch (e) {
            }
            await user.createTable()

            await user.new(supplier)
            await sku.new(newsku)
            await skuitem.new(sn)
            await item.new(i)
            await restockorder.new(restkOrd)
        })

        after(async () => {
            await clearDB()
        })

        newReturnOrder("add return order", 201, ro)
        newReturnOrder("invalid returnDate", 422, invalidDateRo)
        newReturnOrder("invalid products", 422, invalidProductRo)
        newReturnOrder("invalid restockOrderId", 422, invalidRestockOrderRo)
        newReturnOrder("restock order not found", 404, notFoundRestockOrderRo)
        getReturnOrder("get return order", 200, 1, ro)
        getReturnOrder("invalid param", 422, "pietro", ro)
        getReturnOrder("return order not found", 404, 2, ro)
        deleteReturnOrder("delete return order", 204, 1)
        deleteReturnOrder("invalid param", 422, "pietro")


        
    });

    function newReturnOrder(desc, expectedHTTPStatus, ro) {
        it('new return order: ' + desc, function (done) {
            agent.post('/api/returnOrder')
                .send(ro)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    function deleteReturnOrder(desc, expectedHTTPStatus, returnOrderId) {
        it('delete return order: ' + desc, function (done) {
            agent.delete('/api/returnOrder/' + returnOrderId)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    function getReturnOrder(desc, expectedHTTPStatus, returnOrderId, ro) {
        it('get return order: ' + desc, function (done) {
            agent.get('/api/returnOrders/' + returnOrderId)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    console.log(response.body)
                    if (response.body.returnDate) {
                        response.body.returnDate.should.equal(ro.returnDate);
                        response.body.products[0].SKUId.should.equal(ro.products[0].SKUId);
                        response.body.products[0].itemId.should.equal(ro.products[0].itemId);
                        response.body.products[0].RFID.should.equal(ro.products[0].RFID);
                        response.body.restockOrderId.should.equal(ro.restockOrderId);
                    }

                    done();
                }).catch(done)
        });
    }


    run();
})();