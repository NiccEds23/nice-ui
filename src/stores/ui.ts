import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
    const isLoading = ref(false);
    const loadingMessage = ref('');

    const startLoading = (message: string = '') => {
        isLoading.value = true;
        loadingMessage.value = message;
    };

    const stopLoading = () => {
        isLoading.value = false;
        loadingMessage.value = '';
    };

    const globalAlert = ref({
        show: false,
        title: '',
        message: '',
        variant: 'info' as 'success' | 'warning' | 'danger' | 'info',
        autoClose: true,
        timeout: 3000,
        onDismiss: () => { }
    });

    let alertTimeout: ReturnType<typeof setTimeout> | null = null;

    const showAlert = (options: {
        title?: string;
        message: string;
        variant?: 'success' | 'warning' | 'danger' | 'info';
        autoClose?: boolean;
        timeout?: number;
        onDismiss?: () => void;
    }) => {
        // Clear existing timeout if any
        if (alertTimeout) {
            clearTimeout(alertTimeout);
            alertTimeout = null;
        }

        globalAlert.value = {
            show: true,
            title: options.title || '',
            message: options.message,
            variant: options.variant || 'info',
            autoClose: options.autoClose !== undefined ? options.autoClose : true,
            timeout: options.timeout || 3000,
            onDismiss: options.onDismiss || (() => { })
        };

        if (globalAlert.value.autoClose) {
            alertTimeout = setTimeout(() => {
                hideAlert();
            }, globalAlert.value.timeout);
        }
    };

    const hideAlert = () => {
        if (alertTimeout) {
            clearTimeout(alertTimeout);
            alertTimeout = null;
        }

        if (globalAlert.value.onDismiss) {
            globalAlert.value.onDismiss();
        }

        globalAlert.value.show = false;
    };

    // Toast Logic
    interface Toast {
        id: string;
        title: string;
        message: string;
        variant: 'success' | 'warning' | 'danger' | 'info';
        duration: number;
    }

    const toasts = ref<Toast[]>([]);

    const showToast = (options: {
        title?: string;
        message: string;
        variant?: 'success' | 'warning' | 'danger' | 'info';
        duration?: number;
    }) => {
        const id = Date.now().toString() + Math.random().toString().slice(2);
        const toast: Toast = {
            id,
            title: options.title || '',
            message: options.message,
            variant: options.variant || 'info',
            duration: options.duration || 3000
        };

        toasts.value.push(toast);

        if (toast.duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, toast.duration);
        }
    };

    const removeToast = (id: string) => {
        toasts.value = toasts.value.filter(t => t.id !== id);
    };

    // Scroll Logic
    const nextScrollPosition = ref<{ top: number } | null>(null);
    const setNextScroll = (pos: { top: number } | null) => {
        nextScrollPosition.value = pos;
    };

    // Breadcrumb Logic
    interface Breadcrumb {
        label: string;
        to?: string | object;
    }
    const breadcrumbs = ref<Breadcrumb[]>([]);
    const setBreadcrumbs = (items: Breadcrumb[]) => {
        breadcrumbs.value = items;
    };

    return {
        isLoading,
        loadingMessage,
        globalAlert,
        toasts,
        nextScrollPosition,
        breadcrumbs, // Exported
        startLoading,
        stopLoading,
        showAlert,
        hideAlert,
        showToast,
        removeToast,
        setNextScroll,
        setBreadcrumbs // Exported
    };
});
