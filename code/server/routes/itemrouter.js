var express = require('express');
var router = express.Router();
var ItemController = require('../controllers/itemcontroller.js');
const Item = require('../models/item');
const item = new Item();
const User = require('../models/user');
const user = new User();
const Sku = require('../models/sku');
const sku = new Sku();
const { body, param } = require('express-validator');
const { validationHandler } = require('../middlewares/errors');
const asyncHandler = require('../utils/async_handler');

const c = new ItemController(item, user, sku)


router.get('/items',
    asyncHandler(async (req, res, next) => {
        result = await c.getItems()
        res.status(200).send(result)
    }) 
)


router.get('/items/:id/:supplierId',
    param('id').isInt({ min: 0 }),
    param('supplierId').isInt({ min: 0 }),
    validationHandler, 
    asyncHandler(async (req, res, next) => {
        let id = req.params.id;
        let supplierId = req.params.supplierId;
        result = await c.getItem(id, supplierId)
        if(result){
            res.status(200).send(result)
            return
        }
        res.status(404).send()
    })
)



router.post('/item',
    body('id').isNumeric({ no_symbols: true }),
    body('price').isNumeric(/*{ no_symbols: true }*/),
    body('SKUId').isNumeric({ no_symbols: true }),
    body('supplierId').isNumeric({ no_symbols: true }),
    validationHandler,
    asyncHandler(async (req,res,next) => {
        result = await c.addItem(req.body)
        if(result){
            res.status(201).send()
        }
        res.status(404).send()
    })
)

router.put('/item/:id/:supplierId',
    param('id').isInt({ min: 0 }),
    param('supplierId').isInt({ min: 0 }),
    body('newPrice').isNumeric(/*{ no_symbols: true }*/),
    validationHandler,
    asyncHandler(async (req,res,next) => {
        let id = req.params.id;
        let supplierId = req.params.supplierId;
        result = await c.updateItem(req.body, id, supplierId)
        if(result){
            res.status(200).send()
        }
        res.status(404).send()
    })
)

router.delete('/items/:id/:supplierId',
    param('id').isInt({ min: 0 }),
    param('supplierId').isInt({ min: 0 }),
    validationHandler,
    asyncHandler(async (req,res,next) => {
        result = await c.deleteItem(req.params.id, req.params.supplierId)
        if(result){
            res.status(204).send()
            return
        }
        res.status(422).send()
    })
)

module.exports = router