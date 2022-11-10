const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../../server'); 
var agent = chai.request.agent(app);

const skus = require('../utils-sku');
const skuitems = require('../utils-skuitems');
const testdescriptors = require('../utils-testdescriptor');
const testresults = require('../utils-testresult');

testTestResultCRUD();

function testTestResultCRUD(){
    let mysku = []
    mysku[0] = skus.newSku('a','b',20,30,40,10);
    mysku[1] = skus.newSku('c','d',40,30,20,10);
    
    let rfids = [];
    rfids[0] = '12345678901234567890123456789015';
    rfids[1] = '12345678901234567890123456789016';
    rfids[2] = '12345678901234567890123456789017';
    rfids[3] = '12345678901234567890123456789018';
    let validrfid = '12345678901234567890123456789015';
    let notexistingrfid = '02345678901234567890123456789015';
    
    let myskuitems = [];
    myskuitems[0] = skuitems.newSkuItem(rfids[0], 0, '2021/11/29 12:30');
    myskuitems[1] = skuitems.newSkuItem(rfids[1], 0, '2021/11/29 21:45');
    
    let mytd = [];
    mytd[0] = testdescriptors.newTestDescriptor('td1','descr1',0);

    let mytestresults = [];
    mytestresults[0] = testresults.newTestResult(rfids[0], 0, "2022/05/06", true);
    
    describe('Test TestResult CRUD', () => {
        testdescriptors.deleteAllTestDescriptors(agent); 
        skuitems.deleteAllSkuItems(agent);      
        skus.deleteAllSkus(agent);
        skus.testPostNewSku(agent, mysku[0],201);
        skus.testPostNewSku(agent, mysku[1],201);
        skus.testGetAllSkus(agent, mysku,2,200);
        skuitems.testPostNewSkuItem(agent, myskuitems[0], 201);
        skuitems.testPostNewSkuItem(agent, myskuitems[1], 201);
        testdescriptors.testPostNewTestDescriptor(agent, mytd[0], 201);
        testdescriptors.testGetAllTestDescriptors(agent,1, mytd, 200);
        testresults.testGetTestResultByRFID(agent, 200, rfids[0]);
        testresults.testDeleteAllTestResultByRFID(agent, 200, rfids[0]);
        //POST
        testresults.testPostNewTestResult(agent, mytestresults[0], 201);
        testresults.testPostNewTestResultBadRFID(agent, 404, notexistingrfid);
        testresults.testPostNewTestResultBadRFID(agent, 422, '0');
        //GET
        testresults.testGetTestResultByRFID(agent, 200, validrfid);
        testresults.testGetTestResultByWrongRFID(agent, 422, null);
        testresults.testGetTestResultByWrongRFID(agent, 404, notexistingrfid);
        testresults.testGetTestResultByRFIDandID(agent, 200, validrfid);
        testresults.testGetTestResultByWrongRFIDandID(agent, 404, notexistingrfid);
        //PUT
        testresults.testEditTestResultByRFIDandID(agent, 200, validrfid);
        testresults.testEditTestResultByWrongRFIDandID(agent, 404, notexistingrfid);
        testresults.testEditTestResultByWrongRFIDandID(agent, 422, null);
        // DELETE
        testresults.testGetTestResultByRFID(agent, 200, rfids[0]);
        testresults.testDeleteTestResultByRFIDandID(agent, 204,rfids[0]);
        testresults.testDeleteAllTestResultByRFID(agent, 200, rfids[0]);        
        skuitems.deleteAllSkuItems(agent);      
        skus.deleteAllSkus(agent);
        testdescriptors.deleteAllTestDescriptors(agent);
    });

}

exports.testTestResultCRUD = testTestResultCRUD
