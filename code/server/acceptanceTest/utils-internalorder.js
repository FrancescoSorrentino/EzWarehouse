const restockorders = require('./utils-restockorder');
const ids = require('./utils-id');

let currentCustomerID = 0;
let currentProducts = [];

//---------------------------------------------------------------------------------------------------------
//                                            CREATION
//---------------------------------------------------------------------------------------------------------

function newInternalOrder(issueDate, products, customerId){
    return {
        issueDate:issueDate,
        products:products,
        customerId:customerId
    };
}



//---------------------------------------------------------------------------------------------------------
//                                          TEST ACTIONS
//---------------------------------------------------------------------------------------------------------



function testPostNewInternalOrder(agent, myintord, expCode){
    describe(' post /api/internalOrders', function(){
        it('Create a new internal order', function(done){
            let idskus = ids.getIdSku();
            let customerId;
            let currentIntOrd;
            let currentProducts = [];
            agent.get('/api/users')
            .then(function(res){
                for(let i=0; i<res.body.length;i++){
                    if(res.body[i].type === "customer"){
                        customerId = res.body[i].id;
                    }
                }
                for(let i=0; i<myintord.products.length ; i++){
                    currentProducts[i] = restockorders.newProduct(idskus[myintord.products[i].SKUId], myintord.products[i].description, myintord.products[i].price, myintord.products[i].qty );
                }
                currentIntOrd = newInternalOrder(myintord.issueDate, currentProducts, customerId);
                agent.post('/api/internalOrders')
                .send(currentIntOrd)
                .then(function(res2){
                    res2.should.have.status(expCode);
                    done();
                }).catch(err => done(err));
            }).catch(err => done(err));;
            
        });
    });
}

function testPostWrongNewInternalOrders(agent, intord, expCode){
    describe(' post /api/internalOrders', function(){
        it('Create a new internal order', function(done){
            //console.log(currentInternalOrders[ith]);
            agent.post('/api/internalOrders')
            .send(intord)
            .then(function(res) {
                console.log(res.body);
                res.should.have.status(expCode);
                done();
            }).catch(err => done(err));
        });
    });
}

function deleteAllInternalOrders(agent){
    describe('Removing all Internal Orders', function(){
        it('Getting Interna Orders', function(done){
            agent.get('/api/internalOrders')
            .then(function(res){
                res.should.have.status(200);
                if(res.body.length !==0) {
                    for (let i = 0; i< res.body.length; i++){
                        agent.delete('/api/internalOrders/'+res.body[i].id)
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

function testGetAllInternalOrders(agent, size, expCode){
    describe(' get /api/internalOrders', function(){
        it('Getting all internal orders', function (done){
            agent.get('/api/internalOrders')
            .then(function(res){
                //console.log(res.body);
                res.should.have.status(expCode);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(size);
                console.log('body length', res.body.length);
                for(let i=0; i<res.body.length; i++){
                    console.log(res.body[i]);
                }
                done();
            }).catch(err=>done(err));
        });
    });
}

function testEditInternalOrder(agent, newState, expCode){
    describe(' put /api/internalOrders/:id', function(){
        it('Modify the state of an IO', function(done){
            agent.get('/api/internalOrders')
            .then(function(res){
                agent.put('/api/internalOrders/'+res.body[0].id)
                .send({"newState":newState, "products":[{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]})
                .then(function(res2){
                    res2.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));
            });
        });
    });
}

function testGetAllInternalOrdersIssued(agent, expcode){
    describe(' get /api/internalOrdersIssued', function(){
        it('Retrieve all internal order in state issued', function(done){
            agent.get('/api/internalOrdersIssued')
            .then(function(res){
                res.should.have.status(expcode);
                res.body.should.be.a('array');
                for(let i=0; i<res.body.length; i++){
                    console.log('inside get order issued', res.body[i]);
                }
                done();
            }).catch(err=>done(err));
        });
    });
}

function testGetAllInternalOrdersAccepted(agent, expcode){
    describe(' get /api/internalOrdersIssued', function(){
        it('Retrieve all internal order in state issued', function(done){
            agent.get('/api/internalOrdersAccepted')
            .then(function(res){
                res.should.have.status(expcode);
                res.body.should.be.a('array');
                for(let i=0; i<res.body.length; i++){
                    console.log('inside get order accepted', res.body[i]);
                }
                done();
            }).catch(err=>done(err));
        });
    });
}

exports.newInternalOrder = newInternalOrder
exports.deleteAllInternalOrders = deleteAllInternalOrders
exports.testGetAllInternalOrders=testGetAllInternalOrders
exports.testPostNewInternalOrder = testPostNewInternalOrder
exports.testPostWrongNewInternalOrders = testPostWrongNewInternalOrders
exports.testEditInternalOrder = testEditInternalOrder
exports.testGetAllInternalOrdersIssued = testGetAllInternalOrdersIssued
exports.testGetAllInternalOrdersAccepted = testGetAllInternalOrdersAccepted