const chai = require('chai');
const chaiHttp = require('chai-http');
const { it } = require('mocha');
chai.use(chaiHttp);
chai.should();
const { clearDB } = require('../db/reset');

(async function () {
    const app = await require('../server');
    const agent = chai.request.agent(app)


    describe('User Api Test', async () => {
        const username = "test1111@ezwh.it";
        const password = "gigachad@123456";
        const name = "giga";
        const surname = "chad";
        const type = "clerk";
        newUser("1", 201, username, password, name, surname, type)
        newUser("2", 409, username, password, name, surname, type)
        newUser("3", 422, "p", password, name, surname, type)
        newUser("4", 422, username, "p", name, surname, "CEO")
        deleteUser("1", 204, username, type)
        deleteUser("2", 422, "p", type)
        deleteUser("3", 422, username, "manager")

        after(async () => {
            console.log("AFTER")
            await clearDB()
        })
    });

    function deleteUser(desc, expectedHTTPStatus, username, type) {
        it('delete user: ' + desc, function (done) {
            agent.delete('/api/users/' + username + '/' + type)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                });
        });
    }

    function newUser(desc, expectedHTTPStatus, username, password, name, surname, type) {
        it('new user: ' + desc, function (done) {
            const reqBody = { username: username, password: password, name: name, surname: surname, type: type };
            agent.post('/api/newUser')
                .send(reqBody)
                .then(function (response) {
                    response.should.have.status(expectedHTTPStatus);
                    done();
                });
        });
    }

    run();
})();