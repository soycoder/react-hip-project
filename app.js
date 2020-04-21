var express = require('express');
var path = require('path');
const https = require("https");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;


var app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.post("/api/auth/", (_req, _res) => {
  var options = {
    method: "POST",
    hostname: "restapi.tu.ac.th",
    path: "/api/v1/auth/Ad/verify",
    headers: {
      "Content-Type": "application/json",
      "Application-Key":
        "MjU0OTNkYjM1MWE5Mzk0MGVlNzU3MGUyMzRiYWQ0N2ZkOGFmMGJkMWVkNjBiMDEwYTJhZTliMzNkZGU5ZTMzMw==",
    },
  };

  var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      // console.log(JSON.parse(body.toString()));
      _res.status(200).json(JSON.parse(body.toString()));
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });

  var postData =
    '{\n\t"UserName":"' +
    _req.body.username +
    '",\n\t"PassWord":"' +
    _req.body.password +
    '"\n}';

  req.write(postData);

  req.end();
});

// starting the server
app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
