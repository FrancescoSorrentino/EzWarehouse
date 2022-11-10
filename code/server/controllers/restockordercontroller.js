const { ValidationError } = require('../middlewares/errors');
const asyncHandler = require('../utils/async_handler');

class RestockOrderController {
    constructor(restockOrder) {
        this.restockOrder = restockOrder;
    }

    getRestockOrders = async () => {
        let result = await this.restockOrder.getRestockOrders()
        return result;
    }

    getRestockOrdersIssued = async () => {
        let result = await this.restockOrder.getRestockOrders("ISSUED")
        return result;
    }

    getRestockOrder = async (restockOrderID) => {

        let result = await this.restockOrder.getRestockOrder(restockOrderID)
        if (result) {
            return true;
        }
        return false
    }

    getRestockOrderReturnItems = async (restockOrderID) => {
        const restock = await this.restockOrder.getRestockOrder(restockOrderID)
        if (!restock) { return false }
        if (restock.state === 'COMPLETEDRETURN') {
            let result = await this.restockOrder.getRestockOrderReturnItems(restockOrderID)
            if (result) {
                return true
            }
            return false
        }
        else {
            throw new ValidationError('Restock Order is not in COMPLETEDRETURN state')
        }
    }

    addRestockOrder = async (ro) => {
        const addedId = await this.restockOrder.new(ro)
        return addedId;
    }

    updateRestockOrderState = async (restockOrderID, newRO) => {
        const result = await this.restockOrder.updateState(restockOrderID, newRO)
        if (result.changes != 0) {
            return true
        }
        return false
    }

    updateRestockOrderSkuItems = async (restockOrderID, skuItems) => {
        //TODO: Add new skuItems received in the SkuItems table (maybe not actually.)
        // + ADD SAVEPOINT AND COMMIT ON IT!

        let result = await this.restockOrder.getRestockOrder(restockOrderID)
        if (!result) {
            return false;
        }

        result = await this.restockOrder.newReturnItems(restockOrderID, skuItems, result.supplierId)
        // console.log(result)
        if (result) {
            return true
        }
        return false
    }

    updateRestockOrderTransportNote = async (restockOrderID, transportNote) => {
        const restock = await this.restockOrder.getRestockOrder(restockOrderID)
        if (!restock) { return false }
        if (restock.state === 'DELIVERY') {
            const result = await this.restockOrder.newTransportNote(restockOrderID, transportNote)
            if (result.changes != 0) {
                return true
            }
            else {
                return false
            }
        }
        else {
            throw new ValidationError('Restock Order is not in Delivery state')
        }
        return
    }

    deleteRestockOrder = async (restockOrderID, transportNote) => {
        await this.restockOrder.delete(restockOrderID, transportNote)
        return
    }


}

module.exports = RestockOrderController;