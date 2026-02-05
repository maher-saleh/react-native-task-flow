import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryPicker from '../../components/CategoryPicker';
import TaskItem from '../../components/TaskItem';
import { Task } from '../../types';
import { loadTasks, saveTasks } from '../../utils/storage';

type FilterType = 'all' | 'active' | 'completed';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [filter, setFilter] = useState<FilterType>('all');
  const [showInput, setShowInput] = useState(false);

  // Load saved tasks when app starts
  useEffect(() => {
    loadTasksFromStorage();
  }, []);

  // Auto save tasks whenever they change
  useEffect(() => {
    if (tasks.length >= 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const loadTasksFromStorage = async () => {
    const savedTasks = await loadTasks();
    setTasks(savedTasks);
  };

  const addTask = () => {
    // Don't allow empty tasks
    if (taskInput.trim().length === 0) {
      Alert.alert('Oops!', 'Please enter a task title');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(), // Simple unique ID
      title: taskInput.trim(),
      details: taskDetails.trim(),
      category: selectedCategory,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Add new task to the top of the list
    setTasks([newTask, ...tasks]);
    
    // Reset form and close input
    setTaskInput('');
    setTaskDetails('');
    setSelectedCategory('personal');
    setShowInput(false);
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setTasks(tasks.filter((task) => task.id !== id)),
        },
      ]
    );
  };

  // Filter logic based on selected filter
  const getFilteredTasks = (): Task[] => {
    if (filter === 'active') {
      return tasks.filter(t => !t.completed);
    }
    if (filter === 'completed') {
      return tasks.filter(t => t.completed);
    }
    return tasks; // 'all'
  };

  const filteredTasks = getFilteredTasks();
  const completedCount = tasks.filter(t => t.completed).length;
  const activeCount = tasks.filter(t => !t.completed).length;
  const progressPercent = tasks.length > 0 
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header with title and filter tabs */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>TaskFlow</Text>
          <Text style={styles.headerSubtitle}>
            {activeCount} active {activeCount === 1 ? 'task' : 'tasks'}
          </Text>
        </View>
        
        {/* Filter tabs */}
        <View style={styles.filterContainer}>
          {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[
                styles.filterText,
                filter === f && styles.filterTextActive
              ]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick stats (only show if we have tasks) */}
      {tasks.length > 0 && (
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#34C759' }]}>
              {completedCount}
            </Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#FF9500' }]}>
              {activeCount}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#007AFF' }]}>
              {progressPercent}%
            </Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>
      )}

      {/* Empty state or task list */}
      {filteredTasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons 
            name={filter !== 'all' ? "filter-outline" : "checkmark-done-outline"} 
            size={64} 
            color="#ddd" 
          />
          <Text style={styles.emptyText}>
            {filter !== 'all' ? `No ${filter} tasks` : 'No tasks yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            {filter !== 'all' 
              ? `Switch to "All" to see your tasks` 
              : 'Tap the + button to create your first task!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          )}
          keyExtractor={(item) => item.id}
          style={styles.taskList}
          contentContainerStyle={styles.taskListContent}
        />
      )}

      {/* Floating add button */}
      {!showInput && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowInput(true)}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Bottom sheet for adding new tasks */}
      {showInput && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputModal}
        >
          <View style={styles.inputModalContent}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputTitle}>New Task</Text>
              <TouchableOpacity onPress={() => {
                setShowInput(false);
                setTaskInput('');
                setTaskDetails('');
              }}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.inputForm}>
              <TextInput
                style={styles.input}
                placeholder="What needs to be done?"
                value={taskInput}
                onChangeText={setTaskInput}
                autoFocus
              />
              
              <TextInput
                style={styles.detailsInput}
                placeholder="Add details (optional)"
                value={taskDetails}
                onChangeText={setTaskDetails}
                multiline
                numberOfLines={3}
              />

              <CategoryPicker
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />

              <TouchableOpacity style={styles.addButton} onPress={addTask}>
                <Text style={styles.addButtonText}>Add Task</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  filterBtnActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    justifyContent: 'flex-end',
  },
  inputModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  inputForm: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 12,
  },
  detailsInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});