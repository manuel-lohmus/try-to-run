# try-to-run: If happen AppCrash then try to run app again.

[![npm-version](https://badgen.net/npm/v/try-to-run)](https://www.npmjs.com/package/try-to-run)
[![npm-week-downloads](https://badgen.net/npm/dw/try-to-run)](https://www.npmjs.com/package/try-to-run)

If happen AppCrash then try to run app again.
Easy to use. 
Relaunch your app.js.

## Installing

`npm install try-to-run`

## Usage example

app.js
```js
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
```

or index.js
```js
"use strict";

require("try_to_run")("app.js");
```

#### Eval: run a code string
The built-in eval function allows to execute a string of code.
```js
var code = 'setTimeout(function () { throw new Error("Simulated crash ..."); }, 1000);';

require("try-to-run")(code, 20);
```

## License

[MIT](LICENSE)

Copyright (c) 2021 Manuel L&otilde;hmus <manuel@hauss.ee>
