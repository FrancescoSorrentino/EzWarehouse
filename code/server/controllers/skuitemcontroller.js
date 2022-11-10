const { ValidationError } = require('../middlewares/errors');
const asyncHandler = require('../utils/async_handler');


class SkuItemController {
    constructor(sku, skuItem) {
        this.sku = sku;
        this.skuItem = skuItem;
    }

    getItems = async () => {
        let result = await this.skuItem.listsSkuItems()
        return result;
    }

    getSkuItemsBySkuId = async (skuid) => {
        let exists = await this.sku.getSku(skuid)
        if (exists) {
            let result = await this.skuItem.getItemsBySkuId(skuid)
            return result;
        }
        return false;
    }

    getSkuItem = async (rfid) => {

        let result = await this.skuItem.getItem(rfid)
        return result;

    }

    addItem = async (item) => {

        let exists = await this.sku.getSku(item.SKUId)
        if (exists) {
            let result = await this.skuItem.new(item)
            return result;
        }
        return false;

    }

    updateItem = async (oldRFID, newItem) => {
        let exists = await this.skuItem.getItem(oldRFID)
        if (exists) {
            await this.skuItem.update(newItem, oldRFID)
            return true;
        }
        return false;

    }

    deleteItem = async (rfid) => {
        
        await this.skuItem.delete(rfid)
        return

    }


}

module.exports = SkuItemController;