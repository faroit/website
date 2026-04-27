#!/usr/bin/env sh
# THIS IS A MANUAL BUILD SCRIPT
# PLEASE ONLY RUN IF TRAVIS DOESN'T WORK

# abort on errors
set -e

# build
# Node 17+ removed legacy OpenSSL providers that vuepress 1.x's webpack relies on
export NODE_OPTIONS=--openssl-legacy-provider
npm run docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

# if you are deploying to a custom domain
echo 'faroit.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
git push -f git@github.com:faroit/faroit.github.io.git master

cd -