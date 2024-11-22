import { defineStore } from 'pinia';
import { ApiService } from '@/utils/apiService.js';

export const useFormationStore = defineStore('formationStore', {
    state: () => ({
        formations: [], // Liste des formations
        grades: {}, // Map des grades par ID de formation
        selectedFormation: null, // Formation actuellement sélectionnée
        error: null,
        loading: false,
    }),

    getters: {
        getFormationById: (state) => (id) =>
            state.formations.find((formation) => formation._id === id),
        getGradesByFormationId: (state) => (id) =>
            state.grades[id] || [], // Renvoie un tableau vide si aucun grade pour l'ID donné
    },

    actions: {
        // Récupérer toutes les formations
        async fetchFormations() {
            this.loading = true;
            this.error = null;
            try {
                const response = await ApiService.getFormations();
                this.formations = response;
                if (!this.selectedFormation && this.formations.length > 0) {
                    this.selectedFormation = this.formations[0];
                }
            } catch (error) {
                this.error = 'Error fetching formations';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        // Récupérer les grades pour une formation donnée
        async fetchGradesByFormationId(formationId) {
            if (!formationId) {
                throw new Error('Formation ID is required to fetch grades');
            }
            this.loading = true;
            this.error = null;
            try {
                const response = await ApiService.getFormationGrades(formationId);
                this.grades[formationId] = response;
                return response;
            } catch (error) {
                this.error = 'Error fetching grades';
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Ajouter une nouvelle formation
        async addFormation(title) {
            this.error = null;
            try {
                const response = await ApiService.createFormation({ title });
                const newFormation = response.formation;
                this.formations.push(newFormation);
                this.selectedFormation = newFormation;
                return newFormation;
            } catch (error) {
                this.error = 'Error adding formation';
                console.error(error);
                throw error;
            }
        },

        // Ajouter un grade à une formation
        async addGradeToFormation(formationId, gradeData) {
            if (!formationId) {
                throw new Error('Formation ID is required to add a grade');
            }
            this.error = null;
            try {
                const response = await ApiService.createGrade({
                    ...gradeData,
                    formationId,
                });
                const newGrade = response.grade;

                if (!this.grades[formationId]) {
                    this.grades[formationId] = [];
                }
                this.grades[formationId].push(newGrade);
                return newGrade;
            } catch (error) {
                this.error = 'Error adding grade';
                console.error(error);
                throw error;
            }
        },

        // Mettre à jour une formation
        async updateFormation(id, title) {
            this.error = null;
            try {
                const response = await ApiService.updateFormation(id, { title });
                const updatedFormation = response.formation;
                const index = this.formations.findIndex((formation) => formation._id === id);
                if (index !== -1) {
                    this.formations[index] = updatedFormation;
                }
                if (this.selectedFormation && this.selectedFormation._id === id) {
                    this.selectedFormation = updatedFormation;
                }
                return updatedFormation;
            } catch (error) {
                this.error = 'Error updating formation';
                console.error(error);
                throw error;
            }
        },

        // Mettre à jour un grade
        async updateGrade(gradeId, gradeData) {
            this.error = null;
            try {
                const response = await ApiService.updateGrade(gradeId, gradeData);
                const updatedGrade = response.grade;

                Object.keys(this.grades).forEach((formationId) => {
                    const index = this.grades[formationId]?.findIndex((grade) => grade._id === gradeId);
                    if (index !== -1) {
                        this.grades[formationId][index] = updatedGrade;
                    }
                });

                return updatedGrade;
            } catch (error) {
                this.error = 'Error updating grade';
                console.error(error);
                throw error;
            }
        },

        // Supprimer une formation
        async deleteFormation(id) {
            this.error = null;
            try {
                await ApiService.deleteFormation(id);
                this.formations = this.formations.filter((formation) => formation._id !== id);
                delete this.grades[id];
                if (this.selectedFormation && this.selectedFormation._id === id) {
                    this.selectedFormation = this.formations.length > 0 ? this.formations[0] : null;
                }
            } catch (error) {
                this.error = 'Error deleting formation';
                console.error(error);
                throw error;
            }
        },

        // Supprimer un grade
        async deleteGrade(gradeId) {
            this.error = null;
            try {
                await ApiService.deleteGrade(gradeId);
                Object.keys(this.grades).forEach((formationId) => {
                    this.grades[formationId] = this.grades[formationId]?.filter((grade) => grade._id !== gradeId);
                });
            } catch (error) {
                this.error = 'Error deleting grade';
                console.error(error);
                throw error;
            }
        },

        // Sélectionner une formation
        selectFormation(formation) {
            this.selectedFormation = formation;
        },
    },
});