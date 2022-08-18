cp example-bot/bot.py /tmp

rm -rf example-bot

docker-compose run swagger-client-gen

cp /tmp/bot.py example-bot

chmod -R a+rw example-bot

