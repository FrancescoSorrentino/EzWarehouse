const dao = require('../../db/dao');
const User = require('../../models/user')
const UserController = require('../../controllers/usercontroller');
const { ConflictError } = require('../../middlewares/errors');
const user = new User();
const userc = new UserController(user)
const { clearDB } = require('../../db/reset');
const path = './db/ezdb.sqlite3'

describe('User tests cases', () => {

    describe("login", () => {
        const usersList = [{
            username: 'user111@ezwh.it',
            name: 'pippo',
            surname: 'baudo',
            password: 'testpassword',
            type: 'clerk'
        },
        {
            username: 'user112@ezwh.it',
            name: 'pippo2',
            surname: 'baudo2',
            password: 'testpassword',
            type: 'customer'
        }]

        beforeEach(async () => {
            jest.setTimeout(10000)
            dao.connect(path)
            try {
                await user.createTable();
            } catch (err) { }
            await user.delete('user111@ezwh.it', 'clerk')
            await user.delete('user112@ezwh.it', 'customer')
            await user.new(usersList[0])
            await user.new(usersList[1])
        });

        test('The user exists, login succesfull', async () => {
            let res = await userc.login('user112@ezwh.it', 'testpassword')
            expect(res).toEqual({
                id: res.id,
                username: 'user112@ezwh.it',
                name: 'pippo2',
                surname: 'baudo2',
                type: 'customer'
            });
        });

        test("The user doesn't exists, login failed", async () => {
            let res = await userc.login('user113@ezwh.it', 'testpassword')
            expect(res).toBeUndefined()
        });

        afterEach(async () => {
            await user.drop()
        })



    });

    describe("new", () => {
        const usersList = [{
            username: 'user111@ezwh.it',
            name: 'pippo',
            surname: 'baudo',
            password: 'testpassword',
            type: 'clerk'
        },
        {
            username: 'user112@ezwh.it',
            name: 'pippo2',
            surname: 'baudo2',
            password: 'testpassword',
            type: 'customer'
        }]

        beforeEach(async () => {
            jest.setTimeout(10000)
            // await dao.connect(path)
            try {
                await user.createTable();
            } catch (err) { }
            //await user.delete('user112@ezwh.it', 'customer')
            await user.new(usersList[1])

        });

        test("The user doesn't exists, creation success", async () => {
            let res = await userc.newUser(usersList[0])
            expect(res).toBeUndefined()
        });

        test("The user exists, creation failed", async () => {
            try {
                await userc.newUser(usersList[1])
            }
            catch (e) {
                expect(e).toBeInstanceOf(ConflictError)
            }
        });

        afterAll(async () => {
            await clearDB()
        })

    })
})