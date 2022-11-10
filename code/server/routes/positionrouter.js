var express = require('express');
var router = express.Router();
var PositionController = require('../controllers/positioncontroller');
const { body, param } = require('express-validator');
const { validationHandler } = require('../middlewares/errors');
const asyncHandler = require('../utils/async_handler');
const Position = require('../models/position');
const position = new Position();

const c = new PositionController(position)


router.get('/positions',
    asyncHandler(async (req, res, next) => {
        let result = await c.getPositions()
        res.status(200).send(result)
    }) 
);

router.get('/position/:positionID',
    param('positionID').isInt({ min: 1 }),
    validationHandler, 
    asyncHandler(async (req, res, next) => {
        let positionID = req.params.positionID;
        let result = await c.getPosition(positionID)
        if(result){
            res.status(200).send(result)
            return
        }
        res.status(404).send()
    })
)


router.post('/position',
    body('positionID').isNumeric({ no_symbols: true }).isLength({ min: 12, max: 12 }),
    body('aisleID').isNumeric({ no_symbols: true }).isLength({ min: 4, max: 4 }),
    body('row').isNumeric({ no_symbols: true }).isLength({ min: 4, max: 4 }),
    body('col').isNumeric({ no_symbols: true }).isLength({ min: 4, max: 4 }),
    body('maxWeight').isNumeric({ no_symbols: true }),
    body('maxVolume').isNumeric({ no_symbols: true }),
    validationHandler,
    asyncHandler(async (req,res,next) => {
        await c.createPosition(req.body)
        res.status(201).send()
    })
)




router.put('/position/:positionID',
    param('positionID').isInt().isLength({ min: 12, max: 12 }),
    body('newAisleID').isNumeric({ no_symbols: true }).isLength({ min: 4, max: 4 }),
    body('newRow').isNumeric({ no_symbols: true }).isLength({ min: 4, max: 4 }),
    body('newCol').isNumeric({ no_symbols: true }).isLength({ min: 4, max: 4 }),
    body('newMaxWeight').isNumeric({ no_symbols: true }),
    body('newMaxVolume').isNumeric({ no_symbols: true }),
    body('newOccupiedWeight').isNumeric({ no_symbols: true }),
    body('newOccupiedVolume').isNumeric({ no_symbols: true }),
    validationHandler,
    asyncHandler(async (req,res,next) => {
        let positionID = req.params.positionID;
        result = await c.updatePosition(req.body,positionID)
        if(result){
            res.status(200).send()
            return
        }
        res.status(404).send()
    })
)

router.put('/position/:positionID/changeID',
    param('positionID').isInt().isLength({ min: 12, max: 12 }),
    body('newPositionID').isNumeric({ no_symbols: true }).isLength({ min: 12, max: 12 }),
    validationHandler,
    asyncHandler(async (req,res,next) => {
        let positionID = req.params.positionID;
        result = await c.updatePositionID(req.body,positionID)
        if(result){
            res.status(200).send()
            return
        }
        res.status(404).send()
    })
)

    

router.delete('/position/:positionID',
    param('positionID').isInt({ min: 1 }).isLength({ min: 12, max: 12 }),
    validationHandler,
    asyncHandler(async (req,res,next) => {
        result = await c.deletePosition(req.params.positionID)
        if(result){
            res.status(204).send()
            return
        }
        res.status(422).send()
    })
)


module.exports = router