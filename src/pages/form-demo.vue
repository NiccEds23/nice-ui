<template>
  <div class="form-demo-page p-8 max-w-4xl mx-auto">
    <header class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Dynamic Form System</h1>
      <p class="text-secondary">Demonstration of centralized form logic with validation and state management.</p>
    </header>

    <div class="d-grid gap-8" style="grid-template-columns: 2fr 1fr;">
        <!-- Main Form -->
        <BaseCard title="User Registration (Page Form)">
            <form @submit.prevent="handleSubmit" class="d-flex flex-col gap-6">
                
                <div class="d-grid gap-4" style="grid-template-columns: 1fr 1fr;">
                    <BaseInput
                        label="First Name"
                        v-model="fields.firstName.value"
                        :error="fields.firstName.error"
                        :success="!fields.firstName.error && fields.firstName.value.length > 0"
                        @blur="validateField('firstName')"
                    />
                     <BaseInput
                        label="Last Name"
                        v-model="fields.lastName.value"
                        :error="fields.lastName.error"
                        :success="!fields.lastName.error && fields.lastName.value.length > 0"
                        @blur="validateField('lastName')"
                    />
                </div>

                <BaseInput
                    label="Email Address"
                    v-model="fields.email.value"
                    icon="email"
                    :error="fields.email.error"
                    :success="!fields.email.error && fields.email.value.length > 0"
                    @blur="validateField('email')"
                />

                <div class="d-grid gap-4" style="grid-template-columns: 1fr 1fr;">
                    <BaseInput
                        label="Password"
                        type="password"
                        v-model="fields.password.value"
                        icon="lock"
                        :error="fields.password.error"
                        :success="!fields.password.error && fields.password.value.length >= 8"
                        @blur="validateField('password')"
                    />
                    <BaseInput
                        label="Confirm Password"
                        type="password"
                        v-model="fields.confirmPassword.value"
                        icon="lock_clock"
                        :error="fields.confirmPassword.error"
                        :success="!fields.confirmPassword.error && fields.confirmPassword.value.length > 0 && fields.confirmPassword.value === fields.password.value"
                        @blur="validateField('confirmPassword')"
                    />
                </div>
                
                <div class="d-flex flex-col gap-2">
                    <label class="text-xs font-bold uppercase text-secondary tracking-wider">Department</label>
                    <BaseSelect
                        v-model="fields.department.value"
                        :options="['Engineering', 'Design', 'Sales', 'Marketing']"
                        placeholder="Select department"
                        :error="fields.department.error"
                    />
                </div>

                <div class="d-flex gap-4 items-center">
                    <BaseSwitch v-model="fields.terms.value" label="I agree to Terms & Conditions" />
                    <span v-if="fields.terms.error" class="text-xs text-danger">{{ fields.terms.error }}</span>
                </div>

                <div class="d-flex gap-4 mt-4">
                    <BaseButton type="submit" size="lg" :loading="status.isSubmitting">Register User</BaseButton>
                    <BaseButton type="button" variant="secondary" size="lg" @click="saveDraft">Save Draft</BaseButton>
                    <BaseButton type="button" variant="ghost" size="lg" @click="resetForm">Reset</BaseButton>
                </div>

            </form>
        </BaseCard>

        <!-- Sidebar / Actions -->
        <div class="d-flex flex-col gap-6">
            <BaseCard title="Modal Form Demo">
                <p class="text-sm text-secondary mb-4">
                    Open a transactional form inside a modal to see isolated form state.
                </p>
                <BaseButton block icon="add_card" @click="showTransactionModal = true">
                    New Transaction
                </BaseButton>
            </BaseCard>

            <BaseCard title="Form State Debugger">
                <div class="bg-slate-50 p-4 rounded-lg text-xs font-mono overflow-auto max-h-60">
                    <div class="mb-2"><strong>Is Valid:</strong> {{ status.isValid }}</div>
                    <div class="mb-2"><strong>Is Submitting:</strong> {{ status.isSubmitting }}</div>
                    <pre>{{ getValues() }}</pre>
                </div>
            </BaseCard>
            
            <BaseCard title="Draft Storage">
                <p class="text-xs text-secondary mb-2">Data retrieved from Pinia Store:</p>
                <div v-if="savedDraft" class="p-2 border border-dashed border-secondary rounded bg-slate-50 text-xs">
                    {{ savedDraft }}
                </div>
                <div v-else class="text-xs text-muted italic">No draft saved</div>
            </BaseCard>

            <BaseCard title="Edit Scheme Demo">
                <p class="text-xs text-secondary mb-3">Click to populate form with existing data:</p>
                <div class="d-flex flex-col gap-2">
                    <div v-for="user in mockUsers" :key="user.id" class="d-flex justify-between items-center p-2 bg-slate-50 rounded border border-light">
                        <div class="d-flex flex-col">
                            <span class="text-sm font-bold">{{ user.firstName }} {{ user.lastName }}</span>
                            <span class="text-xs text-muted">{{ user.email }}</span>
                        </div>
                        <BaseButton size="sm" icon="edit" variant="secondary" @click="handleEdit(user)">Edit</BaseButton>
                    </div>
                </div>
            </BaseCard>

            <BaseCard title="Modal Edit Demo">
                <p class="text-xs text-secondary mb-3">Edit transaction in a modal:</p>
                 <div class="d-flex flex-col gap-2">
                    <div v-for="trx in mockTransactions" :key="trx.id" class="d-flex justify-between items-center p-2 bg-slate-50 rounded border border-light">
                        <div class="d-flex flex-col">
                            <span class="text-sm font-bold">{{ trx.title }}</span>
                            <span class="text-xs text-muted">{{ trx.category }} - ${{ trx.amount }}</span>
                        </div>
                        <BaseButton size="sm" icon="edit" variant="secondary" @click="openEditModal(trx)">Edit</BaseButton>
                    </div>
                </div>
                 <div class="mt-3">
                     <BaseButton block icon="add" @click="openCreateModal">New Transaction</BaseButton>
                 </div>
            </BaseCard>
        </div>
    </div>
    
    <ModalForm v-model="showTransactionModal" :initial-data="selectedTransaction" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useFormHelper } from '@/composables/useFormHelper';
