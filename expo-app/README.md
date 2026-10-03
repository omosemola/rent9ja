# Rent9ja Expo App

This is a modern React Native (Expo) port of the Rent9ja Flutter application. It aims to provide the exact same user experience and UI but is built with a strictly typed React Native architecture using the Expo framework.

## Tech Stack & Architecture

- **Framework**: [Expo](https://expo.dev/) managed workflow
- **Language**: TypeScript (Strict mode enabled)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: `StyleSheet.create` with Flexbox layouts
- **Icons**: `@expo/vector-icons` (Ionicons)
- **API/Network**: native `fetch` within customized service singletons

## Features Implemented

- Role-based tabs navigation (Hunter vs. Landlord)
- Global state configuration (`authStore`, `propertiesStore`) with backend data normalization
- Dynamic Search UI with BottomSheet filtering
- Nested routing screens (Property detail, Chat messages, Edit Profile, Settings, etc.)
- Strict UI parity with the original Flutter implementation (components, colors, radii, spacing)

## Running the App

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open on your device via the Expo Go app.

## Status

Migration from Flutter to Expo React Native is fully complete. The app bundle compiles successfully.
