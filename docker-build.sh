#!/bin/bash

VERSION=`node -p "require('./package.json').version"`

docker build -t numeration-animation:$VERSION .
