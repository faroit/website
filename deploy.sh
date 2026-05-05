#!/usr/bin/env sh
# THIS IS A MANUAL BUILD SCRIPT
# PLEASE ONLY RUN IF TRAVIS DOESN'T WORK

# abort on errors
set -e

# install and build the Vite site
./scripts/npm-local.sh install
./scripts/npm-local.sh run build:direct

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
echo 'faroit.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
git push -f git@github.com:faroit/faroit.github.io.git master

cd -
