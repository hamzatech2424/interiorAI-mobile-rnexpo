# Network Connection Debug Guide

## 🔍 Network Request Failed - Troubleshooting

You're getting a **"Network request failed"** error when trying to sign in with Apple. Here's how to fix it:

### 🎯 The Problem

The error occurs because your app is trying to connect to `localhost:3000`, but:
- **On iOS Simulator**: `localhost` refers to the simulator itself, not your Mac
- **On Android Emulator**: `localhost` refers to the emulator, not your development machine
- **On Real Device**: `localhost` doesn't exist

### ✅ Solutions

#### Option 1: Use Dynamic Host (For Local Development)

The code has been updated to automatically detect your development machine's IP:

```typescript
const getBaseURL = () => {
  const hostUri = Constants.expoConfig?.hostUri?.split(':')[0];
  return hostUri ? `http://${hostUri}:3000` : BASE_URL;
};
```

**What this does:**
- Automatically uses your Mac's IP address (e.g., `http://192.168.1.100:3000`)
- Falls back to ngrok URL if IP detection fails

#### Option 2: Use Ngrok (Recommended for Apple Sign In)

Update `helper/auth-client.ts` to use ngrok:

```typescript
const getBaseURL = () => {
  // Use ngrok URL for Apple Sign In
  return BASE_URL; // "https://d65b790add9b.ngrok-free.app"
};
```

**Why ngrok is better for Apple Sign In:**
- Apple requires HTTPS for OAuth callbacks
- Ngrok provides a public HTTPS URL
- Works on any device/network

### 🛠️ How to Fix Now

**Step 1: Check Your Backend**
```bash
# Make sure your backend is running on port 3000
npm run dev
# or
node server.js
```

**Step 2: Option A - Use Your Current Setup (Dynamic IP)**
The code is already updated! Just make sure your backend is running.

**Step 3: Option B - Use Ngrok (Recommended)**

1. **Update ngrok URL if needed:**
   ```bash
   # Start ngrok
   ngrok http 3000
   
   # Copy the HTTPS URL (e.g., https://abc123.ngrok-free.app)
   ```

2. **Update `helper/auth-client.ts`:**
   ```typescript
   let BASE_URL = "https://YOUR_NEW_NGROK_URL.ngrok-free.app"
   
   const getBaseURL = () => {
     return BASE_URL; // Use ngrok
   };
   ```

3. **Update your backend Apple Sign In redirect URL:**
   - Make sure your backend is configured with the same ngrok URL

### 🧪 Testing the Connection

1. **Check the console logs:**
   ```
   🍎 Starting Apple Sign In...
   📦 Apple Sign In Response: {...}
   ```

2. **Common error messages:**
   - `Network request failed` → Backend not accessible
   - `timeout` → Backend is slow or not responding
   - `404 Not Found` → Wrong endpoint URL
   - `401 Unauthorized` → Authentication issue

3. **Test the base URL:**
   Add this to your sign-in screen to see what URL is being used:
   ```typescript
   console.log('🌐 Base URL:', getBaseURL());
   ```

### 📱 Device-Specific Solutions

**iOS Simulator:**
- Use dynamic IP (automatic) ✅
- Or use ngrok URL ✅

**Android Emulator:**
- Use `http://10.0.2.2:3000` (Android's special alias)
- Or use ngrok URL ✅

**Real Device:**
- Must be on same WiFi network as your Mac
- Use dynamic IP (automatic) ✅
- Or use ngrok URL (works anywhere) ✅

### 🔧 Quick Fix Command

Update `helper/auth-client.ts` line 19-20:

**For Ngrok (most reliable):**
```typescript
const getBaseURL = () => {
  return BASE_URL; // Uses ngrok
};
```

**For Local Development:**
```typescript
const getBaseURL = () => {
  const hostUri = Constants.expoConfig?.hostUri?.split(':')[0];
  return hostUri ? `http://${hostUri}:3000` : BASE_URL;
};
```

### ⚠️ Important for Apple Sign In

Apple Sign In requires:
1. **HTTPS URL** for redirect URIs
2. **Valid SSL certificate** (ngrok provides this)
3. **Registered redirect URI** in Apple Developer Console

**Best practice:** Use ngrok for Apple Sign In development!

### 📝 Checklist

- [ ] Backend is running on port 3000
- [ ] Updated BASE_URL if using new ngrok tunnel
- [ ] Updated getBaseURL() function
- [ ] Restarted your app after changes
- [ ] Check console logs for connection URL
- [ ] Verify Apple Developer Console settings

### 🎉 After Fixing

You should see:
```
🍎 Starting Apple Sign In...
🌐 Base URL: http://192.168.1.100:3000 (or your ngrok URL)
📦 Apple Sign In Response: { data: {...} }
✅ Welcome back!
```

Then you'll be redirected to the home screen!
