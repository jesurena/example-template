import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Item } from '@/interface/item';

// ============================================================================
// CRUD Hooks for Items
// ============================================================================

// ─── Fetch All Items ─────────────────────────────────────────────────────────

export const useItems = () => {
    return useQuery<Item[]>({
        queryKey: ['items'],
        queryFn: async () => {
            const { data } = await api.get('/items');
            return data.data || data;
        },
    });
};

// ─── Create Item ─────────────────────────────────────────────────────────────

export const useCreateItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (itemData: Partial<Item>) => {
            const { data } = await api.post('/items', itemData);
            return data.item || data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
    });
};

// ─── Update Item ─────────────────────────────────────────────────────────────

export const useUpdateItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, itemData }: { id: number; itemData: Partial<Item> }) => {
            const { data } = await api.put(`/items/${id}`, itemData);
            return data.item || data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
    });
};

// ─── Delete Item ─────────────────────────────────────────────────────────────

export const useDeleteItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await api.delete(`/items/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
    });
};
