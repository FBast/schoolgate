import { defineStore } from 'pinia';
import { ApiService } from '@/utils/apiService.js';

export const useExerciseStore = defineStore('exercise', {
    state: () => ({
        exercises: [],
        selectedExercise: null,
    }),
    actions: {
        async fetchExercises(topicId) {
            try {
                const response = await ApiService.getExercises(topicId);
                this.exercises = response;
                this.selectedExercise = null;
            } catch (error) {
                console.error('Error fetching exercises:', error);
            }
        },
        async createExercise(topicId, title, text) {
            try {
                const response = await ApiService.createExercise(topicId, { title, text });
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
    },
});
