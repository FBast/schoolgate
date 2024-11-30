import { defineStore } from 'pinia';
import { ApiService } from '@/utils/apiService.js';

export const useTopicStore = defineStore('topic', {
    state: () => ({
        topics: [],
        selectedTopic: null,
        exercises: [],
        selectedExercise: null,
    }),

    actions: {
        // Topics
        
        async fetchTopics() {
            try {
                const response = await ApiService.getTopics();
                this.topics = response;
                if (this.topics.length > 0) {
                    this.selectTopic(this.topics[0]);
                }
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        },
        
        async createTopic(title) {
            try {
                const response = await ApiService.createTopic({ title });
                this.topics.push(response.topic);
                this.selectTopic(response.topic);
            } catch (error) {
                console.error('Error creating topic:', error);
            }
        },
        
        async updateTopic(id, updatedTopic) {
            try {
                await ApiService.updateTopic(id, updatedTopic);
                await this.fetchTopics();

            } catch (error) {
                console.error('Error updating topic:', error);
            }
        },
        
        async deleteTopic(id) {
            try {
                await ApiService.deleteTopic(id);
                this.topics = this.topics.filter((topic) => topic._id !== id);
                if (this.selectedTopic?._id === id) {
                    this.selectTopic(this.topics.length > 0 ? this.topics[0] : null);
                }
            } catch (error) {
                console.error('Error deleting topic:', error);
            }
        },
        
        selectTopic(topic) {
            this.selectedTopic = topic;
            if (topic) {
                this.fetchExercises(topic._id);
            } else {
                this.exercises = [];
                this.selectedExercise = null;
            }
        },

        clearSelectedTopic() {
            this.selectedTopic = null;
            this.exercises = [];
            this.selectedExercise = null;
        },

        // Exercises
        
        async fetchExercises(topicId) {
            try {
                const response = await ApiService.getExercises(topicId);
                this.exercises = response;
                
                this.selectExercise(null);
            } catch (error) {
                console.error('Error fetching exercises:', error);
            }
        },
        
        async createExercise(title, text) {
            if (!this.selectedTopic) {
                console.error('No topic selected for creating an exercise.');
                return;
            }
            try {
                const response = await ApiService.createExercise(this.selectedTopic._id, { 
                    title: title, 
                    text: text 
                });
                this.exercises.push(response.exercise);
                this.selectExercise(response.exercise);
            } catch (error) {
                console.error('Error creating exercise:', error);
            }
        },
        
        async updateExercise(id, data) {
            try {
                const response = await ApiService.updateExercise(id, data);
                const index = this.exercises.findIndex((exercise) => exercise._id === id);
                if (index !== -1) {
                    this.exercises[index] = response.exercise;
                }
            } catch (error) {
                console.error('Error updating exercise:', error);
            }
        },
        
        async deleteExercise(id) {
            try {
                await ApiService.deleteExercise(id);
                this.exercises = this.exercises.filter((exercise) => exercise._id !== id);
                if (this.selectedExercise?._id === id) {
                    this.selectedExercise = null;
                }
            } catch (error) {
                console.error('Error deleting exercise:', error);
            }
        },

        selectExercise(exercise) {
            this.selectedExercise = exercise;
        },

        clearSelectedExercise() {
            this.selectedExercise = null;
        }
    },
});