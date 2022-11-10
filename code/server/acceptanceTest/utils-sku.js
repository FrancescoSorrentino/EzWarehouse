const empty = {};

const ids = require('./utils-id');

//---------------------------------------------------------------------------------------------------------
//                                           SKU CREATION
//---------------------------------------------------------------------------------------------------------


function newSku(description, notes, weight, volume, qty, price) {
    return  {
        description: description,
        notes: notes,
        weight: weight,
        volume: volume,
        availableQuantity: qty,
        price: price
    };
}

function newSkuEdit(description, notes, weight, volume, qty, price) {
    return {
        newDescription: description,
        newNotes: notes,
        newWeight: weight,
        newVolume: volume,
        newAvailableQuantity: qty,
        newPrice: price
    };
}

function newPosition(pos) {
    return {
        position: pos
    };
  }

//---------------------------------------------------------------------------------------------------------
//                                          TEST ACTIONS
//---------------------------------------------------------------------------------------------------------


function testPostNewSku(agent, thesku, expCode) {
    describe('post /api/sku/', function() {
        it('FR 2.1 a -> Define a new SKU', function (done) {
            agent.post('/api/sku/')
            .send(thesku)
            .then(function (res) {
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));
        });     
    });
}

function deleteAllSkus(agent) {
    describe('removing all skus', function() {
        it('Getting SKUs',  async function () {
            const res = await agent.get('/api/skus');
            console.log(res.body);
            res.should.have.status(200);
            if (res.body.length !==0) {
                let res2;
                for (let i = 0; i < res.body.length; i++) {
                    res2 = await
                    agent.delete('/api/skus/'+res.body[i].id);
                    res2.should.have.status(204);
                    console.log("Deleted "+ res.body[i].id);
                }
            } 
            console.log("done!");
        });
    });
}

function testGetAllSkus(agent, sku, size, expCode) {
    
    describe('get /api/skus', function() {
        it('FR 2.3 -> List all SKUs', function (done) {
            agent.get('/api/skus')
            .then(function (res) {
                res.should.have.status(expCode);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(size);
                let id = [];
                if (size > 0) {
                    for (let i = 0; i < size; i++) {
                        id[i] = res.body[i].id;
                        res.body[i].description.should.equal(sku[i].description);
                        res.body[i].weight.should.equal(sku[i].weight);
                        res.body[i].volume.should.equal(sku[i].volume);
                        res.body[i].notes.should.equal(sku[i].notes);
                        res.body[i].availableQuantity.should.equal(sku[i].availableQuantity);
                        res.body[i].price.should.equal(sku[i].price);
                    }
                    ids.setIdSku(id);
                }             
                done();
            }).catch(err=>done(err));
        });     
    });
    
}

function testGetSkuById(agent ,skuid, ith, sku, expCode) {
    describe('get /api/skus/:id', function() {
        it('FR 2.4 -> Search a SKU', function (done) {
            let id = ids.getIdSku();
            let procID;
            if (skuid == null || skuid>id.length) {
                procID = skuid;
            }
            else{
                procID = id[ith]
            }
            agent.get('/api/skus/'+procID)
            .then(function (res) {
                res.should.have.status(expCode);
                if (res.status > 200 && res.status < 299) {
                    res.body.should.be.a('object');
                    res.body.description.should.equal(sku[ith].description);
                    res.body.weight.should.equal(sku[ith].weight);
                    res.body.volume.should.equal(sku[ith].volume);
                    res.body.notes.should.equal(sku[ith].notes);
                    res.body.availableQuantity.should.equal(sku[ith].availableQuantity);
                    res.body.price.should.equal(sku[ith].price);
                }
                done();
            }).catch(err=>done(err));
        });     
    });
}

function testEditSku(agent, skuEditedPost, skuid, ith, expCode) {
    describe('put /api/sku/:id', function() {
        it('FR 2.1 b -> Modify an existing SKU', function (done) {
            let id = ids.getIdSku();
            var procID = id[ith];
            if (skuid == null || skuid > id.length) {
                procID = skuid;
            }
            agent.put('/api/sku/'+procID)
            .send(skuEditedPost)
            .then(function (res) {
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));
        });     
    });
}

function testNewPosition(agent, pos, skuid, ith, expCode) {
    describe('put /api/sku/:id/position', function() {
        it('Changing SKU position passing its id', function (done) {
            let id = ids.getIdSku();
            var procID = id[ith];
            if (skuid != null) {
                procID = skuid;
            }
            agent.put('/api/sku/'+procID+'/position')
            .send(pos)
            .then(function (res) {
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));
        });     
    });
}

function testDeleteSku(agent, skuid, ith, expCode) {
    describe('delete /api/sku/:id', function() {
        it('FR 2.2 -> Delete a SKU', function (done) {
            let id = ids.getIdSku();
            var procID = id[ith];
            if (skuid != null) {
                procID = skuid;
            }
            agent.delete('/api/skus/'+procID)
            .then(function (res) {
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));
        });     
    });
}

function login(agent, role, endpoint, expectedCodeResult, done) {
    agent.post(endpoint)
    .send({username: role.username, password: role.password, type: role.type })
    .then(function(res) {
        res.should.have.status(expectedCodeResult);
        res.body.username.should.equal(role.username);
        done();
    }).catch(err=>done(err));
};

function logout(agent, done) {
    agent.post('/api/logout')
    .then(function(res) {
        done();
    }).catch(err=>done(err));
}


exports.newSku = newSku;
exports.newSkuEdit = newSkuEdit;
exports.newPosition = newPosition;
exports.testPostNewSku = testPostNewSku;
exports.testGetAllSkus = testGetAllSkus;
exports.testGetSkuById = testGetSkuById;
exports.testEditSku = testEditSku;
exports.testNewPosition = testNewPosition;
exports.testDeleteSku = testDeleteSku;
exports.deleteAllSkus = deleteAllSkus;
exports.login = login;
exports.logout = logout;
