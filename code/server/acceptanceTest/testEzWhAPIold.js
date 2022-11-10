const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

const app = require('../server'); 
var agent = chai.request.agent(app);

const skus = require('./utils-sku');
const skuitems = require('./utils-skuitems');
const positions = require('./utils-positions');
const testdescriptors = require('./utils-testdescriptor');
const users = require('./utils-users');
const restockorders = require('./utils-restockorder');
const returnorders = require('./utils-returnorder');
const skucrud = require('./crud/test-CRUD-SKUs');
const skuitemcrud = require('./crud/test-CRUD-SKUitems');
const positioncrud = require ('./crud/test-CRUD-Position');
const testdescriptorcrud = require('./crud/test-CRUD-TestDescriptor');
const testresultcrud = require('./crud/test-CRUD-TestResult');
const usercrud = require('./crud/test-CRUD-User');
const restockordercrud = require('./crud/test-CRUD-RestockOrder');
const retordcrud = require('./crud/test-CRUD-ReturnOrder');
const intordcrud = require('./crud/test-CRUD-InternalOrder');
const itemcrud = require('./crud/test-CRUD-Item');

testFR();
testFRCRUD();

function testFR(){

    let myuser = users.newCompleteUser('user12@ezwh.com','John', 'Smith', 'testpassword', 'customer');
    let mysupp = users.newCompleteUser("supp1@ezwh.com", "supName", "supSur", "testpassword", "supplier");

    let mysku = [];
    mysku[0] = skus.newSku('a','b',20,30,40,10);
    mysku[1] = skus.newSku('c','d',40,30,20,10);
    let myeditedskuToPut = skus.newSkuEdit('skuedited', 'noteedited', 50, 50, 50, 50);

    let mypositions = [];
    mypositions[0] = positions.newPosition("800134543412", "8001", "3454", "3412", 1000, 1000);
    mypositions[1] = positions.newPosition("800234553413", "8002", "3455", "3413", 10, 100);
    let updateposition =    {
        "newAisleID": "8002",
        "newRow": "3454",
        "newCol": "3412",
        "newMaxWeight": 1200,
        "newMaxVolume": 600,
        "newOccupiedWeight": 200,
        "newOccupiedVolume":100
    }
    let newpositionid = {
        "newPositionID":"800134543419"
    }

    let rfids = [];
    rfids[0] = '12345678901234567890123456789015';
    rfids[1] = '12345678901234567890123456789016';
    rfids[2] = '12345678901234567890123456789017';
    rfids[3] = '12345678901234567890123456789018';
    
    let myskuitems = [];
    myskuitems[0] = skuitems.newSkuItem(rfids[0], 0, '2021/11/29 12:30');
    myskuitems[1] = skuitems.newSkuItem(rfids[1], 0, '2021/11/29 21:45');
    myskuitems[2] = skuitems.newSkuItem(rfids[2], 1, '2022/11/29 20:45');
    myskuitems[3] = skuitems.newSkuItem(rfids[3], 1, '2022/12/29 20:45');

    let mytd = [];
    mytd[0] = testdescriptors.newTestDescriptor('td1','descr1',0);
    mytd[1] = testdescriptors.newTestDescriptor('td2','descr2',1);

    let myproducts = [];
    myproducts[0] = restockorders.newProduct(0, "descr1", 8.99, 30);
    myproducts[1] = restockorders.newProduct(1, "descr2", 6.99, 20);

    let myrestocks = [];
    myrestocks[0] = restockorders.newRestockOrder("2022/05/16 09:33", myproducts, 0); 
    myrestocks[1] = restockorders.newRestockOrder("2022/05/17 19:00", myproducts, 1); 

    let addskuitems = [];
    addskuitems[0] = {"SKUId":1, "rfid":rfids[2]};
    addskuitems[1]= {"SKUId":1, "rfid":rfids[3]};

    let mynewskuitem = skuitems.newSkuEdit(rfids[0], 1, '2021/11/29 12:30');

    let myproductswithrfid = [];
    myproductswithrfid[0] = returnorders.newProductwithRFID(myproducts[0], rfids[2]);
    myproductswithrfid[1] = returnorders.newProductwithRFID(myproducts[1], rfids[3]);
        
    let myreturnorders = [];
    myreturnorders[0] = returnorders.newReturnOrder('2022/05/16 23:33', myproductswithrfid, 0);
    myreturnorderwithnosuppid = returnorders.newReturnOrder('2022/05/16 23:33', myproductswithrfid, 100000);
    myretnull = returnorders.newReturnOrder(null, null, 0);

    describe('Testing Functional requirements', () => {
        users.testDeleteAllNotManagerUsers(agent);
        skus.deleteAllSkus(agent);
        positions.deleteAllPositions(agent);
        testdescriptors.deleteAllTestDescriptors(agent);
        skuitems.deleteAllSkuItems(agent);  
        restockorders.deleteAllRestockOrders(agent); 
        users.testPostNewUser(agent, myuser,201);
        users.testEditUser(agent, {"oldType":"customer", "newType":"clerk"}, myuser.username, 200);
        users.testGetAllUsers(agent, 200);
        users.testDeleteUser(agent, myuser.username, "clerk", 204);
        skus.testPostNewSku(agent, mysku[0], 201);
        skus.testGetAllSkus(agent, mysku, 1, 200);
        skus.testEditSku(agent, myeditedskuToPut, 0, 0, 200);
        skus.testDeleteSku(agent, 0, 0, 204);
        skus.testPostNewSku(agent, mysku[0], 201);
        skus.testGetSkuById(agent, 0, 0, mysku[0], 200);
        positions.testPostNewPosition(agent, mypositions[0], 201);
        positions.testEditPosition(agent, updateposition, mypositions[0].positionID, 200);
        positions.testPostNewPosition(agent, mypositions[1], 201);
        positions.testDeletePosition(agent, mypositions[1].positionID, 204);
        positions.deleteAllPositions(agent);
        positions.testPostNewPosition(agent, mypositions[0], 201);
        positions.testPostNewPosition(agent, mypositions[1], 201);
        positions.testGetAllPositions(agent, 2, 200);
        positions.testEditPositionChangeID(agent, newpositionid, mypositions[1].positionID, 200);
        skus.deleteAllSkus(agent);
        skus.testPostNewSku(agent, mysku[0], 201);
        skus.testPostNewSku(agent, mysku[1], 201);
        skus.testGetAllSkus(agent, mysku, 2, 200);
        skuitems.testPostNewSkuItem(agent, myskuitems[0], 201);
        skuitems.testPostNewSkuItem(agent, myskuitems[1], 201);
        testdescriptors.testPostNewTestDescriptor(agent, mytd[0], 201);
        restockorders.deleteAllRestockOrders(agent);
        skuitems.deleteAllSkuItems(agent);      
        skus.deleteAllSkus(agent);
        users.testDeleteAllNotManagerUsers(agent);
        skus.testPostNewSku(agent, mysku[0], 201);
        skus.testPostNewSku(agent, mysku[1], 201);
        skus.testGetAllSkus(agent, mysku, 2, 200);
        users.testPostNewUser(agent, myuser, 201);
        users.testPostNewUser(agent, mysupp, 201);
        users.testGetAllUsers(agent, 200);
        skuitems.testPostNewSkuItem(agent, myskuitems[0], 201);
        skuitems.testPostNewSkuItem(agent, myskuitems[1], 201);
        users.testGetAllSuppliers(agent);
        restockorders.testPostNewRestockOrder(agent, myrestocks[0], 201);
        skuitems.testPostNewSkuItem(agent, myskuitems[2], 201);
        skuitems.testPostNewSkuItem(agent, myskuitems[3], 201);
        restockorders.testEditRestockOrder(agent, "DELIVERED", 200);
        restockorders.testEditRestockOrderSkuItems(agent, addskuitems, 200);
        skuitems.deleteAllSkuItems(agent);      
        skus.deleteAllSkus(agent);
        testdescriptors.deleteAllTestDescriptors(agent);
        skus.testPostNewSku(agent, mysku[0],201);
        skus.testPostNewSku(agent, mysku[1],201);
        skus.testGetAllSkus(agent, mysku,2,200);
        skuitems.testPostNewSkuItem(agent, myskuitems[0], 201);
        skuitems.testPostNewSkuItem(agent, myskuitems[1], 201);
        testdescriptors.testPostNewTestDescriptor(agent, mytd[0], 201);
        skuitems.testEditSkuItem(agent, mynewskuitem, 200);

    });
}

function testFRCRUD(){
    describe('Testing Functional requirements pt2', () => {
        skucrud.testSkuCRUD(); 
        skuitemcrud.testSkuItemsCRUD(); 
        positioncrud.testPositionCRUD();
        testdescriptorcrud.testTestDescriptorCRUD();
        testresultcrud.testTestResultCRUD();
        usercrud.testUserCRUD();
        restockordercrud.testRestockOrderCRUD();
        retordcrud.testReturnOrderCRUD();
        intordcrud.testInternalOrderCRUD();
        itemcrud.testItemCRUD();
    });
}