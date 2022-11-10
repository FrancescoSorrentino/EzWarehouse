var express = require('express');
var router = express.Router();
const { param, body } = require('express-validator');
var SkuController = require('../controllers/skucontroller.js');
const { validationHandler } = require('../middlewares/errors.js');
const Sku = require('../models/sku');
const sku = new Sku();
const Position = require('../models/position');
const asyncHandler = require('../utils/async_handler.js');
const position = new Position();

const c = new SkuController(sku, position)

router.get('/skus', 
    asyncHandler(async(req,res,next) =>{
        result = await c.getSkus()
        res.status(200).json(result)
    })
)

router.get('/skus/:id',
    param('id').isInt({ min: 1 }),
    validationHandler,
    asyncHandler(async(req,res,next) =>{
        const skuID = req.params.id;
        result = await c.getSku(skuID)
        if (result) {
            res.status(200).json(result)
            return;
        }
        res.status(404).send()
    })
)

router.post('/sku',
    body("description").isLength({ min:1, max: 400 }),
    body("notes").isLength({ min: 1, max: 400 }),
    body("price").isNumeric({ no_symbols: true }),
    body("weight").isNumeric({ no_symbols: true }),
    body("volume").isNumeric({ no_symbols: true }),
    body("availableQuantity").isNumeric({ no_symbols: true }),
    validationHandler,
        asyncHandler(async(req,res,next) =>{
            await c.addSku(req.body)
            res.status(201).send()
        })
    )

router.put('/sku/:id',
    param('id').isInt({ min: 1 }),
    body("newDescription").isLength({ max: 400 }),
    body("newNotes").isLength({ max: 400 }),
    body("newWeight").isNumeric(),
    body("newVolume").isNumeric(),
    body("newPrice").isNumeric(),
    body("newAvailableQuantity").isNumeric(),
    validationHandler,
    asyncHandler(async(req,res,next) =>{
        const skuID = req.params.id;
        const newSku = req.body;
        done = await c.updateSku(skuID, newSku)
        if(done){
            res.status(200).send()
            return
        }
        res.status(404).send()
    })
)

router.put('/sku/:id/position',
    param('id').isInt({ min: 1 }),
    body("position").not().isEmpty(),
    validationHandler,
    asyncHandler(async(req,res,next) =>{
        const skuID = req.params.id;
        const newPosition = req.body.position;
        done = await c.updateSkuPosition(skuID, newPosition)
        if(done){
            res.status(200).send()
            return
        }
        res.status(404).send()
    })
)

router.delete('/skus/:id',
    param('id').isInt({ min: 0 }),
    validationHandler,
    asyncHandler(async(req,res,next) =>{
        const skuID = req.params.id;
        await c.deleteSku(skuID)
        res.status(204).send()
    })
)

module.exports = router