const PositionController = require('../../controllers/positioncontroller');
const position = require('../../models/mocks/mock_position')
jest.mock('../../models/position');
const { ValidationError } = require('../../middlewares/errors');


const c = new PositionController(position)

describe('Position controller test:', () => {
    describe('getPositions', () => {

        const positionsList = [{
            
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
              
        },
        {
            positionID: "800234543413",
            aisleID: "8002",
            row: "3454",
            col: "3413",
            maxWeight: 1000,
            maxVolume: 1000
        }]

        beforeEach(() => {
            position.getPositions.mockReset()
        })

        test('returns a list of positions', async () => {
            position.getPositions.mockReturnValueOnce(positionsList)
            result = await c.getPositions()
            var exp = positionsList.map(obj => ({ ...obj}));
            expect(result).toEqual(exp)
        })

    })

    describe('createPosition', () => {
        const u = {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        }

        const p = {
            positionID: "800234543413",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        }

        beforeEach(() => {
            position.new.mockReset()
        })

        test('return undefined if new position is added', async () => {
            position.new.mockReturnValueOnce()
            result = await c.createPosition(u)
            expect(position.new.mock.calls[0][0]).toBe(u)
        })

        
        test('throws error if the position is not correct', async () => {
            position.new.mockReturnValueOnce()
            expect(c.createPosition(p))
                .rejects
                .toEqual(new ValidationError('barcode must be the combination of aisleID, row and col'))
        })
    })

    describe('updatePosition', () => {
        const positionID = "800234543412"
        const initialPosition = {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 500,
            occupiedVolume: 250
        }
        

        const newValidPosition =  {
            newAisleID: "8002",
            newRow: "3454",
            newCol: "3414",
            newMaxWeight: 1200,
            newMaxVolume: 600,
            newOccupiedWeight: 200,
            newOccupiedVolume:100
        }

        const newInvalidPosition = {
            newAisleID: "8002",
            newRow: "3454",
            newCol: "3414",
            newMaxWeight: 1200,
            newMaxVolume: 600,
            newOccupiedWeight: 1400,
            newOccupiedVolume:100
        }

        const newInvalidPosition2 = {
            newAisleID: "8002",
            newRow: "3454",
            newCol: "3414",
            newMaxWeight: 1200,
            newMaxVolume: 600,
            newOccupiedWeight: 1100,
            newOccupiedVolume:800
        }
        

        beforeEach(() => {
            position.getPosition.mockReset()
            position.update.mockReset()
        })

        test('values are fine, perform the update to the position', async () => {
            position.getPosition.mockReturnValueOnce(initialPosition)
            position.update.mockReturnValueOnce()

            result = await c.updatePosition(newValidPosition, positionID)
            //const newPositionID = newValidPosition.newAisleID + newValidPosition.newCol + newValidPosition.newRow
            expect(position.getPosition.mock.calls[0][0]).toEqual(positionID)
            expect(position.update.mock.calls[0][0]).toEqual(positionID)
            expect(position.update.mock.calls[0][1]).toEqual(newValidPosition)
            expect(result).toEqual(true)
        })


        test('value of weight is not fine, throw error', async () => {
            position.getPosition.mockReturnValueOnce(initialPosition)
            expect(() => c.updatePosition(newInvalidPosition, positionID))
                .rejects
                .toEqual(new ValidationError("Validation failed: newMaxWeight must be greater or equal then newOccupiedWeight."))
        })

        test('value of volume is not fine, throw error', async () => {
            position.getPosition.mockReturnValueOnce(initialPosition)
            expect(() => c.updatePosition(newInvalidPosition2, positionID))
                .rejects
                .toEqual(new ValidationError("Validation failed: newMaxVolume must be greater or equal then newOccupiedVolume."))
        })
        

        test('position to be updated is not found, return false', async () => {
            position.getPosition.mockReturnValueOnce(undefined)
            result = await c.updatePosition(newValidPosition, positionID)
            expect(result).toEqual(false)
        })
    })


    describe('deletePosition', () => {
        const positionID = "800234543412"
        const initialPosition = {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 500,
            occupiedVolume: 250
        }

        beforeEach(() => {
            position.getPosition.mockReset()
            position.delete.mockReset()
        })

        test('pass to delete the position', async () => {
            position.getPosition.mockReturnValueOnce(initialPosition)
            position.delete.mockReturnValueOnce()
            result = await c.deletePosition(positionID)
            expect(result).toEqual(true)
        })

    })



})