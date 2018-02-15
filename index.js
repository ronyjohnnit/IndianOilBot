var express = require('express');
var app = express();
var fs = require("fs");

app.set('port', (process.env.PORT || 5000));

app.get('/listUsers', function (req, res) {
   fs.readFile("users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})

var server = app.listen(app.get('port'), function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})