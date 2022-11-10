const { assert } = require("chai");
const ids = require('./utils-id');


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

function deleteAllItems(agent){
    describe('Removing all Items', function(){
        it('get /api/items/', async function(){
            const res = await agent.get('/api/items');
            console.log(res.body);
            res.should.have.status(200);
            if(res.body.length !==0) {
                let res2;
                for (let i = 0; i< res.body.length; i++){
                    res2 = await
                    agent.delete('/api/items/'+res.body[i].id+'/'+res.body[i].supplierId);
                    res2.should.have.status(204);
                    console.log("Deleted " + res.body[i].id + " by supplier "+ res.body[i].supplierId);
                }
            }
            
        });
    });
}

function testGetAllItems(agent, size, expCode){
    describe('Get all items', function(){
        it('get /api/items/', function (done){
            agent.get('/api/items')
            .then(function(res){
                console.log(res.body);
                res.should.have.status(expCode);
                res.body.should.be.a('array');
                res.body.length.should.be.equal(size);
                done();
            }).catch(err => done(err));
        });
    });
}

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
            let idsupp = ids.getIdSuppliers();
            agent.get('/api/items/'+itemid+'/'+idsupp[myexpitem.supplierId])
            .then(r => {
                let idskus = ids.getIdSku();
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

function testGetItemnotfound(agent, wrongid, myexpitem, expCode){
    describe('get /api/items/:id', function(){
        it('Gettim item details', function(done){
            let idsupp = ids.getIdSuppliers();
            agent.get('/api/items/'+wrongid+'/'+idsupp[myexpitem.supplierId])
            .then(r => {
                assert.equal(r.status, expCode);
                done();
            }).catch(err => done(err));
        });
    });
}

function testEditItem(agent, myedititem, expCode){
    describe(' put /api/item/:id', function(){
        it('Modify an item given its ID and new fields', function(done){
            let idsupp = ids.getIdSuppliers();
            agent.put('/api/item/'+myedititem.id+'/'+idsupp[myedititem.supplierId])
            .send(updateItem(myedititem.description, myedititem.price))
            .then(res => {
                if(expCode != 404){
                    let idsku = ids.getIdSku();
                    assert.equal(res.status, expCode);
                    agent.get('/api/items/'+myedititem.id+'/'+idsupp[myedititem.supplierId])
                    .then (r => {
                        console.log(r.body);
                        assert.equal(r.status,200);
                        r.body.should.be.a('object');
                        r.body.id.should.equal(myedititem.id);
                        r.body.description.should.equal(myedititem.description);
                        r.body.price.should.equal(myedititem.price);
                        r.body.SKUId.should.equal(idsku[myedititem.SKUId]);
                        r.body.supplierId.should.equal(idsupp[myexpitem.supplierId]);
                    });
                }
                else{
                    res.should.have.status(expCode);
                }
                done();
            }).catch(err=>done(err));
        });
    });
}

function testDeleteItem(agent, myitem, expCode){
    describe(' delete /api/items/:id', function(){
        it('Delete an item given its id', function(done){
            let idsupp = ids.getIdSuppliers();
            agent.delete('/api/items/'+myitem.id+'/'+idsupp[myitem.supplierId])
            .then(function(res){
                res.should.have.status(expCode);
                done();
            }).catch(err => done(err));
        });
    });
}



exports.deleteAllItems = deleteAllItems;
exports.testGetAllItems = testGetAllItems;
exports.newItem = newItem;
exports.testPostNewItem = testPostNewItem;
exports.testGetItem = testGetItem;
exports.testGetItemnotfound = testGetItemnotfound;
exports.testEditItem = testEditItem;
exports.testDeleteItem = testDeleteItem