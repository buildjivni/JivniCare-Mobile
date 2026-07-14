/**
 * JivniCare Mobile — Search Screen (F02) & Filters (F03)
 * Patient search interface with multi-specialty picker and active filter set.
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocationStore } from "../store/useLocationStore";
import { useAppTheme } from "../hooks/useAppTheme";
import { RADIUS, TYPOGRAPHY } from "../constants/theme";
import { BIHAR_DISTRICTS } from "../constants/districts";
import { API_BASE_URL } from "../config";
import SpecialityPicker from "../components/SpecialityPicker";
import DoctorCard from "../components/DoctorCard";
import type { Doctor } from "../types";

interface SearchScreenProps {
  navigation: any;
}

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const { colors, isDark } = useAppTheme();
  
  // Location store
  const district = useLocationStore((state) => state.district);
  const setDistrict = useLocationStore((state) => state.setDistrict);

  // States
  const [query, setQuery] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [availability, setAvailability] = useState<"any" | "today" | "tomorrow">("any");
  const [maxFee, setMaxFee] = useState<"any" | "500" | "1000">("any");
  const [minExperience, setMinExperience] = useState<"0" | "5" | "10" | "15">("0");
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI Modals
  const [specModalVisible, setSpecModalVisible] = useState(false);
  const [districtModalVisible, setDistrictModalVisible] = useState(false);

  // Debounced search query
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Default district if null
  useEffect(() => {
    if (!district) {
      setDistrict("Jamui"); // Default launch district
    }
  }, [district]);

  // Handle Query Debounce
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  // Trigger search API when filters or debounced query changes
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const payload = {
          query: debouncedQuery,
          speciality: selectedSpecialties,
          availability: availability,
          maxFee: maxFee === "any" ? undefined : parseInt(maxFee),
          minExperience: minExperience === "0" ? undefined : parseInt(minExperience),
          district: district || "Jamui",
        };

        const response = await fetch(`${API_BASE_URL}/api/v1/patient/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = await response.json();
        setDoctors(data.results || []);
      } catch (e) {
        console.error(e);
        setError("Unable to search doctors. Verify server connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [debouncedQuery, selectedSpecialties, availability, maxFee, minExperience, district]);

  const clearAllFilters = () => {
    setQuery("");
    setSelectedSpecialties([]);
    setAvailability("any");
    setMaxFee("any");
    setMinExperience("0");
  };

  const hasActiveFilters =
    selectedSpecialties.length > 0 ||
    availability !== "any" ||
    maxFee !== "any" ||
    minExperience !== "0" ||
    query !== "";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header / District Selection */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.locationLabel, { color: colors.mutedForeground }]}>
          📍 Bihar Clinic District
        </Text>
        <TouchableOpacity
          onPress={() => setDistrictModalVisible(true)}
          style={styles.locationSelector}
        >
          <Text style={[styles.locationName, { color: colors.navy }]}>
            {district || "Select District"}
          </Text>
          <Text style={[styles.dropdownArrow, { color: colors.primary }]}>▾</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input Box */}
      <View style={styles.searchBarContainer}>
        <TextInput
          placeholder="Search doctor, speciality or symptoms..."
          placeholderTextColor={colors.mutedForeground}
          value={query}
          onChangeText={setQuery}
          style={[
            styles.searchBar,
            {
              borderColor: colors.border,
              color: colors.foreground,
              backgroundColor: isDark ? colors.card : colors.background,
            },
          ]}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")} style={styles.clearSearchIcon}>
            <Text style={{ color: colors.mutedForeground, fontWeight: "900" }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Primary Horizontal Filter Scroll */}
      <View style={styles.filterScrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {/* Speciality Picker Trigger Pill */}
          <TouchableOpacity
            onPress={() => setSpecModalVisible(true)}
            style={[
              styles.filterPill,
              { borderColor: colors.border },
              selectedSpecialties.length > 0 && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: colors.foreground },
                selectedSpecialties.length > 0 && { color: "#FFFFFF" },
              ]}
            >
              Speciality
              {selectedSpecialties.length > 0 ? ` (${selectedSpecialties.length})` : " ▾"}
            </Text>
          </TouchableOpacity>

          {/* Availability Filter Today Pill */}
          <TouchableOpacity
            onPress={() => setAvailability(availability === "today" ? "any" : "today")}
            style={[
              styles.filterPill,
              { borderColor: colors.border },
              availability === "today" && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: colors.foreground },
                availability === "today" && { color: "#FFFFFF" },
              ]}
            >
              Available Today
            </Text>
          </TouchableOpacity>

          {/* Availability Filter Tomorrow Pill */}
          <TouchableOpacity
            onPress={() => setAvailability(availability === "tomorrow" ? "any" : "tomorrow")}
            style={[
              styles.filterPill,
              { borderColor: colors.border },
              availability === "tomorrow" && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: colors.foreground },
                availability === "tomorrow" && { color: "#FFFFFF" },
              ]}
            >
              Available Tomorrow
            </Text>
          </TouchableOpacity>

          {/* Max Fee Under 500 Pill */}
          <TouchableOpacity
            onPress={() => setMaxFee(maxFee === "500" ? "any" : "500")}
            style={[
              styles.filterPill,
              { borderColor: colors.border },
              maxFee === "500" && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: colors.foreground },
                maxFee === "500" && { color: "#FFFFFF" },
              ]}
            >
              Under ₹500
            </Text>
          </TouchableOpacity>

          {/* Max Fee Under 1000 Pill */}
          <TouchableOpacity
            onPress={() => setMaxFee(maxFee === "1000" ? "any" : "1000")}
            style={[
              styles.filterPill,
              { borderColor: colors.border },
              maxFee === "1000" && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: colors.foreground },
                maxFee === "1000" && { color: "#FFFFFF" },
              ]}
            >
              Under ₹1000
            </Text>
          </TouchableOpacity>

          {/* Experience 5+ Years Pill */}
          <TouchableOpacity
            onPress={() => setMinExperience(minExperience === "5" ? "0" : "5")}
            style={[
              styles.filterPill,
              { borderColor: colors.border },
              minExperience === "5" && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: colors.foreground },
                minExperience === "5" && { color: "#FFFFFF" },
              ]}
            >
              5+ Yrs Exp
            </Text>
          </TouchableOpacity>

          {/* Experience 10+ Years Pill */}
          <TouchableOpacity
            onPress={() => setMinExperience(minExperience === "10" ? "0" : "10")}
            style={[
              styles.filterPill,
              { borderColor: colors.border },
              minExperience === "10" && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: colors.foreground },
                minExperience === "10" && { color: "#FFFFFF" },
              ]}
            >
              10+ Yrs Exp
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Active Filter Clear Header Row */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersHeader}>
          <Text style={[styles.activeFiltersCount, { color: colors.mutedForeground }]}>
            Filters applied ({[
              selectedSpecialties.length > 0,
              availability !== "any",
              maxFee !== "any",
              minExperience !== "0",
              query !== "",
            ].filter(Boolean).length})
          </Text>
          <TouchableOpacity onPress={clearAllFilters}>
            <Text style={[styles.clearLink, { color: colors.destructive }]}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results Listings */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
        </View>
      ) : doctors.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={[styles.emptyTitle, { color: colors.navy }]}>No Doctors Found</Text>
          <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
            No matching doctors found in {district || "Jamui"}. Try clearing some filters.
          </Text>
          {hasActiveFilters && (
            <TouchableOpacity
              onPress={clearAllFilters}
              style={[styles.resetBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.resetBtnText}>Reset All Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <DoctorCard
              doctor={item}
              onPress={() => navigation.navigate("DoctorProfile", { doctorId: item.id })}
            />
          )}
        />
      )}

      {/* Modals */}
      <SpecialityPicker
        visible={specModalVisible}
        onClose={() => setSpecModalVisible(false)}
        selectedSpecialties={selectedSpecialties}
        onSelect={setSelectedSpecialties}
      />

      {/* District Switcher Modal */}
      <Modal
        visible={districtModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDistrictModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setDistrictModalVisible(false)} />
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.navy }]}>Select District</Text>
              <TouchableOpacity onPress={() => setDistrictModalVisible(false)}>
                <Text style={[styles.modalClose, { color: colors.foreground }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={BIHAR_DISTRICTS}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.modalList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setDistrict(item);
                    setDistrictModalVisible(false);
                  }}
                  style={[
                    styles.districtItem,
                    { borderBottomColor: colors.border },
                    district === item && {
                      backgroundColor: isDark ? "rgba(96,165,250,0.1)" : "rgba(86,150,199,0.08)",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.districtText,
                      { color: colors.foreground },
                      district === item && { color: colors.primary, fontWeight: "900" },
                    ]}
                  >
                    {item}
                  </Text>
                  {district === item && (
                    <Text style={{ color: colors.primary, fontWeight: "900" }}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  locationSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  locationName: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "900",
  },
  dropdownArrow: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "900",
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  searchBar: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingLeft: 16,
    paddingRight: 40,
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "700",
  },
  clearSearchIcon: {
    position: "absolute",
    right: 32,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  filterScrollWrapper: {
    marginBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
    height: 38,
  },
  filterPill: {
    height: 34,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  filterPillText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "800",
  },
  activeFiltersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  activeFiltersCount: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "700",
  },
  clearLink: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "800",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "700",
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "900",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  resetBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
  },
  resetBtnText: {
    color: "#FFFFFF",
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "900",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalDismiss: {
    flex: 1,
  },
  modalSheet: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: "60%",
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "900",
  },
  modalClose: {
    fontSize: 16,
    fontWeight: "800",
  },
  modalList: {
    paddingHorizontal: 20,
  },
  districtItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  districtText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "700",
  },
});
