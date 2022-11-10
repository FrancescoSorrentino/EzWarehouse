const { ValidationError } = require('../middlewares/errors');
const asyncHandler = require('../utils/async_handler');


class InternalOrderController {
    constructor(internalOrder, skuItem, user, sku) {
        this.internalOrder = internalOrder
        this.skuItem = skuItem
        this.user = user
        this.sku = sku
    }

    getInternalOrders = async () => {
        let result = await this.internalOrder.getInternalOrders()
        return result;
    }

    getInternalOrdersIssued = async () => {
        let result = await this.internalOrder.getInternalOrdersIssued()
        return result;
    }

    getInternalOrdersAccepted = async () => {
        let result = await this.internalOrder.getInternalOrdersAccepted()
        return result
    }

    

    getInternalOrder = async (id) => {
        let result = await this.internalOrder.getInternalOrder(id)
        return result;
    }



    addInternalOrder = async (req) => {
        let exists = await this.user.getUser(req.customerId)
        if (!exists) {
            throw new ValidationError('customerId missing')
        }
        if (exists.type != "customer") {
            throw new ValidationError('type of this.user is not customer.')
        }

        let result = await this.internalOrder.new(req)
        console.log(result)
        return result;
    }

   

    updateInternalOrderState = async (req, id) => {

        let s = await this.internalOrder.getInternalOrder(id)
        if (!s) {
            return;
        }
        const newState = req.newState;
        if (newState === "ISSUED" || newState === "ACCEPTED" || newState === "REFUSED" || newState === "CANCELED") {
            let result = await this.internalOrder.updateInternalOrderState(id, newState)
            return result;
        }

        let products = req.products;

        let t1 = await this.internalOrder.newReturnItems(id, products)
        await this.internalOrder.updateInternalOrderState(id, req.newState)

        //Putting availability of those SkuItems equal to 0
        let products2 = req.products;

        products2.forEach(async (p) => {
            await this.skuItem.setAvailability(p.RFID)
        });

        return t1;
    }



    deleteInternalOrder = async (internalOrderID) => {

        let p = await this.internalOrder.getInternalOrder(internalOrderID)
        if (!p) {
            return;
        }

        let result = await this.internalOrder.delete(internalOrderID)
        return result;

    }

}

module.exports = InternalOrderController;