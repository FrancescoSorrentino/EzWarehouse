const { ConflictError } = require('../middlewares/errors');

//-----------------------------//


class UserController {
    constructor(user) {
        this.user = user
    }

    listsUsers = async () => {
        var result = await this.user.getUsers()
        result = result.map(obj => ({ ...obj, email: obj.username }));
        return result;
    }

    listSuppliers = async () => {

        result = await this.user.getSuppliers()
        result = result.map(obj => ({ ...obj, email: obj.username }));
        return result;
    }

    login = async (username, password) => {
        /*
        let type = req.url.split("/")[1].replace("Sessions", "");
        let username = req.body.username;
        let password = req.body.password;
        */

        let result = await this.user.login(username, password);
        return result;
    }

    newUser = async (u) => {
        let exist = await this.user.checkUser(u.username, u.type);
        if (exist) {
            throw new ConflictError("Conflict");
        }
        await this.user.new(u);
        return
    }

    updateUser = async (u, username) => {
        return await this.user.update(u.oldType, u.newType, username);
    }

    deleteUser = async (username, type) => {
        await this.user.delete(username, type);
        return
    }

}

module.exports = UserController;