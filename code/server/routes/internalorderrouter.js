const express = require('express');
var router = express.Router();
const InternalOrderController = require('../controllers/internalordercontroller.js');
const { body, oneOf, param } = require('express-validator');
const { validationHandler } = require('../middlewares/errors');
const asyncHandler = require('../utils/async_handler');
const InternalOrder = require('../models/internalorder');
const internalOrder = new InternalOrder();
const SkuItem = require('../models/skuitem');
const skuItem = new SkuItem();
const User = require('../models/user');
const user = new User();
const Sku = require('../models/sku');
const sku = new Sku();

const c = new InternalOrderController(internalOrder, skuItem, user, sku)


router.get('/internalOrders',
    asyncHandler(async (req, res, next) => {
        let result = await c.getInternalOrders()
        res.status(200).send(result)
    }) 
)


router.get('/internalOrdersIssued',
    asyncHandler(async (req, res, next) => {
        let result = await c.getInternalOrdersIssued()
        res.status(200).send(result)
    })
)


router.get('/internalOrdersAccepted',
    asyncHandler(async (req, res, next) => {
        let result = await c.getInternalOrdersAccepted()
        res.status(200).send(result)
    })
)


router.get('/internalOrders/:id',
    param('id').isInt({ min: 1 }),
    validationHandler,
    asyncHandler(async (req, res, next) => {
        let id = req.params.id;
        let result = await c.getInternalOrder(id)
        if(result){
            res.status(200).send(result)
            return
        }
        res.status(404).send()
    })
)



router.post('/internalOrders', oneOf([
    body('issueDate').matches(/[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/),
    body('issueDate').isDate({ format: "YYYY/MM/DD" }),
    body('issueDate').isEmpty()]),
    body('products.*.SKUId').isInt({ min: 1 }),
    body('products.*.qty').isNumeric({ no_symbols: true }),
    body('customerId').isNumeric({ no_symbols: true }),
    validationHandler,
    asyncHandler(async (req,res,next) => {
        result  = await c.addInternalOrder(req.body)
        if(result){
            res.status(201).send()
        }
        res.status(422).send()
    })
)



router.put('/internalOrders/:id',
    param('id').isInt({ min: 1 }),
    body('newState').isIn(['ISSUED', 'ACCEPTED', 'REFUSED', 'CANCELED', 'COMPLETED']),
    validationHandler,
    asyncHandler(async (req,res,next) => {
        let id = req.params.id;
        result = await c.updateInternalOrderState(req.body,id)
        if(result){
            res.status(200).send()
            return
        }
        res.status(404).send()
    })
)

router.delete('/internalOrders/:id',
    param('id').isInt({ min: 1 }),
    validationHandler,
    asyncHandler(async(req,res,next) =>{
        const internalOrderID = req.params.id;
        let result = await c.deleteInternalOrder(internalOrderID)
        if(result){
            res.status(204).send()
        }
        res.status(422).send()
    }))

module.exports = router
