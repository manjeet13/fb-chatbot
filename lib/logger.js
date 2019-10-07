const fs = require('fs');
module.exports = class Logger {
    async logMsg(event) {
        let dataToWrite = {
            userId: event.sender.id,
            message: event.message.text,
            timestamp: event.timestamp
        };
        const filePath = `${global.ROOT}/logs/msgs.txt`;
        await this.appendFile(filePath, dataToWrite);
    }

    appendFile(path, data) {
        return new Promise((resolve, reject)=> {
            fs.appendFile(path, JSON.stringify(data), (err)=> {
                if(!err) {
                    console.log('log created for this msg');
                    resolve();
                } else {
                    console.log('error while writing log => ', err);
                    reject(err);
                }
            });
        })
    }
}