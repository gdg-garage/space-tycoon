#!/bin/bash

rm -rf server/gen

docker-compose run server-gen

mkdir -p server/stycoon/models

mv server/gen/go/*.go server/stycoon/models/

rm -rf server/gen

# Garbage
rm server/stycoon/models/api.go
rm server/stycoon/models/routers.go