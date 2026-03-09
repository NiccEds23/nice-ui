export type ValidatorFn = (value: any, formValues?: any) => string | boolean;

export const validators = {
    required: (message = 'This field is required'): ValidatorFn => {
        return (value) => {
            if (value === null || value === undefined || value === '') return message;
            if (Array.isArray(value) && value.length === 0) return message;
            return true;
        };
    },

    email: (message = 'Invalid email address'): ValidatorFn => {
        return (value) => {
            if (!value) return true; // Optional check handled by required
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(String(value)) || message;
        };
    },

    minLength: (min: number, message?: string): ValidatorFn => {
        return (value) => {
            if (!value) return true;
            return String(value).length >= min || (message || `Must be at least ${min} characters`);
        };
    },

    maxLength: (max: number, message?: string): ValidatorFn => {
        return (value) => {
            if (!value) return true;
            return String(value).length <= max || (message || `Must be no more than ${max} characters`);
        };
    },

    numeric: (message = 'Must be a number'): ValidatorFn => {
        return (value) => {
            if (!value) return true;
            return !isNaN(Number(value)) || message;
        };
    },

    match: (fieldName: string, message = `Values do not match ${fieldName}`): ValidatorFn => {
        return (value, formValues) => {
            if (!value) return true;
            return value === formValues[fieldName] || message;
        }
    }
};
