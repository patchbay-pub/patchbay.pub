#!/bin/bash

set -x

server=https://patchbay.pub
token=$1

function hostFile {
        local channel=$1
        local path=$2

        while true
        do
                curl -X POST -H "Authorization: Bearer $token" $server$channel --data-binary @$path
        done
}

hostFile / ./index.html &
hostFile /apps/simple_chat ./apps/simple_chat/index.html &
hostFile /apps/simple_chat/index.js ./apps/simple_chat/index.js &

wait
