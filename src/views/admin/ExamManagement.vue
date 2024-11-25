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
        <div class="actions">
          <FormButton :label="$t('save')" @click="saveExercise" />
        </div>
      </div>
      <div class="form-group">
        <label for="exercise-content">{{ $t('exercise_content') }}</label>
        <textarea
            id="exercise-content"
            v-model="localExercise.text"
            :placeholder="$t('exercise_content')"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="file-upload">{{ $t('attached_image') }}</label>
        <input type="file" id="file-upload" @change="handleFileUpload" />
      </div>

      <div v-if="localExercise.image" class="form-group">
        <span class="file-name">{{ localExercise.image }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useTopicStore } from "@/stores/topicStore";
import { useExerciseStore } from "@/stores/exerciseStore";
import { ApiService } from "@/utils/apiService"; // Assurez-vous que ApiService est importé

const { t } = useI18n();
const topicStore = useTopicStore();
const exerciseStore = useExerciseStore();

const localExercise = reactive({});

// Charger les topics au montage
onMounted(() => {
  topicStore.fetchTopics();
});

// Synchroniser localExercise avec selectedExercise
watch(
    () => exerciseStore.selectedExercise,
    (newExercise) => {
      if (newExercise) {
        Object.assign(localExercise, newExercise);
      } else {
        Object.keys(localExercise).forEach((key) => {
          delete localExercise[key];
        });
      }
    },
    { immediate: true }
);

// Sélectionner un topic
const selectTopic = async (topic) => {
  topicStore.selectTopic(topic);
  await exerciseStore.fetchExercises(topic._id);
  exerciseStore.selectExercise(null); // Réinitialiser l'exercice sélectionné
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
  if (topicStore.selectedTopic?._id === id) {
    topicStore.selectTopic(null);
    exerciseStore.exercises = [];
    exerciseStore.selectExercise(null);
  }
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
  if (title && topicStore.selectedTopic) {
    await exerciseStore.createExercise(topicStore.selectedTopic._id, title, text);
    await exerciseStore.fetchExercises(topicStore.selectedTopic._id);
  }
};

// Supprimer un exercice
const deleteExercise = async (id) => {
  await exerciseStore.deleteExercise(id);
  await exerciseStore.fetchExercises(topicStore.selectedTopic._id);
  if (exerciseStore.selectedExercise?._id === id) {
    exerciseStore.selectExercise(null);
  }
};

// Modifier un exercice
const updateExercise = async (id) => {
  const newTitle = prompt(t("edit_exercise"));
  if (newTitle) {
    await exerciseStore.updateExercise(id, { title: newTitle });
    await exerciseStore.fetchExercises(topicStore.selectedTopic._id);
  }
};

// Sélectionner un exercice
const selectExercise = (exercise) => {
  exerciseStore.selectExercise(exercise);
};

// Gérer le téléchargement d'un fichier pour l'exercice
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file && exerciseStore.selectedExercise) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await ApiService.uploadExerciseImage(exerciseStore.selectedExercise._id, formData);
      localExercise.image = response.imageUrl;
    } catch (error) {
      console.error(t("error_uploading_image"), error);
    }
  }
};

// Sauvegarder les modifications de l'exercice
const saveExercise = async () => {
  if (exerciseStore.selectedExercise) {
    try {
      await exerciseStore.updateExercise(exerciseStore.selectedExercise._id, localExercise);
      exerciseStore.selectExercise({ ...localExercise });
      await exerciseStore.fetchExercises(topicStore.selectedTopic._id);
    } catch (error) {
      console.error(t("error_updating_exercise"), error);
    }
  }
};
</script>