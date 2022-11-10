class Item {
  constructor() {
    this.dao = require("../db/dao");
  }

  async init() {
    try {
      await this.getItems();
    } catch (error) {
      await this.createTable();
      
      console.log('Item Table created')
    }
  }

  createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS item (
          id INTEGER NOT NULL,
          description VARCHAR,
          price DOUBLE NOT NULL,
          SKUId INTEGER NOT NULL,
          supplierId INTEGER NOT NULL,
          FOREIGN KEY(SKUId) 
          REFERENCES sku(id),
          FOREIGN KEY(supplierId)  
          REFERENCES user(id),
          PRIMARY KEY (supplierId, id),
          UNIQUE (supplierId, SKUId)
          )`;
    return this.dao.run(sql)
  }

  new(item) {
    console.log(item)
    return this.dao.run(
      `INSERT INTO item (id, description, price, SKUId, supplierId)
            VALUES (?, ?, ?, ?, ?)`,
      [item.id, item.description, item.price, item.SKUId, item.supplierId])
  }
  
  update(id, supplierId, newItem) {
    return this.dao.run(
      `UPDATE item SET description = ?, price = ?
            WHERE id = ? AND supplierId == ?`,
      [newItem.newDescription, newItem.newPrice, id, supplierId])
  }

  delete(id, supplierId) {
    return this.dao.run(
      `DELETE FROM item WHERE id = ? AND supplierId = ?`, 
      [id, supplierId]
    )
  }

  getItem(id, supplierId) {
    return this.dao.get(
      `SELECT *
      FROM item
      WHERE id = ? AND supplierId =?`,
      [id, supplierId]
    )
  }


  //OLD API BEFORE CHANGE1
  /*
  update(id, newItem) {
    return this.dao.run(
      `UPDATE item SET description = ?, price = ?
            WHERE id = ?`,
      [newItem.newDescription, newItem.newPrice, id])
  }
 
  delete(id) {
    return this.dao.run(
      `DELETE FROM item WHERE id = ?`, 
      [id]
    )
  }

   getItem(id) {
    return this.dao.get(
      `SELECT *
      FROM item
      WHERE id = ?`,
      [id]
    )
  }

  */

  getItems() {
    return this.dao.all(
      `SELECT *
      FROM item`
    )
  }

  drop(){
    return this.dao.run(
      `DROP TABLE item`
    )
  }

  deleteAll(){
    return this.dao.run(
      `DELETE FROM item`
    )
  }

}


module.exports = Item;