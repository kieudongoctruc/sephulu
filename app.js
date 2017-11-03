var express = require('express');
var http  = require('http');

var port = process.env.PORT || 3000;

var app = express();

app.use(express.static(__dirname + '/dist'));

// This will ensure that all routing is handed over to AngularJS
app.get('*', function(req, res){
  res.sendfile(__dirname + '/dist/index.html');
});

//for any resources, use for html5mode
app.all("/*");
app.set('port', port);

var server = http.createServer(app);
app.listen(port, () => console.log('Running'));
