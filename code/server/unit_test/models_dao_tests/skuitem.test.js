const dao = require('../../db/dao');
const path = './db/ezdb.sqlite3'
const Sku = require('../../models/sku')
const SkuItem = require('../../models/skuitem')
const sku = new Sku()
const skuitem = new SkuItem()
const { clearDB } = require('../../db/reset');

describe('testSkuItemDao', () => {

    const s = {
        description: "a new sku",
        weight: 10,
        volume: 10,
        notes: "first SKU",
        price: 10.99,
        availableQuantity: 50
    }

    let si = {
        RFID: "12345678901234567890123456789015",
        SKUId: 1,
        DateOfStock: "2021/11/29 12:30"
    }

    let nsi = {
        RFID: "12345678901234567890123456789030",
        Available: 1,
        DateOfStock: "2021/11/29 12:30"
    }

    beforeAll(async () => {
        jest.setTimeout(14000)
        await dao.connect(path);
        try {
            await sku.deleteAll()
            await sku.drop()
        }
        catch (e) {
        }
        await sku.createTable()
        try {
            await skuitem.deleteAll()
            await skuitem.drop()
        }
        catch (e) {
        }
        await skuitem.createTable()
        await sku.new(s)
        await skuitem.new(si)
    })

    testUpdate("12345678901234567890123456789015", nsi)
    testSetAvailable(nsi.RFID)

    afterAll(async()=>{
        await clearDB()
    })

});

function testUpdate(rfid, newItem ) {
    test('update skuitem', async () => {
        const skitem = { newRFID: newItem.RFID, newAvailable: newItem.Available, newDateOfStock: newItem.DateOfStock }
        await skuitem.update(skitem, rfid);
        
        let res = await skuitem.getItem(newItem.RFID);
        console.log(res)

        expect(res.RFID).toStrictEqual(newItem.RFID);
        expect(res.Available).toStrictEqual(newItem.Available);
        expect(res.DateOfStock).toStrictEqual(newItem.DateOfStock);
    });
}

function testSetAvailable(rfid) {
    test('set sku available', async () => {
        let u = await skuitem.setAvailability(rfid);
        
        let res = await skuitem.getItem(rfid);
        console.log(res)

        expect(res.Available).toStrictEqual(0);
    
    });
}