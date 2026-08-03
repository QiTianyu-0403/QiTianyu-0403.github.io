#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$script_dir"

if command -v bundle >/dev/null 2>&1; then
  bundler=bundle
elif command -v bundle3.0 >/dev/null 2>&1; then
  bundler=bundle3.0
else
  echo "Bundler is not installed. Install it with: gem install bundler" >&2
  exit 1
fi

exec "$bundler" exec ruby -rbundler/setup -r"$PWD/.jekyll_ruby3_compat.rb" -S jekyll \
  liveserve --host 0.0.0.0 --port 4000
