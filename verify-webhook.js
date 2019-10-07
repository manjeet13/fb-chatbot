const verifyWebhook = (req, res) => {
    let VERIFY_TOKEN = 'not-a-bot';

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
      }
  };

  module.exports = verifyWebhook;
  //EAAFAXZAKVZAMcBAEof1MlNPZCN3F96grFWyIYI9iQs2gc7LIzLXQ7w16d5ZBPmNyunLYpgc3NSCyvJOQCXxiNWlA2OK6b8IlNcYQowhdKSRUJhMnXHXNbTTdxkcagAVLnu3JA6xHggi5WY2GBqm8XGMzQANo7goiG9AobQRof7zwpcJeyEEYg2YDVlRyVSUZD