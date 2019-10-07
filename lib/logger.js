const fs = require('fs');
/* var winston = require('winston');

// define the custom settings for each transport (file, console)
var options = {
  file: {
    level: 'info',
    filename: `msgs.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  }
};

// instantiate a new Winston Logger with the settings defined above
var logger = new winston.Logger({
  transports: [
    new winston.transports.File(options.file),
    //new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger; */

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