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

  app.get('/list_entries',(req,res)=>{
    try {
      var processed_files = fs.readdirSync('content/snaptoroads');
      var raw_files = fs.readdirSync('Java_modules/excels_data');
    }catch(err){
      console.log(err)
      return;
    }
    var to_append = [];
    for (var raw in raw_files){
      if(processed_files.indexOf(raw) == -1){
        to_append.add(raw)
      }
    }
    res.send(to_append);
  });

  app.get('/about',(req,res)=>{
    res.send('ISCAS Traffic Group presents!');
  });

  app.get('/test',(req,res)=>{
    res.sendFile(__dirname+"/content/views/test.html");
  });

  app.get('/', function(req, res){
    console.log("req: %j", req);
    res.sendFile(__dirname+"/content/views/2016-03-12.html");
  });

  app.get('/jquery-3.1.0.min.js',function(req,res){
    res.sendFile(__dirname+"/content/scripts/jquery-3.1.0.min.js");
  });

  app.get('/styles.css',function(req,res){
    res.sendFile(__dirname+"/content/views/css/styles.css");
  });


  app.get('/material.cyan-light_blue.min.css',function(req,res){
    res.sendFile(__dirname+"/content/views/css/material.cyan-light_blue.min.css");
  });

  app.get('/MaterialIcons.css',function(req,res){
    res.sendFile(__dirname+"/content/views/css/MaterialIcons.css");
  });

  app.get('/RobotoFonts.css',function(req,res){
    res.sendFile(__dirname+"/content/views/css/RobotoFonts.css");
  });


  app.get('/2fcrYFNaTjcS6g4U3t-Y5RV6cRhDpPC5P4GCEJpqGoc.woff',function(req,res){
    res.sendFile(__dirname+"/content/views/css/2fcrYFNaTjcS6g4U3t-Y5RV6cRhDpPC5P4GCEJpqGoc.woff");
  });
  app.get('/Hgo13k-tfSpn0qi1SFdUfbO3LdcAZYWl9Si6vvxL-qU.woff',function(req,res){
    res.sendFile(__dirname+"/content/views/css/Hgo13k-tfSpn0qi1SFdUfbO3LdcAZYWl9Si6vvxL-qU.woff");
  });
  app.get('/vzIUHo9z-oJ4WgkpPOtg13YhjbSpvc47ee6xR_80Hnw.woff',function(req,res){
    res.sendFile(__dirname+"/content/views/css/vzIUHo9z-oJ4WgkpPOtg13YhjbSpvc47ee6xR_80Hnw.woff");
  });
  app.get('/CrYjSnGjrRCn0pd9VQsnFOvvDin1pK8aKteLpeZ5c0A.woff',function(req,res){
    res.sendFile(__dirname+"/content/views/css/CrYjSnGjrRCn0pd9VQsnFOvvDin1pK8aKteLpeZ5c0A.woff");
  });
  app.get('/RxZJdnzeo3R5zSexge8UUbO3LdcAZYWl9Si6vvxL-qU.woff',function(req,res){
    res.sendFile(__dirname+"/content/views/css/RxZJdnzeo3R5zSexge8UUbO3LdcAZYWl9Si6vvxL-qU.woff");
  });
  app.get('/d-6IYplOFocCacKzxwXSOLO3LdcAZYWl9Si6vvxL-qU.woff',function(req,res){
    res.sendFile(__dirname+"/content/views/css/d-6IYplOFocCacKzxwXSOLO3LdcAZYWl9Si6vvxL-qU.woff");
  });
  app.get('/mnpfi9pxYH-Go5UiibESIrO3LdcAZYWl9Si6vvxL-qU.woff',function(req,res){
    res.sendFile(__dirname+"/content/views/css/mnpfi9pxYH-Go5UiibESIrO3LdcAZYWl9Si6vvxL-qU.woff");
  });
  app.get('/1pO9eUAp8pSF8VnRTP3xnnYhjbSpvc47ee6xR_80Hnw.woff',function(req,res){
    res.sendFile(__dirname+"/content/views/css/1pO9eUAp8pSF8VnRTP3xnnYhjbSpvc47ee6xR_80Hnw.woff");
  });
  app.get('/t6Nd4cfPRhZP44Q5QAjcC7rIa-7acMAeDBVuclsi6Gc.woff',function(req,res){
    res.sendFile(__dirname+"/content/views/css/t6Nd4cfPRhZP44Q5QAjcC7rIa-7acMAeDBVuclsi6Gc.woff");
  });

  app.get('/user.jpg',function(req,res){
    res.sendFile(__dirname+"/content/views/images/user.jpg");
  });

  app.get('/echarts.min.js',function(req,res){
    res.sendFile(__dirname+"/content/scripts/echarts/dist/echarts.min.js");
  });

  app.get('/dataTool.min.js',function(req,res){
    res.sendFile(__dirname+"/content/scripts/echarts/dist/extension/dataTool.min.js");
  });

  app.get('/bmap.min.js',function(req,res){
    res.sendFile(__dirname+"/content/scripts/echarts/dist/extension/bmap.min.js");
  });

  app.get('/:year-:month-:day.json',function(req,res){
    res.sendFile(__dirname+"/content/snaptoroads/"+req.params.year+"-"+req.params.month+"-"+req.params.day+".json");
  });

  app.get('/:year-:month-:day',function(req,res){
    res.sendFile(__dirname+"/content/views/"+req.params.year+"-"+req.params.month+"-"+req.params.day+".html");
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

