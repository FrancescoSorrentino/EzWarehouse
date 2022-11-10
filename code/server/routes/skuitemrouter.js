var express = require('express');
var router = express.Router();
var SkuItemController = require('../controllers/skuitemcontroller.js');
const { body, param, oneOf } = require('express-validator');
const { validationHandler } = require('../middlewares/errors');
const SkuItem = require('../models/skuitem');
const skuItem = new SkuItem();
const Sku = require('../models/sku');
const sku = new Sku();
const asyncHandler = require('../utils/async_handler.js');


const c = new SkuItemController(sku, skuItem)

router.get('/skuitems',
    asyncHandler(async(req,res,next) =>{
        let result = await c.getItems()
        res.status(200).json(result)
    })
)
router.get('/skuitems/sku/:id',
    param('id').isInt({ min: 1 }),
    validationHandler,
    asyncHandler(async(req,res,next) =>{
        let skuid = req.params.id;
        let result = await c.getSkuItemsBySkuId(skuid)
        if(result){
            res.status(200).json(result)
            return;
        }
        res.status(404).send()
    })
)

router.get('/skuitems/:rfid',
    param('rfid').notEmpty().isNumeric({ no_symbols: true }).isLength({ min: 32, max: 32 }),
    validationHandler,
    asyncHandler(async(req,res,next) =>{
        let rfid = req.params.rfid
        let result = await c.getSkuItem(rfid)
        if (result) {
            res.status(200).json(result)
            return;
        }
        res.status(404).send()
    })
)

router.post('/skuitem',
    body('RFID').notEmpty().isNumeric({ no_symbols: true }).isLength({ min: 32, max: 32 }),
    body('SKUId').isInt({ min: 1 }),
    oneOf([
        body('DateOfStock').matches(/[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/),
        body('DateOfStock').isDate({ format: "YYYY/MM/DD" }),
        body('DateOfStock').isEmpty()
    ]),
    validationHandler,
    asyncHandler(async(req,res,next) =>{
        let done = await c.addItem(req.body)
        if(done){
            res.status(201).send()
            return;
        }
        res.status(404).send()
    })
)

router.put('/skuitems/:rfid',
    param('rfid').notEmpty().isNumeric({ no_symbols: true }).isLength({ min: 32, max: 32 }),
    oneOf([
        body('newDateOfStock').matches(/[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/),
        body('newDateOfStock').isDate({ format: "YYYY/MM/DD" }),
        body('newDateOfStock').isEmpty()
    ]),
    body('newRFID').isInt({ min: 1 }),
    body('newAvailable').isInt({ min: 0 , max: 1 }),
    validationHandler,
    asyncHandler(async(req,res,next) =>{
        let oldRFID = req.params.rfid;
        let newItem = req.body;
        let done = await c.updateItem(oldRFID, newItem)
        if(done){
            res.status(200).send()
            return
        }
        res.status(404).send()
    })
)

router.delete('/skuitems/:rfid',
    param('rfid').notEmpty().isNumeric({ no_symbols: true }).isLength({ min: 32, max: 32 }),
    validationHandler,
    asyncHandler(async(req,res,next) =>{
        rfid = req.params.rfid;
        await c.deleteItem(rfid)
        res.status(204).send()
    })
)

module.exports = router