import { useFormStore } from '@/stores/formStore';
import { validators } from '@/utils/validators';
import { useUIStore } from '@/stores/ui';
import ModalForm from '@/components/FormExample/ModalForm.vue';

const uiStore = useUIStore();
const formStore = useFormStore();
const showTransactionModal = ref(false);
const selectedTransaction = ref<any>(null);

const { fields, validateField, validateAll, status, getValues, resetForm } = useFormHelper({
    firstName: { value: '', validators: [validators.required()] },
    lastName: { value: '', validators: [validators.required()] },
    email: { value: '', validators: [validators.required(), validators.email()] },
    password: { value: '', validators: [validators.required(), validators.minLength(8)] },
    // Custom cross-field validation would ideally be handled in validateAll or by passing formValues to match
    confirmPassword: { value: '', validators: [validators.required(), validators.match('password')] }, 
    department: { value: '', validators: [validators.required()] },
    terms: { 
        value: false, 
        validators: [(val: boolean) => val === true || 'You must agree to terms'] 
    }
});

// Custom watch for password confirmation (since our basic validator helper is per-field)
// In a real scenario, we might pass a context to validators, or handle this in handleSubmit.
// For this demo, we'll check match on submit.

const handleSubmit = async () => {
    // Custom check for password match
    if (fields.password.value !== fields.confirmPassword.value) {
        fields.confirmPassword.error = 'Passwords do not match';
        return;
    }

    if (!validateAll()) {
        uiStore.showToast({ 
            title: 'Form Error', 
            message: 'Please check the highlighted fields.', 
            variant: 'danger' 
        });
        return;
    }

    status.isSubmitting = true;
    
    // Simulate API
    setTimeout(() => {
        console.log('Submitted:', getValues());
        uiStore.showToast({ 
            title: 'Registration Successful', 
            message: 'User account has been created.', 
            variant: 'success' 
        });
        status.isSubmitting = false;
        // Clear draft if successful
        formStore.clearDraft('registration');
    }, 2000);
};

const saveDraft = () => {
    const data = getValues();
    formStore.saveDraft('registration', data);
    uiStore.showToast({ title: 'Draft Saved', message: 'Form progress saved to store.', variant: 'info' });
};

const savedDraft = computed(() => formStore.getDraft('registration'));

onMounted(() => {
    const draft = formStore.getDraft('registration');
    if (draft) {
        resetForm(draft);
        uiStore.showToast({ title: 'Draft Loaded', message: 'Restored form from previous session.', variant: 'info' });
    } else {
        resetForm();
    }
});

// Mock Data for "Edit Scheme"
const mockUsers = [
    {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Connor',
        email: 'sarah@skynet.com',
        department: 'Engineering',
        terms: true,
        // Mock password not shown in UI but required for validation
        password: 'password123',
        confirmPassword: 'password123'
    },
    {
        id: 2,
        firstName: 'John',
        lastName: 'Wick',
        email: 'john@continental.com',
        department: 'Sales',
        terms: true,
        password: 'password123',
        confirmPassword: 'password123'
    }
];

const handleEdit = (user: any) => {
    // Populate form with user data using resetForm (acts as setValues)
    resetForm(user);

    uiStore.showToast({
        title: 'Edit Mode',
        message: `Loaded data for ${user.firstName}.`,
        variant: 'info'
    });
};

// Mock Transactions
const mockTransactions = [
    { id: 101, title: 'AWS Server Bill', amount: '250.00', category: 'Services', isRecurring: true },
    { id: 102, title: 'Office 365 License', amount: '120.00', category: 'Software', isRecurring: true },
    { id: 103, title: 'New Keyboard', amount: '99.99', category: 'Hardware', isRecurring: false },
];

const openEditModal = (trx: any) => {
    selectedTransaction.value = trx;
    showTransactionModal.value = true;
};

const openCreateModal = () => {
    selectedTransaction.value = null;
    showTransactionModal.value = true;
};
</script>

<route lang="yaml">
meta:
  layout: dashboard
  breadcrumb:
    - name: Home
      route: /
    - name: Demos
      route: null
    - name: Form Demo
      route: null
</route>
