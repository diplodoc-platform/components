#!/usr/bin/env bash

set -euo pipefail

IMAGE_NAME="mcr.microsoft.com/playwright"
IMAGE_TAG="v1.48.2-noble" # This version have to be synchronized with playwright version from package.json
# noble = Ubuntu 24.04 with Node.js 22

NODE_MODULES_CACHE_DIR="$HOME/.cache/components-for-tests-playwright-docker-node-modules"

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

run_command() {
    # Check if image exists locally, if not pull it first
    if ! $CONTAINER_TOOL image inspect "$IMAGE_NAME:$IMAGE_TAG" >/dev/null 2>&1; then
        echo "Image $IMAGE_NAME:$IMAGE_TAG not found locally. Pulling..."
        $CONTAINER_TOOL pull "$IMAGE_NAME:$IMAGE_TAG"
    fi
    
    # WebServer runs inside container, so localhost:6006 should work
    # No need for host.containers.internal since everything runs in the same container
    $CONTAINER_TOOL run --rm -w /work \
        -v "$(pwd)":/work \
        -v "$NODE_MODULES_CACHE_DIR:/work/node_modules" \
        -e IS_DOCKER=1 \
        "$IMAGE_NAME:$IMAGE_TAG" \
        /bin/bash -c "$1"
}

if command_exists podman; then
  CONTAINER_TOOL="podman"
  echo "Using Podman as container tool"
elif command_exists docker; then
  CONTAINER_TOOL="docker"
  echo "Using Docker as container tool"
else
  echo "Neither Docker nor Podman is installed on the system."
  exit 1
fi

# Note: We skip the connectivity test to avoid hanging issues
# If commands hang, check that podman machine is running: podman machine list

if [[ "$1" = "clear-cache" ]]; then
    rm -rf "$NODE_MODULES_CACHE_DIR"
    rm -rf "./playwright/.cache-docker"
    exit 0
fi

if [[ ! -d "$NODE_MODULES_CACHE_DIR" ]]; then
    mkdir -p "$NODE_MODULES_CACHE_DIR"
    run_command 'npm ci'
fi

run_command "$1"