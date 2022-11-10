class Position {
  constructor() {
    this.dao = require("../db/dao");
  }

  async init() {
    try {
      await this.getPositions();
    } catch (error) {
      await this.dao.get("PRAGMA foreign_keys = ON")
      await this.createTable();
      
      console.log('Position Table created')
    }
  }

  createTable() {
    const sql = `
          CREATE TABLE IF NOT EXISTS position (
            positionID VARCHAR(12) PRIMARY KEY,
            aisleID VARCHAR(4) NOT NULL,
            row VARCHAR(4) NOT NULL,
            col VARCHAR(4) NOT NULL,
            maxWeight DOUBLE NOT NULL,
            maxVolume DOUBLE NOT NULL,
            occupiedWeight DOUBLE NOT NULL,
            occupiedVolume DOUBLE NOT NULL)`;
    return this.dao.run(sql)
  }

  new(position) {
    return this.dao.run(
      `INSERT INTO position (positionID, aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume)
              VALUES (?, ?, ?, ?, ?, ?, 0, 0)`,
      [position.positionID, position.aisleID, position.row, position.col, position.maxWeight, position.maxVolume])
  }

  getPositions() {
    return this.dao.all(
      `SELECT *
        FROM position`
    )
  }

  getPosition(id) {
    return this.dao.get(
      `SELECT *
        FROM position
        WHERE positionID = ?`,
      [id]
    )
  }

  update(positionID, newPosition) {
    return this.dao.run(
      `UPDATE position SET positionID = ?, aisleID = ?, row = ?, col = ?, maxWeight = ?, maxVolume = ?, occupiedWeight = ?, occupiedVolume = ?
              WHERE positionID = ?`,
      [newPosition.newAisleID + newPosition.newRow + newPosition.newCol, newPosition.newAisleID, newPosition.newRow, newPosition.newCol, newPosition.newMaxWeight, newPosition.newMaxVolume, newPosition.newOccupiedWeight, newPosition.newOccupiedVolume, positionID])
  }

  updatePositionID(positionID, newPosition) {
    return this.dao.run(
      `UPDATE position SET positionID = ?, aisleID = ?, row = ?, col = ?
              WHERE positionID = ?`,
      [newPosition.newPositionID, newPosition.newPositionID.substring(0, 4), newPosition.newPositionID.substring(4, 8), newPosition.newPositionID.substring(8, 12), positionID])
  }

  updatePositionSpace(positionID, occupiedWeight, occupiedVolume) {
    return this.dao.run(
      `UPDATE position SET occupiedWeight = ?, occupiedVolume = ?
              WHERE positionID = ?`,
      [occupiedWeight, occupiedVolume, positionID])
  }

  delete(positionID) {
    return this.dao.run(
      `DELETE FROM position WHERE positionID = ?`,
      [positionID]
    )
  }

  drop(){
    return this.dao.run(
      `DROP TABLE position`
    )
  }

  deleteAll(){
    return this.dao.run(
      `DELETE FROM position`
    )
  }

}

module.exports = Position;