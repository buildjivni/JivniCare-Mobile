/**
 * JivniCare Mobile — Speciality Picker Component (F04)
 * Option B: Tier-grouped, icons, type-to-filter, bottom-sheet style.
 * 
 * ============================================================================
 * 30-ITEM TIER + ICON MAPPING (AUTHORITATIVE DECISION LOG):
 * ============================================================================
 * TIER 1 — Most Common / High Demand (Primary Care & Urgent Local Needs)
 * - "General Physician"         (🩺) [Base: Tier 1] - Primary doctor for rural/semi-urban clinical consultation.
 * - "Pediatrician"              (👶) [Base: Tier 1] - Infant and child care (high frequency).
 * - "Gynecologist & Obstetrician" (🤱) [Base: Tier 1] - Women's health and delivery services.
 * - "Orthopedic Surgeon"         (🦴) [Base: Tier 1] - Bone fractures, joint pains, and physical injuries.
 * - "Dentist"                   (🦷) [Base: Tier 1] - Dental issues, extractions, hygiene.
 * 
 * TIER 2 — Regular Specialist / Moderate Demand (Common outpatient referrals)
 * - "Dermatologist & Cosmetologist" (🔬) [Base: Tier 2] - Skin issues, allergies, cosmetic dermatology.
 * - "ENT Specialist"            (👂) [Base: Tier 2] - Ear, nose, throat diagnostics.
 * - "Ophthalmologist"           (👁️) [Base: Tier 2] - Vision correction, eye infections, cataracts.
 * - "Diabetologist"             (💉) [Base: Tier 2] - High incidence of diabetes management.
 * - "Dietitian & Nutritionist"   (🥗) [Added] - Weight management and therapeutic clinical diet.
 * - "Sexologist"                 (💑) [Added] - Sexual health wellness and consultations.
 * - "Hair & Skin Specialist"     (💇) [Added] - Hair fall, alopecia, cosmetology procedures.
 * - "Ayurvedic Doctor"           (🌿) [Added] - Traditional medicine, high generic consult rate in local markets.
 * - "Homeopathic Doctor"         (🧪) [Added] - Alternative dilution treatments (very popular in local towns).
 * 
 * TIER 3 — Super-Specialist / Lower Frequency (High complexity tertiary care)
 * - "Cardiologist"               (❤️) [Base: Tier 3] - Heart disease, chest pain, hypertension.
 * - "Neurologist"                (🧠) [Base: Tier 3] - Stroke, seizures, nerve disorders.
 * - "Gastroenterologist"         (🫁) [Base: Tier 3] - Stomach, liver, digestion disorders.
 * - "Pulmonologist"              (🫀) [Base: Tier 3] - Asthma, respiratory infections, COPD.
 * - "Endocrinologist"            (⚗️) [Base: Tier 3] - Hormonal disorders, thyroid care.
 * - "Urologist"                  (🧬) [Base: Tier 3] - Kidney stones, urinary tract infections.
 * - "Nephrologist"               (💊) [Base: Tier 3] - Chronic kidney disease, dialysis support.
 * - "Psychiatrist & Psychologist" (💭) [Base: Tier 3] - Mental health disorders, anxiety, depression.
 * - "Physiotherapist"            (🏃) [Base: Tier 3] - Rehabilitation, recovery, physical therapy.
 * - "Oncologist"                 (🎗️) [Added] - Cancer diagnosis and treatment.
 * - "Rheumatologist"             (🩹) [Added] - Arthritis and autoimmune joint disorders.
 * - "Unani Specialist"           (🍯) [Added] - Traditional Greco-Arabic medicine.
 * - "Siddha Specialist"          (🍂) [Added] - Tamil traditional healthcare system.
 * - "Naturopath"                 (🌸) [Added] - Natural medicine therapies.
 * - "Geriatrician"               (👴) [Added] - Elder care and age-related multi-morbidity.
 * - "Emergency Medicine Specialist" (🚨) [Added] - Immediate trauma and acute critical support.
 * ============================================================================
 */

import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { useAppTheme } from "../hooks/useAppTheme";
import { RADIUS, TYPOGRAPHY } from "../constants/theme";

export interface SpecialityItem {
  name: string;
  icon: string;
  tier: 1 | 2 | 3;
}

