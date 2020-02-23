FROM ubuntu:latest
RUN set -x \
    && apt-get update \
    && apt-get upgrade -y \
    && apt-get dist-upgrade -y \
    && apt-get autoclean \
    && apt-get autoremove \
    && apt-get install bash curl -y \
    && curl -sL https://deb.nodesource.com/setup_12.x | bash - \
    && apt-get install python2.7 nodejs cmake curl git gcc clang default-jre -y
SHELL ["/bin/bash", "-c"]
RUN set -x \
    && git clone https://github.com/emscripten-core/emsdk.git \
    && cd emsdk \
    && ./emsdk install latest \
    && ./emsdk activate latest \
    && source ./emsdk_env.sh 