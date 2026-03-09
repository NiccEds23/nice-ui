import { getData } from './http-helper';


/**
 * Dynamic Fetcher for SWRV
 * @param url - Endpoint URL
 * @param config - Optional configuration object
 */
export const fetcher = async <T = any>(
    url: string,
    config?: { type?: string; params?: any }
): Promise<T> => {
    const type = config?.type || 'api_url';
    const params = config?.params || {};

    const response = await getData<T>(type, url, params);
    return response.data;
};

// Default export if swrv needs a simplified signature 
// (swrv default signature is usually just (key) => promise)
export default fetcher;

/**
 * ==========================================
 * Example Usage with SWRV
 * ==========================================
 * 
 * 1. Basic Usage:
 *    const { data } = useSWRV('/api/users', fetcher);
 * 
 * 2. With Params (Search/Filter):
 *    // swrv passes array elements as arguments to fetcher
 *    const { data } = useSWRV(['/api/users', { params: { role: 'admin' } }], fetcher);
 * 
 * 3. With Type Safety:
 *    interface User { id: number; name: string; }
 *    const { data } = useSWRV<User[]>('/api/users', fetcher);
 * 
 * 4. With Specific API Type (modules):
 *    const { data } = useSWRV(['/auth/me', { type: 'auth_api' }], fetcher);
 */
