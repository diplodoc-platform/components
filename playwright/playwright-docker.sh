#!/bin/bash

set -e

. ./playwright/variables.sh

HOST_COMPONENTS_DIR="./src/components"
HOST_REPORT_DIR="./playwright-report"

if [ -z "$1" ]; then
  echo "Usage: $0 <spec-file>"
  exit 1
fi

docker build -t $IMAGE_NAME -f ./playwright/Dockerfile . && \
docker run --rm \
  -v $HOST_COMPONENTS_DIR:$CONTAINER_COMPONENTS_DIR \
  -v $HOST_REPORT_DIR:$CONTAINER_REPORT_DIR \
  $IMAGE_NAME \
  bash -c "npx playwright test $@"
