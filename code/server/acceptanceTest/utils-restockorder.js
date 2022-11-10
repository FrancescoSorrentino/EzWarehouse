const ids = require('./utils-id');

//---------------------------------------------------------------------------------------------------------
//                                            CREATION
//---------------------------------------------------------------------------------------------------------

function newProduct(SKUId, description, price, qty){
    return {
        SKUId:SKUId,
        description:description,
        price:price,
        qty:qty
    };
}

function newRestockOrder(issueDate, products, supplierId){
    return {
        issueDate:issueDate,
        products:products,
        supplierId:supplierId
    };

}

function newDictSkuitems(skuItems){
    return {
        skuItems:skuItems
    };
}

//---------------------------------------------------------------------------------------------------------
//                                          TEST ACTIONS
//---------------------------------------------------------------------------------------------------------

function testPostNewRestockOrder(agent, myrestock, expCode){
    describe('post /api/restockOrder', function(){
        it(' Create a restock order', function(done){
            let idskus = ids.getIdSku();
            let idsupp = ids.getIdSuppliers();
            let currentProducts = [];
            let currentRestock;
            agent.get('/api/suppliers')
            .then(function(res){
                currentSupplierId = res.body[0].id
                for(let i=0; i<myrestock.products.length ; i++){
                    currentProducts[i] = newProduct(idskus[myrestock.products[i].SKUId], myrestock.products[i].description, myrestock.products[i].price, myrestock.products[i].qty );
                }
                currentRestock = newRestockOrder(myrestock.issueDate, currentProducts, idsupp[myrestock.supplierId]);
                agent.post('/api/restockOrder')
                .send(currentRestock)
                .then(function(res2){
                    res2.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));
            });

        });

    });
}

function testPostNewWrongRestockOrder(agent, myrestock, expCode){
    describe('post /api/restockOrder', function(){
        it(' Create a restock order', function(done){
            let idskus = ids.getIdSku();
            let firstSupplierId;
            agent.get('/api/suppliers')
            .then(function(res){
                firstSupplierId = res.body[0].id;
                agent.post('/api/restockOrder')
                .send(myrestock)
                .then(function(res2){
                    res2.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));
            });

        });

    });
}

