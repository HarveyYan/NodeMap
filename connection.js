/**
 * Created by HarveyYan on 16/7/29.
 */
//load the Client interface
var MongoClient = require('mongodb').MongoClient;

var ip_addr = process.env.OPENSHIFT_NODEJS_IP   || '127.0.0.1';
var port    = process.env.OPENSHIFT_NODEJS_PORT || '8080';

console.log("process.env.OPENSHIFT_NODEJS_IP" + process.env.OPENSHIFT_NODEJS_IP);
console.log("process.env.OPENSHIFT_NODEJS_PORT"+ process.env.OPENSHIFT_NODEJS_IP);

// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/YOUR_APP_NAME';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    console.log("process.env.OPENSHIFT_MONGODB_DB_USERNAME" + process.env.OPENSHIFT_MONGODB_DB_USERNAME);
    console.log("process.env.OPENSHIFT_MONGODB_DB_PASSWORD" + process.env.OPENSHIFT_MONGODB_DB_PASSWORD);
    console.log("process.env.OPENSHIFT_MONGODB_DB_HOST"     + process.env.OPENSHIFT_MONGODB_DB_HOST);
    console.log("process.env.OPENSHIFT_MONGODB_DB_PORT"     + process.env.OPENSHIFT_MONGODB_DB_PORT);
    console.log("process.env.OPENSHIFT_APP_NAME"            + process.env.OPENSHIFT_APP_NAME);

    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

var i = 0, j = 0;

// the client db connection scope is wrapped in a callback:
MongoClient.connect('mongodb://'+connection_string, function(err, db) {
    if(err) throw err;
    var collection = db.collection('coordinates').insert({"lat": i, "lng": j});
    i++, j++;
})