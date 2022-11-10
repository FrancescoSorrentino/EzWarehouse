class RestockOrder {
  constructor() {
    this.dao = require("../db/dao");
  }

  async init() {
    try {
      await this.getRestockOrders();
    } catch (error) {
      await this.createTable();
      console.log('RestockOrder Table created')
      await this.createTableProducts();
      console.log('RestockOrder-Product Table created')
      await this.createTableSkuItems();
      console.log('RestockOrder-SkuItem Table created')
      await this.createTableTransportNotes();
      console.log('RestockOrder-TransportNote Table created')


    }
  }

  createTable() {
    const sql = `--sql
        CREATE TABLE IF NOT EXISTS restockOrder (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          issueDate VARCHAR NOT NULL,
          state INTEGER NOT NULL,
          supplierId INTEGER NOT NULL,
          FOREIGN KEY(supplierId) 
          REFERENCES user(id)
          )`;
    return this.dao.run(sql)
  }

  createTableProducts() {
    const sql = `--sql
        CREATE TABLE IF NOT EXISTS restockOrder_product (
          restockOrderID INTEGER,
          itemId INTEGER,
          supplierId INTEGER,
          qty INTEGER NOT NULL,
          FOREIGN KEY(restockOrderID) 
          REFERENCES restockOrder(id)
          ON DELETE CASCADE,
          FOREIGN KEY(itemId, supplierId) 
          REFERENCES item(id, supplierId),
          PRIMARY KEY (restockOrderID, itemId, supplierId)
          )`;
    return this.dao.run(sql)
  }

  createTableSkuItems() {
    const sql = `--sql
        CREATE TABLE IF NOT EXISTS restockOrder_skuItem (
          restockOrderID INTEGER,
          itemId INTEGER,
          supplierId INTEGER,
          RFID VARCHAR,
          FOREIGN KEY(restockOrderID) 
          REFERENCES restockOrder(id)
          ON DELETE CASCADE,
          FOREIGN KEY(itemId, supplierId) 
          REFERENCES item(id, supplierId),
          FOREIGN KEY(RFID) 
          REFERENCES skuitems(RFID)
          ON UPDATE CASCADE,
          PRIMARY KEY (restockOrderID, RFID)
          )`;
    return this.dao.run(sql)
  }

  createTableTransportNotes() {
    const sql = `--sql
        CREATE TABLE IF NOT EXISTS restockOrder_transportNote (
          restockOrderID INTEGER,
          deliveryDate VARCHAR NOT NULL,
          FOREIGN KEY(restockOrderID) 
          REFERENCES restockOrder(id)
          ON DELETE CASCADE,
          PRIMARY KEY (restockOrderID)
          )`;

    return this.dao.run(sql)
  }

  async new(restockOrder) {
    this.dao.run('SAVEPOINT OrderTransaction');
    const ro = await this.newRestockOrder(restockOrder)
    const products = []
    restockOrder.products.forEach(p => {
      products.push({ ...p, ...{ 'supplierId': restockOrder.supplierId } })
    });
    await this.newProducts(ro.id, products)
    this.dao.run('COMMIT')
    return ro.id;
  }

  newRestockOrder(restockOrder) {
    return this.dao.run(
      `INSERT INTO restockOrder (issueDate, state, supplierId)
            VALUES (?, ?, ?)`,
      [
        restockOrder.issueDate,
        "ISSUED",
        restockOrder.supplierId
      ])
  }

  newProducts(restockOrderID, products) {
    const params = []
    products.forEach(p => {
      params.push([restockOrderID, p.itemId, p.supplierId, p.qty])
    });

    return this.dao.runMultiple(`--sql
    INSERT INTO restockOrder_product (restockOrderID, itemId, supplierId, qty)
    VALUES (?, ?, ?, ?)`, params)
  }

  newReturnItems(restockOrderID, data, supplierId) {
    const params = []
    data.forEach(d => {
      params.push([restockOrderID, d.itemId, supplierId, d.rfid])
    });

    return this.dao.runMultiple(`--sql
    INSERT INTO restockOrder_skuItem (restockOrderID, itemId, supplierId, RFID)
    VALUES (?, ?, ?, ?)`, params)
  }

  newTransportNote(restockOrderID, transportNote) {
    return this.dao.run(
      `INSERT INTO restockOrder_transportNote (restockOrderID, deliveryDate)
            VALUES (?, ?)`,
      [
        restockOrderID,
        transportNote.deliveryDate
      ])
  }

  updateState(id, body) {
    return this.dao.run(
      `UPDATE restockOrder SET state = ?
      WHERE id = ? `,
      [body.newState, id])
  }

  delete(id) {
    return this.dao.run(
      `DELETE FROM restockOrder WHERE id = ? `,
      [id]
    )
  }

  async getRestockOrders(state) {
    let orders
    if (state) {
      orders = await this.dao.all(
        `SELECT *
        FROM restockOrder
        WHERE state = ?`,
        [state]
      )
    } else {
      orders = await this.dao.all(
        `SELECT *
        FROM restockOrder`,
      )

    }


    for (let i = 0; i < orders.length; i++) {
      const products = await this.getRestockOrderProducts(orders[i].id)
      const returnItems = await this.getRestockOrderReturnItems(orders[i].id)
      const transportNote = await this.getTransportNote(orders[i].id)
      orders[i] = {
        ...orders[i],
        ...products ? { 'products': products } : {},
        ...returnItems ? { 'skuItems': returnItems } : {},
        ...transportNote ? { 'transportNote': transportNote } : {}
      }
    }
    return orders
  }

  async getRestockOrder(id) {
    const order = await this.dao.get(
      `SELECT *
      FROM restockOrder
      WHERE id = ? `,
      [id]
    )
    if (!order)
      return undefined

    const products = await this.getRestockOrderProducts(id)
    const returnItems = await this.getRestockOrderReturnItems(id)
    const transportNote = await this.getTransportNote(id)
    return {
      ...order,
      ...products ? { 'products': products } : {},
      ...returnItems ? { 'skuItems': returnItems } : {},
      ...transportNote ? { 'transportNote': transportNote } : {}
    }
  }

  async getRestockOrderReturnItems(id) {
    const skuItems = await this.dao.all(
      `SELECT item.SKUId, restockOrder_skuItem.itemId, RFID as rfid
      FROM restockOrder_skuItem
      JOIN item
      ON item.id = restockOrder_skuItem.itemId
      AND item.supplierId = restockOrder_skuItem.supplierId
      WHERE restockOrderID = ? `,
      [id]
    )
    return skuItems.length > 0 ? skuItems : null
  }

  async getRestockOrderProducts(id) {
    const products = await this.dao.all(
      `SELECT item.SKUId, restockOrder_product.itemId, description, price, qty
      FROM restockOrder_product
      JOIN item 
      ON item.id = restockOrder_product.itemId
      AND item.supplierId = restockOrder_product.supplierId
      WHERE restockOrder_product.restockOrderID = ? `,
      [id]
    )
    return products.length > 0 ? products : null
  }

  getTransportNote(id) {
    return this.dao.get(
      `SELECT deliveryDate
      FROM restockOrder_transportNote
      WHERE restockOrderID = ? `,
      [id]
    )
  }
  async drop() {
    await this.dao.run(
      `DROP TABLE restockOrder`
    )
    await this.dao.run(
      `DROP TABLE restockOrder_product`
    )
    await this.dao.run(
      `DROP TABLE restockOrder_skuItem`
    )
    await this.dao.run(
      `DROP TABLE restockOrder_transportNote`
    )
    return;
  }

  async deleteAll() {
    await this.dao.run(
      `DELETE FROM restockOrder_product`
    )
    await this.dao.run(
      `DELETE FROM restockOrder_skuItem`
    )
    await this.dao.run(
      `DELETE FROM restockOrder_transportNote`
    )
    await this.dao.run(
      `DELETE FROM restockOrder`
    )
  }
}

module.exports = RestockOrder;