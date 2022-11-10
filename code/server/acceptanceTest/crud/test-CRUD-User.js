const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../../server'); 
var agent = chai.request.agent(app);
const users = require('../utils-users');

testUserCRUD();

function testUserCRUD(){
    myuser = users.newCompleteUser('user1@ezwh.com','John', 'Smith', 'testpassword', 'customer');
    
    describe('Test user CRUD features', ()=>{
        users.testDeleteUser(agent, myuser.username, myuser.type, 204);
        users.testDeleteUser(agent, 'erruser', myuser.type, 422);
        users.testDeleteUser(agent, myuser.username, 'errtype', 422);
        users.testDeleteUser(agent, 'manager1@ezwh.com', 'manager', 422);
        users.testPostNewUser(agent, myuser,201);
        users.testEditUser(agent, {"oldType":"customer", "newType":"clerk"}, myuser.username, 200);
        users.testEditUser(agent, {"oldType":"customer", "newType":"clerk"}, myuser.username, 404);
        users.testEditUser(agent, {"oldType":"customer", "newType":"clerk"}, 'notuser@aaa.com', 404);
        users.testEditUser(agent, null, 'notuser@aaa.com', 422);
    });
}

exports.testUserCRUD = testUserCRUD