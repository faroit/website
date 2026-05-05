#!/usr/bin/env sh
set -e

if [ -x /opt/homebrew/bin/npm ]; then
  NPM_BIN=/opt/homebrew/bin/npm
else
  NPM_BIN=npm
fi

exec "$NPM_BIN" "$@"
