const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

const app = require('../../server'); 
var agent = chai.request.agent(app);

const skus = require('../utils-sku');
const skuitems = require('../utils-skuitems');

testSkuItemsCRUD();

function testSkuItemsCRUD() {
    
    let myskus = [];
    myskus[0] = skus.newSku('a','b',20,30,40,10);
    myskus[1] = skus.newSku('c','d',40,30,20,10);

    let rfids = [];
    rfids[0] = '12345678901234567890123456789015';
    rfids[1] = '12345678901234567890123456789016';
    
    let myskuitems = [];
    myskuitems[0] = skuitems.newSkuItem(rfids[0], 0, '2021/11/29 12:30');
    myskuitems[1] = skuitems.newSkuItem(rfids[1], 0, '2021/11/29 21:45');
    let myskuitemsnoskuid = skuitems.newSkuItem(rfids[1], 1000000, '2021/11/29 21:45');
    let myskuitemsnull = skuitems.newSkuItem(null, null, null);  
    let mynewskuitem = skuitems.newSkuEdit(rfids[0], 1, '2021/11/29 12:30');
    let mynewskuitemnorfid = skuitems.newSkuEdit('12345678901234567890123456789019', 1, '2021/12/29 14:30');
    let mynewskuitemnull = skuitems.newSkuEdit(null, 1, '2021/12/29 14:30');
    let mynewskuitemnull2 = skuitems.newSkuEdit('12345678901234567890123456789015', null, '2021/12/29 14:30');
    let expskuit = [];
    expskuit[0] = myskuitems[0];
    let notaddedskuitems = skuitems.newSkuItem('12345678901234567890123456789000', 0, '2021/11/29 21:45');

    describe('Test skuitem CRUD features', () => {
        //db cleaning
        skuitems.deleteAllSkuItems(agent);      
        skus.deleteAllSkus(agent);
        skus.testPostNewSku(agent, myskus[0],201);
        skus.testPostNewSku(agent, myskus[1],201);
        skus.testGetAllSkus(agent, myskus, 2, 200);
        //POST    
        skuitems.testPostNewSkuItem(agent, myskuitems[0], 201);
        skuitems.testPostNewSkuItem(agent, myskuitems[1], 201);
        skuitems.testPostNewSkuItem(agent, myskuitemsnoskuid, 404);
        skuitems.testPostNewSkuItem(agent, myskuitemsnull, 422);
        skuitems.testGetAllSkuItems(agent, 2, myskuitems, 200);
        //PUT
        skuitems.testEditSkuItem(agent, mynewskuitem, 200);
        skuitems.testEditSkuItem(agent, mynewskuitemnorfid, 404);
        skuitems.testEditSkuItem(agent, mynewskuitemnull, 422);
        skuitems.testEditSkuItem(agent, mynewskuitemnull2, 422);
        //GET
        skuitems.testGetSkuItemsBySkuId(agent, 0, expskuit, 1, 200, 1);
        skuitems.testGetSkuItemsBySkuId(agent, 100000, expskuit, 1, 404, 1);
        skuitems.testGetSkuItemsBySkuId(agent, null, null, 1, 422, 1);
        skuitems.testGetAllSkuItems(agent, 2, myskuitems, 200);
        skuitems.testGetSkuItemsByRFID(agent, myskuitems[0], 1, 200);
        skuitems.testGetSkuItemsByRFID(agent, notaddedskuitems, 0, 404);
        skuitems.testGetSkuItemsByRFID(agent, myskuitemsnull, 0, 422);
    });
}

exports.testSkuItemsCRUD = testSkuItemsCRUD