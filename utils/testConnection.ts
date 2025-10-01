/**
 * Test Backend Connection Utility
 * Use this to verify your backend is accessible
 */

import Constants from "expo-constants";
import { Platform } from "react-native";

export const getBackendURL = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  
  const hostUri = Constants.expoConfig?.hostUri?.split(':')[0];
  if (hostUri) {
    return `http://${hostUri}:3000`;
  }
  
  return 'http://localhost:3000';
};

export const testBackendConnection = async () => {
  const baseUrl = getBackendURL();
  console.log('🔍 Testing connection to:', baseUrl);
  
  try {
    const response = await fetch(`${baseUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is reachable:', data);
      return { success: true, url: baseUrl, data };
    } else {
      console.log('⚠️ Backend responded with status:', response.status);
      return { success: false, url: baseUrl, status: response.status };
    }
  } catch (error: any) {
    console.error('❌ Cannot connect to backend:', error.message);
    return { success: false, url: baseUrl, error: error.message };
  }
};

export const logConnectionInfo = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  const platform = Platform.OS;
  const baseUrl = getBackendURL();
  
  console.log('📱 Connection Info:');
  console.log('   Platform:', platform);
  console.log('   Host URI:', hostUri);
  console.log('   Backend URL:', baseUrl);
  console.log('');
  console.log('💡 If connection fails:');
  console.log('   1. Make sure backend is running on port 3000');
  console.log('   2. Check if you can access', baseUrl, 'from your browser');
  console.log('   3. Ensure device/simulator is on same network');
};
