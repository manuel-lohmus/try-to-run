"use strict";

var code = 'setTimeout(function () { throw new Error("Simulated crash ..."); }, 1000);';
require("./../index.min.js")(code);
//require("try-to-run")(code, 20);