var models = require('./../models');
var config = require('./../config/dbconfig.json');


var pg = require('pg');
pg.defaults.ssl = false;
var conString = config.App.conString;

var CryptoJS = require("crypto-js");

var cryptoConfig = require('./../config/cryptConf')


/**
 * add socket is a function that add a socket
 * to the database
 * @param req
 * @param res
 *
 */
var addsocket = function(socket, cb) {


    models.socket.create(socket).then(function(socketCreated) {

        return cb(socketCreated)


    }).catch(function(err) {
        console.log(err)
        return cb(false)
    });



};

/**
 * this function delete a socket and take in parameter his id
 * @param data
 */
var deletesocket = function(idsocket, cb) {

    models.socket.findOne({ where: { id: idsocket } }).then(function(socket) {

        cb(socket.destroy());
    }).catch(function(err) {
        console.log(err)
        return cb(false)
    });;
};
/**
 * function that updates   a socket
 * @param idsocket
 * @param socket
 */
var updatesocket = function(idsocket, socket, cb) {
    console.log(idsocket)
    models.socket.findOne({
        where: {
            id: idsocket
        }
    }).then(function(socketToUpdate) {

        socketToUpdate.update(socket).then(function(socketAfterUpdate) {

            cb(socketAfterUpdate.dataValues)
        })
    }).catch(function(err) {
        console.log(err)
        return cb(false)
    });;

}



/**
 * function that return all sockets
 * @param cb
 */
var getAllsocket = function(cb) {
    console.log('Outside pg connect')
    pg.connect(conString, function(err, dbclient, ok) {

        if (err) {

            return console.error('could not connect to the database ' + err);
        }

        dbclient.query("SELECT * FROM sockets ", function(err, rows) {
            if (err) {
                console.log('erruer', err)
            }

            return cb(rows.rows);

        });

        ok();
    });


}


var findsocketByOwner = function(userId, callback) {



    console.log('Outside pg connect')
    pg.connect(conString, function(err, dbclient, ok) {

        if (err) {

            return console.error('could not connect to the database ' + err);
        }

        dbclient.query('SELECT * FROM sockets where "userId" = $1', [userId], function(err, rows) {
            if (err) {
                console.log('erruer', err)
            }

            return callback(rows.rows);

        });

        ok();
    });
}


/**
 * function that return a socket by their id
 * @param idManager
 */
var getsocketById = function(idsocket, cb) {

    models.socket.findOne({ where: { id: idsocket } }).then(function(socketfound) {

        return cb(socketfound.dataValues);
    })

}

/**
 * function that return a socket by their id
 * @param idManager
 */
var getsocketByNumSerie = function(idsocket, nameSocket, cb) {

    models.socket.findOne({ where: { num_serie: idsocket } }).then(function(socketfound) {
        console.log(socketfound)
        if (socketfound) {
            console.log('naeSoclet ', nameSocket)
            console.log('socketfound.dataValues ', socketfound.dataValues)
            socketfound.dataValues.name = nameSocket
            return cb(socketfound.dataValues);
        } else {
            return cb(false)
        }

    })

}

/**
 * function that updates   a socket
 * @param idsocket
 * @param socket
 */
var updatesocketByNumSerie = function(numeSerie, val, cb) {

    models.socket.findOne({
        where: {
            num_serie: numeSerie
        }
    }).then(function(socketToUpdate) {
        if (socketToUpdate) {
            socketToUpdate.update({ selected: val }).then(function(socketAfterUpdate) {

                cb(socketAfterUpdate.dataValues)
            })
        } else {
            cb(null)
        }

    }).catch(function(err) {
        console.log(err)
        return cb(false)
    });;

}


/**
 * this function delete a socket and take in parameter his id
 * @param data
 */
var deletesocketByNumSerie = function(numSerie, cb) {

    models.socket.findOne({ where: { num_serie: numSerie } }).then(function(socket) {

        cb(socket.destroy());
    }).catch(function(err) {
        console.log(err)
        return cb(false)
    });;
};



exports.deletesocket = deletesocket;
exports.addsocket = addsocket;
exports.updatesocket = updatesocket;
exports.getAllsocket = getAllsocket;
exports.getsocketById = getsocketById;
exports.updatesocketByNumSerie = updatesocketByNumSerie;
exports.findsocketByOwner = findsocketByOwner;
exports.deletesocketByNumSerie = deletesocketByNumSerie;
exports.getsocketByNumSerie = getsocketByNumSerie;