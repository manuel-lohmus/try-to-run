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

## License

The [MIT](LICENSE) License
```txt
Copyright (c) 2021 Manuel Lõhmus <manuel@hauss.ee>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
