import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ItemFilterValues } from '@/components/Crud/ItemFilterPopover';

interface PaginationState {
    current: number;
    pageSize: number;
}

/**
 * Hook to synchronize table filters, search, and pagination with the URL query parameters in example-template.
 */
export const useTableUrlSync = (
    activeFilters: ItemFilterValues,
    appliedSearch: string,
    pagination: PaginationState
) => {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const params = new URLSearchParams();

        if (activeFilters.category) params.set('category', activeFilters.category);
        if (activeFilters.status !== null) params.set('status', String(activeFilters.status));
        if (appliedSearch) params.set('search', appliedSearch);
        if (pagination.current > 1) params.set('page', String(pagination.current));
        if (pagination.pageSize !== 10) params.set('pageSize', String(pagination.pageSize));

        const query = params.toString();
        const url = `${pathname}${query ? `?${query}` : ''}`;

        // Use replace to avoid polluting history with every filter change
        router.replace(url, { scroll: false });
    }, [activeFilters, appliedSearch, pagination, pathname, router]);
};
