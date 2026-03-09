import Constants from "expo-constants";
import { Platform } from "react-native";

function getApiBaseUrl() {
  // Web browser
  if (Platform.OS === "web") {
    return "http://localhost:4000";
  }

  // Expo mobile (Android / iOS)
  const debuggerHost =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest?.debuggerHost;

  const host = debuggerHost?.split(":")[0];

  if (!host) {
    return "http://localhost:4000";
  }

  return `http://${host}:4000`;
}

export const API_BASE_URL = getApiBaseUrl();
