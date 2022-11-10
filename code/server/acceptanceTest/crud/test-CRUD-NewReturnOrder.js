const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../../server'); 
var agent = chai.request.agent(app);

const skus = require('../utils-sku');
const users = require('../utils-users');
const newreturnorders = require('../utils-new-returnorder');
const skuitems = require('../utils-skuitems');
const newrestockorders = require('../utils-new-restockorder');
const newitems = require('../utils-new-items')

testNewReturnOrderCRUD();

function testNewReturnOrderCRUD(){
    
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
    addskuitems[0] = {"SKUId":1, "itemId":1, "rfid":rfids[2]};
    addskuitems[1]= {"SKUId":1, "itemId":1, "rfid":rfids[3]};

    let myitems = [];
    myitems[0] = newitems.newItem(1, "desc0", 9.99, 0, 0);
    myitems[1] = newitems.newItem(2, "desc1", 199.99, 1, 0);

    let myproducts = [];
    myproducts[0] = newrestockorders.newProduct(0, 1, "descr0", 8.99, 1);
    myproducts[1] = newrestockorders.newProduct(1, 2, "descr1", 6.99, 1);

    let myrestocks = [];
    myrestocks[0] = newrestockorders.newRestockOrder("2022/05/16 09:33", myproducts, 0); 
    myrestocks[1] = newrestockorders.newRestockOrder("2022/05/17 19:00", myproducts, 0); 
    wrongsuppid = newrestockorders.newRestockOrder("2022/05/17 19:00", myproducts, 1);
    
    let myproductswithrfid = [];
    myproductswithrfid[0] = newreturnorders.newProductwithRFID(myproducts[0], rfids[2]);
    myproductswithrfid[1] = newreturnorders.newProductwithRFID(myproducts[1], rfids[3]);
        
    let myreturnorders = [];
    myreturnorders[0] = newreturnorders.newReturnOrder('2022/05/16 23:33', myproductswithrfid, 0);
    myreturnorderwithnosuppid = newreturnorders.newReturnOrder('2022/05/16 23:33', myproductswithrfid, 100000);
    myretnull = newreturnorders.newReturnOrder(null, null, 0);

    describe('Test CR1 ReturnOrder', ()=>{
        newreturnorders.deleteAllReturnOrders(agent);
        newreturnorders.testGetAllReturnOrders(agent, [], 200);
        newrestockorders.deleteAllRestockOrders(agent);
        newrestockorders.testGetAllRestockOrders(agent, [], 200);
        skuitems.deleteAllSkuItems(agent);   
        skuitems.testGetAllSkuItems(agent, 0, [], 200);   
        skus.deleteAllSkus(agent);
        skus.testGetAllSkus(agent, [], 0, 200);
        users.testDeleteAllNotManagerUsers(agent);
        skus.testPostNewSku(agent, mysku[0], 201);
        skus.testPostNewSku(agent, mysku[1], 201);
        skus.testGetAllSkus(agent, mysku, 2, 200);
        users.testPostNewUser(agent, myuser[0], 201);
        users.testPostNewUser(agent, myuser[1], 201);
        skuitems.testPostNewSkuItem(agent, myskuitems[0], 201);
        skuitems.testPostNewSkuItem(agent, myskuitems[1], 201);
        users.testGetAllSuppliers(agent);
        newitems.deleteAllItems(agent);
        newitems.testPostNewItem(agent, myitems[0], 201);
        newitems.testPostNewItem(agent, myitems[1], 201);
        newrestockorders.testPostNewRestockOrder(agent, myrestocks[0], 201);
        newrestockorders.testPostNewRestockOrder(agent, myrestocks[1], 201);
        newrestockorders.testGetAllRestockOrders(agent, myrestocks, 200);
        newrestockorders.testEditRestockOrder(agent, "DELIVERED", 200);
        newrestockorders.testEditRestockOrderSkuItems(agent, addskuitems, 200);
        newrestockorders.testGetAllRestockOrders(agent, myrestocks, 200);
        newrestockorders.testGetAllRestockIssued(agent, 200);
        newreturnorders.testPostNewReturnOrder(agent, myreturnorders[0], 201);
        newreturnorders.testPostNewReturnOrder(agent, myreturnorderwithnosuppid, 404);
        newreturnorders.testPostWrongNewReturnOrder(agent, myretnull, 422);
        newreturnorders.testGetAllReturnOrders(agent, myreturnorders, 200);
        newreturnorders.testGetReturnOrderById(agent, myreturnorders[0], 0, 200);
        // newreturnorders.deleteAllReturnOrders(agent);
        // newrestockorders.deleteAllRestockOrders(agent);
        // skuitems.deleteAllSkuItems(agent);      
        // skus.deleteAllSkus(agent);
    });
}

exports.testNewReturnOrderCRUD = testNewReturnOrderCRUD