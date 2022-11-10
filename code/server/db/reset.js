const Position = require('../models/position');
const Sku = require('../models/sku');
const User = require('../models/user');
const TestResult = require('../models/testresult');
const SkuItem = require('../models/skuitem');
const Item = require('../models/item');
const TestDescriptor = require('../models/testdescriptor');
const RestockOrder = require('../models/restockorder');
const ReturnOrder = require('../models/returnorder');
const InternalOrder = require('../models/internalorder')
const position = new Position();
const sku = new Sku();
const user = new User();
const testresult = new TestResult();
const skuitem = new SkuItem();
const item = new Item()
const testdescriptor = new TestDescriptor();
const restockorder = new RestockOrder();
const returnorder = new ReturnOrder();
const internalorder = new InternalOrder();


const clearDB = async function () {
    await returnorder.deleteAll()
    await restockorder.deleteAll()
    await internalorder.deleteAll()
    await testresult.deleteAll()
    await testdescriptor.deleteAll()
    await item.deleteAll()
    await skuitem.deleteAll()
    await sku.deleteAll()
    await position.deleteAll()

    await user.deleteAll()
    await user.drop()
    await user.init()
}

module.exports = { clearDB }