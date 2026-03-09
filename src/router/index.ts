import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import { useUIStore } from '@/stores/ui'

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(_, __, savedPosition) {
        const uiStore = useUIStore();
        if (savedPosition) {
            uiStore.setNextScroll(savedPosition);
        } else {
            uiStore.setNextScroll({ top: 0 }); // Default to top for new routes
        }
        // Return false/empty to suppress native window scrolling since we rely on inner scroll
        return false;
    },
})

router.afterEach((to) => {
    const uiStore = useUIStore();

    // 1. Check if route has explicit breadcrumb definition
    if (to.meta.breadcrumb) {
        const breadcrumbData = to.meta.breadcrumb;

        if (Array.isArray(breadcrumbData)) {
            try {
                // Map user's YAML format (name/route) to Store format (label/to)
                const items = breadcrumbData.map((item: any) => ({
                    label: item.name || item.label || 'Unknown',
                    to: item.route || item.to || undefined
                }));
                uiStore.setBreadcrumbs(items);
            } catch (e) {
                console.error('Failed to parse breadcrumbs', e);
                uiStore.setBreadcrumbs([]);
            }
            return;
        }
    }

    // 2. Default Auto-Generation
    // Determine title: prefer meta.title, then capitalised route name, then path segment
    const title = (to.meta.title as string) || (to.name as string)?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Page';

    const breadcrumbs = [
        { label: 'Home', to: '/' }
    ];

    if (to.path !== '/') {
        breadcrumbs.push({
            label: title,
            to: '' // Current page often doesn't need a link, or use to.path
        });
    }

    uiStore.setBreadcrumbs(breadcrumbs);
});

export default router
