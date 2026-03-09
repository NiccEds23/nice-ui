import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface MenuItem {
    label: string;
    icon?: string;
    to?: string;
    href?: string;
    children?: MenuItem[];
    isOpen?: boolean;
}

export const useSidebarStore = defineStore('sidebar', () => {
    const menuItems = ref<MenuItem[]>([]);
    const isMinimized = ref(false);
    const isLoading = ref(false);
    const searchQuery = ref('');

    // Getter for filtered menu items
    const filteredMenuItems = computed(() => {
        if (!searchQuery.value) return menuItems.value;

        const lowerQuery = searchQuery.value.toLowerCase();

        const filterItem = (item: MenuItem): MenuItem | null => {
            // Check if current item matches
            const matchesLabel = item.label.toLowerCase().includes(lowerQuery);

            // Check children
            let filteredChildren: MenuItem[] = [];
            if (item.children) {
                filteredChildren = item.children
                    .map(child => filterItem(child))
                    .filter((child): child is MenuItem => child !== null);
            }

            // Return item if it matches or has matching children
            if (matchesLabel || filteredChildren.length > 0) {
                return {
                    ...item,
                    children: filteredChildren.length > 0 ? filteredChildren : item.children,
                    // Auto-expand if children matched or if we are searching (optional decision)
                    isOpen: filteredChildren.length > 0 ? true : item.isOpen
                };
            }

            return null;
        };

        return menuItems.value
            .map(item => filterItem(item))
            .filter((item): item is MenuItem => item !== null);
    });

    // Simulate API call to fetch menu
    const fetchMenuItems = async () => {
        isLoading.value = true;
        try {
            // Simulating delay and response
            await new Promise(resolve => setTimeout(resolve, 500));

            menuItems.value = [
                {
                    label: 'Sync Center',
                    icon: 'grid_view',
                    to: '/'
                },
                {
                    label: 'Neural Assets',
                    icon: 'hub',
                    href: '#'
                },
                {
                    label: 'Transactions',
                    icon: 'rocket_launch',
                    href: '#'
                },
                {
                    label: 'Liquidity',
                    icon: 'account_balance',
                    href: '#'
                },
                {
                    label: 'Flow Control',
                    icon: 'deployed_code',
                    children: [
                        { label: 'Workflows', to: '/workflows' },
                        { label: 'Rules', href: '#' }
                    ],
                    isOpen: false
                },
                {
                    label: 'Design System',
                    icon: 'palette',
                    to: '/design-system'
                }
            ];
        } catch (error) {
            console.error('Failed to fetch menu items:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const toggleMinimize = () => {
        isMinimized.value = !isMinimized.value;
        // Close all submenus when minimizing to keep it clean
        if (isMinimized.value) {
            menuItems.value.forEach(item => {
                item.isOpen = false;
            });
        }
    };

    const toggleSubmenu = (index: number) => {
        // Auto-expand if minimized and user clicks a submenu
        if (isMinimized.value) {
            isMinimized.value = false;
        }

        // Note: When using filteredMenuItems, we are interacting with copies in the template loop if we don't return the refs.
        // However, the computed returns new objects. 
        // We need to find the ORIGINAL item in menuItems to toggle its state effectively if we want perstistence,
        // OR we simply accept that toggling the filtered view might behave slightly differently.
        // BUT, the simplest way for the UI specific to the Store is to mutate the original list or find it.
        const filteredItem = filteredMenuItems.value[index];
        if (!filteredItem) return;

        // Find the real item in state to toggle (by label as key since IDs aren't present)
        const realItem = menuItems.value.find(i => i.label === filteredItem.label);
        if (realItem && realItem.children) {
            realItem.isOpen = !realItem.isOpen;
        }
    };

    const setSubmenuState = (index: number, isOpen: boolean) => {
        if (menuItems.value[index]) {
            menuItems.value[index].isOpen = isOpen;
        }
    };

    return {
        menuItems,
        filteredMenuItems,
        searchQuery,
        isMinimized,
        isLoading,
        fetchMenuItems,
        toggleMinimize,
        toggleSubmenu,
        setSubmenuState
    };
});
