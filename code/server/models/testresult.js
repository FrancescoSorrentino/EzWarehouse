class TestResult {
  constructor() {
    this.dao = require("../db/dao");
  }

  async init() {
    try {
      await this.getTestResults();
    } catch (error) {
      await this.createTable();
      
      console.log('Test Result Table created')
    }
  }

  createTable() {
    const sql = `--sql
          CREATE TABLE IF NOT EXISTS testresult (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rfid TEXT NOT NULL,
            idTestDescriptor INTEGER NOT NULL,
            Date DATE NOT NULL,
            Result BOOLEAN NOT NULL,
            FOREIGN KEY(idTestDescriptor) 
            REFERENCES testdescriptor(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
            FOREIGN KEY(rfid) 
            REFERENCES skuitems(RFID)
            )`;
    return this.dao.run(sql)
  }

  new(tr) {
    return this.dao.run(
      `INSERT INTO testresult (rfid,idTestDescriptor, Date, Result)
              VALUES (?, ?, ?, ?)`,
      [tr.rfid, tr.idTestDescriptor, tr.Date, tr.Result])
  }

  update(rfid, id, newTR) {
    return this.dao.run(
      `UPDATE testresult SET idTestDescriptor = ?, Date = ?, Result = ?
              WHERE id = ? and rfid=?`,
      [newTR.newIdTestDescriptor, newTR.newDate, newTR.newResult, id, rfid])
  }


  delete(rfid, id) {
    return this.dao.run(
      `DELETE FROM testresult WHERE id = ? and rfid = ?`,
      [id, rfid]
    )
  }


  getTestResults(rfid) {
    return this.dao.all(
      `SELECT id,idTestDescriptor,Date,Result
        FROM testresult
        WHERE rfid = ? `,
      [rfid]
    )
  }

  getTestResultByID(rfid, id) {
    return this.dao.get(
      `SELECT id,idTestDescriptor,Date,Result
        FROM testresult
        WHERE id = ? AND rfid = ?`,
      [id, rfid]
    )
  }
  
  drop(){
    return this.dao.run(
      `DROP TABLE testresult`
    )
  }
  deleteAll(){
    return this.dao.run(
      `DELETE FROM testresult`
    )
  }
}

module.exports = TestResult;