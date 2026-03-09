import { reactive } from 'vue';
import type { ValidatorFn } from '@/utils/validators';

export interface FieldConfig {
    value: any;
    validators?: ValidatorFn[];
    label?: string;
    type?: string; // For auto-generation if needed
    error?: string;
    isTouched?: boolean;
}

export interface FormConfig {
    [key: string]: FieldConfig;
}

export function useFormHelper<T extends FormConfig>(initialConfig: T) {
    // Deep clone initial state to avoid mutation by reactive proxy
    const _initialState = JSON.parse(JSON.stringify(initialConfig));

    // Reactive state for the form fields
    const fields = reactive(initialConfig) as { [K in keyof T]: FieldConfig };

    // Reactive state for general form status
    const status = reactive({
        isSubmitting: false,
        isValid: false,
        globalError: ''
    });

    // Helper to validate a specific field
    const validateField = (fieldName: keyof T) => {
        const field = fields[fieldName] as FieldConfig;
        if (!field) return true;

        field.isTouched = true;
        field.error = '';

        if (field.validators) {
            // Collect all form values to pass to validators (for cross-field validation)
            const formValues = getValues();

            for (const validator of field.validators) {
                const result = validator(field.value, formValues);
                if (result !== true) {
                    field.error = typeof result === 'string' ? result : 'Invalid value';
                    return false;
                }
            }
        }
        return true;
    };

    // Validate all fields
    const validateAll = () => {
        let allValid = true;
        for (const key in fields) {
            const isValid = validateField(key as keyof T);
            if (!isValid) allValid = false;
        }
        status.isValid = allValid;
        return allValid;
    };

    // Get simple key-value object of form data
    const getValues = () => {
        const values: Record<string, any> = {};
        for (const key in fields) {
            const field = fields[key as keyof T] as FieldConfig | undefined;
            if (field) {
                values[key] = field.value;
            }
        }
        return values;
    };

    // Reset form to initial state (or specific values)
    const resetForm = (newValues?: Partial<Record<keyof T, any>>) => {
        for (const key in fields) {
            const field = fields[key as keyof T] as FieldConfig | undefined;
            const originalField = _initialState[key as keyof T] as FieldConfig | undefined;

            if (field && originalField) {
                field.value = newValues?.[key as keyof T] ?? originalField.value;
                field.error = '';
                field.isTouched = false;
            }
        }
        status.globalError = '';
        status.isSubmitting = false;
    };

    return {
        fields,
        status,
        validateField,
        validateAll,
        getValues,
        resetForm
    };
}
