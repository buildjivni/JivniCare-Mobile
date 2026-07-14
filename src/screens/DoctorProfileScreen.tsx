/**
 * JivniCare Mobile — Doctor Profile Screen (F05)
 * Displays complete doctor credentials, clinic locations, and availability.
 * Ends with a placeholder "Book Appointment" button.
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useAppTheme } from "../hooks/useAppTheme";
import { RADIUS, TYPOGRAPHY } from "../constants/theme";
import { API_BASE_URL } from "../config";
import type { Doctor } from "../types";

interface DoctorProfileScreenProps {
  route: any;
  navigation: any;
}

export default function DoctorProfileScreen({ route, navigation }: DoctorProfileScreenProps) {
  const { colors, isDark } = useAppTheme();
  const { doctorId, doctor: initialDoctor } = route.params || {};

  const [doctor, setDoctor] = useState<Doctor | null>(initialDoctor || null);
  const [isLoading, setIsLoading] = useState(!initialDoctor);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!doctor && doctorId) {
      const fetchDoctorDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Fetch from patient search by querying doctor ID or details
          const response = await fetch(`${API_BASE_URL}/api/v1/patient/search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: doctorId }), // Assuming query matches doctor ID
          });

          if (!response.ok) throw new Error("Failed to load doctor profile");

          const data = await response.json();
          // Find the exact doctor by ID in the search results
          const doc = data.results?.find((d: Doctor) => d.id === doctorId);
          if (doc) {
            setDoctor(doc);
          } else {
            setError("Doctor profile not found.");
          }
        } catch (e) {
          console.error(e);
          setError("Error loading doctor profile. Check connection.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchDoctorDetails();
    }
  }, [doctorId, doctor]);

  if (isLoading) {
    return (
      <View style={[styles.loadingCenter, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !doctor) {
    return (
      <View style={[styles.loadingCenter, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.destructive }]}>{error || "Profile unavailable."}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Navigation Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navBackBtn}>
          <Text style={[styles.backArrow, { color: colors.primary }]}>←</Text>
          <Text style={[styles.backText, { color: colors.foreground }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navy }]} numberOfLines={1}>
          Doctor Profile
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Image
            source={doctor.image ? { uri: doctor.image } : require("../../assets/icon.png")}
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: colors.navy }]}>{doctor.name}</Text>
          <Text style={[styles.specialty, { color: colors.primary }]}>
            {doctor.specialty}
          </Text>
          {doctor.qualifications && (
            <Text style={[styles.qualifications, { color: colors.mutedForeground }]}>
              {doctor.qualifications}
            </Text>
          )}

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: colors.navy }]}>{doctor.experience}</Text>
              <Text style={styles.metricLabel}>Experience</Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: colors.navy }]}>
                {doctor.rating > 0 ? `${doctor.rating.toFixed(1)} ★` : "New"}
              </Text>
              <Text style={styles.metricLabel}>Rating</Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: colors.navy }]}>
                {doctor.totalConsultations || "500+"}
              </Text>
              <Text style={styles.metricLabel}>Patients</Text>
            </View>
          </View>
        </View>

        {/* Section: Practice Location */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Clinic Location</Text>
          <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.clinicName, { color: colors.navy }]}>{doctor.clinic}</Text>
            <Text style={[styles.clinicAddress, { color: colors.foreground }]}>{doctor.fullAddress}</Text>
            {doctor.landmark && (
              <Text style={[styles.clinicLandmark, { color: colors.mutedForeground }]}>
                Near: {doctor.landmark}
              </Text>
            )}
            <View style={[styles.feeRow, { borderTopColor: colors.border }]}>
              <Text style={[styles.feeLabel, { color: colors.mutedForeground }]}>Consultation Fee</Text>
              <Text style={[styles.feeVal, { color: colors.navy }]}>{doctor.fee}</Text>
            </View>
          </View>
        </View>

        {/* Section: Availability */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Clinic Schedule</Text>
          <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.scheduleRow}>
              <Text style={[styles.scheduleLabel, { color: colors.foreground }]}>Today's Status</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      doctor.availabilityStatus?.includes("Open") || doctor.availabilityStatus?.includes("Available")
                        ? "rgba(75,159,95,0.1)"
                        : "rgba(100,116,139,0.1)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        doctor.availabilityStatus?.includes("Open") || doctor.availabilityStatus?.includes("Available")
                          ? colors.secondary
                          : colors.statusOffline,
                    },
                  ]}
                >
                  {doctor.availabilityStatus || "Check Schedule"}
                </Text>
              </View>
            </View>

            {doctor.consultationModes && doctor.consultationModes.length > 0 && (
              <View style={[styles.scheduleRow, { marginTop: 12 }]}>
                <Text style={[styles.scheduleLabel, { color: colors.foreground }]}>Consultation Modes</Text>
                <Text style={[styles.scheduleVal, { color: colors.navy }]}>
                  {doctor.consultationModes.join(", ")}
                </Text>
              </View>
            )}

            {doctor.languages && doctor.languages.length > 0 && (
              <View style={[styles.scheduleRow, { marginTop: 12 }]}>
                <Text style={[styles.scheduleLabel, { color: colors.foreground }]}>Languages</Text>
                <Text style={[styles.scheduleVal, { color: colors.navy }]}>
                  {doctor.languages.join(", ")}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Section: About */}
        {doctor.about && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>About Doctor</Text>
            <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.aboutText, { color: colors.foreground }]}>{doctor.about}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Book Appointment Button Placeholder */}
      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.bookBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.bookBtnText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  navBackBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    zIndex: 10,
  },
  backArrow: {
    fontSize: 20,
    fontWeight: "bold",
  },
  backText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "700",
  },
  headerTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.base,
    fontWeight: "900",
    textAlign: "center",
    marginRight: 40, // offset back button
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100, // leave space for sticky footer
  },
  profileCard: {
    alignItems: "center",
    padding: 24,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: RADIUS.md,
    backgroundColor: "#F1F5F9",
    marginBottom: 16,
  },
  name: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: "900",
  },
  specialty: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "800",
    marginTop: 4,
  },
  qualifications: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "600",
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(27,63,107,0.06)",
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricVal: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "900",
  },
  metricLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "600",
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  infoBox: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: 16,
  },
  clinicName: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "900",
  },
  clinicAddress: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "600",
    marginTop: 6,
    lineHeight: 20,
  },
  clinicLandmark: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "600",
    marginTop: 4,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  feeLabel: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "700",
  },
  feeVal: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "900",
  },
  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scheduleLabel: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "700",
  },
  scheduleVal: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "800",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  statusText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "900",
  },
  aboutText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "600",
    lineHeight: 22,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  bookBtn: {
    height: 50,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  bookBtnText: {
    color: "#FFFFFF",
    fontSize: TYPOGRAPHY.base,
    fontWeight: "900",
  },
  loadingCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "900",
  },
});
