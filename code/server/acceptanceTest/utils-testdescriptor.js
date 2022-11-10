const { assert } = require("chai");
const { body } = require("express-validator");

const ids = require('./utils-id');

//---------------------------------------------------------------------------------------------------------
//                                           CREATION
//---------------------------------------------------------------------------------------------------------


function newTestDescriptor(name, procedureDescription, idSKU){
    return {
        name:name,
        procedureDescription:procedureDescription,
        idSKU:idSKU
    };
}

function newTestDescriptorEdit(newName, newProcedureDescription, newIdSKU){
    return{
        newName:newName,
        newProcedureDescription:newProcedureDescription,
        newIdSKU:newIdSKU
    };
}
//---------------------------------------------------------------------------------------------------------
//                                          TEST ACTIONS
//---------------------------------------------------------------------------------------------------------


function deleteAllTestDescriptors(agent){
    describe('removing all test descriptors', function(){
        it('Getting test descriptors', function(done){
            agent.get('/api/testDescriptors')
            .then(function(res){
                res.should.have.status(200);
                if(res.body.length !==0){
                    for (let i=0; i<res.body.length; i++){
                        agent.delete('/api/testDescriptor/'+res.body[i].id)
                        .then(function(res2){
                            res2.should.have.status(204);
                        });
                    }
                }
                done();
            }).catch(err=>done(err));
        });
    });
}

function testPostNewTestDescriptor(agent, mytd, expCode){
    describe('test adding a test descriptor with post', function(){
        it('Creating a test descriptor', function(done){
            let id = ids.getIdSku();
            let testdescriptor;
            if(mytd.idSKU > id.length || mytd.idSKU === null){
                testdescriptor = newTestDescriptor(mytd.name, mytd.procedureDescription, mytd.idSKU);
            } 
            else {
                testdescriptor = newTestDescriptor(mytd.name, mytd.procedureDescription, id[mytd.idSKU]);
            }
            //console.log(testdescriptor);
            agent.post('/api/testDescriptor')
            .send(testdescriptor)
            .then(res2 => {
                assert.equal(res2.status, expCode);
                done();
            }).catch(err=>done(err));
        });
    });
}

function testPostEmptyBodyTestDescriptor(agent, expCode){
    describe('test post test descriptor with not exixsting idsku', function(){
        it('Creating a bad test descriptor', function(done){
            agent.post('/api/testDescriptor')
            .send()
            .then(function(res){
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));
        });
    });

}

function testGetAllTestDescriptors(agent, size, mytd, expCode){
    describe('get /api/testDescriptors', function(){
        it('Getting All TestDescriptors', function(done){
            agent.get('/api/testDescriptors')
            .then(function(res){
                res.should.have.status(expCode);
                res.body.length.should.be.equal(size);
                res.body.should.be.a('array');
                let id = [];
                let idSKUs = ids.getIdSku();
                for(let i=0; i<res.body.length; i++){
                    id[i]=res.body[i].id;
                    res.body[i].name.should.equal(mytd[i].name);
                    res.body[i].procedureDescription.should.equal(mytd[i].procedureDescription);
                    res.body[i].idSKU.should.equal(idSKUs[mytd[i].idSKU]);
                }
                ids.setIdTestDescriptor(id);
                done();
            }).catch(err=>done(err));
        });
    });
}

function testGetTestDescriptorById(agent, tdidith, mytd, expCode){
    describe('get /api/testDescriptors', function(){
        it('Getting a TestDescriptor by id', function(done){
            let id = ids.getIdTestDescriptor();
            let idSKUs = ids.getIdSku();
            let myid;
            if(tdidith>id.length || tdidith === null){
                myid = tdidith;
                agent.get('/api/testDescriptors/'+myid)
                .then(function(res){
                    res.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));
            }
            else {
                myid = id[tdidith];
                agent.get('/api/testDescriptors/'+myid)
                .then(function(res){
                    res.should.have.status(expCode);
                    res.body.id.should.equal(id[tdidith]);
                    res.body.name.should.equal(mytd.name);
                    res.body.procedureDescription.should.equal(mytd.procedureDescription);
                    res.body.idSKU.should.equal(idSKUs[mytd.idSKU]);
                    done();
                }).catch(err=>done(err));
            }               
        });
    });
}

function testModifyTestDescriptorById(agent, newtd, tdidith, expCode){
    describe('put /api/testDescriptor/:id', function(){
        it('Modify a TestDescriptor by id', function(done){
            let id = ids.getIdTestDescriptor();
            let idSKUs = ids.getIdSku();
            let myid;
            if(tdidith>id.length || tdidith===null){
                myid = tdidith
            }
            else {
                myid=id[tdidith];
            }
            let sendnewtd;
            if(newtd.idSKU>idSKUs.length || newtd.idSKU === null){
                sendnewtd = newTestDescriptorEdit(newtd.name, newtd.procedureDescription, newtd.idSKU);
            }
            else{
                sendnewtd = newTestDescriptorEdit(newtd.name, newtd.procedureDescription, idSKUs[newtd.idSKU]);
            }
            agent.put('/api/testDescriptor/'+myid)
            .send(sendnewtd)
            .then(function(res){
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));               
        });
    });
}

function testModifyTestDescriptorEmptyBody(agent, expCode){
    describe('put /api/testDescriptor/:id', function(){
        it('Modify a TestDescriptor by id', function(done){
            agent.get('/api/testDescriptors')
            .then(function(res){
                res.should.have.status(200);
                res.body.should.be.a('array');
                agent.put('/api/testDescriptor/'+10000)
                .send()
                .then(function(res2){
                    res2.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));               
            });
        });
    });
}

function testDeleteTestDescriptorById(agent, tdidith, expCode){
    describe('delete /api/testDescriptor/:id', function(){
        it('Delete a TestDescriptor by id', function(done){
            let id = ids.getIdTestDescriptor();
            myid = id[tdidith];
            agent.delete('/api/testDescriptor/'+myid)
            .then(function(res2){
                res2.should.have.status(expCode);
                done();
            }).catch(err=>done(err));               
        });
    });
}

exports.newTestDescriptor = newTestDescriptor
exports.newTestDescriptorEdit = newTestDescriptorEdit
exports.deleteAllTestDescriptors = deleteAllTestDescriptors
exports.testPostNewTestDescriptor = testPostNewTestDescriptor
exports.testPostEmptyBodyTestDescriptor = testPostEmptyBodyTestDescriptor
exports.testGetAllTestDescriptors = testGetAllTestDescriptors
exports.testGetTestDescriptorById = testGetTestDescriptorById
exports.testModifyTestDescriptorById = testModifyTestDescriptorById
exports.testModifyTestDescriptorEmptyBody = testModifyTestDescriptorEmptyBody
exports.testDeleteTestDescriptorById = testDeleteTestDescriptorById