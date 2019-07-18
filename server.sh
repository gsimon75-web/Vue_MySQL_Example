#!/usr/bin/env bash

## To debug this script:
#exec > >(tee -a /tmp/x.log) 2> >(tee -a /tmp/x.log >&2) 
#set -v -x

THIS_PATH=$(readlink -m $(dirname -- $0))
cd "$THIS_PATH"

export PIDFILE='/tmp/maklerbuero.pid'
export DEBUG=server:*
export NODE_ENV=development

function get_server_pid() {
    # check if the pidfile exists and readable
    if [ -r "$PIDFILE" ]; then
        # read the pid from the pidfile
        local PID=$(<$PIDFILE)
        # try to get the name of that process (if exists)
        local PIDCMD=$(ps -p $PID -o comm=)
        if [ $? -eq 0 -a "$PIDCMD" = "node" ]; then
            # if it exists and is a 'node' process, then return it
            echo $PID
            return 0
        fi
        # now the pidfile is stale anyway, remove it
        rm -f $PIDFILE 2>/dev/null
    fi
    return 1
}

function do_stop() {
    echo -n "Stopping server... "
    PID=$(get_server_pid)
    if [ $? -ne 0 ]; then
        echo "was not running, ok."
    else
        kill $PID
        if [ $? -ne 0 ]; then
            echo "Failed to kill process $PID"
            return 1
        fi
        rm -f $PIDFILE 2>/dev/null
        echo "done, ok."
    fi
}

function do_start() {
    echo -n "Starting server... "
    node "$THIS_PATH/server_launcher.js" -p "$PIDFILE"
    if [ $? -ne 0 ]; then
        echo "Failed."
        return 1
    fi
    echo "done, ok."
}

# do status if no arg is given
case "${1:-status}" in
    stop)
        do_stop
        ;;

    start|restart)
        do_stop && do_start
        ;;

    status)
        echo -n "Server is "
        if get_server_pid > /dev/null; then
            echo "running."
        else
            echo "stopped."
            exit 1
        fi
        ;;

    *)
        echo "Unsupported action '$1' (should be one of start, stop, restart, status)"
        exit 2
esac

# vim: set sw=4 ts=4 et:
