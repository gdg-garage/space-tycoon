#!/bin/bash

rm -rf server/gen

rm -f server/stycoon/helpers.go
rm -f server/stycoon/impl.go
rm -f server/stycoon/model_*.go

docker-compose run server-gen

mv server/gen/go/helpers.go server/stycoon/
mv server/gen/go/impl.go server/stycoon/
mv server/gen/go/model_*.go server/stycoon/

rm -rf server/gen