export const ALL_SPECIALITIES: SpecialityItem[] = [
  { name: "General Physician", icon: "🩺", tier: 1 },
  { name: "Pediatrician", icon: "👶", tier: 1 },
  { name: "Gynecologist & Obstetrician", icon: "🤱", tier: 1 },
  { name: "Orthopedic Surgeon", icon: "🦴", tier: 1 },
  { name: "Dentist", icon: "🦷", tier: 1 },
  { name: "Dermatologist & Cosmetologist", icon: "🔬", tier: 2 },
  { name: "ENT Specialist", icon: "👂", tier: 2 },
  { name: "Ophthalmologist", icon: "👁️", tier: 2 },
  { name: "Diabetologist", icon: "💉", tier: 2 },
  { name: "Dietitian & Nutritionist", icon: "🥗", tier: 2 },
  { name: "Sexologist", icon: "💑", tier: 2 },
  { name: "Hair & Skin Specialist", icon: "💇", tier: 2 },
  { name: "Ayurvedic Doctor", icon: "🌿", tier: 2 },
  { name: "Homeopathic Doctor", icon: "🧪", tier: 2 },
  { name: "Cardiologist", icon: "❤️", tier: 3 },
  { name: "Neurologist", icon: "🧠", tier: 3 },
  { name: "Gastroenterologist", icon: "🫁", tier: 3 },
  { name: "Pulmonologist", icon: "🫀", tier: 3 },
  { name: "Endocrinologist", icon: "⚗️", tier: 3 },
  { name: "Urologist", icon: "🧬", tier: 3 },
  { name: "Nephrologist", icon: "💊", tier: 3 },
  { name: "Psychiatrist & Psychologist", icon: "💭", tier: 3 },
  { name: "Physiotherapist", icon: "🏃", tier: 3 },
  { name: "Oncologist", icon: "🎗️", tier: 3 },
  { name: "Rheumatologist", icon: "🩹", tier: 3 },
  { name: "Unani Specialist", icon: "🍯", tier: 3 },
  { name: "Siddha Specialist", icon: "🍂", tier: 3 },
  { name: "Naturopath", icon: "🌸", tier: 3 },
  { name: "Geriatrician", icon: "👴", tier: 3 },
  { name: "Emergency Medicine Specialist", icon: "🚨", tier: 3 },
];

interface SpecialityPickerProps {
  visible: boolean;
  onClose: () => void;
  selectedSpecialties: string[];
  onSelect: (specialties: string[]) => void;
}

export default function SpecialityPicker({
  visible,
  onClose,
  selectedSpecialties,
  onSelect,
}: SpecialityPickerProps) {
  const { colors, isDark } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelected, setLocalSelected] = useState<string[]>(selectedSpecialties);

  // Sync state on open
  React.useEffect(() => {
    if (visible) {
      setLocalSelected(selectedSpecialties);
      setSearchQuery("");
    }
  }, [visible, selectedSpecialties]);

  const toggleSpecialty = (name: string) => {
    if (localSelected.includes(name)) {
      setLocalSelected(localSelected.filter((s) => s !== name));
    } else {
      setLocalSelected([...localSelected, name]);
    }
  };

  const clearAll = () => {
    setLocalSelected([]);
  };

  const applySelection = () => {
    onSelect(localSelected);
    onClose();
  };

  const filteredList = ALL_SPECIALITIES.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by tier
  const tier1 = filteredList.filter((s) => s.tier === 1);
  const tier2 = filteredList.filter((s) => s.tier === 2);
  const tier3 = filteredList.filter((s) => s.tier === 3);

  const renderItem = ({ item }: { item: SpecialityItem }) => {
    const isSelected = localSelected.includes(item.name);
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => toggleSpecialty(item.name)}
        style={[
          styles.itemRow,
          { borderBottomColor: colors.border },
          isSelected && { backgroundColor: isDark ? 'rgba(96,165,250,0.1)' : 'rgba(86,150,199,0.08)' }
        ]}
      >
        <Text style={styles.itemIcon}>{item.icon}</Text>
        <Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text>
        <View
          style={[
            styles.checkbox,
            { borderColor: colors.border },
            isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
          ]}
        >
          {isSelected && <Text style={styles.checkboxCheck}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const sectionsData = [
    { title: "Popular Specialities", data: tier1 },
    { title: "General Services", data: tier2 },
    { title: "Specialist Care", data: tier3 },
  ].filter((s) => s.data.length > 0);

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.dismissArea} onPress={onClose} />
        
        <View style={[styles.sheetContent, { backgroundColor: colors.background }]}>
          {/* Header Drag Bar */}
          <View style={[styles.dragBar, { backgroundColor: colors.border }]} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.navy }]}>Select Speciality</Text>
            {localSelected.length > 0 && (
              <TouchableOpacity onPress={clearAll}>
                <Text style={[styles.clearBtn, { color: colors.destructive }]}>Clear all</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Search Input */}
          <TextInput
            placeholder="Type to filter..."
            placeholderTextColor={colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[
              styles.searchInput,
              {
                borderColor: colors.border,
                backgroundColor: isDark ? colors.card : colors.accent,
                color: colors.foreground,
              },
            ]}
          />

          {/* List grouped by Tiers */}
          <FlatList
            data={sectionsData}
            keyExtractor={(item) => item.title}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.sectionContainer}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>{item.title}</Text>
                {item.data.map((spec) => (
                  <View key={spec.name}>{renderItem({ item: spec })}</View>
                ))}
              </View>
            )}
          />

          {/* Bottom Actions */}
          <View style={[styles.actionsContainer, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.cancelBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.cancelBtnText, { color: colors.foreground }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={applySelection}
              style={[styles.applyBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.applyBtnText}>
                Apply ({localSelected.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  dismissArea: {
    flex: 1,
  },
  sheetContent: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: "80%",
    paddingBottom: 24,
  },
  dragBar: {
    width: 48,
    height: 5,
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: "900",
  },
  clearBtn: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "700",
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "600",
    marginBottom: 15,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderRadius: RADIUS.sm,
  },
  itemIcon: {
    fontSize: TYPOGRAPHY.lg,
    marginRight: 12,
  },
  itemName: {
    flex: 1,
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "700",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCheck: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  actionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "700",
  },
  applyBtn: {
    flex: 2,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  applyBtnText: {
    color: "#FFFFFF",
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "900",
  },
});
