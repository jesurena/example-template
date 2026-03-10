'use client';

import React, { useState } from 'react';
import { Table, Button, Dropdown, Input, Modal } from 'antd';
import type { MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Search, Plus, RotateCcw, MoreHorizontal, Edit3, Eye, Trash2 } from 'lucide-react';
import StatusChip from '@/components/Table/StatusChip';
import EditItemDialog from '@/components/Crud/EditItemDialog';
import ViewItemDialog from '@/components/Crud/ViewItemDialog';
import ItemFilterPopover, { ItemFilterValues } from '@/components/Crud/ItemFilterPopover';
import { Item } from '@/interface/item';
import { useItems, useCreateItem, useUpdateItem, useDeleteItem } from '@/hooks/items/useItems';

export default function ItemTable() {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');

    // Filter state
    const [activeFilters, setActiveFilters] = useState<ItemFilterValues>({
        category: null,
        status: null,
    });

    // Modal states
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Hooks
    const { data: items = [], isLoading } = useItems();
    const createItem = useCreateItem();
    const updateItem = useUpdateItem();
    const deleteItem = useDeleteItem();
    const [modal, contextHolder] = Modal.useModal();

    // Filtered data
    const filteredItems = items.filter(item => {
        // Search filter
        if (appliedSearch) {
            const search = appliedSearch.toLowerCase();
            const matchesSearch =
                item.name.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search) ||
                item.category.toLowerCase().includes(search);
            if (!matchesSearch) return false;
        }

        // Category filter
        if (activeFilters.category && item.category !== activeFilters.category) return false;

        // Status filter
        if (activeFilters.status !== null && item.status !== activeFilters.status) return false;

        return true;
    });

    const handleAddItem = () => {
        setIsEditing(false);
        setSelectedItem(null);
        setIsEditModalVisible(true);
    };

    const handleReset = () => {
        setSearchValue('');
        setAppliedSearch('');
        setActiveFilters({ category: null, status: null });
    };

    const handleEditItem = (item: Item) => {
        setIsEditing(true);
        setSelectedItem(item);
        setIsEditModalVisible(true);
    };

    const handleViewItem = (item: Item) => {
        setSelectedItem(item);
        setIsViewModalVisible(true);
    };

    const handleDeleteItem = (item: Item) => {
        modal.confirm({
            title: 'Delete Item',
            content: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
            okText: 'Yes, Delete',
            cancelText: 'No, Cancel',
            okButtonProps: {
                danger: true,
            },
            centered: true,
            onOk: () => {
                deleteItem.mutate(item.id);
            }
        });
    };

    const handleSaveItem = (values: any) => {
        if (isEditing && selectedItem) {
            updateItem.mutate({ id: selectedItem.id, itemData: values }, {
                onSuccess: () => {
                    setIsEditModalVisible(false);
                }
            });
        } else {
            createItem.mutate(values, {
                onSuccess: () => {
                    setIsEditModalVisible(false);
                }
            });
        }
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const columns: ColumnsType<Item> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            sorter: (a: Item, b: Item) => a.id - b.id,
            render: (text: number) => <span className="text-text-info font-medium">{text}</span>
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Item, b: Item) => a.name.localeCompare(b.name),
            render: (text: string, record: Item) => (
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-semibold text-text leading-none mb-1">{text}</span>
                        <span className="text-text-info text-xs truncate max-w-[200px]">{record.description}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            sorter: (a: Item, b: Item) => a.category.localeCompare(b.category),
            render: (text: string) => <span className="text-text-info font-medium">{text}</span>
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a: Item, b: Item) => a.createdAt.localeCompare(b.createdAt),
            render: (text: string) => <span className="text-text-info font-medium">{text}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean) => <StatusChip status={status} />
        },
        {
            title: '',
            key: 'action',
            width: 50,
            render: (_: any, record: Item) => {
                const menuItems: MenuProps['items'] = [
                    {
                        key: 'view',
                        label: (
                            <div className="flex items-center gap-2 text-text-info py-1 font-medium">
                                <Eye size={16} />
                                <span>View Details</span>
                            </div>
                        ),
                        onClick: ({ domEvent }: any) => {
                            domEvent.stopPropagation();
                            handleViewItem(record);
                        }
                    },
                    {
                        key: 'edit',
                        label: (
                            <div className="flex items-center gap-2 text-text-info py-1 font-medium">
                                <Edit3 size={16} />
                                <span>Edit Item</span>
                            </div>
                        ),
                        onClick: ({ domEvent }: any) => {
                            domEvent.stopPropagation();
                            handleEditItem(record);
                        }
                    },
                    {
                        type: 'divider',
                    },
                    {
                        key: 'delete',
                        label: (
                            <div className="flex items-center gap-2 text-red-500 py-1 font-medium">
                                <Trash2 size={16} />
                                <span>Delete Item</span>
                            </div>
                        ),
                        onClick: ({ domEvent }: any) => {
                            domEvent.stopPropagation();
                            handleDeleteItem(record);
                        }
                    },
                ];

                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                            <Button
                                type="text"
                                icon={<MoreHorizontal size={18} className="text-text-info" />}
                                className="flex items-center justify-center p-0 w-8 h-8 rounded-full hover:bg-neutral"
                            />
                        </Dropdown>
                    </div>
                );
            },
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <div className="relative">
            {contextHolder}
            <div className="bg-background p-4 pt-2 rounded-2xl border border-border shadow-xl overflow-x-auto">
                <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-text">All Items</h2>
                        <span className="bg-accent-1 text-white px-2 py-0.5 rounded-full text-xs font-bold">{filteredItems.length}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Input
                            placeholder="Search items..."
                            prefix={<Search size={18} className="text-text-info" />}
                            className="w-full md:w-[280px] rounded-lg h-10 border-border"
                            value={searchValue}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSearchValue(val);
                                if (val === '') {
                                    setAppliedSearch('');
                                }
                            }}
                            onPressEnter={() => {
                                setAppliedSearch(searchValue);
                            }}
                            allowClear
                        />
                        <Button
                            icon={<RotateCcw size={18} />}
                            className="rounded-lg h-10 flex items-center gap-2 border-border font-medium text-text-info hover:text-primary hover:border-primary"
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                        <ItemFilterPopover
                            currentFilters={activeFilters}
                            onApply={(values) => {
                                setActiveFilters(values);
                            }}
                        />
                        <Button
                            type="primary"
                            icon={<Plus size={18} />}
                            className="rounded-lg h-10 flex items-center gap-2 border-none font-medium shadow-none"
                            onClick={handleAddItem}
                        >
                            Add Item
                        </Button>
                    </div>
                </div>

                <Table
                    rowKey="id"
                    loading={isLoading}
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={filteredItems}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                    }}
                    className="user-management-table cursor-pointer"
                    onRow={(record: Item) => ({
                        onClick: () => handleViewItem(record),
                    })}
                />

                <EditItemDialog
                    visible={isEditModalVisible}
                    onCancel={() => setIsEditModalVisible(false)}
                    onSave={handleSaveItem}
                    item={selectedItem}
                    isEditing={isEditing}
                    confirmLoading={createItem.isPending || updateItem.isPending}
                />

                <ViewItemDialog
                    visible={isViewModalVisible}
                    onClose={() => setIsViewModalVisible(false)}
                    item={selectedItem}
                />
            </div>
        </div>
    );
}
