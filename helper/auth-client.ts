import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

let APPLE_APP_BUNDLE_ID = "com.solaera-app.io"

// Get the base URL for the backend
const getBaseURL = () => {
  // For Android emulator, use special address
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  
  // For iOS simulator/real device, use the dev machine's IP
  const hostUri = Constants.expoConfig?.hostUri?.split(':')[0];
  if (hostUri) {
    const baseUrl = `http://${hostUri}:3000`;
    console.log('🌐 Using Base URL:', baseUrl);
    return baseUrl;
  }
  
  // Fallback to localhost (won't work on device, but safe fallback)
  console.warn('⚠️ Could not detect host, using localhost');
  return 'http://localhost:3000';
};

export const { signIn, signUp, useSession, getCookie, signOut } = createAuthClient({
    baseURL: getBaseURL(),
    plugins: [
        expoClient({
            scheme: "interiorai",
            storagePrefix: "interiorai",
            storage: SecureStore,
        })
    ],
    socialProviders: {
        apple: {
          clientId: APPLE_APP_BUNDLE_ID, // 👈 use the bundle id here
          appBundleIdentifier: APPLE_APP_BUNDLE_ID,
        },
      },
});
