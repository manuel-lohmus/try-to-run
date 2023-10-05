"use strict";

var configSets = require("config-sets");
var options = configSets.init({
    try_to_run: {
        retrying: 10,
        enabled: true
    }
}).try_to_run;

var fs = require("fs");
var path = require("path");
var wt = require("worker_threads");
var timeout = null;
var counter = 0;
var id = 0;

function try_to_run(filename, retrying = options.retrying, workerID = id++) {

    return (function (filename, retrying, workerID) {

        //console.log("workerID:", workerID);
        //console.log("filename:", filename);

        if (wt.workerData === workerID) return null;
        if (!filename) { filename = process.argv[1]; }

        var _options = { workerData: workerID };
        var exists = fs.existsSync(path.resolve(filename));

        if (!options.enabled) {

            if (!Array.isArray(module.workerID)) { module.workerID = []; }
            if (module.workerID.includes(workerID)) {

                if (configSets.isDebug) {
                    console.error("[ DEBUG ] 'try-to-run' Worker id:" + workerID + " is running");
                }
                return null;
            }

            module.workerID.push(workerID);

            if (exists) {
                // is file code
                require(filename);
            }
            else {
                Function(filename)();
            }
            return null;
        }

        if (!exists) { _options.eval = true; }

        var worker = new wt.Worker(filename, _options);

        worker.on("error", function (err) { console.error("[ ERROR ] 'try to run'\r\n", err + ""); });

        worker.on("exit", function (exitCode) {

            if (exitCode === 1 && (counter < retrying || 0 > retrying)) {

                counter++;
                clearTimeout(timeout);
                console.warn("[ WARN ]\r\n" + counter + ". try to run '" + filename + "'");

                try_to_run(filename, retrying, workerID);

                timeout = setTimeout(function () {

                    if (configSets.isDebug) {
                        console.log("[ DEBUG ] 'try-to-run' Resetting the retry counter.");
                    }
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

    })(filename, retrying, workerID);
}

module.exports = (function () {

    function run(filename, retrying, workerID) { return try_to_run(filename, retrying, workerID); };

    run.try_to_run = try_to_run;
    run.options = options;

    return run;
})();