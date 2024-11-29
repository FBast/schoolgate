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
        <div v-for="topic in topicStore.topics"
            :key="topic._id"
            class="item"
            :class="{ active: topic._id === topicStore.selectedTopic?._id }"
            @click="selectTopic(topic)">
          <div class="item-content">
            <label>{{ topic.title }}</label>
            <div class="actions">
              <a @click.stop="updateTopic(topic._id)"><i class="fa-solid fa-pen-to-square"></i></a>
              <a @click.stop="topicStore.deleteTopic(topic._id)"><i class="fa-solid fa-trash"></i></a>
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
        <div v-for="exercise in topicStore.exercises"
            :key="exercise._id"
            class="item">
          <div class="item-content" @click="toggleDetails(exercise)">
            <label>{{ exercise.title }}</label>
            <div class="actions">
              <a @click.stop="topicStore.deleteExercise(exercise._id)"><i class="fa-solid fa-trash"></i></a>
            </div>
          </div>
          <div v-if="topicStore.selectedExercise" class="item-foldout" :class="{ expanded: topicStore.selectedExercise._id === exercise._id }">
            <div class="form-group">
              <form @submit.prevent="updateExercise">
                <div class="flex-vertical padding-md gap-md">
                  <FormInput v-model="topicStore.selectedExercise.title" :label="$t('exercice_title')" type="text" required />
                  <FormTextarea v-model="topicStore.selectedExercise.text" :label="$t('exercise_content')"/>
                  <FormInput type="file" :label="$t('upload_submission')" @update:modelValue="handleFileUpload"/>
                  <FormButton :label="$t('update')" type="submit" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useTopicStore } from "@/stores/topicStore";
import { ApiService } from "@/utils/apiService";
import FormTextarea from "@/components/FormTextarea.vue";
import FormInput from "@/components/FormInput.vue";
import FormButton from "@/components/FormButton.vue";

const { t } = useI18n();
const topicStore = useTopicStore();

const toggleDetails = (exercise) => {
  if (topicStore.selectedExercise?._id === exercise._id) {
    topicStore.clearSelectedExercise();
  } else {
    topicStore.selectExercise(exercise);
  }
};

// Sélectionner un topic
const selectTopic = async (topic) => {
  topicStore.selectTopic(topic);
};

// Ajouter un topic
const addTopic = async () => {
  const title = prompt(t("new_topic"));
  if (title) {
    await topicStore.createTopic(title);
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
  const title = t("new_exercise");
  const text = t("exercise_content");
  if (title && topicStore.selectedTopic) {
    await topicStore.createExercise(title, text);
  }
};

// Modifier un exercice
const updateExercise = async () => {
  if (topicStore.selectedExercise) {
    await topicStore.updateExercise(topicStore.selectedExercise._id, topicStore.selectedExercise);
  }
};

// Modifier un exercice
// const updateExercise = async (id) => {
//   const newTitle = prompt(t("edit_exercise"));
//   if (newTitle) {
//     await topicStore.updateExercise(id, { title: newTitle });
//   }
// };

// Gérer le téléchargement d'un fichier pour l'exercice
const handleFileUpload = async (event) => {
  // const file = event.target.files[0];
  // if (file && topicStore.selectedExercise) {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //
  //   try {
  //     const response = await ApiService.uploadExerciseImage(topicStore.selectedExercise._id, formData);
  //     localExercise.image = response.imageUrl;
  //   } catch (error) {
  //     console.error(t("error_uploading_image"), error);
  //   }
  // }
};

// Sauvegarder les modifications de l'exercice
const saveExercise = async () => {
  // if (topicStore.selectedExercise) {
  //   try {
  //     await topicStore.updateExercise(topicStore.selectedExercise._id, localExercise);
  //     topicStore.selectExercise({ ...localExercise });
  //     await topicStore.fetchExercises(topicStore.selectedTopic._id);
  //   } catch (error) {
  //     console.error(t("error_updating_exercise"), error);
  //   }
  // }
};
</script>