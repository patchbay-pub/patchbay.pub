#!/bin/bash

set -x

rootChannel=$1
token="dummytoken"
if [ $2 ]
then
        token=$2
fi

# kill all child processes on exit
trap 'kill $(jobs -p)' EXIT

function hostFile {
        local channel=$1
        local path=$2

        for workerId in {1..8}
        do
                echo "Starting worker $workerId for $path at $rootChannel$channel"
                hostFileWorker $channel $path $workerId &
        done

        wait
}

function hostFileWorker {
        local channel=$1
        local path=$2
        local workerId=$3

        while true
        do
                curl -X POST -H "Authorization: Bearer $token" $rootChannel$channel --data-binary @$path 1>>./logs${channel}_stdout 2>>./logs${channel}_stderr

                if [ "$?" -ne "0" ]; then
                        sleep 1
                fi
        done
}


hostFile /favicon.ico ./favicon.ico &
hostFile / ./index.html &

./apps/simple_chat/host.sh $rootChannel $token /apps/simple_chat &

wait
