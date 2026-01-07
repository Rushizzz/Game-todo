FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies for Android SDK and Node.js
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g eas-cli

# Set up Android SDK variables
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

# Download and install Android SDK Command Line Tools
WORKDIR /opt/android-sdk/cmdline-tools
RUN curl -o commandlinetools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip \
    && unzip commandlinetools.zip \
    && mv cmdline-tools latest \
    && rm commandlinetools.zip

# Accept licenses and install Android SDK components
# Expo 52+ typically targets API 35/34. Installing 34 and 35, along with build-tools.
RUN yes | sdkmanager --licenses \
    && sdkmanager "platform-tools" "platforms;android-34" "platforms;android-35" "build-tools;34.0.0" "build-tools;35.0.0"

# Set working directory for the project
WORKDIR /app

# Check versions
RUN java -version && node -v && eas --version && sdkmanager --version

CMD ["/bin/bash"]
