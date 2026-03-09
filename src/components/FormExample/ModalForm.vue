<template>
  <BaseModal 
    :visible="visible"
    :title="initialData ? 'Edit Transaction' : 'New Transaction'" 
    icon="payments" 
    icon-color="green"
    @close="close"
    @update:visible="val => $emit('update:visible', val)"
  >
    <div class="modal-form d-flex flex-col gap-4">
        <BaseInput
            label="Transaction Title"
            v-model="fields.title.value"
            :error="fields.title.error"
            placeholder="e.g. Server Payment"
            @blur="validateField('title')"
        />

        <BaseInput
            label="Amount ($)"
            v-model="fields.amount.value"
            :error="fields.amount.error"
            placeholder="0.00"
            type="number"
            @blur="validateField('amount')"
        />

        <BaseSelect
            label="Category"
            v-model="fields.category.value"
            :options="['Hardware', 'Software', 'Services', 'Utility']"
            placeholder="Select category"
            :error="fields.category.error"
        />

        <div class="d-flex gap-2 items-center">
             <BaseSwitch v-model="fields.isRecurring.value" label="Recurring Payment" />
        </div>
    </div>

    <template #footer>
        <BaseButton variant="secondary" block @click="close">Cancel</BaseButton>
        <BaseButton block @click="handleSave" :loading="status.isSubmitting">
            {{ initialData ? 'Update Changes' : 'Save Transaction' }}
        </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useFormHelper } from '@/composables/useFormHelper';
import { validators } from '@/utils/validators';
import { useUIStore } from '@/stores/ui';

const visible = defineModel<boolean>('visible', { default: false });
const props = defineProps<{
    initialData?: Record<string, any> | null
}>();

const uiStore = useUIStore();

const { fields, validateField, validateAll, status, getValues, resetForm } = useFormHelper({
    title: { value: '', validators: [validators.required(), validators.minLength(3)] },
    amount: { value: '', validators: [validators.required(), validators.numeric('Must be a valid amount')] },
    category: { value: '', validators: [validators.required()] },
    isRecurring: { value: false }
});

// Watch visibility to handle Edit/New mode (populating or resetting form)
watch(visible, (isOpen) => {
    if (isOpen) {
        if (props.initialData) {
            resetForm(props.initialData);
        } else {
            resetForm();
        }
    }
});

const close = () => {
    visible.value = false;
    resetForm();
};

const handleSave = async () => {
    if (!validateAll()) {
        uiStore.showToast({ 
            title: 'Validation Error', 
            message: 'Please fix the errors in the form.', 
            variant: 'danger' 
        });
        return;
    }

    status.isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
        console.log('Saved Data:', getValues());
        uiStore.showToast({ 
            title: 'Success', 
            message: 'Transaction saved successfully!', 
            variant: 'success' 
        });
        status.isSubmitting = false;
        close();
    }, 1500);
};
</script>
