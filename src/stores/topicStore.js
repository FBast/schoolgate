import { defineStore } from 'pinia';
import { ApiService } from '@/utils/apiService.js';

export const useTopicStore = defineStore('topic', {
    state: () => ({
        topics: [],
        selectedTopic: null,
        selectedExercise: null,
        loading: false
    }),

    getters: {
        // Get topics that are new or modified
        getModifiedTopics: (state) => state.topics.filter(topic => topic.isNew || topic.isModified),
    },

    actions: {
        async fetchTopics() {
            this.loading = true;
            try {
                const response = await ApiService.getTopics();
                this.topics = response.map(topic => ({
                    ...topic,
                    exercises: topic.exercises || [],
                    isNew: false,
                    isModified: false,
                }));
                if (this.topics.length > 0) {
                    this.selectTopic(this.topics[0]);
                }
                console.log('Topics fetched successfully');
            } catch (error) {
                throw new Error(`Error fetching topics: ${error.message}`);
            } finally {
                this.loading = false;
            }
        },

        addTopic(title = 'New Topic') {
            const newTopic = {
                _id: `temp-${Date.now()}`,
                title,
                exercises: [],
                isNew: true,
                isModified: true,
            };
            this.topics.push(newTopic);
            this.selectTopic(newTopic);
            console.log('New topic added locally');
        },

        addExercise(title = 'New Exercise', text = 'Text of the exercise') {
            if (!this.selectedTopic) {
                throw new Error('No topic selected for adding an exercise.');
            }

            const newExercise = {
                _id: `temp-${Date.now()}`,
                title,
                text,
                isNew: true
            };

            this.selectedTopic.exercises.push(newExercise);
            this.selectedTopic.isModified = true; // Mark the parent topic as modified
            this.selectExercise(newExercise);
            console.log('New exercise added locally');
        },

        async updateTopic(topic) {
            try {
                let updatedTopic;

                // Prepare exercises for backend (exclude tempId)
                const backendExercises = topic.exercises.map(exercise => {
                    if (exercise.isNew) {
                        const tempId = exercise._id;
                        // Destructuring exercise to remove _id
                        const { _id, ...rest } = exercise;
                        return { ...rest, tempId };
                    }
                    return exercise;
                });

                if (topic.isNew) {
                    const response = await ApiService.createTopic({
                        title: topic.title,
                        exercises: backendExercises,
                    });

                    updatedTopic = response.topic;
                    topic._id = updatedTopic._id;
                    topic.isNew = false;

                    console.log('New topic created successfully:', topic._id);
                }
                else if (topic.isModified) {
                    const response = await ApiService.updateTopic(topic._id, {
                        title: topic.title,
                        exercises: backendExercises,
                    });

                    updatedTopic = response.topic;

                    console.log('Topic updated successfully:', topic._id);
                }

                // Synchronize IDs for exercises
                updatedTopic.exercises.forEach(savedExercise => {
                    const localExercise = topic.exercises.find(exercise => exercise._id === savedExercise.tempId);
                    if (localExercise) {
                        localExercise._id = savedExercise._id;
                    }
                });

                topic.isModified = false;
            } catch (error) {
                throw new Error(`Error saving topic: ${error.message}`);
            }
        },

        async saveAllChanges() {
            this.loading = true;
            try {
                for (const topic of this.getModifiedTopics) {
                    await this.updateTopic(topic);
                }
                console.log('All changes saved successfully');
            } catch (error) {
                throw new Error(`Error saving changes: ${error.message}`);
            } finally {
                this.loading = false;
            }
        },

        deleteTopic(topicId) {
            const index = this.topics.findIndex(topic => topic._id === topicId);
            if (index === -1) {
                throw new Error('Topic not found');
            }

            const topic = this.topics[index];

            // Remove topic from the store
            this.topics.splice(index, 1);

            // If the deleted topic is the selectedTopic, clear the selection
            if (this.selectedTopic && this.selectedTopic._id === topicId) {
                this.selectedTopic = null;
                this.selectedExercise = null;
            }

            console.log(`Topic deleted locally: ${topicId}`);

            // If the topic is not new, delete it on the server
            if (!topic.isNew) {
                ApiService.deleteTopic(topicId)
                    .then(() => console.log(`Topic deleted from server: ${topicId}`))
                    .catch(error => {
                        console.error(`Error deleting topic from server: ${error.message}`);
                        throw new Error(`Error deleting topic: ${error.message}`);
                    });
            }
        },


        deleteExercise(exerciseId) {
            if (!this.selectedTopic) {
                throw new Error('No topic selected to delete an exercise.');
            }

            const index = this.selectedTopic.exercises.findIndex(exercise => exercise._id === exerciseId);
            if (index === -1) {
                throw new Error('Exercise not found');
            }

            const exercise = this.selectedTopic.exercises[index];
            this.selectedTopic.exercises.splice(index, 1); // Remove from local array
            this.selectedTopic.isModified = true; // Mark the parent topic as modified
            console.log('Exercise deleted locally:', exerciseId);

            if (this.selectedExercise && this.selectedExercise._id === exerciseId) {
                this.selectExercise(null);
            }
        },

        markTopicAsModified(topicId) {
            const topic = this.topics.find(topic => topic._id === topicId);
            if (topic && !topic.isNew) {
                topic.isModified = true;
                console.log('Topic marked as modified:', topicId);
            }
        },

        selectTopic(topic) {
            this.selectedTopic = topic;
            this.selectedExercise = null;
        },

        selectExercise(exercise) {
            this.selectedExercise = exercise;
        },
    },
});
