import { defineStore } from 'pinia';
import { ApiService } from '@/utils/apiService.js';

export const useFormationStore = defineStore('formationStore', {
    state: () => ({
        formations: [],
        selectedFormation: null,
        selectedGrade: null,
        loading: false,
    }),

    getters: {
        formationOptions: (state) =>
            state.formations.map((formation) => ({
                label: formation.title,
                value: formation._id,
            })),

        gradeOptions: (state) => (formationId) => {
            if (!formationId) return [];
            const formation = state.formations.find((formation) => formation._id === formationId);
            return formation?.grades.map((grade) => ({
                label: grade.title,
                value: grade._id,
            })) || [];
        },

        getFormationById: (state) => (id) =>
            state.formations.find((formation) => formation._id === id),

        getGradeById: (state) => (gradeId) =>
            state.selectedFormation?.grades.find((grade) => grade._id === gradeId) || null,

        getTopicsByGradeId: (state) => (gradeId) => {
            const grade = state.selectedFormation?.grades.find((g) => g._id === gradeId);
            return grade ? grade.topics : [];
        },

        getFormationTitle: (state) => (formationId) => {
            const formation = state.formations.find(f => f._id === formationId);
            return formation ? formation.title : 'Unknown Formation';
        },

        getGradeTitle: (state) => (formationId, gradeId) => {
            const formation = state.formations.find(f => f._id === formationId);
            const grade = formation.grades.find((g) => g._id === gradeId);
            return grade ? grade.title : 'Unknown Grade';
        }
    },

    actions: {
        // Fetch all formations with their grades
        async fetchFormations() {
            this.loading = true;
            try {
                const response = await ApiService.getFormations();
                this.formations = response.map((formation) => ({
                    ...formation,
                    grades: formation.grades.map((grade) => ({
                        ...grade,
                        isNew: false,
                    })),
                    isNew: false,
                    isModified: false,
                }));
                console.log('Formations fetched successfully');
            } catch (error) {
                throw new Error(`Error fetching formations: ${error.message}`);
            } finally {
                this.loading = false;
            }
        },

        addFormation(title = 'New Formation') {
            const newFormation = {
                _id: `temp-${Date.now()}`,
                title,
                grades: [],
                isNew: true,
                isModified: true,
            };
            this.formations.push(newFormation);
            this.selectFormation(newFormation);
            console.log('New formation added locally');
        },

        addGrade(title = 'New Grade') {
            if (!this.selectedFormation) {
                throw new Error('No formation selected to add a grade.');
            }

            const newGrade = {
                _id: `temp-${Date.now()}`,
                title,
                topics: [],
                isNew: true,
            };

            this.selectedFormation.grades.push(newGrade);
            this.selectedFormation.isModified = true;
            this.selectGrade(newGrade);
            console.log('New grade added locally');
        },

        async updateFormation(formation) {
            try {
                let updatedFormation;

                // Prepare grades for backend (exclude tempId)
                const backendGrades = formation.grades.map((grade) => {
                    if (grade.isNew) {
                        const tempId = grade._id;
                        const { _id, ...rest } = grade;
                        return { ...rest, tempId };
                    }
                    return grade;
                });

                if (formation.isNew) {
                    const response = await ApiService.createFormation({
                        title: formation.title,
                        grades: backendGrades,
                    });

                    updatedFormation = response.formation;
                    formation._id = updatedFormation._id;
                    formation.isNew = false;

                    console.log('New formation created successfully:', formation._id);
                } else if (formation.isModified) {
                    const response = await ApiService.updateFormation(formation._id, {
                        title: formation.title,
                        grades: backendGrades,
                    });

                    updatedFormation = response.formation;

                    console.log('Formation updated successfully:', formation._id);
                }

                // Synchronize IDs for grades
                updatedFormation.grades.forEach((savedGrade) => {
                    const localGrade = formation.grades.find((grade) => grade._id === savedGrade.tempId);
                    if (localGrade) {
                        localGrade._id = savedGrade._id;
                    }
                });

                formation.isModified = false;
            } catch (error) {
                throw new Error(`Error saving formation: ${error.message}`);
            }
        },

        async saveAllChanges() {
            this.loading = true;
            try {
                for (const formation of this.formations.filter((f) => f.isNew || f.isModified)) {
                    await this.updateFormation(formation);
                }
                console.log('All changes saved successfully');
            } catch (error) {
                throw new Error(`Error saving changes: ${error.message}`);
            } finally {
                this.loading = false;
            }
        },

        async deleteFormation(id) {
            try {
                const index = this.formations.findIndex((f) => f._id === id);
                if (index === -1) throw new Error('Formation not found');

                const formation = this.formations[index];

                if (formation.isNew) {
                    this.formations.splice(index, 1);
                    console.log('New formation deleted locally:', id);
                } else {
                    await ApiService.deleteFormation(id);
                    this.formations.splice(index, 1);
                    console.log('Formation deleted successfully:', id);
                }

                if (this.selectedFormation?._id === id) {
                    this.selectFormation(null);
                }
            } catch (error) {
                throw new Error(`Error deleting formation: ${error.message}`);
            }
        },

        deleteGrade(gradeId) {
            if (!this.selectedFormation) throw new Error('No formation selected to delete a grade.');

            const index = this.selectedFormation.grades.findIndex((g) => g._id === gradeId);
            if (index === -1) throw new Error('Grade not found');

            const grade = this.selectedFormation.grades[index];

            if (grade.isNew) {
                this.selectedFormation.grades.splice(index, 1);
                console.log('New grade deleted locally:', gradeId);
            } else {
                this.selectedFormation.grades.splice(index, 1);
                this.selectedFormation.isModified = true;
                console.log('Grade deleted locally:', gradeId);
            }

            if (this.selectedGrade?._id === gradeId) {
                this.selectedGrade = this.selectedFormation.grades.length > 0 ? this.selectedFormation.grades[0] : null;
            }
        },

        markFormationAsModified(formationId) {
            const formation = this.formations.find(formation => formation._id === formationId);
            if (formation && !formation.isNew) {
                formation.isModified = true;
                console.log('Formation marked as modified:', formationId);
            }
        },

        selectFormation(formation) {
            this.selectedFormation = formation;
            this.selectedGrade = null;
        },

        selectGrade(grade) {
            this.selectedGrade = grade;
        }
    },
});
