
class ReturnOrder {
  constructor() {
    this.dao = require("../db/dao");
  }

  async init() {
    try {
      await this.getReturnOrders();
      await this.dao.get("PRAGMA foreign_keys = ON")
    } catch (error) {
      await this.createTable();
      await this.createTableProducts();

    }
  }

  createTable() {
    const sql = `--sql
          CREATE TABLE IF NOT EXISTS returnOrders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            returnDate TEXT NOT NULL,
            restockOrderId INTEGER NOT NULL,
            FOREIGN KEY(restockOrderId) 
            REFERENCES restockOrder(id)
            )`;
    console.log('ReturnOrder Table created')
    return this.dao.run(sql)
  }

  createTableProducts() {
    const sql = `--sql
          CREATE TABLE IF NOT EXISTS returnOrder_products (
            returnOrderId INTEGER,
            itemId INTEGER,
            supplierId INTEGER,
            RFID VARCHAR,
            FOREIGN KEY(returnOrderId) 
            REFERENCES returnOrders(id) ON DELETE CASCADE,
            FOREIGN KEY(itemId, supplierId) 
            REFERENCES item(id, supplierId),
            FOREIGN KEY(RFID)
            REFERENCES skuitems(RFID)
            ON UPDATE CASCADE,
            PRIMARY KEY (returnOrderId, RFID)
            )`;
    console.log('ReturnOrder-Products Table created')
    return this.dao.run(sql)
  }


  async new(returnOrder, supplierId) {
    console.log("HERE:", returnOrder)
    this.dao.run('SAVEPOINT OrderTransaction');
    const ro = await this.newReturnOrder(returnOrder)
    const params = []
    returnOrder.products.forEach(p => {
      params.push([ro.id, p.itemId, supplierId, p.RFID])
    });

    let result = await this.newProducts(params)
    this.dao.run('COMMIT')
    return ro.id;
  }

  newReturnOrder(returnOrder) {
    return this.dao.run(
      `INSERT INTO returnOrders (returnDate, restockOrderId)
              VALUES (?, ?)`,
      [
        returnOrder.returnDate,
        returnOrder.restockOrderId
      ])
  }

  newProducts(params) {
    return this.dao.runMultiple(`--sql
      INSERT INTO returnOrder_products (returnOrderId, itemId, supplierId, RFID)
      VALUES (?, ?, ?, ?)`, params)
  }


  delete(id) {
    return this.dao.run(
      `DELETE FROM returnOrders WHERE id = ? `,
      [id]
    )
  }


  async getReturnOrders() {
    const orders = await this.dao.all(
      `SELECT *
        FROM returnOrders`
    )

    for (let i = 0; i < orders.length; i++) {
      const products = { 'products': await this.getReturnOrderProducts(orders[i].id) }
      orders[i] = {
        ...orders[i],
        ...products,
      }
    }

    return orders
  }

  async getReturnOrder(id) {
    const order = await this.dao.get(
      `SELECT *
        FROM returnOrders
        WHERE id = ? `,
      [id]
    )
    if (!order)
      return false;
    const products = { 'products': await this.getReturnOrderProducts(id) }
    return { ...order, ...products }
  }

  getReturnOrderProducts(id) {
    return this.dao.all(
      `SELECT item.SKUId, RP.itemId, item.description, RP.RFID
        FROM returnOrder_products as RP
        JOIN item
        ON item.id = RP.itemId
        AND item.supplierId = RP.supplierId
        WHERE RP.returnOrderId = ? `,
      [id]
    )
  }

  async drop() {
    await this.dao.run(
      `DROP TABLE returnOrders`
    )
    await this.dao.run(
      `DROP TABLE returnOrder_products`
    )
    return;
  }

  async deleteAll() {
    await this.dao.run(
      `DELETE FROM returnOrder_products`
    )
    await this.dao.run(
      `DELETE FROM returnOrders`
    )
  }
}

module.exports = ReturnOrder;