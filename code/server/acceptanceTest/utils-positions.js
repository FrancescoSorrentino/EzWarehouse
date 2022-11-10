//---------------------------------------------------------------------------------------------------------
//                                           POSITION CREATION
//---------------------------------------------------------------------------------------------------------

const { assert } = require("chai");

function newPosition(positionID, aisleID, row, col, maxWeight, maxVolume){
    return {
        positionID:positionID,
        aisleID:aisleID,
        row:row,
        col:col,
        maxWeight:maxWeight,
        maxVolume:maxVolume,
        occupiedWeight: 0,
        occupiedVolume:0
    };
}

//---------------------------------------------------------------------------------------------------------
//                                          TEST ACTIONS
//---------------------------------------------------------------------------------------------------------

function testPostNewPosition(agent, position, expCode){
    describe('post /api/position/', function(){
        it('FR 3.1.1 a Define a new position', function(done){
            agent.post('/api/position')
            .send(position)
            .then(res => {
                assert.equal(res.status, expCode);
                done();
            }).catch(err=>done(err));
        });
    });
}


function deleteAllPositions(agent){
    describe('Removing all Positions', function(){
        it('Getting Positions', function(done){
            agent.get('/api/positions')
            .then(function(res){
                res.should.have.status(200);
                if(res.body.length !==0) {
                    for (let i = 0; i< res.body.length; i++){
                        agent.delete('/api/position/'+res.body[i].positionID)
                        .then(function(res2){
                            res2.should.have.status(204);
                        });
                    }
                }
                done();
            }).catch(err => done(err));
        });
    });
}

function testGetAllPositions(agent, size, expCode){
    describe(' get /api/positions', function(){
        it('FR 3.1.3 -> List all positions', function (done){
            agent.get('/api/positions')
            .then(function(res){
                res.should.have.status(expCode);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(size);
                done();
            }).catch(err => done(err));
        });
    });
}

function testEditPosition(agent, updateposition, positionID, expCode){
    describe(' put /api/position/:positionID', function(){
        it('FR 3.1.1 b -> Modify an existing position', function(done){
            agent.put('/api/position/'+positionID)
            .send(updateposition)
            .then(res => {
                assert.equal(res.status, expCode);
                done();
            }).catch(err=>done(err));
        });
    });
}

function testEditPositionChangeID(agent, newpositionid, oldpositionid, expCode){
    describe(' put /api/position/:positionID/changeID', function(){
        it('FR 3.1.4 -> Modify attributes of a position', function(done){
            agent.put('/api/position/'+oldpositionid+'/changeID')
            .send(newpositionid)
            .then(res => {
                assert.equal(res.status, expCode);
                done();
            }).catch(err=>done(err));
        });
    });
}

function testDeletePosition(agent, positionID, expCode){
    describe(' delete /api/position/:positionID', function(){
        it('FR 3.1.2 -> Delete a position', function(done){
            agent.delete('/api/position/'+positionID)
            .then(function(res){
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));
        });
    });
}

exports.newPosition = newPosition;
exports.testPostNewPosition = testPostNewPosition;
exports.deleteAllPositions = deleteAllPositions;
exports.testGetAllPositions = testGetAllPositions;
exports.testEditPosition = testEditPosition;
exports.testEditPositionChangeID = testEditPositionChangeID;
exports.testDeletePosition = testDeletePosition;