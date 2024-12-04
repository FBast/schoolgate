<template>
  <div class="flex-vertical gap-md">
    <!-- Header -->
    <div class="panel">
      <div class="header">
        <h2 class="title">{{ $t('topics') }}</h2>
        <div class="actions">
          <!-- Save All Changes -->
          <a @click="saveAllChanges">
            <i class="fas fa-save"></i>
          </a>
          <!-- Add Topic -->
          <a @click="addTopic">
            <i class="fas fa-square-plus"></i>
          </a>
        </div>
      </div>

      <!-- Topics List -->
      <div class="items-list">
        <div v-for="topic in topicStore.topics" :key="topic._id" class="item">
          <div
              class="item-content"
              :class="{ selected: topicStore.selectedTopic?._id === topic._id, modified: topic.isModified }"
          >
            <label>{{ topic.title }}</label>
            <div class="actions">
              <!-- Edit Topic -->
              <a @click.stop="toggleTopicDetails(topic)">
                <i class="fa-solid fa-pen-to-square"></i>
              </a>
              <!-- Delete Topic -->
              <a @click.stop="deleteTopic(topic._id)">
                <i class="fa-solid fa-trash"></i>
              </a>
            </div>
          </div>

          <!-- Topic Details -->
          <div v-if="topicStore.selectedTopic?._id === topic._id" class="item-foldout expanded">
            <div class="form-group flex-vertical gap-md padding-md">
              <FormInput
                  v-model="topicStore.selectedTopic.title"
                  :label="$t('topic_title')"
                  type="text"
                  required
                  @input="markTopicAsModified(topicStore.selectedTopic._id)"
              />

              <!-- Exercises List -->
              <div class="sub-panel exercises">
                <div class="header">
                  <h3 class="title">{{ $t('exercises') }}</h3>
                  <div class="actions">
                    <!-- Add Exercise -->
                    <a @click="addExercise">
                      <i class="fas fa-square-plus"></i>
                    </a>
                  </div>
                </div>
                <div class="items-list">
                  <div v-for="exercise in topicStore.selectedTopic.exercises" :key="exercise._id" class="item">
                    <div class="item-content" :class="{ selected: topicStore.selectedExercise?._id === exercise._id }">
                      <label>{{ exercise.title }}</label>
                      <div class="actions">
                        <!-- Edit Exercise -->
                        <a @click.stop="toggleExerciseDetails(exercise)">
                          <i class="fa-solid fa-pen-to-square"></i>
                        </a>
                        <!-- Delete Exercise -->
                        <a @click.stop="deleteExercise(exercise._id)">
                          <i class="fa-solid fa-trash"></i>
                        </a>
                      </div>
                    </div>

                    <!-- Exercise Details -->
                    <div v-if="topicStore.selectedExercise?._id === exercise._id" class="item-foldout expanded">
                      <div class="form-group flex-vertical gap-md padding-md">
                        <FormInput
                            v-model="exercise.title"
                            :label="$t('exercise_title')"
                            type="text"
                            required
                            @input="markTopicAsModified(topicStore.selectedTopic._id)"
                        />
                        <FormTextarea
                            v-model="exercise.text"
                            :label="$t('exercise_content')"
                            required
                            @input="markTopicAsModified(topicStore.selectedTopic._id)"
                        />
                        <FormInput
                            type="file"
                            :label="$t('upload_submission')"
                            @change="handleFileUpload($event, exercise._id)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- End of Exercises List -->
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
import FormInput from "@/components/FormInput.vue";
import FormTextarea from "@/components/FormTextarea.vue";
import {defineEmits, onMounted, onUnmounted} from "vue";

const { t } = useI18n();
const topicStore = useTopicStore();
const emit = defineEmits(["notify"]);

onMounted(async () => {
  try {
    emit("notify", { success: true, message: t("loading_topics") });
    await topicStore.fetchTopics();
    emit("notify", { success: true, message: t("topics_loaded_successfully") });
  } catch (error) {
    emit("notify", { success: false, message: t("error_loading_topics") });
    console.error("Error loading topics:", error);
  }
});

// onUnmounted(() => {
//   topicStore.selectTopic(null);
// });

const saveAllChanges = async () => {
  try {
    await topicStore.saveAllChanges();
    emit("notify", { success: true, message: t("all_changes_saved_successfully") });
  } catch (error) {
    emit("notify", { success: false, message: t("error_saving_changes") });
  }
};

const addTopic = () => {
  topicStore.addTopic();
  emit("notify", { success: true, message: t("new_topic_added_successfully") });
};

const deleteTopic = async (topicId) => {
  try {
    topicStore.deleteTopic(topicId);
    emit("notify", { success: true, message: t("topic_deleted_successfully") });
  } catch (error) {
    emit("notify", { success: false, message: error.message });
  }
};

const addExercise = () => {
  topicStore.addExercise();
  emit("notify", { success: true, message: t("new_exercise_added_successfully") });
};

const deleteExercise = (exerciseId) => {
  topicStore.deleteExercise(exerciseId);
  emit("notify", { success: true, message: t("exercise_deleted_successfully") });
};

const toggleTopicDetails = (topic) => {
  if (topicStore.selectedTopic?._id === topic._id) {
    topicStore.selectTopic(null);
  } else {
    topicStore.selectTopic(topic);
  }
};

const toggleExerciseDetails = (exercise) => {
  if (topicStore.selectedExercise?._id === exercise._id) {
    topicStore.selectExercise(null);
  } else {
    topicStore.selectExercise(exercise);
  }
};

const markTopicAsModified = (topicId) => {
  topicStore.markTopicAsModified(topicId);
};

const handleFileUpload = async (event, exerciseId) => {
  const file = event.target.files[0];
  if (file) {
    emit("notify", { success: true, message: t("file_uploaded_successfully") });
  }
};
</script>
