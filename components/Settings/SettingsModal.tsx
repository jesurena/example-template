'use client';

import React, { useState } from 'react';
import { Modal, Select } from 'antd';
import { useTheme } from '@/components/Providers/theme-provider';
import { Settings, Sun, Moon, Monitor, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

const themeOptions = [
    {
        value: 'light',
        label: (
            <div className="flex items-center gap-2">
                <Sun size={14} />
                <span>Light</span>
            </div>
        ),
    },
    {
        value: 'dark',
        label: (
            <div className="flex items-center gap-2">
                <Moon size={14} />
                <span>Dark</span>
            </div>
        ),
    },
    {
        value: 'system',
        label: (
            <div className="flex items-center gap-2">
                <Monitor size={14} />
                <span>System</span>
            </div>
        ),
    },
];

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<'general'>('general');
    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            closeIcon={null}
            width={{
                xs: '90%',
                sm: '80%',
                md: '70%',
                lg: '60%',
                xl: '50%',
                xxl: '40%',
            }}
            mask={false}
            centered
        >
            <div className="flex flex-col md:flex-row h-[75vh] md:h-[520px] relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all z-10"
                >
                    <X size={20} />
                </button>
                <div className="w-full md:w-[220px] bg-neutral border-b md:border-b-0 md:border-r border-border flex flex-col shrink-0">
                    <div className="px-5 pt-6 pb-4">
                        <h2 className="text-base font-bold text-foreground tracking-tight">Settings</h2>
                    </div>

                    <nav className="flex flex-col gap-1 px-3 flex-1">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={cn(
                                "flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer shrink-0 whitespace-nowrap",
                                activeTab === 'general'
                                    ? "bg-accent-1 text-white shadow-sm"
                                    : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                            )}
                        >
                            <Settings size={18} />
                            <span>General</span>
                        </button>
                    </nav>
                </div>

                <div className="flex-1 overflow-y-auto p-5 md:p-8">
                    {activeTab === 'general' && (
                        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">General</h3>
                                <p className="text-sm text-foreground/50 mt-1">
                                    Manage your general preferences.
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground block mb-2">
                                    Theme Appearance
                                </label>
                                <Select
                                    value={theme}
                                    onChange={(val) => setTheme(val)}
                                    options={themeOptions}
                                    className="w-full sm:w-64"
                                />
                                <p className="text-xs text-foreground/50 mt-2">
                                    Select how you&apos;d like the UI to appear on your screen.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
