const ids = require('./utils-id');
const restockorders = require('./utils-restockorder');

//---------------------------------------------------------------------------------------------------------
//                                            CREATION
//---------------------------------------------------------------------------------------------------------

function newReturnOrder(returnDate, products, restockOrderId){
    return {
        returnDate:returnDate,
        products:products,
        restockOrderId:restockOrderId
    };
}

function newProductwithRFID(product, rfid){
    return{
        SKUId:product.SKUId,
        description:product.description,
        price:product.price,
        RFID:rfid
    };
}

//---------------------------------------------------------------------------------------------------------
//                                          TEST ACTIONS
//---------------------------------------------------------------------------------------------------------

function deleteAllReturnOrders(agent){
    describe('Removing all return orders', function(){
        it('Getting and removing', function(done){
            agent.get('/api/returnOrders')
            .then(function(res){
                res.should.have.status(200);
                if(res.body.length !==0){
                    for( let i=0; i< res.body.length; i++){
                        agent.delete('/api/returnOrder/'+res.body[i].id)
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

function testPostNewReturnOrder(agent, myretord, expCode){
    describe(' post /api/returnOrder', function(){
        it(' Create a return order', function(done){
            let idroid = ids.getIdRestockOrdersIssued();
            let idskus = ids.getIdSku();
            let currentProducts = [];
            let currentProductswithrfid = [];
            let restordid;
            if(myretord.restockOrderId === null || myretord.restockOrderId > idroid.length){
                restordid = myretord.restockOrderId;
            }
            else{
                restordid = idroid[myretord.restockOrderId];
            }
            for(let i=0; i<myretord.products.length ; i++){
                currentProducts[i] = restockorders.newProduct(idskus[myretord.products[i].SKUId], myretord.products[i].description, myretord.products[i].price, myretord.products[i].qty );
                currentProductswithrfid[i] = newProductwithRFID(currentProducts[i], myretord.products[i].RFID);
            }
            let retord = newReturnOrder(myretord.returnDate, currentProductswithrfid, restordid);
            agent.post('/api/returnOrder')
            .send(retord)
            .then(function(res){
                //console.log(res);
                //console.log(retord);
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));
        })
    })
}

function testPostWrongNewReturnOrder(agent, myretord, expCode){
    describe(' post /api/returnOrder', function(){
        it(' Create a return order', function(done){
            agent.post('/api/returnOrder')
            .send(myretord)
            .then(function(res){
                //console.log(res);
                //console.log(retord);
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));
        })
    })
}


function testGetAllReturnOrders(agent, myretord, expCode){
    describe(' get /api/returnOrders', function(){
        it(' get all return orders', function(done){
            agent.get('/api/returnOrders')
            .then(function(res){
                //console.log(res.body);
                res.should.have.status(expCode);
                res.body.should.be.a('array');
                let idrestockorders = ids.getIdRestockOrdersIssued();
                let idretord = [];
                res.body.length.should.be.eql(myretord.length);
                for(let i = 0; i<res.body.length; i++){
                    idretord[i] = res.body[i].id;
                    res.body[i].returnDate.should.equal(myretord[i].returnDate);
                    res.body[i].restockOrderId.should.equal(idrestockorders[myretord[i].restockOrderId]);
                }
                ids.setIdReturnOrders(idretord);
                done();
            }).catch(err=>done(err));
        });
    });
}

function testGetReturnOrderById(agent, myretord, id, expCode){
    describe(' get /api/returnOrders/:id', function(){
        it(' get return order by id', function(done){
            let idsret = ids.getIdReturnOrders();
            //console.log(idsret[id]);
            agent.get('/api/returnOrders/'+idsret[id])
            .then(function(res){
                res.should.have.status(expCode);
                res.body.returnDate.should.equal(myretord.returnDate);
                done();
            }).catch(err=>done(err));
        });
    });
}

function testGetWrongReturnOrderById(agent, id, expCode){
    describe(' get /api/returnOrders/:id', function(){
        it(' get return order by id', function(done){
            //console.log(idsret[id]);
            agent.get('/api/returnOrders/'+id)
            .then(function(res){
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));
        });
    });
}



//---------------------------------------------------------------------------------------------------------
//                                          EXPORTS
//---------------------------------------------------------------------------------------------------------

exports.testGetWrongReturnOrderById = testGetWrongReturnOrderById
exports.testGetReturnOrderById = testGetReturnOrderById
exports.testGetAllReturnOrders = testGetAllReturnOrders
exports.deleteAllReturnOrders = deleteAllReturnOrders
exports.newReturnOrder = newReturnOrder
exports.testPostNewReturnOrder = testPostNewReturnOrder
exports.newProductwithRFID = newProductwithRFID
exports.testPostWrongNewReturnOrder = testPostWrongNewReturnOrder