"use strict";

var test = 'setTimeout(function () { throw new Error("Simulated crash ..."); }, 1000);';
require("../index.js")(test);
//require("try-to-run")(test, 20);