/**
 * JivniCare Mobile — Login Screen (F01)
 * Phone input → OTP verification using v1 endpoints.
 * Integrates with useAuthStore.
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useAuthStore } from "../store/useAuthStore";
import { useAppTheme } from "../hooks/useAppTheme";
import { RADIUS, TYPOGRAPHY } from "../constants/theme";
import { API_BASE_URL } from "../config";

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { colors, isDark } = useAppTheme();
  const login = useAuthStore((state) => state.login);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const body = await response.json();

      if (!response.ok || !body.success) {
        setError(body.error || "Failed to send OTP. Please try again.");
      } else {
        setSessionId(body.data.sessionId);
        setStep("otp");
      }
    } catch (e) {
      console.error(e);
      setError("Network error. Please make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, sessionId }),
      });

      const body = await response.json();

      if (!response.ok) {
        setError(body.error || "Verification failed. Check your OTP.");
      } else {
        // Save to Zustand auth store (handles secure storage internally)
        await login(body.user, body.accessToken, body.refreshToken);
        
        // Navigation resets stack to Search screen
        navigation.replace("Search");
      }
    } catch (e) {
      console.error(e);
      setError("Verification failed due to a network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setStep("phone");
    setOtp("");
    setError(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.brandTitle, { color: colors.navy }]}>JivniCare</Text>
          <Text style={[styles.brandSubtitle, { color: colors.primary }]}>Digital OPD Clinic</Text>
        </View>

        {error && (
          <View style={[styles.errorBox, { backgroundColor: isDark ? "rgba(239,68,68,0.15)" : "#FEF2F2", borderColor: colors.destructive }]}>
            <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
          </View>
        )}

        {step === "phone" ? (
          <View style={styles.form}>
            <Text style={[styles.inputLabel, { color: colors.foreground }]}>Enter Mobile Number</Text>
            <View style={styles.phoneInputRow}>
              <View style={[styles.prefixBox, { backgroundColor: colors.accent, borderColor: colors.border }]}>
                <Text style={[styles.prefixText, { color: colors.foreground }]}>+91</Text>
              </View>
              <TextInput
                keyboardType="phone-pad"
                maxLength={10}
                placeholder="9999999999"
                placeholderTextColor={colors.mutedForeground}
                value={phone}
                onChangeText={(val) => {
                  setPhone(val.replace(/\D/g, ""));
                  if (error) setError(null);
                }}
                style={[
                  styles.input,
                  { borderColor: colors.border, color: colors.foreground, backgroundColor: isDark ? colors.card : colors.background },
                ]}
              />
            </View>
            <Text style={[styles.helpText, { color: colors.mutedForeground }]}>
              We will send you a 6-digit verification code.
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSendOtp}
              disabled={isLoading}
              style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Get OTP</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={[styles.inputLabel, { color: colors.foreground }]}>Enter Verification Code</Text>
            <TextInput
              keyboardType="number-pad"
              maxLength={6}
              placeholder="123456"
              placeholderTextColor={colors.mutedForeground}
              value={otp}
              onChangeText={(val) => {
                setOtp(val.replace(/\D/g, ""));
                if (error) setError(null);
              }}
              style={[
                styles.otpInput,
                { borderColor: colors.border, color: colors.foreground, backgroundColor: isDark ? colors.card : colors.background },
              ]}
            />
            <Text style={[styles.helpText, { color: colors.mutedForeground }]}>
              Code sent to +91 {phone}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleVerifyOtp}
              disabled={isLoading}
              style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Verify & Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={resetFlow} style={styles.backBtn}>
              <Text style={[styles.backBtnText, { color: colors.primary }]}>Change phone number</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  brandTitle: {
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -1,
  },
  brandSubtitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 4,
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 20,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "700",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "800",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  phoneInputRow: {
    flexDirection: "row",
    gap: 10,
    height: 52,
    marginBottom: 10,
  },
  prefixBox: {
    width: 60,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  prefixText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "800",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    fontSize: TYPOGRAPHY.base,
    fontWeight: "700",
  },
  otpInput: {
    height: 52,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    fontSize: TYPOGRAPHY.xl,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 8,
    marginBottom: 10,
  },
  helpText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "600",
    marginBottom: 24,
  },
  submitBtn: {
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(86,150,199,0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: TYPOGRAPHY.base,
    fontWeight: "900",
  },
  backBtn: {
    marginTop: 20,
    alignSelf: "center",
  },
  backBtnText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "700",
  },
});
