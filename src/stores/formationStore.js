import { defineStore } from 'pinia';
import { ApiService } from '@/utils/apiService.js';

export const useFormationStore = defineStore('formationStore', {
    state: () => ({
        formations: [],
        grades: [],
        selectedFormation: null,
        selectedGrade: null,
        error: null,
        loading: false
    }),

    getters: {
        formationOptions: (state) =>
            state.formations.map((formation) => ({
                label: formation.title,
                value: formation._id,
            })),

        gradeOptions: (state) =>
            state.grades.map((grade) => ({
                label: grade.grade,
                value: grade._id,
            })),

        gradeOptionsByFormationId: (state) => (formationId) =>
            state.grades
                .filter((grade) => grade.formationId === formationId)
                .map((grade) => ({
                    label: grade.grade,
                    value: grade._id,
                })),

        getFormationById: (state) => (id) =>
            state.formations.find((formation) => formation._id === id),

        getGradesByFormationId: (state) => (formationId) =>
            state.grades.filter((grade) => grade.formationId === formationId),
        
        getFormationTitle: (state) => (formationId) => {
            const formation = state.formations.find(f => f._id === formationId);
            return formation ? formation.title : 'Unknown Formation';
        },

        getGradeLabel: (state) => (gradeId) => {
            const grade = state.grades.find((g) => g._id === gradeId);
            return grade ? grade.grade : 'Unknown Grade';
        },
    },

    actions: {
        // Récupérer toutes les formations
        async fetchFormations() {
            this.loading = true;
            this.error = null;
            try {
                const response = await ApiService.getFormations();
                this.formations = response;

                // Sélectionner automatiquement la première formation si elle existe
                if (this.formations.length > 0) {
                    this.selectFormation(this.formations[0]);
                }
            } catch (error) {
                this.error = 'Error fetching formations';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async fetchGrades() {
            this.loading = true;
            this.error = null;
            try {
                const response = await ApiService.getGrades();
                this.grades = response;

                if (this.selectedFormation) {
                    const grades = this.getGradesByFormationId(this.selectedFormation._id);
                    if (grades.length > 0) {
                        this.selectGrade(grades[0]);
                    }
                }
            } catch (error) {
                this.error = 'Error fetching grades';
                console.error(error);
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
                this.selectFormation(newFormation);
                
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

                // Ajouter le nouveau grade au tableau des grades
                this.grades.push(newGrade);
                this.selectGrade(newGrade);

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

                const index = this.grades.findIndex((grade) => grade._id === gradeId);
                if (index !== -1) {
                    this.grades[index] = updatedGrade;
                }

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

                // Supprimer les grades associés à la formation supprimée
                this.grades = this.grades.filter((grade) => grade.formationId !== id);

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
                this.grades = this.grades.filter((grade) => grade._id !== gradeId);
            } catch (error) {
                this.error = 'Error deleting grade';
                console.error(error);
                throw error;
            }
        },

        selectFormation(formation) {
            this.selectedFormation = formation;

            const grades = this.getGradesByFormationId(formation._id);
            if (grades.length > 0) {
                this.selectGrade(grades[0]);
            } else {
                this.selectedGrade = null;
            }
        },
        
        selectGrade(grade) {
            this.selectedGrade = grade;
        },

    },
});