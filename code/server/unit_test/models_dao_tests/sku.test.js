const dao = require('../../db/dao');
const path = './db/ezdb.sqlite3'
const Sku = require('../../models/sku')
const Position = require('../../models/position')
const sku = new Sku()
const position = new Position()
const { clearDB } = require('../../db/reset');

describe('testSkuDao', () => {

    const s = {
        description: "a new sku",
        weight: 10,
        volume: 10,
        notes: "first SKU",
        price: 10.99,
        availableQuantity: 50
    }
    const is = {
        newDescription: "a new sku",
        newVolume: 3,
        newWeight: 3,
        newNotes: "first SKU",
        newPrice: 10.99,
        newAvailableQuantity: 3
    }

    const u = {
        positionID: "800234543417",
        aisleID: "8002",
        row: "3454",
        col: "3417",
        maxWeight: 1000,
        maxVolume: 1000
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
        try {
            await position.deleteAll()
            await position.drop()
        }
        catch (e) {
        }
        await position.createTable()
        await sku.createTable()
        await sku.new(s)
        await position.new(u)
    })

    testUpdate(1,is)
    testUpdatePosition(1,u.positionID)

    afterAll(async()=>{
        await clearDB()
    })

});

function testUpdate(id, newSku ) {
    test('update sku', async () => {
        
        let u = await sku.update(id,newSku);
        
        let res = await sku.getSku(id);

        expect(res.description).toStrictEqual(newSku.newDescription);
        expect(res.volume).toStrictEqual(newSku.newVolume);
        expect(res.weight).toStrictEqual(newSku.newWeight);
        expect(res.price).toStrictEqual(newSku.newPrice);
        expect(res.notes).toStrictEqual(newSku.newNotes);
    });
}

function testUpdatePosition(id, position) {
    test('update sku position', async () => {
        let u = await sku.updatePosition(id,position);
        
        let res = await sku.getSku(id);

        expect(res.position).toStrictEqual(position);
    
    });
}