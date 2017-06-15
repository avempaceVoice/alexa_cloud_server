
var models=require('./../models');
var config = require('./../config/dbconfig.json');




/**
 * add lock is a function that add a lock
 * to the database
 * @param req
 * @param res
 *
 */
var addLock=function(lock){

    models.lock.create(lock).then(function(){});
};

/**
 * this function delete a lock and take in parameter his id
 * @param data
 */
var deleteLock=function(idLock){

    models.lock.findOne(idLock).then(function(lock) {

        lock.destroy();
    });
};
/**
 * function that updates   a lock
 * @param idLock
 * @param lock
 */
var updateLock=function(idLock,lock){

    models.lock.findOne(idLock).then(function(lockToUpdate){

        lockToUpdate.update(lock);
    });

}

exports.deleteLock=deleteLock;
exports.addLock=addLock;
exports.updateLock=updateLock;


