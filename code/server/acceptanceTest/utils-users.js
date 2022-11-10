const ids = require('./utils-id');
//---------------------------------------------------------------------------------------------------------
//                                          USER DATA
//---------------------------------------------------------------------------------------------------------


const customer = newUser('user1@ezwh.com', 'testpassword', 'customer')
const qualityEmployee = newUser('qualityEmployee1@ezwh.com', 'testpassword', 'qualityEmployee');
const clerk = newUser('clerk1@ezwh.com','testpassword','clerk');
const delivery = newUser('deliveryEmployee1@ezwh.com', 'testpassword', 'deliveryEmployee');
const supplier = newUser('supplier1@ezwh.com','testpassword', 'supplier');
const manager = newUser('manager1@ezwh.com', 'testpassword', 'manager');


//---------------------------------------------------------------------------------------------------------
//                                          ENDPOINTS
//---------------------------------------------------------------------------------------------------------


const endpointLoginManager = '/api/managerSessions';
const endpointLoginCustomer = '/api/customerSessions';
const endpointLoginClerk = '/api/clerkSessions';
const endpointLoginQualityEmployee = '/api/qualityEmployeeSessions';
const endpointLoginDelivery = 'deliveryEmployeeSessions';
const endpointLoginSupplier = '/api/supplierSessions';


//---------------------------------------------------------------------------------------------------------
//                                          USER CREATION
//---------------------------------------------------------------------------------------------------------


function newUser (username, password, type) {
    return  {
        username: username,
        password: password ,
        type: type
    }
}

function newCompleteUser(username,name,surname,password,type){
    return {
        username:username,
        name:name,
        surname:surname,
        password:password,
        type:type
    };
}


//---------------------------------------------------------------------------------------------------------
//                                          DATA EXPORT
//---------------------------------------------------------------------------------------------------------


exports.customer = customer;
exports.qualityEmployee = qualityEmployee;
exports.clerk = clerk;
exports.delivery = delivery;
exports.supplier = supplier;
exports.manager =manager;
exports.endpointLoginManager = endpointLoginManager;
exports.endpointLoginClerk = endpointLoginClerk;
exports.endpointLoginCustomer = endpointLoginCustomer;
exports.endpointLoginQualityEmployee = endpointLoginQualityEmployee;
exports.endpointLoginDelivery = endpointLoginDelivery;
exports.endpointLoginSupplier = endpointLoginSupplier;

//---------------------------------------------------------------------------------------------------------
//                                          TEST ACTIONS
//---------------------------------------------------------------------------------------------------------


function testPostNewUser(agent, myuser, expCode){
    describe(' post /api/newUser', function(){
        it('FR 1.1 a -> Define a new user', function(done){
            agent.post('/api/newUser')
            .send(myuser)
            .then(function(res){
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));
        });
    });

}

function testDeleteUser(agent, username, type, expCode){
    describe(' delete /api/users/:username/:type', function(){
        it('FR 1.2 -> Delete a user', function(done){
            agent.delete('/api/users/'+username+'/'+type)
            .then(function(res){
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));
        })
    })
}

function testEditUser(agent, changetype, username,expCode){
    describe( ' put /api/users/:username', function(){
        it('FR 1.1 b -> Modify an existing user', function(done){
            agent.put('/api/users/'+username)
            .send(changetype)
            .then(function(res){
                res.should.have.status(expCode);
                done();
            }).catch(err=>done(err));
        });
    });
}

function testGetAllUsers(agent, expCode){
    describe(' get /api/users/', function(){
        it('FR 1.3 -> List all users', function(done){
            agent.get('/api/users')
            .then(function(res){
                res.should.have.status(expCode);
                res.body.should.be.a('array');
                for(let i=0; i<res.body.length; i++){
                    //console.log(res.body[i]);
                }
                done();
            }).catch(err=>done(err));
        })
    })
}

function testDeleteAllNotManagerUsers(agent){
    describe(' Delete all not manager', function(){
        it('Cleaning db user util', async function (){
            const res = await agent.get('/api/users');
            console.log(res.body);
            res.should.have.status(200);
            if (res.body.length !==0) {
                let res2;
                for(let i=0; i<res.body.length; i++){
                    console.log(res.body[i].email);
                    res2 = await
                    agent.delete('/api/users/'+res.body[i].email+'/'+res.body[i].type);
                    console.log(res2.body);
                    res2.should.have.status(204);
                    console.log("Deleted "+ res.body[i].email);                    
                }                
            }
            console.log("done!");
        });
    });
}

function testGetAllSuppliers(agent){
    describe(' get /api/suppliers', function(){
        it(' get all suppliers', function(done){
            let idsupp = [];
            agent.get('/api/suppliers')
            .then(function(res){
                for(let i=0; i<res.body.length; i++){
                    idsupp[i] = res.body[i].id;
                }
                ids.setIdSuppliers(idsupp);
                //console.log(res.body);
                done();
            }).catch(err=>done(err));
        });
    });
}

exports.newCompleteUser = newCompleteUser
exports.testPostNewUser = testPostNewUser
exports.testDeleteUser = testDeleteUser
exports.testEditUser = testEditUser
exports.testGetAllUsers = testGetAllUsers
exports.testDeleteAllNotManagerUsers = testDeleteAllNotManagerUsers
exports.testGetAllSuppliers = testGetAllSuppliers