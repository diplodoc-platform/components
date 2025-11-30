#!/usr/bin/env bash

set -euo pipefail

IMAGE_NAME="playwright-docker-node22"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_MODULES_CACHE_DIR="$HOME/.cache/components-for-tests-playwright-docker-node-modules"

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

build_image() {
  if ! $CONTAINER_TOOL image inspect "$IMAGE_NAME" >/dev/null 2>&1; then
    echo "Building Docker image with Node 22..."
    $CONTAINER_TOOL build -t "$IMAGE_NAME" -f "$SCRIPT_DIR/Dockerfile" "$SCRIPT_DIR"
  fi
}

run_command() {
    build_image
    $CONTAINER_TOOL run --rm -w /work \
        -v "$(pwd)":/work \
        -v "$NODE_MODULES_CACHE_DIR:/work/node_modules" \
        -e IS_DOCKER=1 \
        "$IMAGE_NAME" \
        /bin/bash -c "$1"
}

if command_exists podman; then
  CONTAINER_TOOL="podman"
  echo "Using Podman"
elif command_exists docker; then
  CONTAINER_TOOL="docker"
  echo "Using Docker"
else
  echo "Neither Docker nor Podman is installed."
  exit 1
fi

if [[ "$1" = "clear-cache" ]]; then
    rm -rf "$NODE_MODULES_CACHE_DIR"
    $CONTAINER_TOOL rmi "$IMAGE_NAME" 2>/dev/null || true
    exit 0
fi

if [[ ! -d "$NODE_MODULES_CACHE_DIR" ]]; then
    mkdir -p "$NODE_MODULES_CACHE_DIR"
    run_command 'npm ci'
fi

run_command "$1"
