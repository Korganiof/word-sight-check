#!/bin/sh
# Renders the share card and the iOS home-screen icon from the HTML sources
# in this folder with headless Chrome (fonts come from public/fonts).
set -e
cd "$(dirname "$0")"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --virtual-time-budget=3000 \
  --screenshot="$PWD/../../public/og-lukutaju.png" "file://$PWD/og-card.html"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=180,180 --virtual-time-budget=3000 \
  --screenshot="$PWD/../../public/apple-touch-icon.png" "file://$PWD/touch-icon.html"
