#!/bin/bash

# Script to kill specified processes

# Kill process running "devvit playtest" if it exists
pkill -f "devvit playtest" || true

# Kill process running "vite build --watch" if it exists
pkill -f "vite build --watch" || true

# Kill process running "devvit playtest" again if it exists
pkill -f "devvit playtest" || true

echo "Processes terminated successfully!"
