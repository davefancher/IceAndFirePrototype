var express = require("express");

var port = 3000;
var app = express();

app.use(express.static(__dirname));
app.listen(port, () => console.log("Started listening on port", 3000));
