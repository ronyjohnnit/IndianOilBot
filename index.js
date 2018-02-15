var express = require('express');
var app = express();
//var fs = require("fs");

RiveScript = require("rivescript");

// Create the bot.
var bot = new RiveScript();

var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 5000));

app.post('/listUsers', function (req, res) {
   /*fs.readFile("users.json", 'utf8', function (err, data) {

      console.log( "Request="+req);
       console.log( "Post data="+req.body.text );
       res.end( data );
   });*/
   res.end(req.body.text);
})

var server = app.listen(app.get('port'), function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})