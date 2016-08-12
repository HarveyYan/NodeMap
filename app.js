const http         = require('http'),
      fs           = require('fs'),
      os           = require('os'),
      path         = require('path'),
      env          = process.env,
      MongoClient  = require('mongodb').MongoClient,
      bodyParser   = require('body-parser'),
      express      = require('express');

var   app          = express();
var   port         = "64154";
var   ip           = "192.168.100.20";

app.use(express.static( __dirname + '/content'));

fs.open("log.txt","a",0x0644, function(err, fd){
  fs.write(fd, `application ${process.pid} initiated \r\n`,'utf8',function(e){
    if(e) throw e;
  });

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
  app.use(bodyParser.json())

// parse application/vnd.api+json as json
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

  app.use(function(req,res,next){
    fs.write(fd,req.body,'utf8',function(e){
      if (e) throw e;
    });
    next();
  });

  app.get('/about',(req,res)=>{
    res.send('ISCAS Traffic Group presents!');
  });

  app.get('/', function(req, res){
    console.log("req: %j", req);
    res.sendFile(__dirname+"/content/views/lines-bmap-effect.html");
  });

  app.get('/jquery-1.7.2.min.js',function(req,res){
    res.sendFile(__dirname+"/content/scripts/jquery-1.7.2.min.js");
  });

  app.get('/6-10.json',function(req,res){
    res.sendFile(__dirname+"/content/resources/6-10.json");
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

//   var connection_string = '127.0.0.1:27017/coordinates';
//   var i= 0 ,j = 0;
//   //the client db connection scope is wrapped in a callback:
//   MongoClient.connect('mongodb://'+connection_string, function(err, db) {
//     if(err) throw err;
//     var collection = db.collection('coordinates').insert({"lat": i, "lng": j});
//   })

});

