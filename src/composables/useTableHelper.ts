

export interface TableRequest {
    page: number;
    show: number; // limit/perPage
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    search?: string;
    [key: string]: any; // Allow dynamic filters
}

export function tableHelper(request: TableRequest, getData: () => Promise<void>) {

    const setShow = async (value: number) => {
        request.show = value;
        request.page = 1; // Reset to first page on limit change
        await getData();
    };

    const setPage = async (value: number) => {
        request.page = value;
        await getData();
    };

    const setFilter = async (fieldName: string, value: any) => {
        request[fieldName] = value;
        request.page = 1; // Reset to first page on filter change
        await getData();
    };

    const setSearch = async (value: string) => {
        request.search = value;
        request.page = 1;
        await getData();
    };

    const setSort = async (sortBy: string, sortDirection: 'asc' | 'desc') => {
        if (request.sortBy === sortBy) {
            // Toggle direction if same column
            request.sortDirection = request.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            request.sortBy = sortBy;
            request.sortDirection = sortDirection;
        }
        request.page = 1;
        await getData();
    };

    return {
        setShow,
        setPage,
        setFilter,
        setSearch,
        setSort,
    };
}
