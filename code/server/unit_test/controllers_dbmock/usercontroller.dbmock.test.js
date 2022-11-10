const UserController = require('../../controllers/usercontroller');
const { ConflictError } = require('../../middlewares/errors');
const user = require('../../models/mocks/mock_user')
jest.mock('../../models/user');

const c = new UserController(user)

describe('User controller test:', () => {

    describe('listUsers', () => {
        const usersList = [{
            id: 1,
            username: 'user@ezwh.it',
            name: 'pippo',
            surname: 'baudo',
            type: 'manager'
        },
        {
            id: 2,
            username: 'user2@ezwh.it',
            name: 'pippo2',
            surname: 'baudo2',
            type: 'customer'
        }]

        beforeEach(() => {
            user.getUsers.mockReset()
        })

        test('returns a list of users', async () => {
            user.getUsers.mockReturnValueOnce(usersList)
            result = await c.listsUsers()
            var exp = usersList.map(obj => ({ ...obj, email: obj.username }));
            expect(result).toEqual(exp)
        })
    })

    describe('listSuppliers', () => {
        const suppliersList = [{
            id: 3,
            username: 'user@ezwh.it',
            name: 'pippo',
            surname: 'baudo',
            type: 'supplier'
        },
        {
            id: 3,
            username: 'user2@ezwh.it',
            name: 'pippo2',
            surname: 'baudo2',
            type: 'supplier'
        }]

        beforeEach(() => {
            user.getSuppliers.mockReset()
        })

        test('returns a list of users suppliers', async () => {
            user.getSuppliers.mockReturnValueOnce(suppliersList)
            result = await c.listSuppliers()
            var exp = suppliersList.map(obj => ({ ...obj, email: obj.username }));
            expect(result).toEqual(exp)
        })
    })

    describe('login', () => {
        const username = "user@ezwh.it"
        const password = "12345678"
        const u = {
            id: 1,
            username: 'user@ezwh.it',
            name: 'pippo',
            surname: 'baudo',
        }

        beforeEach(() => {
            user.login.mockReset()
        })

        test('return the user corresponding to credentials', async () => {
            user.login.mockReturnValueOnce(u)
            result = await c.login(username, password)
            expect(result).toEqual(u)
        })

        test('returns undefined if the user is not found', async () => {
            user.login.mockReturnValueOnce(undefined)
            result = await c.login("", "")
            expect(result).toEqual(undefined)
        })

    })


    describe('newUser', () => {
        const u = {
            username: "user2@ezwh.com",
            name: "John",
            surname: "Smith",
            password: "1234567",
            type: "customer"
        }

        beforeEach(() => {
            user.checkUser.mockReset()
            user.new.mockReset()
        })

        test('return undefined if new user is added', async () => {
            user.checkUser.mockReturnValueOnce()
            user.new.mockReturnValueOnce()
            result = await c.newUser(u)
            expect(user.checkUser.mock.calls[0][0]).toBe(u.username)
            expect(user.checkUser.mock.calls[0][1]).toBe(u.type)
            expect(user.new.mock.calls[0][0]).toBe(u)
        })


        test('throws error if the user is already existing', async () => {
            user.checkUser.mockReturnValueOnce(true)
            expect(c.newUser(u))
                .rejects
                .toEqual(new ConflictError('Conflict'))
        })
    })



    describe('updateUser', () => {
        const u = {
            oldType: "supplier",
            newType: "clerk",
            name: 'pippo',
            surname: 'baudo',
        }
        const username = "user2@ezwh.com"

        beforeEach(() => {
            user.update.mockReset()
        })

        test('pass to update the combination of user and username', async () => {
            user.update.mockReturnValueOnce()
            result = await c.updateUser(u, username)
            expect(user.update.mock.calls[0][0]).toEqual(u.oldType)
            expect(user.update.mock.calls[0][1]).toEqual(u.newType)
            expect(user.update.mock.calls[0][2]).toEqual(username)
        })

    })


    describe('deleteUser', () => {
        const username = "user@ezwh.it"
        const type = "supplier"

        beforeEach(() => {
            user.delete.mockReset()
        })

        test('pass to delete the username and the type', async () => {
            user.delete.mockReturnValueOnce()
            result = await c.deleteUser(username, type)
            expect(user.delete.mock.calls[0][0]).toEqual(username)
            expect(user.delete.mock.calls[0][1]).toEqual(type)
        })

    })

})