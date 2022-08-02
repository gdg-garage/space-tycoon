# Space Tycoon

## Observe the API in Swagger
https://editor.swagger.io/?url=https://raw.githubusercontent.com/gdg-garage/space-tycoon/master/api/swagger.yaml

## Dev

```shell
docker-compose up sever adminer
```
This will also run container `db`.

Containers:
* `server` - App server listening on port 80.
* `adminer` - Db interface running on port 8080.
* `db` - (Mariadb) with password `secret` and database `space_tycoon` with all tables and procedures included from `database` directory.
* `server-tidy` - `go mod tidy` = Update and cleanup go dependencies (go.mod) using the container. 
