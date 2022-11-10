const Position = require('../models/position');
const Sku = require('../models/sku');
const User = require('../models/user');
const TestResult = require('../models/testresult');
const SkuItem = require('../models/skuitem');
const Item = require('../models/item');
const TestDescriptor = require('../models/testdescriptor');
const RestockOrder = require('../models/restockorder');
const ReturnOrder = require('../models/returnorder');
const InternalOrder = require('../models/internalorder')

class DAO {
  constructor() {
    this.sqlite = require('sqlite3');
  }

  connect(path) {
    this.db = new this.sqlite.Database(path, async function (err) {
      ///REMOVE THIS COMMENT TO TRIGGERTABLES CREATION AT SERVER STARTUP
      /*
      await new Position().init()
      await new Sku().init()
      await new User().init()
      await new SkuItem().init()
      await new Item().init()
      await new TestDescriptor().init()
      await new TestResult().init()
      await new RestockOrder().init()
      await new ReturnOrder().init()
      await new InternalOrder().init()
      */
    })
  }

  //CREATE, INSERT, UPDATE, DELETE
  run(sql, params = []) {
    return new Promise((resolve, reject) =>
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve({ id: this.lastID, changes: this.changes })
        }
      })
    )
  }
  //SELECT something FROM
  get(sql, params = []) {
    return new Promise((resolve, reject) =>
      this.db.get(sql, params, (err, result) => {
        if (err) {
          reject(`Error running sql: ${err}`)
        } else {
          resolve(result)
        }
      })
    )
  }
  //SELECT * FROM
  all(sql, params = []) {
    return new Promise((resolve, reject) =>
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(`Error running sql: ${err}`)
        } else {
          resolve(rows)
        }
      })
    )
  }


  //CREATE, INSERT, UPDATE, DELETE MULTIPLE TIME WITH SAME QUERY
  runMultiple(sql, paramsList = [[]]) {
    return new Promise(async (resolve, reject) => {
      let statement = this.db.prepare(sql);
      for (const params of paramsList) {
        try {
          await new Promise((resolve, reject) => {
            statement.run(params, (err) => {
              if (err) {
                this.db.run('ROLLBACK TO OrderTransaction')
                reject(err)
              } else {
                resolve(true)
              }
            })
          })
        } catch (error) {
          reject(error)
        }
      }
      resolve(true)
    })
  }

}

module.exports = new DAO();