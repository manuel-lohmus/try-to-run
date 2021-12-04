"use strict";

/* longer version */
var try_to_run = require("./../index");
//var try_to_run = require("try-to-run");
var isMainThread = try_to_run(__filename, 20);
if (isMainThread) return;

/* short version */
//if (require("try-to-run")()) return;


console.time("Time");
var http = require("http");
var port = process.env.PORT || 1337;
var server = http.createServer();

// Console log
server.on("request", function (req, res) {
    console.timeLog("Time", "Url: " + req.headers.host + req.url);
});

// Simulated crash ...
server.on("request", function (req, res) {
    if (req.url === "/crash") { throw new Error("Simulated crash ..."); }
});

// Shutdown ...
server.on("request", function (req, res) {
    if (req.url === "/shutdown") { require("worker_threads").parentPort.postMessage("kill"); }
});

// Test page.
server.on("request", function (req, res) {

    if (req.url === "/") {

        res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
        res.end(`
<!doctype html>
<html>
<head>
    <title>Test</title>
</head>
<body>
    Test ... <a href="/crash">crash</a>
</body>
</html>`);
    }
    else {

        console.warn("Warning: 404 Not Found. Url: " + req.headers.host + req.url);
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found Url: " + req.url);
    }
});

server.listen(port, function (err) {

    if (err)
        console.error(err)
    else
        console.log("\r\nWebserver port:" + port + " pid:" + process.pid);
});

var url = `http://localhost${(port === 443 || port === 80 ? '' : ':' + port)}/`;
require("browse-url")(url);