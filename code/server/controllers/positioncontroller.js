const { ValidationError } = require('../middlewares/errors');



class PositionController {
    constructor(position) {
        this.position = position;
    }

   

    getPositions = async () => {
        let result = await this.position.getPositions()
        return result;
    }

    getPosition = async (positionID) => {
        let result = await this.position.getPosition(positionID)
        console.log(result)
        return result;
    }


    createPosition = async (req) => {
        let barcode = req.positionID;
        let aisleID = req.aisleID;
        let row = req.row;
        let col = req.col;
        if (barcode != aisleID + row + col) {
            throw new ValidationError('barcode must be the combination of aisleID, row and col')
        }
        let result = await this.position.new(req);
        return result;
    }


    updatePosition = async (req, positionID) => {

        let p = await this.position.getPosition(positionID)

        if (!p) {
            return false;
        }

        const newMaxWeight = parseFloat(req.newMaxWeight);
        const newMaxVolume = parseFloat(req.newMaxVolume);
        const newOccupiedWeight = parseFloat(req.newOccupiedWeight);
        const newOccupiedVolume = parseFloat(req.newOccupiedVolume);


        if (newMaxVolume < newOccupiedVolume) {
            throw new ValidationError('Validation failed: newMaxVolume must be greater or equal then newOccupiedVolume.')
        }

        if (newMaxWeight < newOccupiedWeight) {
            throw new ValidationError('Validation failed: newMaxWeight must be greater or equal then newOccupiedWeight.')
        }


        await this.position.update(positionID, req)
        return true;
    }

    updatePositionID = async (req, positionID) => {
        console.log(positionID)
        let p = await this.position.getPosition(positionID)
        if (!p) {
            return false;
        }

        await this.position.updatePositionID(positionID, req)
        return true;
    }


    
    deletePosition = async (positionID) => {
        let p = await this.position.getPosition(positionID)

        if (!p) {
            return false;
        }
        await this.position.delete(positionID)
        return true;

    }

}

module.exports = PositionController;