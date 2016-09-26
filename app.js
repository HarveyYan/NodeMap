const http         = require('http'),
      fs           = require('fs'),
      os           = require('os'),
      path         = require('path'),
      env          = process.env,
      MongoClient  = require('mongodb').MongoClient,
      bodyParser   = require('body-parser'),
      express      = require('express'),
      jsdom        = require('jsdom'),
      spawn     = require('child_process').spawn;

var   app          = express();
var   port         = "64154";
var   ip           = "192.168.100.20";

app.use(express.static( __dirname + '/content'));
app.set('views', path.join(__dirname, 'content/views'));
app.set('view engine', 'jade');

fs.open(__dirname+"/log.txt","a",0x0644, function(err, fd){
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

  function check_entries(date,res){
      var processed_files = fs.readdirSync(__dirname+'/content/snaptoroads');
      var raw_files = fs.readdirSync(__dirname+'/Java_modules/excels_data');
      var new_entries = [];
      for (var i = 0;i < raw_files.length; i++){
        if (fs.lstatSync(__dirname+'/Java_modules/excels_data/'+raw_files[i]).isDirectory()) {
          if (processed_files.indexOf(raw_files[i] + ".json") == -1) {
            new_entries.push(raw_files[i])
          }
        }
      }
      fs.write(fd, new_entries);
      if (new_entries.length!=0) {
        var opts = {stdio: 'inherit'} ;
        var javac = spawn('javac', ['-cp', '/usr/local/nodejsapp/app/Java_modules/lib/\*', '/usr/local/nodejsapp/app/Java_modules/src/Change.java','/usr/local/nodejsapp/app/Java_modules/src/BaiduApi.java','/usr/local/nodejsapp/app/Java_modules/src/StuService.java'], opts);

        javac.on('close', function () {
          var params = ['-cp','/usr/local/nodejsapp/app/Java_modules:/usr/local/nodejsapp/app/Java_modules/lib/\*','src.Change'];
          for (var i = 0 ; i < new_entries.length; i++){
            //注意new_entries没有'.json'，只更新new_entries的内容,PS空文件夹很Annoying
            params.push(new_entries[i])
          }
          var javaa  = spawn('java', params, opts);
          javaa.on('close',function(){
            send_html(date,res);
          });
        });
        //execSync('javac -cp Java_modules/lib/\* Java_modules/src/*.java',{stdio:[0,1,2]});
        //execSync('java -cp Java_modules:Java_modules/lib/\* src.Change',{stdio:[0,1,2]});
      }
  }

  function send_html(date,res){
    var processed_files = fs.readdirSync(__dirname+'/content/snaptoroads');
    jsdom.env(__dirname+"/content/views/template.html", ['http://222.85.139.245:64154/jquery-3.1.0.min.js'], function(errors, window) {
        $ = window.jQuery;
        $('nav.demo-navigation.mdl-navigation.mdl-color--blue-grey-800').html("");
        for (var i = 0 ; i < processed_files.length; i++) {
            $('nav.demo-navigation.mdl-navigation.mdl-color--blue-grey-800').append('<a class="mdl-navigation__link" href='+processed_files[i].substring(0,10)+'>' +
            '<i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">flag</i>'+processed_files[i].substring(0,10)+'</a>');
        }
        $('nav.demo-navigation.mdl-navigation.mdl-color--blue-grey-800').append('<div class="mdl-layout-spacer"></div>');
        $('#key').attr('res',date.concat(".json"));
        fs.writeFileSync(__dirname+'/content/views/out.html', window.document.documentElement.outerHTML);
        res.sendFile(__dirname + '/content/views/out.html');
        window.close();
    });

  }

  app.get('/about',(req,res)=>{
    res.send('ISCAS Traffic Group presents!');
  });

  app.get('/test',(req,res)=>{
    res.sendFile(__dirname+"/content/views/test.html");
  });

  app.get('/', function(req, res){
    check_entries("2016-03-12",res);
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
    check_entries(req.params.year+"-"+req.params.month+"-"+req.params.day,res);
    //res.sendFile(__dirname+"/content/views/"+req.params.year+"-"+req.params.month+"-"+req.params.day+".html");
  });

  app.get('/compare',function(req,res){
    console.log("Note");
    var before = req.query.res_before;
    var after = req.query.res_after;
    jsdom.env(__dirname+"/content/views/template_compare.html", ['http://222.85.139.245:64154/jquery-3.1.0.min.js'], function(errors, window) {
      $ = window.jQuery;

      $('#key').attr('res_before',before.concat(".json"));
      $('#key').attr('res_after',after.concat(".json"));
      fs.writeFileSync(__dirname+'/content/views/compare.html', window.document.documentElement.outerHTML);
      res.sendFile(__dirname + '/content/views/compare.html');
      window.close();
    });
    //res.sendFile(__dirname+"/content/views/"+req.params.year+"-"+req.params.month+"-"+req.params.day+".html");
  });

  var listener = app.listen(port,ip, function (err) {
    if (err)  console.log(err);
    else console.log("listenting at: %j",listener.address());

    fs.write(fd, `server on application ${process.pid} started, running at ip ${ip} port ${port}\r\n`,
        0,'utf8',function(e){
          if(e) throw e;
        });
  });


});

