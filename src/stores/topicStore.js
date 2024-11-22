import { defineStore } from 'pinia';
import { ApiService } from '@/utils/apiService.js';

export const useTopicStore = defineStore('topic', {
    state: () => ({
        topics: [],
        selectedTopic: null,
    }),
    actions: {
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
        async updateTopic(id, title) {
            try {
                const response = await ApiService.updateTopic(id, { title });
                const index = this.topics.findIndex((topic) => topic._id === id);
                if (index !== -1) {
                    this.topics[index] = response.topic;
                }
            } catch (error) {
                console.error('Error updating topic:', error);
            }
        },
        async deleteTopic(id) {
            try {
                await ApiService.deleteTopic(id);
                this.topics = this.topics.filter((topic) => topic._id !== id);
                if (this.selectedTopic?._id === id) {
                    this.selectedTopic = this.topics.length > 0 ? this.topics[0] : null;
                }
            } catch (error) {
                console.error('Error deleting topic:', error);
            }
        },
        selectTopic(topic) {
            this.selectedTopic = topic;
        },
    },
});
