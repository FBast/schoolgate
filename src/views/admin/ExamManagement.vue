<template>
  <div class="layout-wide flex-vertical gap-md">
    <!-- Topic column -->
    <div class="panel">
      <div class="header">
        <h2 class="title">{{ $t('topics') }}</h2>
        <div class="actions">
          <a @click="addTopic"><i class="fas fa-square-plus"></i></a>
        </div>
      </div>
      <div class="items-list">
        <div
            v-for="topic in topicStore.topics"
            :key="topic._id"
            class="item"
            :class="{ active: topic._id === topicStore.selectedTopic?._id }"
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
    <div v-if="topicStore.selectedTopic" class="panel exercises">
      <div class="header">
        <h2 class="title">{{ $t('exercises') }}</h2>
        <div class="actions">
          <a @click="addExercise"><i class="fas fa-square-plus"></i></a>
        </div>
      </div>
      <div class="items-list">
        <div
            v-for="exercise in exerciseStore.exercises"
            :key="exercise._id"
            class="item"
            :class="{ active: exercise._id === exerciseStore.selectedExercise?._id }"
            @click="selectExercise(exercise)"
        >
          <div class="item-content">
            <label>{{ exercise.title }}</label>
            <div class="actions">
              <a @click.stop="updateExercise(exercise._id)"><i class="fa-solid fa-pen-to-square"></i></a>
              <a @click.stop="deleteExercise(exercise._id)"><i class="fa-solid fa-trash"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Exercise details column -->
    <div v-if="exerciseStore.selectedExercise" class="panel enonce">
      <div class="header">
        <h2 class="title">{{ $t('statement') }}</h2>
      </div>
      <div class="form-group">
        <label for="exercise-content">{{ $t('exercise_content') }}</label>
        <textarea
            id="exercise-content"
            v-model="exerciseStore.selectedExercise.text"
            :placeholder="$t('exercise_content')"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="file-upload">{{ $t('attached_image') }}</label>
        <input type="file" id="file-upload" @change="handleFileUpload" />
      </div>

      <div v-if="exerciseStore.selectedExercise.image" class="form-group">
        <span class="file-name">{{ exerciseStore.selectedExercise.image }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted} from "vue";
import {useI18n} from "vue-i18n";
import {useTopicStore} from "@/stores/topicStore";
import {useExerciseStore} from "@/stores/exerciseStore";

const {t} = useI18n();
const topicStore = useTopicStore();
const exerciseStore = useExerciseStore();

// Charger les topics au montage
onMounted(() => {
  topicStore.fetchTopics();
});

// Sélectionner un topic
const selectTopic = async (topic) => {
  topicStore.selectTopic(topic);
  await exerciseStore.fetchExercises(topic._id);
};

// Ajouter un topic
const addTopic = async () => {
  const title = prompt(t("new_topic"));
  if (title) {
    await topicStore.createTopic(title);
  }
};

// Supprimer un topic
const deleteTopic = async (id) => {
  await topicStore.deleteTopic(id);
};

// Modifier un topic
const updateTopic = async (id) => {
  const newTitle = prompt(t("edit_topic"));
  if (newTitle) {
    await topicStore.updateTopic(id, newTitle);
  }
};

// Ajouter un exercice
const addExercise = async () => {
  const title = prompt(t("new_exercise"));
  const text = t("exercise_content");
  if (title) {
    await exerciseStore.createExercise(topicStore.selectedTopic._id, title, text);
  }
};

// Supprimer un exercice
const deleteExercise = async (id) => {
  await exerciseStore.deleteExercise(id);
};

// Modifier un exercice
const updateExercise = async (id) => {
  const newTitle = prompt(t("edit_exercise"));
  if (newTitle) {
    await exerciseStore.updateExercise(id, {title: newTitle});
  }
};

// Sélectionner un exercice
const selectExercise = (exercise) => {
  exerciseStore.selectExercise(exercise);
};

// Gérer le téléchargement d'un fichier pour l'exercice
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && exerciseStore.selectedExercise) {
    exerciseStore.updateSelectedExercise({image: file.name});
  }
};
</script>