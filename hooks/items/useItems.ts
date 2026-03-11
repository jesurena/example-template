import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import api from '@/lib/api'; // Uncomment when connecting to a real API
import { Item } from '@/interface/item';

// ============================================================================
// CRUD Hooks for Items
// ============================================================================
// Each hook below has TWO versions:
//   1. The REAL API version (commented out) — uncomment & use when backend is ready
//   2. The MOCK version (active) — uses static data for development
//
// To switch: uncomment the real version, delete/comment the mock version,
// and uncomment the `import api` at the top.
// ============================================================================

// Static mock data — remove once connected to a real API
const mockItems: Item[] = [
    { id: 1, name: 'Project Alpha', description: 'Initial project setup and configuration', category: 'Technology', status: true, createdAt: '2026-01-15' },
    { id: 2, name: 'Budget Report Q1', description: 'Quarterly financial analysis report', category: 'Finance', status: true, createdAt: '2026-02-01' },
    { id: 3, name: 'Marketing Campaign', description: 'Spring 2026 digital marketing campaign', category: 'Marketing', status: false, createdAt: '2026-02-10' },
    { id: 4, name: 'Server Migration', description: 'Cloud infrastructure migration plan', category: 'Technology', status: true, createdAt: '2026-02-20' },
    { id: 5, name: 'HR Policy Draft', description: 'Updated employee handbook and policies', category: 'General', status: false, createdAt: '2026-03-01' },
    { id: 6, name: 'Warehouse Audit', description: 'Annual inventory and compliance audit', category: 'Operations', status: true, createdAt: '2026-03-05' },
    { id: 7, name: 'Project Alpha', description: 'Initial project setup and configuration', category: 'Technology', status: true, createdAt: '2026-01-15' },
    { id: 8, name: 'Budget Report Q1', description: 'Quarterly financial analysis report', category: 'Finance', status: true, createdAt: '2026-02-01' },
    { id: 9, name: 'Marketing Campaign', description: 'Spring 2026 digital marketing campaign', category: 'Marketing', status: false, createdAt: '2026-02-10' },
    { id: 10, name: 'Server Migration', description: 'Cloud infrastructure migration plan', category: 'Technology', status: true, createdAt: '2026-02-20' },
    { id: 11, name: 'HR Policy Draft', description: 'Updated employee handbook and policies', category: 'General', status: false, createdAt: '2026-03-01' },
    { id: 12, name: 'Warehouse Audit', description: 'Annual inventory and compliance audit', category: 'Operations', status: true, createdAt: '2026-03-05' },
];

// ─── Fetch All Items ─────────────────────────────────────────────────────────

// REAL API version:
// export const useItems = () => {
//     return useQuery<Item[]>({
//         queryKey: ['items'],
//         queryFn: async () => {
//             const { data } = await api.get('/items');
//             return data.data || data;
//         },
//     });
// };

// MOCK version (active):
export const useItems = () => {
    return useQuery<Item[]>({
        queryKey: ['items'],
        queryFn: async () => {
            console.log('[useItems] Fetching all items...');
            await new Promise(resolve => setTimeout(resolve, 300));
            console.log('[useItems] Returned', mockItems.length, 'items');
            return mockItems;
        },
    });
};

// ─── Create Item ─────────────────────────────────────────────────────────────

// REAL API version:
// export const useCreateItem = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: async (itemData: Partial<Item>) => {
//             const { data } = await api.post('/items', itemData);
//             return data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['items'] });
//         },
//     });
// };

// MOCK version (active):
export const useCreateItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (itemData: Partial<Item>) => {
            console.log('[useCreateItem] Creating item:', itemData);
            await new Promise(resolve => setTimeout(resolve, 300));
            const newItem: Item = {
                id: Date.now(),
                name: itemData.name || '',
                description: itemData.description || '',
                category: itemData.category || 'General',
                status: itemData.status ?? true,
                createdAt: new Date().toISOString().split('T')[0],
            };
            console.log('[useCreateItem] Created item:', newItem);
            return newItem;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
    });
};

// ─── Update Item ─────────────────────────────────────────────────────────────

// REAL API version:
// export const useUpdateItem = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: async ({ id, itemData }: { id: number; itemData: Partial<Item> }) => {
//             const { data } = await api.put(`/items/${id}`, itemData);
//             return data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['items'] });
//         },
//     });
// };

// MOCK version (active):
export const useUpdateItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, itemData }: { id: number; itemData: Partial<Item> }) => {
            console.log('[useUpdateItem] Updating item', id, ':', itemData);
            await new Promise(resolve => setTimeout(resolve, 300));
            console.log('[useUpdateItem] Item updated successfully');
            return { ...itemData, id };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
    });
};

// ─── Delete Item ─────────────────────────────────────────────────────────────

// REAL API version:
// export const useDeleteItem = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: async (id: number) => {
//             const { data } = await api.delete(`/items/${id}`);
//             return data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['items'] });
//         },
//     });
// };

// MOCK version (active):
export const useDeleteItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            console.log('[useDeleteItem] Deleting item', id);
            await new Promise(resolve => setTimeout(resolve, 300));
            console.log('[useDeleteItem] Item deleted successfully');
            return { id };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
    });
};
