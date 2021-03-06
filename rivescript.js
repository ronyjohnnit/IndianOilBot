// RiveScript-JS
//
// Node.JS Web Server for RiveScript
//
// Run this and then communicate with the bot using `curl` or your favorite
// REST client. Example:
//
// curl -i \
//    -H "Content-Type: application/json" \
//    -X POST -d '{"username":"soandso","message":"hello bot"}' \
//    http://localhost:2001/reply

var express = require("express"),
    bodyParser = require("body-parser"),
    RiveScript = require("rivescript");

// Create the bot.
var bot = new RiveScript();
bot.loadDirectory("brain", success_handler, error_handler);

function success_handler (loadcount) {
    console.log("Load #" + loadcount + " completed!");

    bot.sortReplies();

    // Set up the Express app.
    var app = express();
app.set('port', (process.env.PORT || 5000));
    // Parse application/json inputs.
    app.use(bodyParser.json());
    app.set("json spaces", 4);

    // Set up routes.
    app.post("/reply", getReply);
    app.get("/", showUsage);
    app.get("*", showUsage);

    // Start listening.
   var server = app.listen(app.get('port'), function() {
        var host = server.address().address
  var port = server.address().port
        console.log("Listening on http://%s:%s", host, port);
    });
}

function error_handler (loadcount, err) {
    console.log("Error loading batch #" + loadcount + ": " + err + "\n");
}

// POST to /reply to get a RiveScript reply.
function getReply(req, res) {
    // Get data from the JSON post.
    var username = req.body.username;
    var message  = req.body.message;
    var vars     = req.body.vars;

    // Make sure username and message are included.
    if (typeof(username) === "undefined" || typeof(message) === "undefined") {
        return error(res, "username and message are required keys");
    }

    // Copy any user vars from the post into RiveScript.
    if (typeof(vars) !== "undefined") {
        for (var key in vars) {
            if (vars.hasOwnProperty(key)) {
                bot.setUservar(username, key, vars[key]);
            }
        }
    }

    // Get a reply from the bot.
    var reply = bot.reply(username, message, this);

    reply = transformation(reply);

    // Get all the user's vars back out of the bot to include in the response.
    vars = bot.getUservars(username);

    // Send the JSON response.
    res.json({
        "status": "ok",
        "reply": reply,
        "vars": vars
    });
}

// All other routes shows the usage to test the /reply route.
function showUsage(req, res) {
    var egPayload = {
        "username": "soandso",
        "message": "Hello bot",
        "vars": {
            "name": "Soandso"
        }
    };
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("Usage: curl -i \\\n");
    res.write("   -H \"Content-Type: application/json\" \\\n");
    res.write("   -X POST -d '" + JSON.stringify(egPayload) + "' \\\n");
    res.write("   http://localhost:2001/reply");
    res.end();
}

function transformation(reply) {
        if (reply.includes("IOCLdealer:")) {


            var arr = reply.split(":");
           // console.log("arr[0]=" + arr[0]);
           // console.log("arr[1]=" + arr[1]);
            var salesfigure =
                    {

                        "raj automobile": {"petrol": "25 KL", "diesel": "30 KL"},
                        "rohit service station": {"petrol": "50 KL", "diesel": "40 KL"},
                        "risal petro": {"petrol": "75 KL", "diesel": "50 KL"}
                    }

            var entry = salesfigure[arr[1]];
          //  console.log("entry=" + entry);
            // alert(entry.petrol);
            if (entry != null) {
                reply = "The sales figure for MS is " + entry.petrol + " and HSD is " + entry.diesel;
            } else {

                reply = "Sorry I couldn't find "+arr[1]+" from my database.";
            }
        }

        if (reply.includes("IOCL:ms")) {

            reply = "15450 KL";
        }

        if (reply.includes("IOCL:hsd")) {

            reply = "13450 KL";
        }
        return reply
    }

// Send a JSON error to the browser.
function error(res, message) {
    res.json({
        "status": "error",
        "message": message
    });
}