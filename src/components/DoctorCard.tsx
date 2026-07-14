/**
 * JivniCare Mobile — Doctor Card Component
 * Renders doctor info in search listings.
 */

import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useAppTheme } from "../hooks/useAppTheme";
import { RADIUS, TYPOGRAPHY } from "../constants/theme";
import type { Doctor } from "../types";

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
}

export default function DoctorCard({ doctor, onPress }: DoctorCardProps) {
  const { colors } = useAppTheme();

  // Availability badge colors based on status text
  const getStatusColors = (status?: string) => {
    const text = (status || "").toLowerCase();
    if (text.includes("open") || text.includes("available")) {
      return { bg: "rgba(75,159,95,0.1)", text: colors.secondary };
    }
    if (text.includes("opens at")) {
      return { bg: "rgba(86,150,199,0.1)", text: colors.primary };
    }
    return { bg: "rgba(100,116,139,0.1)", text: colors.statusOffline };
  };

  const statusStyle = getStatusColors(doctor.availabilityStatus);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={styles.topRow}>
        {/* Doctor Image */}
        <Image
          source={
            doctor.image
              ? { uri: doctor.image }
              : require("../../assets/icon.png") // Fallback local image
          }
          style={styles.avatar}
        />

        <View style={styles.headerInfo}>
          {/* Badge & Rating Row */}
          <View style={styles.badgeRow}>
            {doctor.verifiedBadgeLabel && (
              <View style={[styles.verifiedBadge, { backgroundColor: "rgba(86,150,199,0.08)" }]}>
                <Text style={[styles.verifiedText, { color: colors.primary }]}>✓ {doctor.verifiedBadgeLabel}</Text>
              </View>
            )}
            {doctor.rating > 0 && (
              <View style={styles.ratingBox}>
                <Text style={styles.starIcon}>⭐</Text>
                <Text style={[styles.ratingVal, { color: colors.foreground }]}>{doctor.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>

          {/* Name & Specialty */}
          <Text style={[styles.name, { color: colors.navy }]}>{doctor.name}</Text>
          <Text style={[styles.specialty, { color: colors.primary }]}>
            {doctor.specialty} {doctor.qualifications ? `(${doctor.qualifications})` : ""}
          </Text>
          
          <Text style={[styles.experience, { color: colors.mutedForeground }]}>
            {doctor.experience} Experience
          </Text>
        </View>
      </View>

      {/* Middle info: Clinic & Fees */}
      <View style={[styles.midSection, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
        <View style={styles.midItem}>
          <Text style={styles.midLabel}>Clinic</Text>
          <Text style={[styles.midValue, { color: colors.foreground }]} numberOfLines={1}>
            {doctor.clinic}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.midItem}>
          <Text style={styles.midLabel}>Fee</Text>
          <Text style={[styles.midValue, { color: colors.navy }]}>{doctor.fee}</Text>
        </View>
        {doctor.distanceStr && (
          <>
            <View style={styles.divider} />
            <View style={styles.midItem}>
              <Text style={styles.midLabel}>Distance</Text>
              <Text style={[styles.midValue, { color: colors.foreground }]}>{doctor.distanceStr}</Text>
            </View>
          </>
        )}
      </View>

      {/* Bottom section: Availability status & Call-to-action */}
      <View style={styles.bottomRow}>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {doctor.availabilityStatus || "Check Schedule"}
          </Text>
        </View>
        
        <Text style={[styles.ctaText, { color: colors.primary }]}>View Profile →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    shadowColor: "rgba(30,41,59,0.04)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 1,
  },
  topRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.md,
    backgroundColor: "#F1F5F9",
  },
  headerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  verifiedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  starIcon: {
    fontSize: 10,
  },
  ratingVal: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "800",
  },
  name: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "900",
  },
  specialty: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "700",
    marginTop: 2,
  },
  experience: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "600",
    marginTop: 2,
  },
  midSection: {
    flexDirection: "row",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  midItem: {
    flex: 1,
    paddingHorizontal: 4,
  },
  midLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
  },
  midValue: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "800",
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: "rgba(27,63,107,0.1)",
    marginVertical: 4,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
  },
  statusText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "900",
  },
  ctaText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "900",
  },
});
