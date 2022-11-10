class User {
  constructor() {
    this.dao = require("../db/dao");
  }

  async init() {
    try {
      await this.getUsers();
    } catch (error) {
      await this.createTable();
      await this.new({
        username: "manager1@ezwh.com",
        name: "pippo1",
        surname: "baudo1",
        password: "testpassword",
        type: "manager"
      });
      await this.new({
        username: "user1@ezwh.com",
        name: "pippo2",
        surname: "baudo2",
        password: "testpassword",
        type: "customer"
      });
      await this.new({
        username: "qualityEmployee1@ezwh.com",
        name: "pippo3",
        surname: "baudo3",
        password: "testpassword",
        type: "qualityEmployee"
      });
      await this.new({
        username: "clerk1@ezwh.com",
        name: "pippo4",
        surname: "baudo4",
        password: "testpassword",
        type: "clerk"
      });
      await this.new({
        username: "deliveryEmployee1@ezwh.com",
        name: "pippo5",
        surname: "baudo5",
        password: "testpassword",
        type: "deliveryEmployee"
      });
      await this.new({
        username: "supplier1@ezwh.com",
        name: "pippo6",
        surname: "baudo6",
        password: "testpassword",
        type: "supplier"
      });
    }
  }

  createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username VARCHAR,
          name VARCHAR,
          surname VARCHAR,
          password VARCHAR,
          type VARCHAR)`;
    console.log('User Table is beeing created')
    return this.dao.run(sql)

  }

  new(user) {
    return this.dao.run(
      `INSERT INTO user (username, name, surname, password, type)
            VALUES (?, ?, ?, ?, ?)`,
      [user.username, user.name, user.surname, user.password, user.type])
  }

  getUsers() {
    return this.dao.all(
      `SELECT id,
          username,
          name,
          surname,
          type FROM user
          WHERE type<>"manager"`
    )
  }

  getUser(id) {
    return this.dao.get(
      `SELECT id,
          username,
          name,
          surname,
          type FROM user
          WHERE id = ?`,
      [id]
    )
  }

  getSuppliers() {
    return this.dao.all(
      `SELECT id,
          username,
          name,
          surname,
          type FROM user
          WHERE type="supplier"`
    )
  }

  login(username, password) {
    return this.dao.get(
      `SELECT id,
            username,
            name,
            surname,
            type FROM user
            WHERE username=? AND password=?`,
      [username, password]
    )
  }

  checkUser(username, type) {
    return this.dao.get(
      `SELECT id 
       FROM user
       WHERE username=? AND type=?`,
      [username, type]
    )
  }

  update(oldType, newType, username) {
    return this.dao.run(
      `UPDATE user 
       SET type = ?
       WHERE username=? AND type=?`,
      [newType, username, oldType]
    )
  }

  delete(username, type) {
    return this.dao.run(
      `DELETE  
       FROM user
       WHERE username=? AND type=?`,
      [username, type]
    )
  }

  drop() {
    return this.dao.run(
      `DROP TABLE user`
    )
  }

  deleteAll() {
    return this.dao.run(
      `DELETE FROM user`
    )
  }
}


module.exports = User;