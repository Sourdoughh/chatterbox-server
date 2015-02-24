var express = require('express');
var fsUtils = require('fs-utils');
var cors = require('cors');
var bodyParser = require('body-parser');
var serverData = require('server/serverData.json');
var app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/classes/messages', function (req, res) {
  res.send(serverData);
});

app.post('/classes/messages', function (req, res){
  console.log(req.body);
  serverData.results.push(req.body);
  fsUtils.writeJSON('server/serverData.json', serverData);
});


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
