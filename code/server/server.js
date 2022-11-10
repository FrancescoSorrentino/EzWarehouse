'use strict';
const express = require('express');
const skuRouter = require("./routes/skurouter.js");
const skuitemRouter = require("./routes/skuitemrouter.js");
const userRouter = require("./routes/userrouter.js");
const positionRouter = require("./routes/positionrouter.js");
const testdescriptorRouter = require("./routes/testdescriptorrouter");
const testresultRouter = require("./routes/testresultrouter");
const itemRouter = require("./routes/itemrouter.js");
const restockOrderRouter = require("./routes/restockorderrouter.js");
const returnOrderRouter = require("./routes/returnorderrouter");
const internalOrderRouter = require("./routes/internalorderrouter");

const l = require("./middlewares/logger.js");
const e = require("./middlewares/errors.js");
const dao = require("./db/dao.js");
const path = './db/ezdb.sqlite3'
// init express
const port = 3001;


const app = new express();
dao.connect(path)

//Middlewares
app.use(express.json());
app.use(l.logRequests);

//Routers
app.use('/api', skuRouter);
app.use('/api', userRouter);
app.use('/api', positionRouter);
app.use('/api', testdescriptorRouter);
app.use('/api', testresultRouter);
app.use('/api', skuitemRouter);
app.use('/api', itemRouter);
app.use('/api', restockOrderRouter);
app.use('/api', returnOrderRouter);
app.use('/api', internalOrderRouter);

//Middlewares
app.use(e.errorsHandler);
// app.use(e.invalidPathHandler)

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});



module.exports = app;