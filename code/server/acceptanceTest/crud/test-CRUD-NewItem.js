const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

const app = require('../../server'); 
var agent = chai.request.agent(app);

const newitems = require('../utils-new-items');
const skuitems = require('../utils-skuitems');
const skus = require('../utils-sku'); 
const users = require('../utils-users');

testNewItemCRUD();

function testNewItemCRUD(){
    
    let myskuitems = [];
    let myskus = [];
    let myuser  = [];
    myuser[0] = users.newCompleteUser("supp1@ezwh.com", "supName", "supSur", "testpassword", "supplier");
    myuser[1] = users.newCompleteUser("supp2@ezwh.com", "supName2", "supSur2", "testpassword", "supplier");

    let mysku = [];
    mysku[0] = skus.newSku('a','b',20,30,40,10);
    mysku[1] = skus.newSku('c','d',40,30,20,10);

    let myitems = [];
    myitems[0] = newitems.newItem(0, "desc0", 9.99, 0, 0);
    myitemsnotfound = newitems.newItem(0, "desc0", 9.99, 1000000, 1);
    let notexistingitemid = 100000000000;
    let myedititem = newitems.newItem(0, "newDesc", 99.99, 0, 0);
    let mywrongedititem = newitems.newItem(notexistingitemid, "newDesc", 99.99, 0, 0);

    describe('Test CR1 Item', () => {

        newitems.deleteAllItems(agent);
        newitems.testGetAllItems(agent, 0, 200);
        skuitems.deleteAllSkuItems(agent);
        skuitems.testGetAllSkuItems(agent, 0, myskuitems, 200);
        skus.deleteAllSkus(agent);
        skus.testGetAllSkus(agent, myskus, 0, 200);
        users.testDeleteAllNotManagerUsers(agent);
        users.testPostNewUser(agent, myuser[0], 201);
        users.testPostNewUser(agent, myuser[1], 201);
        users.testGetAllSuppliers(agent);

        skus.testPostNewSku(agent, mysku[0],201);
        skus.testPostNewSku(agent, mysku[1],201);
        skus.testGetAllSkus(agent, mysku,2,200);

        newitems.testPostNewItem(agent, myitems[0], 201);
        newitems.testPostNewItem(agent, myitemsnotfound, 404);
        newitems.testGetAllItems(agent, 1, 200);
        newitems.testGetItem(agent, myitems[0].id, myitems[0], 200);
        newitems.testGetItemnotfound(agent, notexistingitemid, myitems[0], 404);
        newitems.testEditItem(agent, myedititem, 200);
        newitems.testEditItem(agent, mywrongedititem, 404);
        newitems.testDeleteItem(agent, myitems[0], 204);
        
        newitems.deleteAllItems(agent);
        skuitems.deleteAllSkuItems(agent);      
        skus.deleteAllSkus(agent);
    });
}

exports.testNewItemCRUD = testNewItemCRUD