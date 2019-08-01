
// Parse commandline options (needed for foreground mode and pidfile)
const opt = require("node-getopt").create([
    ["F", "foreground",         "stay in foreground"],
    ["p", "pidfile=ARG",        "name of pidfile"],
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
        if (opt.options.pidfile) {
            fs.writeFileSync(opt.options.pidfile, child.pid.toString() + "\n", { mode: 0o600 });
        }
        process.exit(0);
    });

    // Don't continue this script, but let the event loop running to wait for the child startup
    return;
}

// Now we're in the child process

// Register exit handler for cleaning up the pid file
if (opt.options.pidfile) {
    process.on("exit", (code) => {
        fs.unlinkSync(opt.options.pidfile);
    });
}

require("./server");

// vim: set ts=4 sw=4 et:
