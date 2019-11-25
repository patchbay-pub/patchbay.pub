#!/bin/bash

#set -x

server=$1
token=$2
rootChannel=$3

# kill all child processes on exit
trap 'kill $(jobs -p)' EXIT

# https://stackoverflow.com/a/246128/943814
scriptPath="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

function hostFile {
        local channel=$1
        local path=$2

        for workerId in {1..4}
        do
                echo "Starting worker $workerId for $path"
                hostFileWorker $channel $path $workerId &
        done

        wait
}

function hostFileWorker {
        local channel=$rootChannel$1
        local path=$scriptPath/$2
        local workerId=$3

        while true
        do
                curl -X POST -H "Authorization: Bearer $token" $server$channel --data-binary @$path 1>>.$rootChannel.stdout 2>>.$rootChannel.stderr

                if [ "$?" -ne "0" ]; then
                        sleep 1
                fi
        done
}

hostFile / index.html &
hostFile /chat.css chat.css &
hostFile /index.js index.js &
hostFile /chat.js chat.js &

wait
