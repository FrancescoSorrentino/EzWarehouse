var express = require('express');
const { param, body, oneOf } = require('express-validator');
var router = express.Router();
var RestoCkOrderController = require('../controllers/restockordercontroller.js');
const { validationHandler } = require('../middlewares/errors.js');
const RestockOrder = require('../models/restockorder');
const asyncHandler = require('../utils/async_handler.js');
const restockOrder = new RestockOrder();

const c = new RestoCkOrderController(restockOrder)


router.get('/restockOrders',
    asyncHandler(async (req, res, next) => {
        let result = await c.getRestockOrders()
        res.status(200).json(result)
    })
)
router.get('/restockOrdersIssued',
    asyncHandler(async (req, res, next) => {
        let result = await c.getRestockOrdersIssued()
        res.status(200).json(result)
    })
)

router.get('/restockOrders/:id',
    param('id').isInt({ min: 1 }),
    validationHandler,
    asyncHandler(async (req, res, next) => {
        let id = req.params.id
        result = await c.getRestockOrder(id)
        if (result) {
            res.status(200).json(result)
            return
        }
        res.status(404).send()
    })
)

router.get('/restockOrders/:id/returnItems',
    param('id').isInt({ min: 1 }),
    validationHandler,
    asyncHandler(async (req, res, next) => {
        let id = req.params.id
        result = await c.getRestockOrderReturnItems(id)
        if (result) {
            res.status(200).json(result)
            return
        }
        res.status(404).send()
    })
)

router.post('/restockOrder',
    body('supplierId').isInt({ min: 1 }),
    oneOf([
        body('issueDate').matches(/[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/),
        body('issueDate').isDate({ format: "YYYY/MM/DD" }),
        body('issueDate').isEmpty()
    ]),
    body("products.*.SKUId")
        .isNumeric(),
    body("products.*.itemId")
        .isNumeric(),
    body("products.*.description")
        .isLength({ max: 400 }),
    body("products.*.price")
        .isNumeric(),
    body("products.*.qty")
        .isNumeric(),
    validationHandler,
    asyncHandler(async (req, res, next) => {
        let ro = req.body
        await c.addRestockOrder(ro)
        res.status(201).send()
    })
)

router.put('/restockOrder/:id',
    param('id').isInt({ min: 1 }),
    body('newState').isIn(['ISSUED', 'DELIVERY', 'DELIVERED', 'TESTED', 'COMPLETEDRETURN', 'COMPLETED']),
    validationHandler,
    asyncHandler(async (req, res, next) => {
        const restockOrderID = req.params.id;
        let done = await c.updateRestockOrderState(restockOrderID, req.body)
        if (done) {
            res.status(200).send()
        }
        res.status(404).send()

    })
)

router.put('/restockOrder/:id/skuItems',
    param('id').isInt({ min: 1 }),
    body("skuItems").notEmpty(),
    body("skuItems.*.SKUId").isInt({ min: 1 }).not().isEmpty(),
    body("skuItems.*.itemId").isInt({ min: 1 }).not().isEmpty(),
    body("skuItems.*.rfid")
        .not().isEmpty()
        .isNumeric({ no_symbols: true })
        .isLength({ min: 32, max: 32 }),
    validationHandler,
    asyncHandler(async (req, res, next) => {
        const restockOrderID = req.params.id;
        let skuItems = req.body.skuItems
        done = await c.updateRestockOrderSkuItems(restockOrderID, skuItems)
        if (done) {
            res.status(200).send()
        }
        res.status(404).send()
    })
)

router.put('/restockOrder/:id/transportNote',
    param('id').isInt({ min: 1 }),
    oneOf([
        body('transportNote.*.deliveryDate').matches(/[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/),
        body('transportNote.*.deliveryDate').isDate({ format: "YYYY/MM/DD" }),
        body('transportNote.*.deliveryDate').isEmpty()
    ]),
    /*
    oneOf([
        body('transportNote.*.deliveryDate').isBefore(dayjs().format("YYYY/MM/DD HH:mm").toString()).isDate(),
        body('transportNote.*.deliveryDate').isBefore(dayjs().toString()).isDate()
    ]),*/
    body('transportNote').notEmpty(),
    validationHandler,
    asyncHandler(async (req, res, next) => {
        const restockOrderID = req.params.id;
        let transportNote = req.body.transportNote
        done = await c.updateRestockOrderTransportNote(restockOrderID, transportNote)
        if (done) {
            res.status(200).send()
        }
        res.status(404).send()
    })
)

router.delete('/restockOrder/:id',
    param('id').isInt({ min: 1 }),
    validationHandler,
    asyncHandler(async (req, res, next) => {
        const restockOrderID = req.params.id;
        let transportNote = req.body.transportNote
        await c.deleteRestockOrder(restockOrderID, transportNote)
        res.status(204).send()
    })
)

module.exports = router