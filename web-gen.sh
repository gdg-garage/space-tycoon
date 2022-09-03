
docker-compose run visualization-gen

cd web/js/client
npm install
npm link
cd ../..
npm link $PWD/js/client/
npm run build

echo
echo
echo "run 'cd web && npm run watch' to automatically detected changes in index.js and regenerate bundle.js"
