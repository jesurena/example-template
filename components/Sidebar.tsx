'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Settings, MoreVertical, Menu, X, LogOut, Loader2, ChevronRight } from 'lucide-react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import SettingsModal from './Settings/SettingsModal';
import UserAvatar from './Avatar/UserAvatar';
import { useAuth, useLogout } from '@/hooks/login/useAuth';
import { MenuGroup } from '@/interface/sidebar';
import { useSidebarExpansion } from '@/hooks/sidebar/useSidebarExpansion';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const { user, isLoading } = useAuth();
    const { mutate: logout } = useLogout();

    const menuGroups: MenuGroup[] = [
        {
            title: 'DASHBOARD',
            items: [
                { name: 'Overview', href: '/dashboard', icon: Home }
            ]
        },
        {
            title: 'MODULES',
            items: [
                {
                    name: 'User',
                    icon: Users,
                    subItems: [
                        { name: 'User Management', href: '/user-management' }
                    ]
                },
                
                
                
                { name: 'CRUD', href: '/crud', icon: Settings },
                
                // MODULE_INSERTION_MARKER
            ]
        }
    ];

    const { expandedMenus, toggleSubMenu } = useSidebarExpansion(pathname, menuGroups);

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'settings',
            label: (
                <div className="flex items-center gap-2 py-1">
                    <Settings size={16} />
                    <span>Settings</span>
                </div>
            ),
            onClick: () => setIsSettingsOpen(true)
        },
        {
            key: 'logout',
            label: (
                <div className="flex items-center gap-2 py-1 text-red-500">
                    <LogOut size={16} />
                    <span>Logout</span>
                </div>
            ),
            onClick: () => logout(),
        },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full bg-sidebar transition-colors duration-300">
            <div className="p-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group w-max">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-xs">EX</span>
                    </div>
                    <span className="text-md font-bold text-foreground tracking-tight">
                        Example Template
                    </span>
                </Link>
                <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden text-foreground/40 hover:text-foreground transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-6">
                {menuGroups.map((group, index) => (
                    <div key={index}>
                        <h3 className="text-[11px] font-bold text-foreground/40 uppercase tracking-wider mb-2 px-3">
                            {group.title}
                        </h3>
                        {group.items.length > 0 && (
                            <div className="flex flex-col gap-1">
                                {group.items.map((item) => {
                                    const hasSubItems = item.subItems && item.subItems.length > 0;
                                    const isExpanded = expandedMenus.includes(item.name);
                                    const isActive = pathname === item.href || (hasSubItems && item.subItems?.some(sub => pathname === sub.href));
                                    const Icon = item.icon;

                                    if (hasSubItems) {
                                        return (
                                            <div key={item.name} className="flex flex-col gap-1">
                                                <button
                                                    onClick={() => toggleSubMenu(item.name)}
                                                    className={cn(
                                                        "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-[14px] interactive-item transition-all",
                                                        isActive ? "text-foreground font-semibold" : "text-foreground/60 hover:text-foreground font-medium"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Icon className={cn("w-[18px] h-[18px]", isActive ? "text-foreground" : "text-foreground/40")} />
                                                        {item.name}
                                                    </div>
                                                    <ChevronRight size={16} className={cn("transition-transform duration-200", isExpanded && "rotate-90")} />
                                                </button>
                                                {isExpanded && (
                                                    <div className="flex flex-col gap-1 ml-9 overflow-hidden animate-in slide-in-from-top-1 duration-200">
                                                        {item.subItems?.map((sub) => {
                                                            const isSubActive = pathname === sub.href;
                                                            return (
                                                                <Link
                                                                    key={sub.href}
                                                                    href={sub.href}
                                                                    className={cn(
                                                                        "flex items-center px-3 py-2 rounded-lg text-[13px] font-semibold transition-all",
                                                                        isSubActive
                                                                            ? "text-foreground bg-neutral/50"
                                                                            : "text-foreground/40 hover:text-foreground hover:bg-neutral/30"
                                                                    )}
                                                                >
                                                                    <span className={cn(
                                                                        "w-1.5 h-1.5 rounded-full mr-2",
                                                                        isSubActive ? "bg-primary" : "bg-foreground/40"
                                                                    )} />
                                                                    {sub.name}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href || '#'}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-bold interactive-item",
                                                isActive
                                                    ? "bg-neutral text-foreground"
                                                    : "text-foreground/60 hover:text-foreground"
                                            )}
                                        >
                                            <Icon className={cn("w-[18px] h-[18px]", isActive ? "text-foreground" : "text-foreground/40")} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-5 overflow-hidden">
                <Dropdown menu={{ items: userMenuItems }} placement="topRight" trigger={['click']}>
                    <div className="flex items-center justify-between pt-4 border-t border-border cursor-pointer group">
                        <div className="flex items-center gap-3 overflow-hidden">
                            {isLoading ? (
                                <div className="w-9 h-9 rounded-full bg-neutral flex items-center justify-center">
                                    <Loader2 className="w-4 h-4 text-foreground/40 animate-spin" />
                                </div>
                            ) : (
                                <UserAvatar
                                    src={user?.GAvatar}
                                    name={user?.AccountName}
                                    domainAccount={user?.DomainAccount}
                                    size={36}
                                    className="shadow-sm group-hover:scale-105 transition-transform shrink-0"
                                />
                            )}
                            <div className="flex flex-col text-left overflow-hidden">
                                <span className="text-xs font-bold text-foreground leading-none mb-1 truncate">
                                    {isLoading ? 'Loading...' : (user?.Nickname || user?.AccountName || 'Guest User')}
                                </span>
                                <span className="text-xs text-foreground/50 font-medium truncate">
                                    {isLoading ? 'Please wait' : (user?.Email || 'Not logged in')}
                                </span>
                            </div>
                        </div>
                        <MoreVertical className="w-4 h-4 text-foreground/40 group-hover:text-foreground transition-colors flex-shrink-0" />
                    </div>
                </Dropdown>
            </div>
        </div>
    );

    return (
        <>
            <header className="lg:hidden sticky top-0 left-0 w-full z-40 bg-background border-b border-border px-4 h-16 flex items-center justify-between shrink-0 transition-colors">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-2 text-foreground/60 hover:bg-neutral rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-xs">AC</span>
                        </div>
                        <span className="text-lg font-bold text-foreground tracking-tight leading-none uppercase tracking-tighter">template</span>
                    </Link>
                </div>
            </header>

            <div
                className={cn(
                    "fixed inset-0 z-[60] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div
                    className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                ></div>
                <div className="absolute left-0 top-0 h-full w-[280px] bg-background shadow-2xl overflow-hidden">
                    {sidebarContent}
                </div>
            </div>

            <aside className="hidden lg:flex w-64 flex-col h-screen border-r border-border sticky top-0 bg-sidebar shadow-sm shrink-0 transition-colors">
                {sidebarContent}
            </aside>

            <SettingsModal
                visible={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </>
    );
}