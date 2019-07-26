/* 
 * Custom REST routes
 *
 * Read this before doing anything:
 * REST methods: https://www.restapitutorial.com/lessons/httpmethods.html
 */
var express = require("express");
var router = express.Router();
var path = require("path");
var scriptName = path.basename(__filename);
var log4js = require("log4js");
var logger = log4js.getLogger(scriptName);

var config = require("./config.json");

var mysql = require('mysql');

var db = mysql.createPool({
    connectionLimit: 10,
    host: config["db_server"],
    port: config["db_port"],
    database: config["db_name"],
    user: config["db_user"],
    password: config["db_password"],
});

/*db.connect(function(err) {
    if (err)
        throw err;
    console.log("Connected to DB");
});*/

require("./rest_Kunde.js").register(router, db, logger);
require("./rest_Wohnung.js").register(router, db, logger);
require("./rest_Ansehen.js").register(router, db, logger);

module.exports = router;

// vim: set sw=4 ts=4 et:
