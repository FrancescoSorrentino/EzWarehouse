const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

const app = require('../../server'); 
var agent = chai.request.agent(app);

const users = require('../utils-users');
const positions = require('../utils-positions');

testPositionCRUD();

function testPositionCRUD(){

    let mypositions = [];
    mypositions[0] = positions.newPosition("800134543412", "8001", "3454", "3412", 1000, 1000);
    mypositions[1] = positions.newPosition("800234553413", "8002", "3455", "3413", 10, 100);
    let mypositionwrong = positions.newPosition("1","2","3","4", -10, -20);
    
    let updateposition =    {
        "newAisleID": "8002",
        "newRow": "3454",
        "newCol": "3412",
        "newMaxWeight": 1200,
        "newMaxVolume": 600,
        "newOccupiedWeight": 200,
        "newOccupiedVolume":100
    }
    let updatepositionerrbody =    {
        "newAisleID": "8010",
        "newRow": "3454",
        "newCol": "3412",
        "newMaxWeight": 1200,
        "newMaxVolume": -600,
        "newOccupiedWeight": 200,
        "newOccupiedVolume":100
    }

    let notfoundpositionid = '000000000000'
    let newpositionid = {
        "newPositionID":"800134543412"
    }
    
    describe('test positions CRUD features', () =>{
        // db cleaning
        positions.deleteAllPositions(agent);
        //POST
        positions.testPostNewPosition(agent, mypositions[0], 201);
        positions.testPostNewPosition(agent,mypositionwrong, 422);
        positions.testPostNewPosition(agent,null, 422);
        positions.testPostNewPosition(agent, mypositions[1], 201);
        //GET
        positions.testGetAllPositions(agent, 2,  200);
        //PUT
        positions.testEditPosition(agent, updateposition, mypositions[0].positionID, 200);
        positions.testEditPosition(agent, updateposition, notfoundpositionid, 404);
        positions.testEditPosition(agent, updatepositionerrbody, mypositions[1].positionID, 422);
        positions.testEditPositionChangeID(agent, newpositionid, mypositions[1].positionID, 200);
        positions.testEditPositionChangeID(agent, newpositionid, notfoundpositionid, 404);
        positions.testEditPositionChangeID(agent, "800134543419", mypositions[1].positionID, 422); //uprocessable body
        //DELETE
        positions.testDeletePosition(agent, newpositionid.newPositionID, 204);
        positions.testDeletePosition(agent, "somethingwrong", 422);
    });       
}

exports.testPositionCRUD = testPositionCRUD
