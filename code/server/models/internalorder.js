class InternalOrder {
    constructor() {
      this.dao = require("../db/dao");
    }
  
    async init() {
      try {
        await this.getInternalOrders();
      } catch (error) {
        await this.createTable();
        await this.createTableProducts();
        await this.createTableSkuItems();
          
      }
    }
  
    createTable() {
      const sql = `--sql
          CREATE TABLE IF NOT EXISTS internalOrder (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            issueDate VARCHAR NOT NULL,
            state INTEGER NOT NULL,
            customerId INTEGER NOT NULL,
            FOREIGN KEY(customerId) 
            REFERENCES user(id)
            )`;
      console.log('InternalOrder Table created')
      return this.dao.run(sql)
    }
  
    createTableProducts() {
      const sql = `--sql
          CREATE TABLE IF NOT EXISTS internalOrder_product (
            internalOrderID INTEGER,
            SKUId INTEGER,
            qty INTEGER NOT NULL,
            FOREIGN KEY(internalOrderID) 
            REFERENCES internalOrder(id) ON DELETE CASCADE,
            FOREIGN KEY(SKUId) 
            REFERENCES sku(id),
            PRIMARY KEY (internalOrderID, SKUId)
            )`;
      console.log('InternalOrder-Product Table created')
      return this.dao.run(sql)
    }
  
    createTableSkuItems() {
      const sql = `--sql
          CREATE TABLE IF NOT EXISTS internalOrder_skuItem (
            internalOrderID INTEGER,
            SKUId INTEGER,
            RFID VARCHAR,
            FOREIGN KEY(internalOrderID) 
            REFERENCES internalOrder(id) ON DELETE CASCADE,
            FOREIGN KEY(SKUId) 
            REFERENCES sku(id),
            FOREIGN KEY(RFID) 
            REFERENCES skuitems(RFID)
            ON UPDATE CASCADE,
            PRIMARY KEY (internalOrderID, SKUId, RFID)
            )`;
      console.log('InternalOrder-SkuItem Table created')
      return this.dao.run(sql)
    }
  
    async new(internalOrder) {
      this.dao.run('SAVEPOINT OrderTransaction')
      const io = await this.newInternalOrder(internalOrder)

      let result = io;
      if(internalOrder.products){
        result = await this.newProducts(io.id, internalOrder.products)
      }
      this.dao.run('COMMIT')
      if(result){
        return io.id
      }
      else{
        return result
      }

    }

    newInternalOrder(internalOrder) {
      return this.dao.run(
        `INSERT INTO internalOrder (issueDate, state, customerId)
              VALUES (?, ?, ?)`,
        [
          internalOrder.issueDate,
          "ISSUED",
          internalOrder.customerId
        ])
    }
  
    newProducts(internalOrderID, products) {
      const params = []
      products.forEach(p => {
        params.push([internalOrderID, p.SKUId, p.qty])
      });
      return this.dao.runMultiple(`--sql
      INSERT INTO internalOrder_product (internalOrderID, SKUId, qty)
      VALUES (?, ?, ?)`, params)
    }
  
    async newReturnItems(internalOrderID, data) {
      this.dao.run('SAVEPOINT OrderTransaction')
      const params = []
      data.forEach(d => {
        params.push([internalOrderID, d.SkuID, d.RFID])
      });
      
      let result = await this.dao.runMultiple(`--sql
      INSERT INTO internalOrder_skuItem (internalOrderID, SKUId, RFID)
      VALUES (?, ?, ?)`, params)
      this.dao.run('COMMIT')
      return result;
    }
  
    updateInternalOrderState(id, state) {
      return this.dao.run(
        `UPDATE internalOrder SET state = ?
              WHERE id = ?`,
        [state, id])
    }
  
    delete(id) {
      return this.dao.run(
        `DELETE FROM internalOrder WHERE id = ? `,
        [id]
      )
    }
  
  
    async getInternalOrders() {
      const orders = await this.dao.all(
        `SELECT *
        FROM internalOrder`
      )
      
      for (let i = 0; i < orders.length; i++) {
        let products = {};
        if(orders[i].state === "COMPLETED"){
          products = { 'products': await this.getInternalOrderReturnItems(orders[i].id) }
        }
        else{
          products = { 'products': await this.getInternalOrderProducts(orders[i].id) }
        }
        orders[i] = {
          ...orders[i],
          ...products,
        }
      }
  
  
      return orders
    }

    async getInternalOrdersIssued() {
      const orders = await this.dao.all(
        `SELECT *
        FROM internalOrder
        WHERE state = 'ISSUED'`
      )
      
      for (let i = 0; i < orders.length; i++) {
        const products = { 'products': await this.getInternalOrderProducts(orders[i].id) }
        orders[i] = {
          ...orders[i],
          ...products,
        }
      }
  
  
      return orders
    }

    async getInternalOrdersAccepted() {
      const orders = await this.dao.all(
        `SELECT *
        FROM internalOrder
        WHERE state = 'ACCEPTED'`
      )
      
      for (let i = 0; i < orders.length; i++) {
        const products = { 'products': await this.getInternalOrderProducts(orders[i].id) }
        orders[i] = {
          ...orders[i],
          ...products,
        }
      }
  
      return orders
    }
  
    async getInternalOrder(id) {
      const order = await this.dao.get(
        `SELECT *
        FROM internalOrder
        WHERE id = ? `,
        [id]
      )
      let products = {};
      if(order != undefined){
        if(order.state === "COMPLETED"){
          products = { 'products': await this.getInternalOrderReturnItems(order.id) }
        }
        else{
          products = { 'products': await this.getInternalOrderProducts(order.id) }
        }
        return { ...order, ...products}
      }
    }
  
    getInternalOrderProducts(id) {
      return this.dao.all(
        `SELECT SKUId, description, qty
        FROM internalOrder_product
        JOIN sku ON sku.id = internalOrder_product.SKUId
        WHERE internalOrder_product.internalOrderID = ? `,
        [id]
      )
    }
  
    getInternalOrderReturnItems(id) {
      return this.dao.all(
        `SELECT SKUId, description, RFID 
        FROM internalOrder_skuItem
        JOIN sku ON sku.id = internalOrder_skuItem.SKUId
        WHERE internalOrderID = ? `,
        [id]
      )
    }
    
    async drop(){
      await this.dao.run(
        `DROP TABLE internalOrder`
      )
      await this.dao.run(
        `DROP TABLE internalOrder_product`
      )
      await this.dao.run(
        `DROP TABLE internalOrder_skuItem`
      )
      return;
    }

    async deleteAll(){
      await this.dao.run(
        `DELETE FROM internalOrder_product`
      )

      await this.dao.run(
        `DELETE FROM internalOrder_skuItem`
      )

      await this.dao.run(
        `DELETE FROM internalOrder`
      )
      return;
    }
  }
  
  module.exports = InternalOrder;
  