function deleteAllRestockOrders(agent){
    describe('Removing all Restock orders', function(){
        it('Getting and removing', function(done){
            agent.get('/api/restockOrders')
            .then(function(res){
                res.should.have.status(200);
                if(res.body.length !==0){
                    for( let i=0; i< res.body.length; i++){
                        agent.delete('/api/restockOrder/'+res.body[i].id)
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

function testGetAllRestockOrders(agent, myrestocks, expCode){
    describe(' get /api/restockOrders', function(){
        it(' get all restock orders', function(done){
            agent.get('/api/restockOrders')
            .then(function(res){
                res.should.have.status(expCode);
                res.body.should.be.a('array');
                let idsupp = ids.getIdSuppliers();
                let idrestord = [];
                res.body.length.should.be.eql(myrestocks.length);
                for(let i = 0; i<res.body.length; i++){
                    idrestord[i] = res.body[i].id;
                    res.body[i].issueDate.should.equal(myrestocks[i].issueDate);
                    res.body[i].supplierId.should.equal(idsupp[myrestocks[i].supplierId]);
                }
                ids.setIdRestockOrders(idrestord);
                done();
            }).catch(err=>done(err));
        });
    });
}

function testGetAllRestockIssued(agent, expCode){
    describe(' get /api/restockOrderIssued', function(){
        it(' get all restock order issued', function(done){
            agent.get('/api/restockOrdersIssued')
            .then(function(res){
                let idrestord = [];
                res.should.have.status(expCode);
                res.body.should.be.a('array');
                for(let i = 0; i<res.body.length; i++){
                    idrestord[i] = res.body[i].id;
                    res.body[i].state.should.equal("ISSUED");
                }
                ids.setIdRestockOrdersIssued(idrestord);
                done();
            }).catch(err=>done(err));
        });
    });
}

function testEditRestockOrder(agent, newState, expCode){
    let changestate = {"newState":newState};
    describe('put /api/restockOrder/:id', function(){
        it('Change a state of a restock order', function(done){
            agent.get('/api/restockOrders')
            .then(function(res){
                id = res.body[0].id;
                agent.put('/api/restockOrder/'+id)
                .send(changestate)
                .then(function(res){
                    res.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));
            });
        });
    });
}

function testEditWrongRestockOrder(agent, newState, id, expCode){
    let changestate = {"newState":newState};
    describe('put /api/restockOrder/:id', function(){
        it('Change a state of a restock order', function(done){
            agent.get('/api/restockOrders')
            .then(function(res){
                id = id;
                agent.put('/api/restockOrder/'+id)
                .send(changestate)
                .then(function(res){
                    res.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));
            });
        });
    });
}

function testEditRestockOrderSkuItems(agent, addskuitems, expCode){
    describe('put /api/restockOrder/:id/skuItems', function(){
        it('Change a state of a restock order', function(done){
            let idsku = ids.getIdSku();
            let thisskuitems = addskuitems;
            thisskuitems[0].SKUId = idsku[thisskuitems[0].SKUId];
            thisskuitems[1].SKUId = idsku[thisskuitems[1].SKUId];
            console.log(thisskuitems);
            agent.get('/api/restockOrders')
            .then(function(res){
                idsearch = res.body[0].id;
                //console.log("this is skuitems ", thisskuitems);
                agent.put('/api/restockOrder/'+idsearch+'/skuItems')
                .send({"skuItems":thisskuitems})
                .then(function(res2){
                    //console.log(res2)
                    res2.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));                 
            });
        });
    });
}

function testEditRestockWrongOrderSkuItems(agent, expCode){
    describe('put /api/restockOrder/:id/skuItems', function(){
        it('Change a state of a restock order', function(done){
            agent.get('/api/restockOrders')
            .then(function(res){
                idsearch = 1000000;
                let allskuitems = [];
                allskuitems[0] = {"SKUId":12, "rfid":'12345678901234567890123456789015'};
                allskuitems[1]= {"SKUId":12, "rfid":'12345678901234567890123456789016'};
                agent.put('/api/restockOrder/'+idsearch+'/skuItems')
                .send({"skuItems":allskuitems})
                .then(function(res3){
                    res3.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));                 
            });
        });
    });
}

function testEditRestockWrongBodyOrderSkuItems(agent, expCode){
    describe('put /api/restockOrder/:id/skuItems', function(){
        it('Change a state of a restock order', function(done){
            agent.get('/api/restockOrders')
            .then(function(res){
                idsearch = 1000000;
                let allskuitems = [];
                allskuitems[0] = {"SKUId":12, "rfid":'12345678901234567890123456789015'};
                allskuitems[1]= {"SKUId":12, "rfid":'12345678901234567890123456789016'};
                agent.put('/api/restockOrder/'+idsearch+'/skuItems')
                .send(null)
                .then(function(res3){
                    res3.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));                 
            });
        });
    });
}



function testEditRestockOrderTransportNote(agent, expCode){
    describe('put /api/restockOrder/:id/transportNote', function(){
        it('Change a state of a restock order', function(done){
            agent.get('/api/restockOrders')
            .then(function(res){
                idsearch = res.body[0].id;
                console.log(idsearch);
                agent.put('/api/restockOrder/'+idsearch+'/transportNote')
                .send({"transportNote":{"deliveryDate":"2023/12/29 03:00"}})
                .then(function(res3){
                    res3.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));                 
            });
        });
    });
}

function testEditRestockOrderTransportNoteNotFound(agent, expCode){
    describe('put /api/restockOrder/:id/transportNote', function(){
        it('Change a state of a restock order', function(done){
            agent.get('/api/restockOrders')
            .then(function(res){
                idsearch = 10000;
                agent.put('/api/restockOrder/'+idsearch+'/transportNote')
                .send({"transportNote":{"deliveryDate":"2021/12/29"}})
                .then(function(res3){
                    res3.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));                 
            });
        });
    });
}

exports.newProduct = newProduct
exports.newRestockOrder = newRestockOrder
exports.testPostNewRestockOrder = testPostNewRestockOrder
exports.testPostNewWrongRestockOrder = testPostNewWrongRestockOrder
exports.testGetAllRestockOrders = testGetAllRestockOrders
exports.deleteAllRestockOrders = deleteAllRestockOrders
exports.testGetAllRestockIssued = testGetAllRestockIssued
exports.testEditRestockOrder = testEditRestockOrder
exports.testEditWrongRestockOrder = testEditWrongRestockOrder
exports.testEditRestockOrderSkuItems = testEditRestockOrderSkuItems
exports.testEditRestockWrongOrderSkuItems = testEditRestockWrongOrderSkuItems
exports.testEditRestockWrongBodyOrderSkuItems = testEditRestockWrongBodyOrderSkuItems
exports.testEditRestockOrderTransportNote = testEditRestockOrderTransportNote
exports.testEditRestockOrderTransportNoteNotFound = testEditRestockOrderTransportNoteNotFound
exports.newProduct = newProduct
exports.newDictSkuitems = newDictSkuitems