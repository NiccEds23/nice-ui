import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFormStore = defineStore('form', () => {
    // Store drafts for different forms by ID
    const drafts = ref<Record<string, any>>({});

    // Store submission results or cache
    const submissions = ref<Record<string, any>>({});

    const saveDraft = (formId: string, data: any) => {
        drafts.value[formId] = data;
        console.log(`[FormStore] Draft saved for ${formId}`, data);
    };

    const getDraft = (formId: string) => {
        return drafts.value[formId];
    };

    const clearDraft = (formId: string) => {
        delete drafts.value[formId];
    };

    const setSubmissionResult = (formId: string, result: any) => {
        submissions.value[formId] = result;
    };

    return {
        drafts,
        submissions,
        saveDraft,
        getDraft,
        clearDraft,
        setSubmissionResult
    };
});
