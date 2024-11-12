<template>
  <div class="container">
    <!-- Topic column -->
    <div class="panel topic">
      <div class="header">
        <h2 class="title">Sujets</h2>
        <div class="actions">
          <a @click="addTopic"><i class="fa-regular fa-square-plus"></i></a>
        </div>
      </div>
      <div class="items-list">
        <div
            v-for="topic in topics"
            :key="topic._id"
            class="item"
            :class="{ active: topic._id === selectedTopic?._id }"
            @click="selectTopic(topic)"
        >
          <div class="item-content">
            <label>{{ topic.title }}</label>
            <div class="actions">
              <a @click.stop="updateTopic(topic._id)"><i class="fa-solid fa-pen-to-square"></i></a>
              <a @click.stop="deleteTopic(topic._id)"><i class="fa-solid fa-trash"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Exercises column -->
    <div v-if="selectedTopic" class="panel exercises">
      <div class="header">
        <h2 class="title">Exercices</h2>
        <div class="actions">
          <a @click="addExercise"><i class="fa-regular fa-square-plus"></i></a>
        </div>
      </div>
      <div class="items-list">
        <div
            v-for="exercise in exercises"
            :key="exercise._id"
            class="item"
            :class="{ active: exercise._id === selectedExercise?._id }"
            @click="selectExercise(exercise._id)"
        >
          <div class="item-content">
            <label>{{ exercise.title }}</label>
            <div class="actions">
              <a @click.stop="deleteExercise(exercise._id)"><i class="fa-solid fa-pen-to-square"></i></a>
              <a @click.stop="updateExercise(exercise._id)"><i class="fa-solid fa-trash"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Exercise details column -->
    <div v-if="selectedExercise" class="panel enonce">
      <div class="header">
        <h2 class="title">Enoncé</h2>
      </div>
      <div class="form-group">
        <label for="exercise-content">Exercise Content:</label>
        <textarea
            id="exercise-content"
            v-model="selectedExercise.text"
            placeholder="Enter the exercise content..."
        ></textarea>
      </div>

      <div class="form-group">
        <label for="file-upload">Attached image:</label>
        <input type="file" id="file-upload" @change="handleFileUpload" />
      </div>

      <div v-if="selectedExercise.image" class="form-group">
        <span class="file-name">{{ selectedExercise.image }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import { ApiService } from '@/utils/apiService.js';

const topics = ref([]);
const exercises = ref([]);
const selectedTopic = ref(null);
const selectedExercise = ref(null);

const fetchTopics = async () => {
  try {
    const responseData = await ApiService.getTopics();
    topics.value = responseData;
    if (topics.value.length > 0) {
      selectedTopic.value = topics.value[0];
      await selectTopic(selectedTopic.value);
    }
  } catch (error) {
    console.error('Error fetching topics:', error);
  }
};

// Select a topic and load its exercises
const selectTopic = async (topic) => {
  selectedTopic.value = topic;
  selectedExercise.value = null;
  try {
    const responseData = await ApiService.getExercises(topic._id);
    exercises.value = responseData;
  } catch (error) {
    console.error('Error fetching exercises:', error);
  }
};

// Watch for changes in the selected exercise text and update the backend
watch(
    () => selectedExercise.value?.text,
    async (newText) => {
      if (selectedExercise.value && newText !== undefined) {
        try {
          await ApiService.updateExercise(selectedExercise.value._id, {
            text: newText,
          });
        } catch (error) {
          console.error('Error updating exercise content:', error);
        }
      }
    }
);

// Select an exercise and load its details
const selectExercise = (exerciseId) => {
  const exercise = exercises.value.find((ex) => ex._id === exerciseId);
  if (exercise) {
    selectedExercise.value = exercise;
  } else {
    console.error('Exercise not found:', exerciseId);
  }
};

// Add a new topic
const addTopic = async () => {
  const newTopic = { title: `New Topic ${topics.value.length + 1}` };
  try {
    const responseData = await ApiService.createTopic(newTopic);
    const createdTopic = responseData.topic;
    topics.value.push(createdTopic);

    // Select the newly created topic
    selectedTopic.value = createdTopic;
    exercises.value = []; // Reset exercises
    selectedExercise.value = null; // Reset selected exercise

    // Fetch exercises for the newly created topic
    await selectTopic(createdTopic);
  } catch (error) {
    console.error('Error creating topic:', error);
  }
};

// Delete a topic
const deleteTopic = async (id) => {
  try {
    await ApiService.deleteTopic(id);
    topics.value = topics.value.filter((topic) => topic._id !== id);

    // If the deleted topic was the currently selected one, reset selection
    if (selectedTopic.value && selectedTopic.value._id === id) {
      selectedTopic.value = topics.value.length > 0 ? topics.value[0] : null;
      exercises.value = [];
      selectedExercise.value = null;
      if (selectedTopic.value) await selectTopic(selectedTopic.value);
    }
  } catch (error) {
    console.error('Error deleting topic:', error);
  }
};

// Update a topic title
const updateTopic = async (id) => {
  const newTitle = prompt('Edit the topic title:');
  if (!newTitle) return;

  try {
    const responseData = await ApiService.updateTopic(id, { title: newTitle });
    const index = topics.value.findIndex((topic) => topic._id === id);
    topics.value[index] = responseData.topic;
  } catch (error) {
    console.error('Error updating topic:', error);
  }
};

// Add a new exercise to the selected topic
const addExercise = async () => {
  if (!selectedTopic.value) return;
  const newExercise = {
    title: `New Exercise ${exercises.value.length + 1}`,
    text: 'Exercise description...'
  };

  try {
    const responseData = await ApiService.createExercise(selectedTopic.value._id, newExercise);
    exercises.value.push(responseData.exercise);
    selectExercise(responseData.exercise._id); // Auto-select the new exercise
  } catch (error) {
    console.error('Error creating exercise:', error);
  }
};

// Delete an exercise
const deleteExercise = async (id) => {
  try {
    await ApiService.deleteExercise(id);
    exercises.value = exercises.value.filter((exercise) => exercise._id !== id);
    if (selectedExercise.value && selectedExercise.value._id === id) {
      selectedExercise.value = null;
    }
  } catch (error) {
    console.error('Error deleting exercise:', error);
  }
};

// Update an exercise title
const updateExercise = async (id) => {
  const newTitle = prompt('Edit the exercise title:');
  if (!newTitle) return;

  try {
    const responseData = await ApiService.updateExercise(id, { title: newTitle });
    const index = exercises.value.findIndex((exercise) => exercise._id === id);
    exercises.value[index] = responseData.exercise;
  } catch (error) {
    console.error('Error updating exercise:', error);
  }
};

// Handle file upload for the selected exercise
const handleFileUpload = (event) => {
  if (selectedExercise.value) {
    selectedExercise.value.image = event.target.files[0].name;
  }
};

onMounted(fetchTopics);
</script>
