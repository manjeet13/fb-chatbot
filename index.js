/**
 * @author : Manjeet Kumar
 * @description : main driver file for the application, creates an express app and starts the server
 */

//load environment variables
require('dotenv').config({ path: './variables.env' });

const express = require('express');
const bodyParser = require('body-parser');

const configs = require('./configs');
const router  = require('./routes');

//create an express app
const app = express();

initializeUserDataStore();

//set app configs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(router);

//start the server
app.listen(configs.port, (err)=> {
    if(!err) {
        console.log('app is up and running on PORT :',configs.port);
    } else {
        console.log('Error while starting the server =>', err);
    }
});


function initializeUserDataStore() {
    global.ROOT = __dirname;
    global.users = {
        1: {
            username: 'Manjeet',
            password: 'sbs',
            dob: '',
            email: '',
            isUserName: 0,
            isPassword: 0,
            isEmail: 0,
            isDOB: 0
        }
    };
}