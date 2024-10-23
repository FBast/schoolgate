<template>
  <div class="exam-container">
    <!-- Topic column -->
    <div class="section topic">
      <h2>Topics</h2>
      <div class="items-list">
        <div
            v-for="topic in topics"
            :key="topic._id"
            class="item"
            :class="{ active: topic._id === selectedTopic?._id }"
            @click="selectTopic(topic)"
        >
          {{ topic.title }}
          <button @click.stop="deleteTopic(topic._id)">Delete</button>
          <button @click.stop="updateTopic(topic._id)">Edit</button>
        </div>
      </div>
      <div class="actions">
        <button @click="addTopic">+</button>
      </div>
    </div>

    <!-- Exercises column -->
    <div v-if="selectedTopic" class="section exercises">
      <h2>Exercises</h2>
      <div class="items-list">
        <div
            v-for="exercise in exercises"
            :key="exercise._id"
            class="item"
            :class="{ active: exercise._id === selectedExercise?._id }"
            @click="selectExercise(exercise._id)"
        >
          {{ exercise.title }}
          <button @click.stop="deleteExercise(exercise._id)">Delete</button>
          <button @click.stop="updateExercise(exercise._id)">Edit</button>
        </div>
      </div>
      <div class="actions">
        <button @click="addExercise(selectedTopicId)">+</button>
      </div>
    </div>

    <!-- Exercise details column -->
    <div v-if="selectedExercise" class="section enonce">
      <h2>Details</h2>
      <div class="content-box">
        <textarea v-model="selectedExercise.text" placeholder="Enter the exercise content..."></textarea>
        <label for="file-upload">Attached image:</label>
        <input type="file" id="file-upload" @change="handleFileUpload" />
        <span v-if="selectedExercise.image">{{ selectedExercise.image }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ApiService } from '@/utils/apiService';

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

<style scoped lang="scss">
.exam-container {
  display: flex;
  flex-direction: row;
  padding: 20px;
  gap: 20px;

  .section {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    h2 {
      color: $primary-color;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .items-list {
      max-height: 200px;
      overflow-y: auto;
      margin-bottom: 10px;

      .item {
        padding: 8px;
        border: 1px solid $primary-color;
        margin-bottom: 5px;
        cursor: pointer;
        transition: background-color 0.3s, border-color 0.3s;

        &:hover {
          background-color: lighten($primary-color, 20%);
        }

        &.active {
          background-color: $primary-color;
          color: #fff;
          border-color: darken($primary-color, 10%);
        }

        button {
          margin-left: 10px;
        }
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
    }

    .content-box {
      height: 200px;
      border: 1px solid $primary-color;
      overflow-y: auto;
      padding: 10px;
      background-color: #f9f9f9;

      textarea {
        width: 100%;
        height: 100px;
        margin-top: 10px;
        resize: vertical;
      }
    }
  }
}
</style>
