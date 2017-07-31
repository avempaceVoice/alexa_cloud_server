/**
 * 
 * Copyright (c) 2017, Avempace Wireless (Daghfous Wejd). All rights reserved.
 * 
 */
var Sequelize = require('sequelize');
dbConfig = require('../config/dbconfig.json');

var conString = dbConfig.App.conString;
/**
 * to establish connection between  the server and the dataabase in this case
 * postgres we have to add the connection string to the sequelize instance
 * @type {Sequelize}
 */
var sequelize = new Sequelize(conString);

/**
 * type all  the table name (models) to have access on it after
 * @type {string[]}
 */
var models = [
    'socket',

];
/**
 * import model configuration
 */
models.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
});

/**
 * orm specification for the relation between tables
 * hasMany for one to many relatiuon
 * Belongsto fo one to one relation
 * HasOne for one to one relation
 * belongstoMany for many to many relation
 */
(function(m) {

})(module.exports);

/**
 * export the sequelize module
 * @type {Sequelize}
 */
module.exports.sequelize = sequelize;