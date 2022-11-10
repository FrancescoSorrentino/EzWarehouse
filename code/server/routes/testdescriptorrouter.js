var express = require('express');
var router = express.Router();
var TestDescriptorController = require('../controllers/testdescriptorcontroller');
const { body, param } = require('express-validator');
const { validationHandler } = require('../middlewares/errors');
const Sku = require('../models/sku');
const sku = new Sku();
const TestDescriptor = require('../models/testdescriptor');
const asyncHandler = require('../utils/async_handler');
const testdesc = new TestDescriptor();

const c = new TestDescriptorController(sku, testdesc)


router.get('/testDescriptors', 
    asyncHandler(async(req,res,next)=>{
        let result = await c.getTestDescriptors();
        res.status(200).json(result);
    })
)

router.get('/testDescriptors/:id',
    param("id").isInt({ min: 1 }).notEmpty(),
    validationHandler,
    asyncHandler(async(req,res,next)=>{
        const tdID = req.params.id;
        let result = await c.getTestDescriptorByID(tdID);
        
        if (result) {
            res.status(200).json(result)
            return;
        }
        res.status(404).send("id not found") // id not found
    })
    )

router.post('/testDescriptor',
    body('name').notEmpty(),
    body('procedureDescription').notEmpty(),
    body('idSKU').isInt({ min: 1 }).notEmpty(),
    validationHandler,
    asyncHandler(async(req,res,next)=>{
        // const idSKU = req.body.idSKU;
        // let t = await sku.getSku(idSKU);
        // if (t === undefined) {
        //     res.status(404).send("sku not exists");
        //     return;
        // }
        // const result = await c.addTestDescriptor(req.body)
        // if(result)
        //     res.status(201).send("add new test descriptor success")
        // else 
        //     next(errorsHandler(new Error("Add failed")))
        let result = await c.addTestDescriptor(req.body)
        if(result.changes){
            res.status(201).send(result)
            return
        }
        res.status(404).send("sku not exists")
    })
    )

router.put('/testDescriptor/:id',
    param("id").isInt({ min: 1 }).notEmpty(),
    body('newName').notEmpty(),
    body('newIdSKU').isInt({ min: 1 }).notEmpty(),
    validationHandler,
    asyncHandler(async(req,res,next)=>{
        // const tdID = req.params.id;
        // const idSKU = req.body.newIdSKU;
        // let t1 = await testdesc.getTestDescriptorByID(tdID)
        // let t2 = await sku.getSku(idSKU);
        // if (t1 === undefined || t2 === undefined) {
        //     res.status(404).send("SKU not exists.")
        //     return;
        // }

        // const result = await c.updateTestDescriptor(tdID, req.body)
        // if(result)
        //     res.status(200).send("update success")
        // else 
        //     next(errorsHandler(new Error("Update failed")))
        let id = req.params.id;
        result = await c.updateTestDescriptor(id,req.body)
        if(result.changes){
            res.status(200).send("update success")
            return
        }
        res.status(404).send("SKU not exists.")
    })
)

router.delete('/testDescriptor/:id',
    param("id").isInt({ min: 1 }).notEmpty(),
    validationHandler,
    asyncHandler(async(req,res,next)=>{
        // const tdID = req.params.id;
        // let t = await testdesc.getTestDescriptorByID(tdID)
        // if (t === undefined) {
        //     res.status(404).send("TestDescriptor not exists") // Unprocessable Entity
        //     return;
        // }
        // const result = await c.deleteTestDescriptor(tdID)
        // if(result)
        //     res.status(204).send("delete success")
        // else 
        //     next(errorsHandler(new Error("Delete failed")))
        result = await c.deleteTestDescriptor(req.params.id)
        if(result.changes){
            res.status(204).send("delete success")
            return
        }
        res.status(404).send('TestDescriptor not exists')
    })
    )

module.exports = router