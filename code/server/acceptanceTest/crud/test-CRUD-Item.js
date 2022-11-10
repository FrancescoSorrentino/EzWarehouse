const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

const app = require('../../server'); 
var agent = chai.request.agent(app);

const users = require('../utils-users');
const skus = require('../utils-sku');
const skuitems = require('../utils-skuitems');
const testdescriptors = require('../utils-testdescriptor');
const items = require('../utils-items');

validrfid = '12345678901234567890123456789015';
notexistingrfid = '02345678901234567890123456789015';

testItemCRUD();

function testItemCRUD(){
    let mysku = [];
    mysku[0] = skus.newSku('a','b',20,30,40,10);
    mysku[1] = skus.newSku('c','d',40,30,20,10);

    let myuser  = [];
    myuser[0] = users.newCompleteUser("supp1@ezwh.com", "supName", "supSur", "testpassword", "supplier");
    myuser[1] = users.newCompleteUser("supp2@ezwh.com", "supName2", "supSur2", "testpassword", "supplier");

    let myitems = [];
    myitems[0] = items.newItem(0, "desc0", 9.99, 0, 0);
    myitemsnotfound = items.newItem(0, "desc0", 9.99, 1000000, 1);

    let myedititem = items.newItem(99, "newDesc", 99.99, 0, 0);
    

    describe('Test Item CRUD features', () => {
        skuitems.deleteAllSkuItems(agent);      
        skus.deleteAllSkus(agent);
        testdescriptors.deleteAllTestDescriptors(agent);
        users.testDeleteAllNotManagerUsers(agent);
        skus.testPostNewSku(agent, mysku[0],201);
        skus.testPostNewSku(agent, mysku[1],201);
        skus.testGetAllSkus(agent, mysku,2,200);
        items.deleteAllItems(agent);
        items.testGetAllItems(agent, 0, 200);
        users.testPostNewUser(agent, myuser[0], 201);
        users.testPostNewUser(agent, myuser[1], 201);
        users.testGetAllSuppliers(agent);
        items.testPostNewItem(agent, myitems[0], 201);
        items.testPostNewItem(agent, myitemsnotfound, 404);
        items.testGetAllItems(agent, 1, 200);
        items.testGetItem(agent, 0, myitems[0], 200);
        items.testGetItemnotfound(agent, null, 422);
        items.testGetItemnotfound(agent, 100000000, 404);
        items.testEditItem(agent, 0, 'desc0', 99.99, myedititem, 200);
        items.testDeleteItem(agent, 0, 204);
        items.deleteAllItems(agent);
        skuitems.deleteAllSkuItems(agent);      
        skus.deleteAllSkus(agent);
    });
}

exports.testItemCRUD = testItemCRUD