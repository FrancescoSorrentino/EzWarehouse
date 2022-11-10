const { ValidationError } = require('../middlewares/errors');
const asyncHandler = require('../utils/async_handler');
let skus = Array();

class SkuController {
    constructor(sku, position) {
        this.sku = sku;
        this.position = position;
    }

    getSkus = async () => {
        let result = await this.sku.getSkus()
        return result;
    }

    getSku = async (skuID) => {
        let result = await this.sku.getSku(skuID)
        return result;
    }

    addSku = async (Sku) => {
        await this.sku.new(Sku)
        return true
    }

    updateSku = async (skuID, newSku) => {
        let s = await this.sku.getSku(skuID)
        if (!s) {
            return false
        }

        if (s.position) {
            let p = await this.position.getPosition(s.position)
            let weight = newSku.newWeight * newSku.newAvailableQuantity
            let volume = newSku.newVolume * newSku.newAvailableQuantity
            if (weight > p.maxWeight || volume > p.maxVolume) {
                throw new ValidationError("MaxWeight or MaxVolume exeeded")
            }
            await this.position.updatePositionSpace(s.position, weight, volume)
        }

        await this.sku.update(skuID, newSku)
        return true;
    }

    updateSkuPosition = async (skuID, newPosition) => {

        var s = await this.sku.getSku(skuID)
        if (!s) {
            return false
        }

        var p = await this.position.getPosition(newPosition)
        if (!p) {
            throw new ValidationError('Position is not available')
        }
        var weight = s.weight * s.availableQuantity
        var volume = s.volume * s.availableQuantity
        if (weight > p.maxWeight || volume > p.maxVolume) {
            throw new ValidationError('MaxWeight or MaxVolume exeeded')
        }
        var result = await this.position.updatePositionSpace(newPosition, weight, volume)
        result = await this.sku.updatePosition(skuID, newPosition)
        return true;
    }


    deleteSku = async (skuID) => {

        var s = await this.sku.getSku(skuID)
        var result = await this.sku.delete(skuID)
        if (!s) {
            return
        }
        if (s.position) {
            result = await this.position.updatePositionSpace(s.position, 0, 0)
        }
    }


}

module.exports = SkuController;