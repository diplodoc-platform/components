#!/usr/bin/env bash

set -euo pipefail

IMAGE_NAME="mcr.microsoft.com/playwright"
IMAGE_TAG="v1.48.2-noble" # This version have to be synchronized with playwright version from package.json
# noble = Ubuntu 24.04 with Node.js 22

NODE_MODULES_CACHE_DIR="$HOME/.cache/components-for-tests-playwright-docker-node-modules"

command_exists() {
  command -v "$*" >/dev/null 2>&1
}

run_command() {
  # Build container run command based on container tool and OS
  # Docker on Linux can use --network host, but Docker Desktop on macOS doesn't support it
  # Podman on macOS also needs port mapping instead of --network host
  # Since webServer runs inside container, localhost works for all cases
  # Note: removed -it flag for tests as it can interfere with webServer
  if [[ "$CONTAINER_TOOL" == "docker" ]] && [[ "$(uname -s)" != "Darwin" ]]; then
    # Docker on Linux: use --network host
    $CONTAINER_TOOL run --rm --network host -w /work \
      -v $(pwd):/work \
      -v "$NODE_MODULES_CACHE_DIR:/work/node_modules" \
      -e IS_DOCKER=1 \
      "$IMAGE_NAME:$IMAGE_TAG" \
      /bin/bash -c "$*"
  else
    # Docker Desktop on macOS or Podman: don't use --network host
    # Everything runs in the same container, so localhost works
    $CONTAINER_TOOL run --rm -w /work \
      -v $(pwd):/work \
      -v "$NODE_MODULES_CACHE_DIR:/work/node_modules" \
      -e IS_DOCKER=1 \
      "$IMAGE_NAME:$IMAGE_TAG" \
      /bin/bash -c "$*"
  fi
}

run_dev_command() {
  # Run command with port mapping for storybook (6006)
  # This allows accessing storybook from host machine
  $CONTAINER_TOOL run --rm -it -w /work \
    -v $(pwd):/work \
    -v "$NODE_MODULES_CACHE_DIR:/work/node_modules" \
    -e IS_DOCKER=1 \
    -p 6006:6006 \
    "$IMAGE_NAME:$IMAGE_TAG" \
    /bin/bash -c "$*"
}

# On macOS, prefer Podman as Docker Desktop often has credential issues
if [[ "$(uname -s)" == "Darwin" ]] && command_exists podman; then
  CONTAINER_TOOL="podman"
  echo "Using Podman as container tool (macOS)"
elif command_exists docker; then
  CONTAINER_TOOL="docker"
  echo "Using Docker as container tool"
elif command_exists podman; then
  CONTAINER_TOOL="podman"
  echo "Using Podman as container tool"
else
  echo "Neither Docker nor Podman is installed on the system."
  exit 1
fi

if [[ "$*" = "clear-cache" ]]; then
  rm -rf "$NODE_MODULES_CACHE_DIR"
  rm -rf "./playwright/.cache-docker"
  exit 0
fi

if [[ "$*" = "dev" ]] || [[ "$*" =~ "npm run dev" ]] || [[ "$*" =~ "storybook" ]]; then
  # Run storybook with port mapping
  if [[ ! -d "$NODE_MODULES_CACHE_DIR" ]]; then
    mkdir -p "$NODE_MODULES_CACHE_DIR"
    run_command 'echo "engine-strict=false" > .npmrc && npm ci --ignore-engines'
  fi
  echo "Starting storybook in Docker with port 6006 mapped to host..."
  echo "Access storybook at http://localhost:6006"
  run_dev_command "$*"
  exit 0
fi

if [[ ! -d "$NODE_MODULES_CACHE_DIR" ]]; then
  mkdir -p "$NODE_MODULES_CACHE_DIR"
  echo "[DOCKER] Installing dependencies..."
  # Create .npmrc to ignore engine requirements (Node.js version check)
  run_command 'echo "engine-strict=false" > .npmrc && npm ci --ignore-engines'
fi

echo "[DOCKER] Running command: $*"
echo "[DOCKER] BASE_URL will be: ${BASE_URL:-http://localhost:6006}"
echo "[DOCKER] IS_DOCKER will be set to 1"
run_command "$*"
