#!/usr/bin/env bash

HOST=""
PORT=3306

declare -a ARGS
while [ ${#@} != 0 ]; do
	case "$1" in
		-h|--host)
            HOST="$2"
            shift 2
            ;;
		-P|--port)
            PORT="$2"
            shift 2
            ;;
		*)
            if [ "${1:0:7}" = "--host=" ]; then
                HOST="${1:7}"
            elif [ "${1:0:7}" = "--port=" ]; then
                PORT="${1:7}"
            else
                ARGS[${#ARGS[*]}]="$1"
            fi
            shift
            ;;
	esac
done
set -- "${ARGS[@]}"
unset ARGS

if [ -z "$HOST" ]; then
    echo "Usage: $0 -h|--host=HOST [-p|--port PORT] <other mysql args>"
    exit 1
fi

coproc PFWD { oc port-forward "$HOST" ":$PORT" | sed -urn 's/^Forwarding from 127.0.0.1:([0-9]*).*/\1/p'; }
read -u ${PFWD[0]} LPORT
#echo "Forwarder pid=$PFWD_PID, local port=$LPORT"

mysql -h 127.0.0.1 -P "$LPORT" "$@"

kill "$PFWD_PID"

# vim: set sw=4 ts=4 et:
