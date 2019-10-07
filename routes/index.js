const appRouter = require('express').Router();
const verifyHook = require('../verify-webhook.js');
const messageWebhook = require('../message-webhook');

//setup application routes
/* appRouter.get('/', (req, res)=> {
    res.send('yeah the app home route works');
}) */

appRouter.get('/', verifyHook);

appRouter.post('/', messageWebhook);

module.exports = appRouter;