import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Task } from '../types';
import { CATEGORIES } from './CategoryPicker';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  // Find category or default to "Other"
  const category = CATEGORIES.find(c => c.id === task.category) || CATEGORIES[3];

  return (
    <View style={styles.taskItem}>
      {/* Color bar on the left edge */}
      <View style={[styles.categoryIndicator, { backgroundColor: category.color }]} />
      
      <TouchableOpacity
        onPress={() => onToggle(task.id)}
        style={styles.taskContent}
      >
        {/* Checkbox */}
        <View style={[
          styles.checkbox,
          task.completed && styles.checkboxCompleted
        ]}>
          {task.completed && (
            <Ionicons name="checkmark" size={18} color="#fff" />
          )}
        </View>
        
        <View style={styles.taskText}>
          <View style={styles.titleRow}>
            <Text style={[
              styles.taskTitle,
              task.completed && styles.completedText
            ]}>
              {task.title}
            </Text>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
          </View>
          {/* Show details if they exist */}
          {task.details ? (
            <Text style={styles.taskDetails} numberOfLines={2}>
              {task.details}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>

      {/* Delete button */}
      <TouchableOpacity
        onPress={() => onDelete(task.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={22} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIndicator: {
    width: 4,
    height: '100%',
    position: 'absolute',
    left: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  taskText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  categoryIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  taskDetails: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});