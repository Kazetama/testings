import { Link, usePage } from '@inertiajs/react'
import { Activity, LayoutGrid } from 'lucide-react'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

import { dashboard } from '@/routes'
import admin from '@/routes/admin'
import ketua from '@/routes/ketua'
import superadmin from '@/routes/superadmin'

import type { NavItem, Usertype } from '@/types'
import AppLogo from './app-logo'

const mainNavItems: NavItem[] = [
    // mahasiswa navbar items
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        usertype: ['user'],
    },

    // admin navbar items
    {
        title: 'Admin Dashboard',
        href: admin.dashboard().url,
        icon: LayoutGrid,
        usertype: ['admin'],
    },

    {
        title: 'Event Organisasi',
        href: '/admin/event',
        icon: LayoutGrid,
        usertype: ['admin'],
    },

    {
        title: 'Manajemen Blog',
        icon: LayoutGrid,
        usertype: ['admin'],
        items: [
            {
                title: 'Manajemen Post',
                href: '/admin/posts',
                usertype: ['admin'],
            },
            {
                title: 'Manajemen Kategori',
                href: '/admin/categories',
                usertype: ['admin'],
            },
            {
                title: 'Manajemen Tag',
                href: '/admin/tags',
                usertype: ['admin'],
            },
        ],
    },

    {
        title: 'Lihat Blog',
        href: '/blog',
        icon: LayoutGrid,
        usertype: ['user', 'admin', 'ketua', 'superadmin'],
    },

    // superadmin navbar items
    {
        title: 'Superadmin Dashboard',
        href: superadmin.dashboard().url,
        icon: LayoutGrid,
        usertype: ['superadmin'],
    },

    // ketua navbar items
    {
        title: 'ketua Dashboard',
        href: ketua.dashboard().url,
        icon: LayoutGrid,
        usertype: ['ketua'],
    },

    {
        title: 'Manajemen Anggota',
        href: '/ketua/members',
        icon: Activity,
        usertype: ['ketua'],
    }

]

export function AppSidebar() {
    const { auth } = usePage().props as {
        auth?: {
            user?: {
                usertype?: Usertype
            }
        }
    }

    const usertype: Usertype = auth?.user?.usertype ?? 'user'

    const filteredMainNavItems = mainNavItems.filter(
        item => !item.usertype || item.usertype.includes(usertype)
    )

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
