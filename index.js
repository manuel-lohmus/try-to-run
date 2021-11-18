"use strict";

var path = require("path");
var wt = require("worker_threads");
var timeout = null;
var counter = 0;


function try_to_run(filename, retrying) {

    var worker = new wt.Worker(filename);

    worker.on("error", function (err) {

        console.error("\r\n", err);
    });

    worker.on("exit", function (exitCode) {

        if (counter < retrying || 0 > retrying) {

            counter++;
            clearTimeout(timeout);
            console.warn("\r\n" + counter + ". try to run '" + path.parse(filename).base + "'");

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
}

module.exports = function (filename, retrying = 10) {

    if (!filename) { filename = process.argv[1]; }
    if (wt.isMainThread) { try_to_run(filename, retrying); }

    return wt.isMainThread;
};