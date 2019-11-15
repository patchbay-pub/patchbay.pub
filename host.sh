#!/bin/bash

set -x

server=$1
token=$2

# kill all child processes on exit
trap 'kill $(jobs -p)' EXIT

function hostFile {
        local channel=$1
        local path=$2

        while true
        do
                curl -X POST -H "Authorization: Bearer $token" $server$channel --data-binary @$path 1>>./logs${channel}_stdout 2>>./logs${channel}_stderr

                if [ "$?" -ne "0" ]; then
                        sleep 1
                fi
        done
}

hostFile /favicon.ico ./favicon.ico &
hostFile / ./index.html &

./apps/simple_chat/host.sh $server $token /apps/simple_chat &

wait
