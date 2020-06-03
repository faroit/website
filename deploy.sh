#!/usr/bin/env sh
# THIS IS A MANUAL BUILD SCRIPT
# PLEASE ONLY RUN IF TRAVIS DOESN'T WORK

# abort on errors
set -e

# build
npm run docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

# if you are deploying to a custom domain
echo 'www.faroit.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
git push -f git@github.com:faroit/faroit.github.io.git master

cd -