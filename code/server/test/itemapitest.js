const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { it } = require('mocha');
chai.use(chaiHttp);
chai.should();
const dao = require('../db/dao');
const Item = require('../models/item')
const User = require('../models/user');
const Sku = require('../models/sku');
const item = new Item();
const user = new User();
const sku = new Sku();
const { clearDB } = require('../db/reset');

(async function () {
    var app;
    var agent

    before(async () => {
        app = await require('../server');
        agent = chai.request.agent(app)
    })


    describe('Item Api Test', async () => {
        let item_post = {
            id: 1,
            description: "a new item",
            price: 10.99,
            SKUId: 1,
            supplierId: 1
        }

        let item_post_sku_not = {
            id: 1,
            description: "a new item",
            price: 10.99,
            SKUId: 100,
            supplierId: 1
        }

        const sku_prova = {

            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }

        const supplier = {
            username: "supplier17@ezwh.com",
            name: "John",
            surname: "Smith",
            password: "testpassword",
            type: "supplier"
        }

        const item_put = {
            newDescription: "a new sku",
            newPrice: 10.99
        }

        const item_put_invalid = {
            newDescription: "a new sku",
            newPrice: "a"
        }


        let s = " ";
        let id2 = " ";

        before(async () => {
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
            await user.deleteAll()
            await user.drop()
        }
        catch (e) {
        }
            await user.createTable()

            s = await user.new(supplier)
            console.log("s è " + s.id)
            id2 = await sku.new(sku_prova)
            console.log("sku è " + id2.id)
        })

        after(async () => {
            await clearDB()
        })

        newItem("sku not found", 404, item_post_sku_not)
        newItem("add one item", 201, item_post)
        newItem("invalid unique constraint", 422, item_post)
        getItems("get items", 200)

        getItem("get existing item", 200, item_post.id, 1)
        getItem("get item not found", 404, 6, 2)
        getItem("get item invalid id", 422, "invalid", 2)
        updateItem("update item", 200, 1, 1, item_put)
        updateItem("item not existing", 404, 2, 1, item_put)
        updateItem("validation body failed", 422, 1, 1, item_put_invalid)
        deleteItem("delete validation failed", 422, "a", 1)
        deleteItem("delete item", 204, 1, 1)

    });

    async function getItems(desc, expectedHTTPStatus) {
        it('get items: ' + desc, function (done) {
            agent.get('/api/items')
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }


    function getItem(desc, expectedHTTPStatus, id, supplierId) {
        it('get item: ' + desc, function (done) {
            agent.get(`/api/items/${id}/${supplierId}`)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }

    function newItem(desc, expectedHTTPStatus, item) {
        it('new item: ' + desc, function (done) {
            agent.post('/api/item')
                .send(item)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }

    function updateItem(desc, expectedHTTPStatus, id, supplierId, newItem) {
        it('update item: ' + desc, function (done) {
            agent.put(`/api/item/${id}/${supplierId}`)
                .send(newItem)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }

    function deleteItem(desc, expectedHTTPStatus, id, supplierId) {
        it('delete item: ' + desc, function (done) {
            agent.delete(`/api/items/${id}/${supplierId}`)
                .send()
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        });
    }


    run();
})();
