const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

const app = require('../../server'); 
var agent = chai.request.agent(app);

const testdescriptors = require('../utils-testdescriptor');
const users = require('../utils-users');
const skus = require('../utils-sku');
const skuitems = require('../utils-skuitems');

testTestDescriptorCRUD();

function testTestDescriptorCRUD(){
    let mysku = [];
    mysku[0] = skus.newSku('a','b',20,30,40,10);
    mysku[1] = skus.newSku('c','d',40,30,20,10);

    let mytd = [];
    mytd[0] = testdescriptors.newTestDescriptor('td1','descr1',0);
    mytd[1] = testdescriptors.newTestDescriptor('td2','descr2',1);
    mytdbad1 = testdescriptors.newTestDescriptor(null,'descrbad1',0);
    mytdbad2 = testdescriptors.newTestDescriptor('tdbad2',null,0);
    mytdbad3 = testdescriptors.newTestDescriptor('tdbad3','descrbad3', 100000000);
    mytdbad4 = testdescriptors.newTestDescriptor('tdbad4','descrbad4', null);
    newtd0 = testdescriptors.newTestDescriptor('newtd1', 'newdescr1',1);
    newtdwrongidsku = testdescriptors.newTestDescriptor('wrongnewtd1', 'wrongnewdescr1',1000000);
    
    describe('Test TestDescriptor CRUD features', () =>{
        // db cleaning
        testdescriptors.deleteAllTestDescriptors(agent);
        skuitems.deleteAllSkuItems(agent);      
        skus.deleteAllSkus(agent);
        skus.testPostNewSku(agent, mysku[0],201);
        skus.testPostNewSku(agent, mysku[1],201);
        skus.testGetAllSkus(agent, mysku,2,200);
        //POST
        testdescriptors.testPostNewTestDescriptor(agent, mytd[0], 201);
        testdescriptors.testGetAllTestDescriptors(agent, 1, mytd, 200);
        testdescriptors.testPostNewTestDescriptor(agent, mytdbad1, 422);
        testdescriptors.testPostNewTestDescriptor(agent, mytdbad2, 422);
        testdescriptors.testPostNewTestDescriptor(agent, mytdbad3, 404);
        testdescriptors.testPostNewTestDescriptor(agent, mytdbad4, 422);
        testdescriptors.testPostEmptyBodyTestDescriptor(agent, 422);   
        //GET
        testdescriptors.testPostNewTestDescriptor(agent, mytd[1], 201);
        testdescriptors.testGetAllTestDescriptors(agent, 2, mytd, 200);
        testdescriptors.testGetTestDescriptorById(agent, 0, mytd[0], 200);
        testdescriptors.testGetTestDescriptorById(agent, 100, mytd[0], 404);
        testdescriptors.testGetTestDescriptorById(agent, null, mytd[0], 422);
        //PUT
        testdescriptors.testModifyTestDescriptorById(agent, newtd0, 0, 200);
        testdescriptors.testGetTestDescriptorById(agent, 0, newtd0, 200);
        testdescriptors.testModifyTestDescriptorById(agent, newtd0, 10000, 404);
        testdescriptors.testModifyTestDescriptorById(agent, newtdwrongidsku, 0, 404);
        testdescriptors.testModifyTestDescriptorEmptyBody(agent, 422);
        //DELETE
        testdescriptors.testDeleteTestDescriptorById(agent, 0, 204);
        let mynewtd = [];
        mynewtd[0] = mytd[1];
        testdescriptors.testGetAllTestDescriptors(agent, 1, mynewtd, 200);
        testdescriptors.testDeleteTestDescriptorById(agent, null, 422);
    });
}

exports.testTestDescriptorCRUD = testTestDescriptorCRUD