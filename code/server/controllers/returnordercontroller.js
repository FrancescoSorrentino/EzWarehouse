const asyncHandler = require('../utils/async_handler');
const { ValidationError } = require('../middlewares/errors');


class ReturnOrderController {
    constructor(returnOrder, restockOrder) {
        this.returnOrder = returnOrder;
        this.restockOrder = restockOrder;
    }

    listsReturnOrders = async () => {
        let result = await this.returnOrder.getReturnOrders()
        return result
    }

    getReturnOrder = async (returnOrderId) => {
        console.log(returnOrderId)
        let result = await this.returnOrder.getReturnOrder(returnOrderId)
        console.log(result)
        if (result) {
            return result
        }
        return false
    }

    addReturnOrder = async (ro) => {
        let result = await this.restockOrder.getRestockOrder(ro.restockOrderId)
        if (result) {
            await this.returnOrder.new(ro, result.supplierId)
            return true
        }
        return false
    }

    deleteReturnOrder = async (returnOrderId) => {

        await this.returnOrder.delete(returnOrderId);
        return
    }

}

module.exports = ReturnOrderController;