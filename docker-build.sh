#!/bin/bash

docker build -t code-a-bank .
docker run -d -t --name code-a-bank -p 3000:3000 code-a-bank