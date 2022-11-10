class Sku {
  constructor() {
    this.dao = require("../db/dao");
  }

  async init() {
    try {
      await this.getSkus();
    } catch (error) {
      await this.createTable();
      
      console.log('SKU Table created')
    }
  }

  createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS sku (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          description VARCHAR NOT NULL,
          weight INTEGER NOT NULL,
          volume INTEGER NOT NULL,
          notes VARCHAR,
          availableQuantity INTEGER NOT NULL,
          price REAL NOT NULL,
          position VARCHAR(12),
          FOREIGN KEY(position) 
          REFERENCES position(positionID)
          ON UPDATE CASCADE
          ON DELETE SET NULL
          )`;
    return this.dao.run(sql)
  }

  new(sku) {
    return this.dao.run(
      `INSERT INTO sku (description, weight, volume, notes, price, availableQuantity)
            VALUES (?, ?, ?, ?, ?, ?)`,
      [sku.description, sku.weight, sku.volume, sku.notes, sku.price, sku.availableQuantity])
  }

  update(id, newSku) {
    return this.dao.run(
      `UPDATE sku SET description = ?, weight = ?, volume = ?, notes = ?, price = ?, availableQuantity = ?
            WHERE id = ?`,
      [newSku.newDescription, newSku.newWeight, newSku.newVolume, newSku.newNotes, newSku.newPrice, newSku.newAvailableQuantity, id])
  }

  updatePosition(id, position) {
    return this.dao.run(
      `UPDATE sku SET position = ?
            WHERE id = ?`,
      [position, id])
  }

  delete(id) {
    return this.dao.run(
      `DELETE FROM sku WHERE id = ?`,
      [id]
    )
  }


  getSkus() {
    return this.dao.all(
      `SELECT *
      FROM sku`
    )
  }

  getSku(id) {
    return this.dao.get(
      `SELECT *
      FROM sku
      WHERE id = ?`,
      [id]
    )
  }

  drop(){
    return this.dao.run(
      `DROP TABLE sku`
    )
  }
  
  deleteAll(){
    return this.dao.run(
      `DELETE FROM sku`
    )
  }
}

module.exports = Sku;