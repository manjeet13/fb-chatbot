/**
 * @author : Manjeet Kumar
 * @description: this file handles the messages received from the chat client
 */

const processMessage = require('./process-message');
const loggerClass = require('./lib/logger');
const logger = new loggerClass();

function getUserNameById(userId) {
    if(global.users[userId]) {
        return global.users[userId]
    }
    return false;
}

function saveUserData(event) {
    const userId = event.sender.id;
    global.users[userId] = {};
    global.users[userId]['isUserName'] = 1;
    global.users[userId]['isPassword'] = 0;
}

function saveUserName(event) {
    const userId = event.sender.id;
    global.users[userId].username = event.message.text;
    global.users[userId].isUserName = 0;
    global.users[userId].isPassword = 1;
    console.log('user data inside saveUserName ', global.users[userId]);
}

function savepassword(event) {
    const userId = event.sender.id;
    global.users[userId].password = event.message.text;
    global.users[userId].isPassword = 0;
    global.users[userId].isUserName = 0;
    global.users[userId].isEmail = 1;
}

function saveEmail(event) {
    const userId = event.sender.id;
    global.users[userId].email = event.message.text;
    global.users[userId].isEmail = 0;
    global.users[userId].isDOB = 1;
}

function saveDOB(event) {
    const userId = event.sender.id;
    global.users[userId].dob = event.message.text;
    global.users[userId].isDOB = 0;
}


function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        return true;
    }
    return false;
}

function validateDOB(date) {
    return true;
}


module.exports = (req, res) => {
    if (req.body.object === 'page') {
    req.body.entry.forEach(entry => {
        entry.messaging.forEach(event => {
        if (event.message && event.message.text) {
            console.log('event ==> ', event);
            //log message
            logger.logMsg(event);
            let userData = getUserNameById(event.sender.id);
            if(!userData) {
                saveUserData(event);
                processMessage(event, 'NEW');
            } else if(userData.isUserName) {
                saveUserName(event);
                processMessage(event, 'U');
            } else if(userData.isPassword) {
                savepassword(event);
                processMessage(event, 'P');
            } else if(userData.isEmail) {
                //saveUserName(event);
                let isValidEmail = validateEmail(event.message.text);
                if(isValidEmail) {
                    saveEmail(event);
                    processMessage(event, 'EML');
                } else {
                    processMessage(event, 'P');
                }
            } else if(userData.isDOB) {
                //savepassword(event);
                let isValidDate = validateDOB(event.message.text);
                if(isValidDate) {
                    saveDOB(event);
                    processMessage(event, 'DOB');
                } else {
                    processMessage(event, 'EML');
                }
            }else {
                processMessage(event, 'E');
            }
        }
        });
    });

    res.status(200).end();
    }
};