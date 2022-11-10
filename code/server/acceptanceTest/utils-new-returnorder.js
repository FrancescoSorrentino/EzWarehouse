const ids = require('./utils-id');
const newrestockorders = require('./utils-new-restockorder');

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
        itemId:product.itemId,
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
        it('Getting and removing', async function(){
            const res = await agent.get('/api/returnOrders');
            res.should.have.status(200);
            console.log(res.body);
            if(res.body.length !==0){
                let res2;
                for( let i=0; i< res.body.length; i++){
                    res2 = await
                    agent.delete('/api/returnOrder/'+res.body[i].id);                    
                    res2.should.have.status(204);
                    console.log("Deleted "+ res.body[i].id);
                }
            }
            console.log("done");   
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
                currentProducts[i] = newrestockorders.newProduct(idskus[myretord.products[i].SKUId], myretord.products[i].itemId, myretord.products[i].description, myretord.products[i].price, myretord.products[i].qty );
                currentProductswithrfid[i] = newProductwithRFID(currentProducts[i], myretord.products[i].RFID);
            }
            console.log(currentProducts);
            let retord = newReturnOrder(myretord.returnDate, currentProductswithrfid, restordid);
            agent.post('/api/returnOrder')
            .send(retord)
            .then(function(res){
                console.log(res.body);
                console.log(retord);
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
                let idskus  = ids.getIdSku();
                res.body.length.should.be.eql(myretord.length);
                for(let i = 0; i<res.body.length; i++){
                    idretord[i] = res.body[i].id;
                    res.body[i].returnDate.should.equal(myretord[i].returnDate);
                    res.body[i].restockOrderId.should.equal(idrestockorders[myretord[i].restockOrderId]);
                    for(let j = 0; j<res.body[i].products.length; j++){
                        res.body[i].products[j].SKUId.should.equal(idskus[myretord[i].products[j].SKUId]);
                        res.body[i].products[j].itemId.should.equal(myretord[i].products[j].itemId);
                        res.body[i].products[j].description.should.equal(myretord[i].products[j].description);
                        res.body[i].products[j].price.should.equal(myretord[i].products[j].price);
                        res.body[i].products[j].RFID.should.equal(myretord[i].products[j].RFID);
                    }
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
            let idskus  = ids.getIdSku();
            //console.log(idsret[id]);
            agent.get('/api/returnOrders/'+idsret[id])
            .then(function(res){
                res.should.have.status(expCode);
                res.body.returnDate.should.equal(myretord.returnDate);
                for(let j = 0; j < res.body.products.length; j++){
                    res.body.products[j].SKUId.should.equal(idskus[myretord.products[j].SKUId]);
                    res.body.products[j].itemId.should.equal(myretord.products[j].itemId);
                    res.body.products[j].description.should.equal(myretord.products[j].description);
                    res.body.products[j].price.should.equal(myretord.products[j].price);
                    res.body.products[j].RFID.should.equal(myretord.products[j].RFID);

                }
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