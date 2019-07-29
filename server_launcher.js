
// Parse commandline options (needed for foreground mode and pidfile)
const opt = require("node-getopt").create([
    ["F", "foreground",         "stay in foreground"],
    ["p", "pidfile=ARG",        "name of pidfile", "./mysvr.pid"],
    ["c", "config=ARG",         "the JSON config file", "./config.json"],
    ["h", "help",               "display this help"]
]).bindHelp().parseSystem();

const fs = require("fs"); 

// If in daemon mode, fork child and wait until it crashes, exits or disconnects
if (!opt.options.foreground) {
    // Spawn the child process
    var child = require("child_process").spawn(
        process.execPath,
        [ process.argv[1], "-F" ].concat(process.argv.slice(2)),
        {
            env: process.env,
            cwd: process.cwd(),
            stdio: [ "ignore", "ignore", "ignore", "ipc" ],
            detached: false
        }
    );

    // If the child exits, then just pass its exit code on
    child.on("exit", (code, signal) => {
        //console.log("child exited, code=" + code);
        process.exit(code);
    });

    // If the child disconnects, then create the pid file and exit with success
    child.on("disconnect", () => {
        //console.log("child disconnected");
        fs.writeFileSync(opt.options.pidfile, child.pid.toString() + "\n", { mode: 0o600 });
        process.exit(0);
    });

    // Don't continue this script, but let the event loop running to wait for the child startup
    return;
}

// Now we're in the child process

// Read config file
const config = require(opt.options.config);

// Set up logging
const log4js = require("log4js");
log4js.configure(config.logger);
const logger = log4js.getLogger();

// Register exit handler for cleaning up the pid file
if (!opt.options.foreground) {
    process.on("exit", (code) => {
        logger.info("Process exiting;");
        fs.unlinkSync(opt.options.pidfile);
    });

}

// Redirect exceptions to the log
process.on("uncaughtException", (err) => {
    logger.fatal(err);
    //process.exit(1);
});

// Set up the Express engine
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Do the CORS rain dance
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

// Set the static document root
const path = require("path");
logger.debug("Document root; path='" + path.join(__dirname, "public") + "'");
app.use(express.static(path.join(__dirname, "public")));

// Register routers
app.use("/rest", require("./rest.js"));

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    if (req.originalUrl.indexOf("es6-promise/es6-promise.map") == -1) {
        var err = new Error("Not Found - " + req.originalUrl);
        err.status = 404;
        next(err);
    }
});

// Error handler
app.use((err, req, res, next) => {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = (req.app.get("env") === "development") ? err : {};
    logger.error(err);
    // Render the error page
    res.status(err.status || 500);
    res.send((err instanceof Error) ? err.message : err);
});

// Get port from environment and store in Express.
var port = parseInt(config.server_port, 10) || 8080;
if (isNaN(port)) {
    port = config.server_port; // named pipe
}
var listen_info = "Listen address; ";
if (process.env.host != undefined) {
    listen_info += "host='" + process.env.host + "', ";
}
listen_info += "port='" + port + "', protocol='http'";
logger.info(listen_info);
app.set("port", port);

// Create an http server within the Express app
const http = require("http");
const server = http.createServer(app);

// Die quickly and noisily if the server can't start up
server.on("error", (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }

    var bind_info = ((typeof port === "string") ? "pipe" : "port") + "='" + port + "'";
    // Handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            logger.fatal("Address requires elevated privileges; " + bind_info);
            process.exit(1);
            break;

        case "EADDRINUSE":
            logger.fatal("Address is already in use; " + bind_info);
            process.exit(1);
            break;

        default:
            throw error;
    }
});

// Exit normally if the server has closed
server.on("close", () => {
    logger.info("Server closed;");
    process.exit(0);
});

// Finish the startup when the server has actually started listening
server.on("listening", () => {
    var addr = server.address();
    var bind_info = ((typeof addr === "string") ? "pipe" : "port") + "='" + addr.port + "'";
    logger.info("Server is listening; " + bind_info);

    // Register handlers for external kill signals
    function cleanup() {
        logger.info("Closing server;");
        server.close();
        process.exit(0);
    }
    process.on("SIGINT", () => { cleanup(); });
    process.on("SIGTERM", () => { cleanup(); });

    // Startup complete, let the launcher process finish
    if (!opt.options.foreground) {
        process.disconnect();
    }
});

// Start listening
server.listen(port);

// vim: set ts=4 sw=4 et:
