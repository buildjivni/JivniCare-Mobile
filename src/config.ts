import { Platform } from "react-native";

/**
 * API configuration for local development.
 * Android Emulator uses 10.0.2.2 to access the host machine's localhost.
 */
export const API_BASE_URL = Platform.select({
  android: "http://10.0.2.2:3000",
  ios: "http://localhost:3000",
  default: "http://localhost:3000",
});
