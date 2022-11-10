const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../../server'); 
var agent = chai.request.agent(app);

const skus = require('../utils-sku');
const users = require('../utils-users');
const returnorders = require('../utils-returnorder');
const skuitems = require('../utils-skuitems');
const restockorders = require('../utils-restockorder');

testReturnOrderCRUD();

function testReturnOrderCRUD(){
    
    let mysku = []
    mysku[0] = skus.newSku('a','b',20,30,40,10);
    mysku[1] = skus.newSku('c','d',40,30,20,10);
    
    let myuser  = [];
    myuser[0] = users.newCompleteUser("supp1@ezwh.com", "supName", "supSur", "testpassword", "supplier");
    myuser[1] = users.newCompleteUser("supp2@ezwh.com", "supName2", "supSur2", "testpassword", "supplier");

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

    let addskuitems = [];
    addskuitems[0] = {"SKUId":0, "rfid":rfids[2]};
    addskuitems[1]= {"SKUId":1, "rfid":rfids[3]};


    let myproducts = [];
    myproducts[0] = restockorders.newProduct(0, "descr1", 8.99, 30);
    myproducts[1] = restockorders.newProduct(1, "descr2", 6.99, 20);

    let myrestocks = [];
    myrestocks[0] = restockorders.newRestockOrder("2022/05/16 09:33", myproducts, 0); 
    myrestocks[1] = restockorders.newRestockOrder("2022/05/17 19:00", myproducts, 1); 
    
    let myproductswithrfid = [];
    myproductswithrfid[0] = returnorders.newProductwithRFID(myproducts[0], rfids[2]);
    myproductswithrfid[1] = returnorders.newProductwithRFID(myproducts[1], rfids[3]);
        
    let myreturnorders = [];
    myreturnorders[0] = returnorders.newReturnOrder('2022/05/16 23:33', myproductswithrfid, 0);
    myreturnorderwithnosuppid = returnorders.newReturnOrder('2022/05/16 23:33', myproductswithrfid, 100000);
    myretnull = returnorders.newReturnOrder(null, null, 0);

    describe('Test ReturnOrder CRUD features', ()=>{
        returnorders.deleteAllReturnOrders(agent);
        restockorders.deleteAllRestockOrders(agent);
        skuitems.deleteAllSkuItems(agent);      
        skus.deleteAllSkus(agent);
        users.testDeleteAllNotManagerUsers(agent);
        skus.testPostNewSku(agent, mysku[0], 201);
        skus.testPostNewSku(agent, mysku[1], 201);
        skus.testGetAllSkus(agent, mysku, 2, 200);
        users.testPostNewUser(agent, myuser[0], 201);
        users.testPostNewUser(agent, myuser[1], 201);
        skuitems.testPostNewSkuItem(agent, myskuitems[0], 201);
        skuitems.testPostNewSkuItem(agent, myskuitems[1], 201);
        users.testGetAllSuppliers(agent);
        restockorders.testPostNewRestockOrder(agent, myrestocks[0], 201);
        restockorders.testPostNewRestockOrder(agent, myrestocks[1], 201);
        restockorders.testGetAllRestockOrders(agent, myrestocks, 200);
        restockorders.testGetAllRestockIssued(agent, 200);
        restockorders.testEditRestockOrder(agent, "DELIVERED", 200);
        restockorders.testEditRestockOrderSkuItems(agent, addskuitems, 200);
        restockorders.testGetAllRestockOrders(agent, myrestocks, 200);
        restockorders.testGetAllRestockIssued(agent, 200);
        returnorders.testPostNewReturnOrder(agent, myreturnorders[0], 201);
        returnorders.testPostNewReturnOrder(agent, myreturnorderwithnosuppid, 404);
        returnorders.testPostWrongNewReturnOrder(agent, myretnull, 422);
        returnorders.testGetAllReturnOrders(agent, myreturnorders, 200);
        returnorders.testGetReturnOrderById(agent, myreturnorders[0], 0, 200);
        returnorders.testGetWrongReturnOrderById(agent, 1000000, 404);
        returnorders.testGetWrongReturnOrderById(agent, null, 422);
    });
}

exports.testReturnOrderCRUD = testReturnOrderCRUD