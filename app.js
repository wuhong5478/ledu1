var express = require("express");
var app     = express();
var path    = require("path");

app.use(express.static(path.join(__dirname, 'static')));
app.get('/',function(req,res){
   res.sendFile(path.join(__dirname+'/index.html'));
});
app.listen(80);
console.log("Express server listening on port %d in %s mode", 80, app.settings.env);