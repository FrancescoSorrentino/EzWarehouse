const dao = require('../../db/dao');
const path = './db/ezdb.sqlite3'
const User = require('../../models/user')
const user = new User()
const { clearDB } = require('../../db/reset');

describe('testUserDao', () => {
    beforeAll(async () => {
        jest.setTimeout(14000)
        await dao.connect(path);
        try {
            await user.deleteAll()
            await user.drop();
        } catch (e) { }
        await user.createTable();
    });

    test('delete db', async () => {
        var res = await user.getUsers();
        expect(res.length).toStrictEqual(0);
    });

    testNewUser('usertest@ezwh.it', 'Pietro', 'Smusi', 'testpassword', 'customer');

    afterAll(async()=>{
        await clearDB()
    })

});

function testNewUser(username, name, surname, password, type) {
    test('create new user', async () => {
        const newUser = {username: username, name: name, surname: surname, password: password, type: type}
        let u = await user.new(newUser);
        
        let res = await user.getUsers();
        expect(res.length).toStrictEqual(1);
        
        res = await user.getUser(u.id);

        expect(res.username).toStrictEqual(username);
        expect(res.name).toStrictEqual(name);
        expect(res.surname).toStrictEqual(surname);
        expect(res.type).toStrictEqual(type);
    });
}
