/**
 * @author : Manjeet Kumar
 * @description : handles the processing of message and decides what type of response should be sent next
 */

const fetch = require('node-fetch');

const projectId = 'human-npgqes'; //https://dialogflow.com/docs/agents#settings
const sessionId = '123456';
const languageCode = 'en-US';

const dialogflow = require('dialogflow');

const config = {
    credentials: {
    private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
    }
};

const sessionClient = new dialogflow.SessionsClient(config);

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// Remember the Page Access Token you got from Facebook earlier?
// Don't forget to add it to your `variables.env` file.
const { FACEBOOK_ACCESS_TOKEN } = process.env;

const sendTextMessage = (userId, text) => {
    return fetch(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`,
    {
        headers: {
        'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
        messaging_type: 'RESPONSE',
        recipient: {
            id: userId,
        },
        message: {
            text,
        },
        }),
    }
    );
}

function processMsgs(event, type) {
    switch(type) {
        case 'E'    : sendAutoMatedResponse(event);
                    break;
        case 'NEW'  : signHimUp(event, type);
                    break;
        case 'U'    : signHimUp(event, type);
                    break;
        case 'P'    : signHimUp(event, type);
                    break;
        case 'EML': signHimUp(event, type)
                    break;
        case 'DOB': signHimUp(event, 'DOB');
                    break;
        default     : sendAutoMatedResponse(event);
                    break;
    }
}

// sends automated response via dialogflow small talk feature
function sendAutoMatedResponse(event) {
    const userId = event.sender.id;
    const message = event.message.text;

    const request = {
    session: sessionPath,
    queryInput: {
        text: {
        text: message,
        languageCode: languageCode,
        },
    },
    };

    sessionClient
    .detectIntent(request)
    .then(responses => {
        const result = responses[0].queryResult;
        return sendTextMessage(userId, result.fulfillmentText);
    })
    .catch(err => {
        console.error('ERROR:', err);
    });
}

//sends custom responses for getting user data
function signHimUp(event, type) {
    const userId = event.sender.id;
    const message = event.message.text;

    const request = {
    session: sessionPath,
    queryInput: {
        text: {
        text: message,
        languageCode: languageCode,
        },
    },
    };

    sessionClient
    .detectIntent(request)
    .then(responses => {
        const response = getResponseText(event, type);
        console.log('the control is here =>', response);
        return sendTextMessage(userId, response);
    })
    .catch(err => {
        console.error('ERROR:', err);
    });
}

function getResponseText(event, type) {
    switch(type) {
        case 'NEW': return 'Signing you up! Please enter your username now';
        case 'U':   return 'please enter your password now'
        case 'P':   let userName = global.users[event.sender.id].username;
                    return `Great!, you're signed up. Welcome ${userName}
                    We'll need a few details, please enter your email now`;
        case 'EML': return `please enter your date of birth in dd/mm/yyyy `;
        case 'DOB': return `you're all set. Send us a message! `;
    }
}

module.exports = processMsgs;