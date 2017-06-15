var mysql = require('mysql'),
    dbConfig = require('../config/dbconfig.json');
    db = null;

module.exports = function () {
    if(!db) {
        db = mysql.createConnection({
            host:       dbConfig.App.dbConfig.host,
            user:        dbConfig.App.dbConfig.user,
            password:    dbConfig.App.dbConfig.password,
            database:    dbConfig.App.dbConfig.base,
            timezone: 'utc'
        });
    };
    return db;
};
