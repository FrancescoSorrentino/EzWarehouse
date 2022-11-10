class TestDescriptor {
  constructor() {
    this.dao = require("../db/dao");
    // this.init()
  }
  async init() {
    try {
      await this.getTestDescriptors();
    } catch (error) {
      await this.createTable();
      
      console.log("Test Descriptor Table created.");
    }
  }

  createTable() {
    const sql = `--sql
      CREATE TABLE IF NOT EXISTS testdescriptor(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR NOT NULL,
        procedureDescription VARCHAR,
        idSKU INTEGER NOT NULL,
        FOREIGN KEY(idSKU) 
        REFERENCES sku(id)
        ON DELETE CASCADE
      ) `;
    return this.dao.run(sql);
  }

  new(td) {
    return this.dao.run(
      `INSERT INTO testdescriptor(name,procedureDescription,idSKU)
          VALUES(?,?,?)`,
      [td.name, td.procedureDescription, td.idSKU]
    );
  }
  update(id, newtd) {
    return this.dao.run(
      `UPDATE testdescriptor SET name = ?, procedureDescription = ?, idSKU = ?
          WHERE id = ?`,
      [newtd.newName, newtd.newProcedureDescription, newtd.newIdSKU, id]
    );
  }
  delete(id) {
    return this.dao.run(
      `DELETE FROM testdescriptor WHERE id = ?`,
      [id]
    );
  }
  getTestDescriptors() {
    return this.dao.all(
      `SELECT * FROM testdescriptor`
    );
  }
  getTestDescriptorByID(id) {
    return this.dao.get(
      `SELECT * 
        FROM testdescriptor
        WHERE id = ?`,
      [id]
    );
  }
  drop(){
    return this.dao.run(
      `DROP TABLE testdescriptor`
    )
  }
  // getTestDescriptorByName(name){
  //   return this.dao.get(
  //     `SELECT * 
  //       FROM testdescriptor
  //       WHERE name = ?`,
  //       [name]
  //   );
  // }
  deleteAll(){
    return this.dao.run(
      `DELETE FROM testdescriptor`
    )
  }

}
module.exports = TestDescriptor;