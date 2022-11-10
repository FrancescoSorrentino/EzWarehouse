var express = require('express');
var router = express.Router();
var UserController = require('../controllers/usercontroller');
const { body, param } = require('express-validator');
const { validationHandler } = require('../middlewares/errors');
const User = require('../models/user');
const asyncHandler = require('../utils/async_handler');
const user = new User();
const c = new UserController(user)

//Returns user informations if logged in.
//router.get('/userinfo', c.getUserInfo); ++WE DONT IMPLEMENT THE SESSION, USELESS++
//Return an array containing all suppliers.
router.get('/suppliers', 
    asyncHandler(async (req,res,next) => {
        let result = await c.listSuppliers()
        res.status(200).json(result)
    })
);
//Return an array containing all users excluding managers.
router.get('/users',
    asyncHandler(async (req,res,next) => {
        let result = await c.listsUsers()
        res.status(200).json(result)
    })
);

//Create a new user.
router.post('/newUser',
    body('username').isEmail(),
    body('password').isLength({ min: 8 }),
    body('type').isIn(['customer', 'supplier', 'clerk', 'qualityEmployee', 'deliveryEmployee']),
    validationHandler,
    asyncHandler(async (req,res,next) => {
        await c.newUser(req.body)
        res.status(201).send()
    })    
);
//Logins
router.post('/managerSessions', 
    asyncHandler(async (req,res,next) => {
        //let type = req.url.split("/")[1].replace("Sessions", ""); useless without session token
        let username = req.body.username;
        let password = req.body.password;
        await c.login(username,password)
        res.status(200).send()
    })
);
router.post('/customerSessions', 
    asyncHandler(async (req,res,next) => {
        //let type = req.url.split("/")[1].replace("Sessions", ""); useless without session token
        let username = req.body.username;
        let password = req.body.password;
        await c.login(username,password)
        res.status(200).send()
    })
);
router.post('/supplierSessions', 
    asyncHandler(async (req,res,next) => {
        //let type = req.url.split("/")[1].replace("Sessions", ""); useless without session token
        let username = req.body.username;
        let password = req.body.password;
        await c.login(username,password)
        res.status(200).send()
    })
);
router.post('/clerkSessions', 
    asyncHandler(async (req,res,next) => {
        //let type = req.url.split("/")[1].replace("Sessions", ""); useless without session token
        let username = req.body.username;
        let password = req.body.password;
        await c.login(username,password)
        res.status(200).send()
    })
);
router.post('/qualityEmployeeSessions', 
    asyncHandler(async (req,res,next) => {
        //let type = req.url.split("/")[1].replace("Sessions", ""); useless without session token
        let username = req.body.username;
        let password = req.body.password;
        await c.login(username,password)
        res.status(200).send()
    })
);
router.post('/deliveryEmployeeSessions', 
    asyncHandler(async (req,res,next) => {
        //let type = req.url.split("/")[1].replace("Sessions", ""); useless without session token
        let username = req.body.username;
        let password = req.body.password;
        await c.login(username,password)
        res.status(200).send()
    })
);
//Logout
//router.post('/logout', c.logout); ++WE DONT IMPLEMENT THE SESSION, USELESS++
//Modify rights of a user, given it's username.
router.put('/users/:username',
    param('username').isEmail(),
    body(['oldType', 'newType']).isIn(['customer', 'supplier', 'clerk', 'qualityEmployee', 'deliveryEmployee']),
    validationHandler,
    asyncHandler(async (req,res,next) => {
        let username = req.params.username;
        result = await c.updateUser(req.body,username)
        if(result.changes != 0){
            res.status(200).send()
            return
        }
        res.status(404).send()
    })
);
//Deletes the user identified by username(email) and type.
router.delete('/users/:username/:type',
    param('username').isEmail(),
    param('type').isIn(['customer', 'supplier', 'clerk', 'qualityEmployee', 'deliveryEmployee']),
    validationHandler,
    asyncHandler(async (req,res,next) => {
        let username = req.params.username
        let type = req.params.type
        await c.deleteUser(username,type)
        res.status(204).send()
    })
);


module.exports = router