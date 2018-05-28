var express =   require("express");
var multer  =   require('multer');
var app         =   express();
var bodyParser = require("body-parser");

var unzip =require('unzip');
var AdmZip = require('adm-zip');
const fs = require('fs-extra')
//app.use(bodyParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    //console.log(req.body);
    callback(null,'./uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage}).single('projet');

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.post('/upload',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        var path = "./uploads/" + req.file.originalname;
       var destination_path=req.body.destination; //".";
        console.log(req.body.destination);
        console.log(req.file.originalname);
       /*fs.renameSync(path,destination_path+ "/" + req.file.originalname, (err) => {
          if (err) throw err;
          console.log('Rename complete!');
        });*/
        fs.move(path, destination_path+ "/" + req.file.originalname , { overwrite: true }, err => {
          if (err) return console.error(err)

          console.log('success!')
        })
        res.end("File is uploaded");
        console.log(destination_path+ "/" + req.file.originalname);
      //  fs.createReadStream(destination_path+ "/" + req.file.originalname).pipe(unzip.Extract({ path: destination_path+ "/" + req.file.originalname }));
});
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.listen(3001,function(){
    console.log("Working on port 3001");
});
