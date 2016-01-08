/*
* Simulate Session Module
* 2015.12.02 @ lin 
*/
var mongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    objectId = require('mongodb').ObjectID,
    dbUrl = 'mongodb://127.0.0.1:27017/nostory',
    moment = require('moment');

module.exports = Session;

function Session(res,sId,userName){
    
};