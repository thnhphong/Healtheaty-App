#!/bin/bash

# 👋 Welcome to Healtheaty Dev Script
echo "🚀 Starting Healtheaty app in iOS Simulator..."

# ✅ Open iOS Simulator if not already running
open -a Simulator

# ✅ Export environment for debug + disable Expo telemetry
export EXPO_NO_TELEMETRY=1
export EXPO_DEBUG=true

# ✅ Wait a moment to ensure Simulator is open
sleep 2

# ✅ Start Expo with iOS only, no web
npx expo start --ios
