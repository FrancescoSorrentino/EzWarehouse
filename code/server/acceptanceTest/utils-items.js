
const { assert } = require("chai");
const ids = require('./utils-id');

let currentItems = [];


function newItem(id, description, price, SKUId, supplierId) {
    return {
        id: id,
        description: description,
        price: price,
        SKUId: SKUId,
        supplierId: supplierId
    };
}

function updateItem(newDescription, newPrice) {
    return {
        newDescription: newDescription,
        newPrice: newPrice
    }
}


//---------------------------------------------------------------------------------------------------------
//                                          TEST ACTIONS
//---------------------------------------------------------------------------------------------------------

function testPostNewItem(agent, myitem, expCode){
    describe('post /api/item/', function() {
        it('Adding item details', function(done){
            let idskus = ids.getIdSku();
            let idsupp = ids.getIdSuppliers();
            let currskuid;
            if(myitem.SKUId === null || myitem.SKUId > idskus.length){
                currskuid = myitem.SKUId;
            }
            else{
                currskuid = idskus[myitem.SKUId]
            }
            let currentItem = newItem(myitem.id, myitem.description, myitem.price, currskuid, idsupp[myitem.supplierId]);
            agent.post('/api/item')
            .send(currentItem)
            .then(res => {
                //console.log(res);
                assert.equal(res.status, expCode);
                done();
            }).catch(err => done(err));
        });
    });
}

function testGetItem(agent,itemid, myexpitem, expCode){
    describe('get /api/items/:id', function(){
        it('Gettim item details', function(done){
            agent.get('/api/items/'+itemid)
            .then(r => {
                let idskus = ids.getIdSku();
                let idsupp = ids.getIdSuppliers();
                assert.equal(r.status, expCode);
                if (r.status == 200) {
                    r.body.should.be.a('object');
                    r.body.id.should.equal(itemid);
                    r.body.description.should.equal(myexpitem.description);
                    r.body.price.should.equal(myexpitem.price);
                    r.body.SKUId.should.equal(idskus[myexpitem.SKUId]);
                    r.body.supplierId.should.equal(idsupp[myexpitem.supplierId]);
                }
                done();
            }).catch(err => done(err));
        });
    });
}

function testGetItemnotfound(agent, id, expCode){
    describe('get /api/items/:id', function(){
        it('Gettim item details', function(done){
            agent.get('/api/items/'+id)
            .then(r => {
                assert.equal(r.status, expCode);
                done();
            }).catch(err => done(err));
        });
    });
}


function deleteAllItems(agent){
    describe('Removing all Items', function(){
        it('Getting Items', function(done){
            agent.get('/api/items')
            .then(function(res){
                res.should.have.status(200);
                if(res.body.length !==0) {
                    for (let i = 0; i< res.body.length; i++){
                        agent.delete('/api/items/'+res.body[i].id)
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

function testGetAllItems(agent, size, expCode){
    describe(' get /api/items', function(){
        it('Getting all items', function (done){
            agent.get('/api/items')
            .then(function(res){
                console.log(res.body);
                res.should.have.status(expCode);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(size);
                done();
            }).catch(err => done(err));
        });
    });
}

function testEditItem(agent, ith, newDescription, newPrice, myexpitem, expCode){
    describe(' put /api/item/:id', function(){
        it('Modify an item given its ID and new fields', function(done){
            agent.put('/api/item/'+ith)
            .send(updateItem(newDescription, newPrice))
            .then(res => {
                let idsku = ids.getIdSku();
                let idsupp = ids.getIdSuppliers();
                assert.equal(res.status, expCode);
                agent.get('/api/items/'+ith)
                .then (r => {
                    console.log(r.body);
                    assert.equal(r.status,200);
                    r.body.should.be.a('object');
                    r.body.id.should.equal(myexpitem.id);
                    r.body.description.should.equal(newDescription);
                    r.body.price.should.equal(newPrice);
                    r.body.SKUId.should.equal(idsku[myexpitem.SKUId]);
                    r.body.supplierId.should.equal(idsupp[myexpitem.supplierId]);
                });
                done();
            }).catch(err=>done(err));
        });
    });
}

function testDeleteItem(agent, ith, expCode){
    describe(' delete /api/items/:id', function(){
        it('Delete an item given its id', function(done){
            agent.delete('/api/items/'+ith)
            .then(function(res){
                res.should.have.status(expCode);
                done();
            }).catch(err => done(err));
        });
    });
}



exports.newItem = newItem;
exports.testPostNewItem = testPostNewItem;
exports.testGetItem = testGetItem;
exports.deleteAllItems = deleteAllItems;
exports.testGetAllItems = testGetAllItems;
exports.testEditItem = testEditItem;
exports.testDeleteItem = testDeleteItem;
exports.testGetItemnotfound = testGetItemnotfound