const ids = require('./utils-id');

//---------------------------------------------------------------------------------------------------------
//                                           SKUITEMS CREATION
//---------------------------------------------------------------------------------------------------------


function newSkuItem(RFID, SKUId, DateOfStock) {
    return  {
        RFID: RFID,
        SKUId:SKUId,
        DateOfStock: DateOfStock
    };
}

function newSkuEdit(RFID, availability, DateOfStock) {
    return  {
        newRFID: RFID,
        newAvailable:availability,
        newDateOfStock: DateOfStock
    };
}


//---------------------------------------------------------------------------------------------------------
//                                          TEST ACTIONS
//---------------------------------------------------------------------------------------------------------


function testPostNewSkuItem(agent, myskuitem, expCode) {
    describe('post /api/skuitem/', function() {
        it('Adding skuitem details', function (done) {
            let id = ids.getIdSku();
            let skuitem;
            if(myskuitem.SKUId > id.length || myskuitem.SKUId === null){
                skuitem = newSkuItem(myskuitem.RFID, myskuitem.SKUId , myskuitem.DateOfStock); 
            }
            else{
                skuitem = newSkuItem(myskuitem.RFID, id[myskuitem.SKUId] , myskuitem.DateOfStock);
            }
            agent.post('/api/skuitem/')
            .send(skuitem)
            .then(function (res) {
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));
        });     
    });
}

/*
function deleteAllSkuItems(agent) {
    describe('removing all skuitems', function() {
        it('Getting SKUitems', function (done) {
            agent.get('/api/skuitems')
            .then(function (res) {
                res.should.have.status(200);
                if (res.body.length !==0) {
                    for (let i = 0; i < res.body.length; i++) {
                        agent.delete('/api/skuitems/'+res.body[i].RFID)
                        .then(function (res2) {
                            res2.should.have.status(204); 
                        });
                    }
                    
                } 
                done();
            }).catch(err => done(err));
        });
    });
}
*/
function deleteAllSkuItems(agent) {
    describe('removing all skuitems', function() {
        it('Getting SKUitems', async function () {
            const res = await agent.get('/api/skuitems');
            console.log(res.body);
            res.should.have.status(200);
            if (res.body.length !==0) {
                let res2;
                for (let i = 0; i < res.body.length; i++) {
                    res2 = await
                    agent.delete('/api/skuitems/'+res.body[i].RFID);
                    res2.should.have.status(204);
                    console.log("Deleted "+ res.body[i].RFID);
                }
            }
            console.log("done!");
        });
    });
}



function testGetAllSkuItems(agent, size, skuitems, expCode) {
    describe('get /api/skuitems', function() {
        it('Getting SKUitems', function (done) {
            agent.get('/api/skuitems')
            .then(function (res) {
                console.log(res.body[0]);
                res.should.have.status(expCode);
                res.body.should.be.a('array');
                res.body.length.should.be.equal(size);
                let idSKUs = ids.getIdSku();
                for (let i = 0; i < size; i++) {
                    res.body[i].RFID.should.equal(skuitems[i].RFID);
                    res.body[i].SKUId.should.equal(idSKUs[skuitems[i].SKUId]);
                    res.body[i].DateOfStock.should.equal(skuitems[i].DateOfStock);
                    if(skuitems[i].Available !== undefined){
                        res.body[i].Available.should.equal(skuitems[i].Available);
                        //console.log('null');
                    }
                }
                
                done();                
            }).catch(err=>done(err));
        });     
    });
    
}

function testGetSkuItemsBySkuId(agent ,skuidith, expectedskuitem, expectedsize, expCode) {
    describe('get /api/skuitems/sku/:id', function() {
        it('Getting SKUitems passing its id', function (done) {
            let idskus = ids.getIdSku();
            let nowskuid;
            if(skuidith > idskus.length || skuidith === null){
                nowskuid = skuidith;
                agent.get('/api/skuitems/sku/'+nowskuid)
                .then(function (res) {
                    res.should.have.status(expCode);
                    done();
                }).catch(err=>done(err));
            }
            else{
                nowskuid = idskus[skuidith];
                agent.get('/api/skuitems/sku/'+nowskuid)
                .then(function (res) {
                    res.should.have.status(expCode);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(expectedsize);
                    for (let i = 0; i < expectedsize; i++) {
                        res.body[i].RFID.should.equal(expectedskuitem[i].RFID);
                        res.body[i].SKUId.should.equal(idskus[expectedskuitem[i].SKUId]);
                        res.body[i].DateOfStock.should.equal(expectedskuitem[i].DateOfStock);                    
                    }
                    done();
                }).catch(err=>done(err));
            }
            
        });     
    });
}

function testGetSkuItemsByRFID(agent, expectedskuitem, expAvail, expCode) {
    describe('get /api/skuitems/:RFID', function() {
        it('Getting SKUitems passing its rfid', function (done) {
            let idskus = ids.getIdSku();
            agent.get('/api/skuitems/'+expectedskuitem.RFID)
            .then(function (res) {
                res.should.have.status(expCode);
                if(res.status==200){
                    res.body.should.be.a('object');
                    res.body.RFID.should.equal(expectedskuitem.RFID);
                    res.body.SKUId.should.equal(idskus[expectedskuitem.SKUId]);
                    res.body.DateOfStock.should.equal(expectedskuitem.DateOfStock);
                    if(res.body.Available !== undefined){
                        res.body.Available.should.equal(expAvail);
                    }
                }
                done();
            }).catch(err=>done(err));
        });     
    });
}

function testEditSkuItem(agent, newskuitem, expCode) {
    describe('put /api/skutems/:rfid', function() {
        it('Editing SKUitems details passing its rfid', function (done) {
            console.log(newskuitem);
            agent.put('/api/skuitems/'+newskuitem.newRFID)
            .send(newskuitem)
            .then(function (res) {
                console.log(res.body);
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));
        });     
    });
}

function testDeleteSkuItem(agent, skuid, ith, expCode) {
    describe('delete /api/skuitems/:rfid', function() {
        it('Deleting SKUitem passing its id', function (done) {
            var procID = idskus[ith];
            if (skuid != null) {
                procID = skuid;
            }
            agent.delete('/api/skuitems/'+procID)
            .then(function (res) {
                res.should.have.status(expCode);
                done();
            }).catch(err => done(err));
        });     
    });
}

exports.newSkuItem = newSkuItem;
exports.newSkuEdit = newSkuEdit;
exports.testPostNewSkuItem = testPostNewSkuItem;
exports.testGetAllSkuItems = testGetAllSkuItems;
exports.testGetSkuItemsBySkuId = testGetSkuItemsBySkuId;
exports.testGetSkuItemsByRFID = testGetSkuItemsByRFID;
exports.testEditSkuItem = testEditSkuItem;
exports.testDeleteSkuItem = testDeleteSkuItem;
exports.deleteAllSkuItems = deleteAllSkuItems;