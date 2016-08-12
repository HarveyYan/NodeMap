/**
 * Created by HarveyYan on 16/7/29.
 */
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');

var ip_addr = '127.0.0.1';
var port    = '27017';

var connection_string = ip_addr+":"+port+"/"+"roads";

MongoClient.connect('mongodb://'+connection_string, function(err, db) {
    if(err) throw err;

    var data = fs.readFileSync(__dirname+"/roadsJSON/#6-#10.json","utf-8");
    var points = data.snappedPoints;

    points.forEach(function(point){
        db.collection("#6-#10").insert({
            "lat":point.location.latitude,
            "lng":point.location.longitude
        });
    });
})