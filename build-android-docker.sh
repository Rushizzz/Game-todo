#!/bin/bash

# Build the Docker image
echo "Building Docker image 'eas-builder'..."
docker build -t eas-builder .

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Docker image build failed."
    exit 1
fi

echo "Running EAS Android build inside Docker..."

# Run the container
# -v $(pwd):/app: Mounts the current directory to /app in the container
# --rm: Removes the container after it exits
# -it: Interactive mode (useful for seeing logs and potential prompts)
# We default to running 'eas build --local --platform android'
# User might need to pass EXPO_TOKEN env var if not relying on cached credentials or interactive login

# Check for EXPO_TOKEN
if [ -z "$EXPO_TOKEN" ]; then
    echo "Warning: EXPO_TOKEN is not set."
    echo "Build might fail if authentication is required."
    echo "Usage: EXPO_TOKEN=... ./build-android-docker.sh"
    echo "Or export EXPO_TOKEN in your shell."
fi

docker run --rm -it \
    -v "$(pwd)":/app \
    -e EXPO_TOKEN="$EXPO_TOKEN" \
    eas-builder \
    /bin/bash -c "git config --global --add safe.directory '*' && eas build --local --platform android --output ./build.apk --non-interactive --no-wait"
