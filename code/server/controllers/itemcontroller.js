const { ValidationError } = require('../middlewares/errors');

class ItemController {
    constructor(item, user, sku) {
        this.item = item;
        this.user = user;
        this.sku = sku;
    }

    getItems = async () => {
        let result = await this.item.getItems()
        return result;
    }

    getItem = async (id, supplierId) => {
        let result = await this.item.getItem(id, supplierId)
        return result;
    }

    addItem = async (req) => {
        const supplierId = req.supplierId;
        let t1 = await this.user.getUser(supplierId);
        if(!t1){
            return false;
        }

        if (t1.type != "supplier") {
            throw new ValidationError('type of this.user is not supplier.')
        }

        const skuId = req.SKUId;
        let t2 = await this.sku.getSku(skuId);
        if(!t2){
            return false;
        }

        await this.item.new(req);
        return true;
    }

    

    updateItem = async (newItem, id, supplierId) => {
        let t = await this.item.getItem(id, supplierId)
        if (t == undefined) {
            return false;
        }

        await this.item.update(id, supplierId, newItem)
        return true;
    }

    deleteItem = async (id, supplierId) => {
        let s = await this.item.getItem(id, supplierId)
        if (!s) {
            return;
        }
        let result = await this.item.delete(id, supplierId)
        return result;
    }



}

module.exports = ItemController;