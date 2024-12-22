#!/bin/bash

set -e

source ./playwright/variables.sh

HOST_COMPONENTS_DIR="./src/components"

docker build --no-cache -t $IMAGE_NAME -f ./playwright/Dockerfile . &&  
docker run --rm -v $HOST_COMPONENTS_DIR:$CONTAINER_COMPONENTS_DIR $IMAGE_NAME