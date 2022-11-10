const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { it } = require('mocha');
chai.use(chaiHttp);
chai.should();
const Position = require('../models/position');
const position = new Position();
const { clearDB } = require('../db/reset');

(async function () {
    var app;
    var agent

    before(async () => {
        app = await require('../server');
        agent = chai.request.agent(app)
    })


    describe('Position Api Test', async () => {
        let position_post = {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        }

        let position_post_invalid = {
            positionID: "800234543413",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        }

        let position_put = {
            newAisleID: "8002",
            newRow: "3454",
            newCol: "3412",
            newMaxWeight: 1200,
            newMaxVolume: 600,
            newOccupiedWeight: 200,
            newOccupiedVolume: 100
        }

        let position_put_invalid = {
            newAisleID: "80023",
            newRow: "3454",
            newCol: "3412",
            newMaxWeight: 1200,
            newMaxVolume: 600,
            newOccupiedWeight: 200,
            newOccupiedVolume: 100
        }

        let position_put_invalid_2 = {
            newAisleID: "80023",
            newRow: "3454",
            newCol: "3412",
            newMaxWeight: 1200,
            newMaxVolume: 600,
            newOccupiedWeight: 1400,
            newOccupiedVolume: 100
        }

        let position_put_id = {
            newPositionID: "800234543413"
        }

        let position_put_id_invalid = {
            newPositionID: "8002345434123"
        }

        before(async () => {
            try {
                await position.deleteAll()
                await position.drop()
            }
            catch (e) {
            }
            await position.createTable()

        })

        after(async () => {
            await clearDB()
        })


        newPosition("add one position", 201, position_post)
        newPosition("try to add invalid sku", 422, position_post_invalid)
        getPositions("get positions", 200)
        updatePosition("update position", 200, 800234543412, position_put)
        updatePosition("update positionID not found", 404, 800234543421, position_put)
        updatePosition("update invalid positionID", 422, 800234543412, position_put_invalid)
        updatePosition("update invalid body", 422, 800234543412, position_put_invalid_2)
        updatePositionID("update positionID not found", 404, 800234543421, position_put_id)
        updatePositionID("update invalid body", 422, 800234543412, position_put_id_invalid)
        updatePositionID("update positionID", 200, 800234543412, position_put_id)
        deletePosition("delete position", 204, 800234543413)
        deletePosition("delete validation failed", 422, 8002345434134)
    });

    async function getPositions(desc, expectedHTTPStatus) {
        it('get positions: ' + desc, function (done) {
            agent.get('/api/positions')
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                });
        });
    }

    function newPosition(desc, expectedHTTPStatus, position) {
        it('new position: ' + desc, function (done) {
            agent.post('/api/position')
                .send(position)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                });
        });
    }

    function updatePosition(desc, expectedHTTPStatus, positionID, newPosition) {
        it('updates position: ' + desc, function (done) {
            agent.put(`/api/position/${positionID}`)
                .send(newPosition)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                });
        });
    }

    function updatePositionID(desc, expectedHTTPStatus, positionID, newPositionID) {
        it('update positionID: ' + desc, function (done) {
            agent.put(`/api/position/${positionID}/changeID`)
                .send(newPositionID)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                });
        });
    }

    function deletePosition(desc, expectedHTTPStatus, positionID) {
        it('delete position: ' + desc, function (done) {
            agent.delete(`/api/position/${positionID}`)
                .send()
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                });
        });
    }

    run();
})();