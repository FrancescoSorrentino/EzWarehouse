const dao = require('../../db/dao');
const  Position = require('../../models/position')
const  PositionController= require('../../controllers/positioncontroller');
const  position = new Position();
const  positioncontroller = new PositionController(position)
const path = './db/ezdb.sqlite3'
const { ValidationError } = require('../../middlewares/errors');
const { clearDB } = require('../../db/reset');


describe('Position tests', () => {
    describe('createPosition', () =>{
        const u = {
            positionID: "800234543417",
            aisleID: "8002",
            row: "3454",
            col: "3417",
            maxWeight: 1000,
            maxVolume: 1000
        }

        const p = {
            positionID: "800234543418",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        }

        beforeAll(async() =>{
            jest.setTimeout(10000)
            dao.connect(path)
            try{
                await position.createTable()
            }catch(err){}
        })

        test('Add a new position successfully', async ()=> {
            result = await positioncontroller.createPosition(u)
            expect(result).toBeTruthy() 
        })

        test('throws error if the position is not correct', async ()=> {
            try{
                await positioncontroller.createPosition(p)
            }catch(e){
                expect(e).toBeInstanceOf(ValidationError)
            }
        })

        afterAll(async() =>{
            await position.deleteAll()
            await position.drop()
        })

    })

    describe('deletePosition', () =>{
        let positionID = " " 
        const initialPosition = {
            positionID: "800234543417",
            aisleID: "8002",
            row: "3454",
            col: "3417",
            maxWeight: 1000,
            maxVolume: 1000
        }

        beforeAll(async() =>{
            jest.setTimeout(20000)
            // await dao.connect(path)
            try{
                await position.createTable()
            }catch(err){}
            p = await position.new(initialPosition)
            positionID = initialPosition.positionID
        })

        test('delete success', async ()=> {
            let result = await positioncontroller.deletePosition(positionID)
            expect(result).toBeTruthy()
        })
        test('delete failed', async ()=> {
            positionID =  " "
            let result = await positioncontroller.deletePosition(positionID)
            expect(result).toBeFalsy()
        })

        afterAll(async() =>{
            await clearDB()
        })

    })
})