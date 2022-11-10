class SkuItem {
  constructor() {
    this.dao = require("../db/dao");
  }

  async init() {
    try {
      await this.listsSkuItems();
    } catch (error) {
      await this.createTable();
      
      console.log('SKU Item Table created')
    }
  }

  createTable() {
    const sql = `
            CREATE TABLE IF NOT EXISTS skuitems (
              RFID TEXT PRIMARY KEY,
              SKUId INTEGER NOT NULL,
              Available INTEGER,
              DateOfStock TEXT,
              FOREIGN KEY (SKUId)
              REFERENCES sku (id))
              `;

    return this.dao.run(sql)
  }

  drop(){
    return this.dao.run(
      `DROP TABLE skuitems`
    )
  }

  new(skuitem) {
    return this.dao.run(
      `INSERT INTO skuitems (RFID, SKUId, Available, DateOfStock)
                  VALUES (?, ?, ?, ?)`,
      [skuitem.RFID, skuitem.SKUId, "0", skuitem.DateOfStock])
  }

  deleteAll(){
    return this.dao.run(
      `DELETE FROM skuitems`
    )
  }

  update(newItem, oldRFID) {
    return this.dao.run(
      `UPDATE skuitems SET RFID = ?, Available = ?, DateOfStock = ?
                  WHERE RFID = ?`,
      [newItem.newRFID, newItem.newAvailable, newItem.newDateOfStock, oldRFID])
  }

  delete(rfid) {
    return this.dao.run(
      `DELETE FROM skuitems WHERE RFID = ?`,
      [rfid]
    )
  }

  listsSkuItems() {
    return this.dao.all(
      `SELECT *
            FROM skuitems`
    )
  }

  getItemsBySkuId(skuid) {
    return this.dao.all(
      `SELECT *
            FROM skuitems
            WHERE SKUId = ? AND Available = 1`,
      [skuid])
  }

  getItem(rfid) {
    return this.dao.get(
      `SELECT *
            FROM skuitems
            WHERE RFID = ?`,
      [rfid])
  }

  setAvailability(rfid) {
    return this.dao.run(
      `UPDATE skuitems SET Available = 0
      WHERE RFID = ?`,
      [rfid])
  }

  drop(){
    return this.dao.run(
      `DROP TABLE skuitems`
    )
  }

  deleteAll(){
    return this.dao.run(
      `DELETE FROM skuitems`
    )
  }
}

module.exports = SkuItem;