const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

const app = require('../../server'); 
var agent = chai.request.agent(app);

const skus = require('../utils-sku');

testSkuCRUD();

function testSkuCRUD() {

    let mysku = [], myeditedsku = [];
    let myeditedskuToPut = skus.newSkuEdit('sku', 'note', 50, 50, 50, 50);
    let p = skus.newPosition('8002345434122');
    mysku[0] = skus.newSku('a','b',20,30,40,30);
    myeditedsku[0] = skus.newSku('sku', 'note', 50, 50, 50, 50);
    
    describe('Test sku CRUD features', () => {
        skus.deleteAllSkus(agent);
        skus.testPostNewSku(agent, mysku[0],201);
        skus.testGetAllSkus(agent, mysku, 1, 200);
        skus.testGetSkuById(agent, null, 0, mysku, 422);
        skus.testEditSku(agent, myeditedskuToPut, null, 0, 422);
        skus.testGetSkuById(agent, null, 0, myeditedsku, 422);        
        skus.testNewPosition(agent, p, null, 0, 422);        
        skus.testDeleteSku(agent, null, 0, 204);
        skus.testGetAllSkus(agent, null,0, 200);
        skus.testGetSkuById(agent, null,0, null, 422);
        skus.testPostNewSku(agent, '{dd:s', 422);
        skus.testPostNewSku(agent, '<tag>345</tag>', 422);
        skus.testPostNewSku(agent, skus.newSku('sku', 'note', -50, 50, 50, 50), 422);
        skus.testPostNewSku(agent, skus.newSku('sku', 'note', 50, -50, 50, 50), 422);
        skus.testPostNewSku(agent, skus.newSku('sku', 'note', 50, 50, -50, 50), 422);
        skus.testPostNewSku(agent, skus.newSku('sku', 'note', 50, 50, 50, -50), 422);
        skus.testPostNewSku(agent, skus.newSku('sku', '', 50, 50, 50, 50), 422);
        skus.testPostNewSku(agent, skus.newSku('', 'note', 50, 50, 50, 50), 422);
        skus.testPostNewSku(agent, skus.newSku('skui', 'note', 50, 50, 50, 50), 201);
        skus.testPostNewSku(agent, skus.newSku('skui2', 'note', 50, 50, 50, 50), 201);
        skus.testPostNewSku(agent, skus.newSku('sku', 'note', 50, 50, 50.1, 50),422);
        skus.testPostNewSku(agent, skus.newSku('sku', 'note', '50x', 50, 50, 50),422);
        skus.testPostNewSku(agent, skus.newSku('sku', 'note', 50, '50x', 50, 50),422);
        skus.testPostNewSku(agent, skus.newSku('sku', 'note', 50, 50, '50.1x', 50),422);
        skus.testPostNewSku(agent, skus.newSku('sku', 'note', 50, 50, 50, '50x'),422);                
        skus.testGetSkuById(agent, 'w', null, null, 422);       
        skus.testGetSkuById(agent, '$', null, null, 422);
        skus.deleteAllSkus(agent);
    });
}

exports.testSkuCRUD = testSkuCRUD