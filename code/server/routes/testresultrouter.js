var express = require('express');
var router = express.Router();
const TestResultController = require('../controllers/testresultcontroller');
const { body, param } = require('express-validator');
const { validationHandler } = require('../middlewares/errors');
const asyncHandler = require('../utils/async_handler');
const TestResult = require('../models/testresult');
const testResult = new TestResult();
const TestDescriptor = require('../models/testdescriptor');
const testDescriptor = new TestDescriptor();
const SkuItem = require('../models/skuitem');
const skuitem = new SkuItem();

const c = new TestResultController(testDescriptor, testResult, skuitem)



router.get('/skuitems/:rfid/testResults',
    param('rfid').notEmpty().isNumeric({ no_symbols: true }).isLength({ min: 32, max: 32 }),
    validationHandler,
    asyncHandler(async(req,res,next)=>{
        const rfid = req.params.rfid;
        // const skuitemRes = await skuitem.getItem(rfid);
        // if (!skuitemRes) res.status(404).send('no sku item associated to rfid')
        // next(errorsHandler(new Error("500 test")))
        const result = await c.getTestResults(rfid);
        if(result){
            res.status(200).send(result);
            return;
        }
        res.status(404).send('no sku item associated to rfid');
    })
)//select all

router.get('/skuitems/:rfid/testResults/:id',
    param('rfid').notEmpty().isNumeric({ no_symbols: true }).isLength({ min: 32, max: 32 }),
    param("id").isInt({ min: 1 }).notEmpty(),
    validationHandler,
    asyncHandler(async(req,res,next)=>{
        // const trID = req.params.id;
        // const rfid = req.params.rfid;
        // const skuitemRes = await skuitem.getItem(rfid);
        // const result = await c.getTestResultByID(rfid, trID)
        // if (!skuitemRes || !result) {
        //     res.status(404).send('no sku item associated to rfid or no test result associated to id')
        //     return;
        // }
        // res.status(200).json(result)
        // return;
        let rfid = req.params.rfid;
        let id = req.params.id;
        let result = await c.getTestResultByID(rfid, id)
        if(result){
            res.status(200).send(result)
            return
        }
        res.status(404).send('no sku item associated to rfid or no test result associated to id')
    })
)//select by id

router.post('/skuitems/testResult',
    body('rfid').notEmpty().isNumeric({ no_symbols: true }).isLength({ min: 32, max: 32 }),
    body('idTestDescriptor').notEmpty().isInt({ min: 1 }),
    body('Date').notEmpty().isDate(),
    body('Result').notEmpty().isBoolean(),
    validationHandler,
    asyncHandler(async(req,res,next) =>{
        // const rfid = req.body.rfid;
        // const tdid = req.body.idTestDescriptor;
        // const skuitemRes = await skuitem.getItem(rfid);
        // const td = await testDescriptor.getTestDescriptorByID(tdid);
        // if (!skuitemRes || !td) {
        //     res.status(404).send('no sku item associated to rfid or no test descriptor associated to idTestDescriptor')
        //     return;
        // }
        // const result = await c.addTestResult(req.body)
        // if(result)
        //     res.status(201).send("add new test result success")
        // else 
        //     next(errorsHandler(new Error("Add failed")))
        let result = await c.addTestResult(req.body)
        if(result.changes){//默认不会出现changes=0，只要没有404就一定能成功
            res.status(201).send(result)
            return
        }
        res.status(404).send('no sku item associated to rfid or no test descriptor associated to idTestDescriptor')
    })
)//create new

router.put('/skuitems/:rfid/testResult/:id',
    param('rfid').notEmpty().isNumeric({ no_symbols: true }).isLength({ min: 32, max: 32 }),
    param("id").isInt({ min: 1 }).notEmpty(),
    body('newIdTestDescriptor').notEmpty().isInt({ min: 1 }),
    body('newDate').notEmpty().isDate(),
    body('newResult').notEmpty().isBoolean(),
    validationHandler,
    asyncHandler(async(req,res,next)=>{
        // const trID = req.params.id;
        // const rfid = req.params.rfid;
        // const newTrID = req.body.newIdTestDescriptor;
        // skuitemRes = await skuitem.getItem(rfid);
        // if (!skuitemRes) {
        //     res.status(404).send('no sku item associated to rfid')
        //     return;
        // }
        // t1 = await testResult.getTestResultByID(rfid, trID)
        // t2 = await testDescriptor.getTestDescriptorByID(newTrID);
        // if (!t1 || !t2) {
        //     res.status(404).send('no test result associated to id or no test descriptor associated to newIdTestDescriptor')
        //     return;
        // }

        // const result = await c.updateTestResult(rfid, trID, req.body)
        // if(result)
        //     res.status(200).send("update success")
        // else 
        //     next(errorsHandler(new Error("Update failed")))
        let id = req.params.id;
        let rfid = req.params.rfid;
        result = await c.updateTestResult( rfid, id,req.body)
        if(result.changes){
            res.status(200).send("update success")
            return;
        }
        res.status(404).send('can not find the rfid ,test result id or id testdescriptor')
    })
)//modify

router.delete('/skuitems/:rfid/testResult/:id',
    param('rfid').notEmpty().isNumeric({ no_symbols: true }).isLength({ min: 32, max: 32 }),
    param("id").isInt({ min: 1 }).notEmpty(),
    asyncHandler(async(req,res,next)=>{
        // const trID = req.params.id;
        // const rfid = req.params.rfid;
        // const s = await testResult.getTestResultByID(rfid, trID)
        // if (!s) {
        //     res.status(404).send("no test result associated to id or rfid")
        //     return;
        // }
        // const result = await c.deleteTestResult(rfid, trID)
        // if(result)
        //     res.status(204).send("delete success")
        // else 
        //     next(errorsHandler(new Error("Delete failed")))
        result = await c.deleteTestResult(req.params.id, req.params.rfid)
        if(result.changes){
            res.status(204).send("delete successed")
            return
        }
        res.status(422).send("delete failed")
    })
    )//delete

// router.get('/error', (req, res) => {
//     res.send("The URL you are trying to reach does not exist.")
// })
module.exports = router