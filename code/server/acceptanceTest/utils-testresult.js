const ids = require('./utils-id');

validrfid = '12345678901234567890123456789015';
notexistingrfid = '02345678901234567890123456789015';

//---------------------------------------------------------------------------------------------------------
//                                           CREATION
//---------------------------------------------------------------------------------------------------------

function newTestResult(rfid, idTestDescriptor, Date, Result){
    return {
        rfid:rfid,
        idTestDescriptor:idTestDescriptor,
        Date:Date,
        Result:Result
    };
}


//---------------------------------------------------------------------------------------------------------
//                                          TEST ACTIONS
//---------------------------------------------------------------------------------------------------------


function testPostNewTestResult(agent, mytr, expCode){
    describe(' post /api/skuitems/testResult', function(){
        it('FR 3.2.1 -> Add a quality test', function(done){
            let idtds = ids.getIdTestDescriptor();
            let testResult = newTestResult(mytr.rfid, idtds[mytr.idTestDescriptor], mytr.Date, mytr.Result);
            //console.log(testResult);
            agent.post('/api/skuitems/testResult')
            .send(testResult)
            .then(function(res){
                console.log(res.body);
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));
        });            
    });
}

function testPostNewTestResultBadRFID(agent, expCode, rfid){
    describe(' post /api/skuitems/testResult', function(){
        it('Creates a new test Result for a certain sku item defined by RFID', function(done){
            agent.get('/api/testDescriptors')
            .then(function(res){
                testResultid = res.body[0].id;
                testResult = newTestResult(rfid, testResultid, '2021/12/11', true);
                agent.post('/api/skuitems/testResult')
                .send(testResult)
                .then(function(res2){
                    res2.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));
            });
            
        });
    });
}

function testGetTestResultByRFID(agent, expCode, rfid){
    describe(' get /api/skuitems/:rfid/testResults', function(){
        it('Get all test results associated to a certain rfid', function(done){
            agent.get('/api/skuitems/'+rfid+'/testResults')
            .then(function(res){
                let all = [];
                res.should.have.status(expCode);
                res.body.should.be.a('array');
                console.log("all tr for rfid", res.body);
                for(let i=0; i<res.body.length; i++){
                    all[i] = res.body[i].id;
                }
                ids.setIdTRonRFID(all);
                done();
            }).catch(err=>done(err));
        });
    });
}

function testGetTestResultByWrongRFID(agent, expCode, rfid){
    describe(' get /api/skuitems/:rfid/testResults', function(){
        it('Get all test results associated to a certain rfid', function(done){
            agent.get('/api/skuitems/'+rfid+'/testResults')
            .then(function(res){
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));
        });
    });
}

function testGetTestResultByRFIDandID(agent, expCode, rfid){
    describe(' get /api/skuitems/:rfid/testResults/:id', function(){
        it('Get a specific test result with the rfid and id', function(done){
            agent.get('/api/skuitems/'+rfid+'/testResults')
            .then(function(res){
                let trid = res.body[0].id;
                //console.log(res.body[0]);
                agent.get('/api/skuitems/'+rfid+'/testResults/'+trid)
                .then(function(res2){
                    res2.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));
            });
        });
    });
}

function testGetTestResultByWrongRFIDandID(agent, expCode, rfid){
    describe(' get /api/skuitems/:rfid/testResult/:id', function(){
        it('Get a specific test result with the rfid and id', function(done){
            agent.get('/api/skuitems/'+rfid+'/testResults')
            .then(function(res){
                let alltdids = ids.getIdTestDescriptor();
                console.log(alltdids);
                agent.get('/api/skuitems/'+rfid+'/testResult/'+alltdids[0])
                .then(function(res2){
                    console.log(res2.body);
                    res2.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));
            });
        });
    });
}

function testEditTestResultByRFIDandID(agent, expCode, rfid){
    describe( ' put /api/skuitems/:rfid/testResult/:id', function(){
        it('FR 3.2.2 -> Modify a quality test', function(done){
            agent.get('/api/skuitems/'+validrfid+'/testResults')
            .then(function(res){
                console.log("this is it", res.body);
                let trid = res.body[0].id;
                agent.put('/api/skuitems/'+rfid+'/testResult/'+trid)
                .send({"newIdTestDescriptor":res.body[0].idTestDescriptor,"newDate":"2022/01/01","newResult":false})
                .then(function(res2){
                    console.log("I'm heeeeereeee", res2.body);
                    res2.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));
            });
        });
    });
}

function testEditTestResultByWrongRFIDandID(agent, expCode, rfid){
    describe( ' put /api/skuitems/:rfid/testResult/:id', function(){
        it('Modify a test results given its rfid and id and new fields', function(done){
            agent.get('/api/skuitems/'+validrfid+'/testResults')
            .then(function(res){
                let trid = res.body[0].id;
                agent.put('/api/skuitems/'+rfid+'/testResult/'+trid)
                .send({"newIdTestDescriptor":res.body[0].idTestDescriptor,"newDate":"2022/01/01","newResult":false})
                .then(function(res2){
                    res2.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));
            });
        });
    });
}

function testDeleteTestResultByRFIDandID(agent, expCode, rfid){
    describe(' delete /api/skuitems/:rfid/testResult/:id', function(){
        it('FR 3.2.3 -> Delete a quality test', function(done){
            agent.get('/api/skuitems/'+rfid+'/testResults')
            .then(function(res){
                let trid = res.body[0].id;
                //console.log(res.body);
                agent.delete('/api/skuitems/'+rfid+'/testResult/'+trid)
                .then(function(res2){
                    res2.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));
            });
        });
    });
}

function testDeleteAllTestResultByRFID(agent, expCode, rfid){
    describe(' get /api/skuitems/:rfid/testResults', function(){
        it('Delete all test results associated to a certain rfid', function(done){
            agent.get('/api/skuitems/'+rfid+'/testResults')
            .then(function(res){
                res.should.have.status(expCode);
                res.body.should.be.a('array');
                console.log("delete all", res.body);
                for(let i=0; i<res.body.length; i++){
                    agent.delete('/api/skuitems/'+rfid+'/testResult/'+res.body[i].id)
                    .then(function(res2){
                        res2.should.have.status(204);
                    });
                }
                done();
            }).catch(err=>done(err));
        });
    });
}

exports.newTestResult = newTestResult
exports.testPostNewTestResult = testPostNewTestResult
exports.testPostNewTestResultBadRFID = testPostNewTestResultBadRFID
exports.testGetTestResultByRFID = testGetTestResultByRFID
exports.testGetTestResultByWrongRFID = testGetTestResultByWrongRFID
exports.testGetTestResultByRFIDandID = testGetTestResultByRFIDandID
exports.testGetTestResultByWrongRFIDandID = testGetTestResultByWrongRFIDandID
exports.testEditTestResultByRFIDandID = testEditTestResultByRFIDandID
exports.testEditTestResultByWrongRFIDandID = testEditTestResultByWrongRFIDandID
exports.testDeleteTestResultByRFIDandID = testDeleteTestResultByRFIDandID
exports.testDeleteAllTestResultByRFID = testDeleteAllTestResultByRFID
