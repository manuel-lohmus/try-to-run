"use strict";

var fs = require("fs");
var path = require("path");
var wt = require("worker_threads");
var timeout = null;
var counter = 0;


function try_to_run(filename, retrying = 10) {

    if (wt.workerData === "try-to-run") return null;
    if (!filename) { filename = process.argv[1]; }

    var options = { workerData: "try-to-run" };
    var exists = fs.existsSync(path.resolve(filename));

    if (!exists) { options.eval = true; }

    var worker = new wt.Worker(filename, options);

    worker.on("error", function (err) { console.error("\r\n", err); });

    worker.on("exit", function (exitCode) {

        if (counter < retrying || 0 > retrying) {

            counter++;
            clearTimeout(timeout);
            console.warn("\r\n" + counter + ". try to run '" + filename + "'");

            try_to_run(filename, retrying);

            timeout = setTimeout(function () {

                console.log("\r\nResetting the retry counter.");
                counter = 0;
            }, 30000);
        }
        else {
            clearTimeout(timeout);
        }
    });

    worker.on("message", function (msg) {

        if (msg === "kill") {
            worker.removeAllListeners("exit");
            worker.terminate();
        }
    });

    return worker;
}

module.exports = (function () {

    function run(filename, retrying = 10) {


        return try_to_run(filename, retrying);
    };

    run.try_to_run = try_to_run;

    return run;
})();