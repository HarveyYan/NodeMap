const http         = require('http'),
      fs           = require('fs'),
      os           = require('os'),
      path         = require('path'),
      env          = process.env,
      MongoClient  = require('mongodb').MongoClient,
      express      = require('express');

var   app          = express();
var   port         = "64154";
var   ip           = "192.168.100.20";

fs.open("log.txt","a",0x0644, function(err, fd){
  fs.write(fd, `application ${process.pid} initiated \r\n`,'utf8',function(e){
    if(e) throw e;
  });

  app.get('/', function(req, res){
    console.log("incoming requests");
    res.send('hello world');
  });

  var listener = app.listen(port,ip, function (err) {
    if (err)  console.log(err);
    else console.log("listenting at: %j",listener.address());

    fs.write(fd, `server on application ${process.pid} started, running at ip ${ip} port ${port}\r\n`,
        0,'utf8',function(e){
          if(e) throw e;
        });
  });

  // var networkInterfaces = os.networkInterfaces();
  // console.log( networkInterfaces );
  // var server = http.createServer(function (req, res) {
  //   var url = req.url;
  //   if (url == '/') {
  //     res.statusCode = 200;
  //     res.setHeader('Content-Type', 'text/plain');
  //     res.end("Under Development");
  //   }
  //
  //
  //   IMPORTANT: Your application HAS to respond to GET /health with status 200
  //              for OpenShift health monitoring
  //
  //   if (url == '/health') { //检查健康状态
  //     res.writeHead(200);
  //     res.end();
  //   } else if (url == '/info/gen' || url == '/info/poll') {
  //     res.setHeader('Content-Type', 'application/json');
  //     res.setHeader('Cache-Control', 'no-cache, no-store');
  //     res.end(JSON.stringify(sysInfo[url.slice(6)]()));
  //   } else {
  //     fs.readFile('./static' + url, function (err, data) {
  //       if (err) {
  //         res.writeHead(404);
  //         res.end('Not found');
  //       } else {
  //         var ext = path.extname(url).slice(1);
  //         res.setHeader('Content-Type', contentTypes[ext]);
  //         if (ext === 'html') {
  //           res.setHeader('Cache-Control', 'no-cache, no-store');
  //         }
  //         res.end(data);
  //       }
  //     });
  //   }
  // });
  // server.listen(port,ip, function (err) {
  //   if (err)  console.log(err);
  //   else console.log("listenting at: %j",server.address());
  //
  //   fs.write(fd, `server on application ${process.pid} started, running at ip ${ip} port ${port}\r\n`,
  //       0,'utf8',function(e){
  //     if(e) throw e;
  //   });
  // });

  var connection_string = '127.0.0.1:27017/coordinates';
  var i= 0 ,j = 0;
// the client db connection scope is wrapped in a callback:
  MongoClient.connect('mongodb://'+connection_string, function(err, db) {
    if(err) throw err;
    var collection = db.collection('coordinates').insert({"lat": i, "lng": j});
  })

});

