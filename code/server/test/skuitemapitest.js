const chai = require('chai');
const chaiHttp = require('chai-http');
const { it, after } = require('mocha');
const Sku = require('../models/sku');
const SkuItem = require('../models/skuitem');
chai.use(chaiHttp);
chai.should();
const sku = new Sku();
const skuitem = new SkuItem();
const { clearDB } = require('../db/reset');

(async function () {
    var app;
    var agent

    before(async () => {
        console.log("HERE SKUITEM BEFORE")
        app = await require('../server');
        agent = chai.request.agent(app)
    })

    describe('SkuItem Api Test', async () => {

        const s = {
            description: "a new sku",
            weight: 10,
            volume: 10,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }

        let si = {
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        }

        let sinx = {
            RFID: "12345678901234567890123456789300",
            SKUId: "prova",
            DateOfStock: "2021/11/29 12:30"
        }

        before(async function () {
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
            let r = await sku.new(s);
            sk3 = r.id;
            console.log(sk3)
            console.log(si)
        })

        after(async () => {
            await clearDB()
        })

        newSkuItem("add one skuitem", 201, si.RFID, si.SKUId, si.DateOfStock)

        newSkuItem("invalid RFID", 422, "pietro", si.SKUId, si.DateOfStock)

        newSkuItem("invalid SKUId", 422, si.RFID, "pietro", si.DateOfStock)

        newSkuItem("invalid DateOfStock", 422, si.RFID, si.SKUId, "2555-39-49")

        newSkuItem("SKUId not found", 404, si.RFID, 100, si.DateOfStock)

        updateSkuItem("update one skuitem", 200, si.RFID, "12345678901234567890123456789016", 1, "2021/10/11 12:30")
        updateSkuItem("invalid param", 422, "pietro", "12345678901234567890123456789016", 1, "2021/10/11 12:30")
        updateSkuItem("invalid newDateOfStock", 422, si.RFID, "12345678901234567890123456789016", 1, "2021/44/32")
        updateSkuItem("invalid newAvailable", 422, si.RFID, "12345678901234567890123456789016", 10, "2021/10/11 12:30")
        updateSkuItem("invalid newRFID", 422, si.RFID, "pietro", 1, "2021/10/11 12:30")
        updateSkuItem("skuitem not found", 404, sinx.RFID, "12345678901234567890123456789016", 1, "2021/10/11 12:30")
        deleteSkuItem("delete one skuitem", 204, "12345678901234567890123456789016")
        deleteSkuItem("invalid RFID", 422, "pietro")

    });
    //Write functions here
    function newSkuItem(desc, expectedHTTPStatus, rfid, skuid, date) {
        it('new skuitem: ' + desc, function (done) {
            const skitem = { RFID: rfid, SKUId: skuid, DateOfStock: date }
            console.log(skitem)
            agent.post('/api/skuitem')
                .send(skitem)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    function deleteSkuItem(desc, expectedHTTPStatus, rfid) {
        it('delete skuitem: ' + desc, function (done) {
            agent.delete('/api/skuitems/' + rfid)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    function updateSkuItem(desc, expectedHTTPStatus, oldRFID, RFID, Available, DateOfStock) {
        it('update skuitem: ' + desc, function (done) {
            const skitem = { newRFID: RFID, newAvailable: Available, newDateOfStock: DateOfStock }
            agent.put('/api/skuitems/' + oldRFID)
                .send(skitem)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done)
        });
    }

    run();
})();
