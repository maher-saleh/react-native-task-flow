import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Category } from '../types';

// Available task categories
export const CATEGORIES: Category[] = [
  { id: 'work', label: 'Work', color: '#007AFF', icon: '💼' },
  { id: 'personal', label: 'Personal', color: '#34C759', icon: '🏠' },
  { id: 'urgent', label: 'Urgent', color: '#FF3B30', icon: '⚡' },
  { id: 'other', label: 'Other', color: '#8E8E93', icon: '📌' },
];

interface CategoryPickerProps {
  selected: string;
  onSelect: (categoryId: string) => void;
}

export default function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <View style={styles.options}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.option,
              { borderColor: category.color },
              // Highlight selected category
              selected === category.id && {
                backgroundColor: category.color + '15', // Add transparency
              },
            ]}
            onPress={() => onSelect(category.id)}
          >
            <Text style={styles.icon}>{category.icon}</Text>
            <Text
              style={[
                styles.optionText,
                { color: category.color },
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});