var express = require('express');
var router = express.Router();
var ReturnOrderController = require('../controllers/returnordercontroller.js');
const ReturnOrder = require('../models/returnorder');
const returnOrder = new ReturnOrder();
const RestockOrder = require('../models/restockorder');
const restockOrder = new RestockOrder();
const { body , param, oneOf, check } = require('express-validator');
const {  validationHandler } = require('../middlewares/errors');
const asyncHandler = require('../utils/async_handler.js');

const c = new ReturnOrderController(returnOrder, restockOrder)

router.get('/returnOrders', 
    asyncHandler(async (req,res,next) => {
        let result = await c.listsReturnOrders()
        res.status(200).json(result)
        
    })
);

router.get('/returnOrders/:id', 
    param('id').isInt({min: 1}),
    validationHandler,
    asyncHandler(async (req,res,next) => {
        let returnOrderId = req.params.id;
        let result = await c.getReturnOrder(returnOrderId)
        if(result){
            res.status(200).json(result)
        }
        res.status(404).send()
    })
);

router.post('/returnOrder', 
    oneOf([
        body('returnDate').matches(/[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/),
        body('returnDate').isDate({format: "YYYY/MM/DD"}),
        body('returnDate').isEmpty()
    ]),
    body('products.*.SKUId').isInt({min: 1}),
    body('products.*.itemId').isInt({min: 1}),
    body('products.*.RFID').isNumeric({no_symbols: true}).isLength({min:32,max:32}),
    body('restockOrderId').isInt({min: 1}),
    validationHandler,
    asyncHandler(async (req,res,next) => {
        let returnOrder = req.body
        done = await c.addReturnOrder(returnOrder)
        if(done){
            res.status(201).send()
        }
        res.status(404).send()
    })
);

router.delete('/returnOrder/:id',
    param('id').isInt({min: 1}),
    validationHandler,
    asyncHandler(async (req,res,next) => {
        let returnOrderId = req.params.id;
        await c.deleteReturnOrder(returnOrderId)
        res.status(204).send()
    })
);


module.exports = router