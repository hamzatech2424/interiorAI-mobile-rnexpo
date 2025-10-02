import axios from "axios";
import { Alert } from "react-native";
import { logout } from "../controllerHooks/useAuthController";
import { getCookie } from "../helper/auth-client";
import { BASE_URL } from "../proxy";

let isHandlingSessionExpiry = false;
export const TOKEN_KEY = "API_JWT_TOKEN";

export const useApiClient = () => {
   
  const api = axios.create({
    baseURL: BASE_URL,
  });

  const handleTokenExpiration = async () => {
    if (isHandlingSessionExpiry) return;
    isHandlingSessionExpiry = true;

    Alert.alert(
      "Session Expired",
      "Your session has expired. Please log in again.",
      [
        {
          text: "OK",
          onPress: async () => {
            try {
              await logout();
            } finally {
              isHandlingSessionExpiry = false;
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Request interceptor
  api.interceptors.request.use(async (config) => {
    try {
      const cookies = getCookie();
      console.log(cookies, "cookies")
      if (cookies) {
        config.headers = {
          ...config.headers,
          Cookie: cookies,
          credentials: "omit"
        };
      }
    } catch (err) {
      console.log("❌ Error fetching token:", err);
    }

    if (__DEV__) {
      console.log("🚀 Axios Request Details:");
      console.log("📡 Method:", config.method?.toUpperCase());
      console.log("🌐 URL:", config.url);
      console.log("🔑 Headers:", config.headers);
      console.log("📦 Request Body:", config.data);
      console.log("🔍 Params:", config.params);
      console.log("⏰ Timestamp:", new Date().toISOString());
    }

    return config;
  });

  // Response interceptor
  api.interceptors.response.use(
    async (res) => {
      // for testing purposes
      // if (res.status === 200) {
      //   await handleTokenExpiration();
      // }
      return res;
    },
    async (error) => {
      if (error.response?.status === 401) {
        console.log("⚠️ Session expired, handling logout...");
        await handleTokenExpiration();
      }
      return Promise.reject(error);
    }
  );

  return api;
};
