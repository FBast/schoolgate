import { defineStore } from "pinia";

export const useModalStore = defineStore("modalStore", {
    state: () => ({
        visible: false,
        title: "",
        message: "",
        callback: null,
    }),
    actions: {
        showModal({ title, message, callback }) {
            this.title = title;
            this.message = message;
            this.callback = callback;
            this.visible = true;
        },
        closeModal() {
            this.visible = false;
            if (this.callback) {
                this.callback();
            }
        },
    },
});
