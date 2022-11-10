const dao = require('../../db/dao');
const path = './db/ezdb.sqlite3'
const Position = require('../../models/position')
const position = new Position()
const { clearDB } = require('../../db/reset');

describe('testPositionDao', () => {
    beforeAll(async () => {
        jest.setTimeout(14000)
        await dao.connect(path);
        try {
            await position.deleteAll()
            await position.drop()
        }
        catch (e) {
        }
        await position.createTable()
        await position.deleteAll()
    });

    test('delete db', async () => {
        var res = await position.getPositions();
        expect(res.length).toStrictEqual(0);
    });

    testNewPosition('800234543412', '8002', '3454', '3412', 1000, 1000);
    testUpdatePositionSpace('800234543412', 500, 500);
    testChangePositionID('800234543412', '800234543413')

    afterAll(async ()=>{
        await clearDB()
    })
});

function testNewPosition(positionID, aisleID, row, col, maxWeight, maxVolume) {
    test('create new position', async () => {
        const newPosition = {positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume}
        let u = await position.new(newPosition);
        
        let res = await position.getPositions();
        expect(res.length).toStrictEqual(1);
        
        res = await position.getPosition(positionID);

        expect(res.positionID).toStrictEqual(positionID);
        expect(res.aisleID).toStrictEqual(aisleID);
        expect(res.row).toStrictEqual(row);
        expect(res.col).toStrictEqual(col);
        expect(res.maxWeight).toStrictEqual(maxWeight);
        expect(res.maxVolume).toStrictEqual(maxVolume);

    });
}

function testUpdatePositionSpace(positionID, occupiedWeight, occupiedVolume) {
    test('update position space', async () => {
        await position.updatePositionSpace(positionID, occupiedWeight, occupiedVolume);
        res = await position.getPosition(positionID);
        expect(res.occupiedWeight).toStrictEqual(occupiedWeight);
        expect(res.occupiedVolume).toStrictEqual(occupiedVolume);

    });

    test('update position space failed position not found', async () => {
        positionID = " "
        let result = await position.updatePositionSpace(positionID, occupiedWeight, occupiedVolume);
        expect(result.changes).toStrictEqual(0)

    });

    test('update position space failed occupied Weight not positive', async () => {
        occupiedWeight = -100
        let result = await position.updatePositionSpace(positionID, occupiedWeight, occupiedVolume);
        expect(result.changes).toStrictEqual(0)
    });

    test('update position space failed occupied Volume not positive', async () => {
        occupiedWeight = -100
        let result = await position.updatePositionSpace(positionID, occupiedWeight, occupiedVolume);
        expect(result.changes).toStrictEqual(0)
    });
}


function testChangePositionID(positionID, newPositionID) {
    test('update positionID success', async () => {
        const newPosition = {newPositionID : newPositionID}
        await position.updatePositionID(positionID, newPosition);
        res = await position.getPosition(newPositionID);
        expect(res.positionID).toStrictEqual(newPosition.newPositionID);

    });

    test('update positionID failed position not found', async () => {
        positionID = " "
        const newPosition = {newPositionID : newPositionID}
        res = await position.updatePositionID(positionID, newPosition);
        expect(res.changes).toStrictEqual(0)

    })

    test('update position space failed newPositionID not good', async () => {
        newPositionID = " "
        const newPosition = {newPositionID : newPositionID}
        res = await position.updatePositionID(positionID, newPosition);
        expect(res.changes).toStrictEqual(0)
    });

}


