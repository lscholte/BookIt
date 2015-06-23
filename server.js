//Packages
var express = require('express');
var app = express();
var path = require('path');
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);
app.get('/', function(req,res){
	res.sendFile(path.join(__dirname + '/app/views/index.html'));
});
 app.listen(1337);
console.log('1337 is the magic port!');