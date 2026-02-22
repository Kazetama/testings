import { usePage } from '@inertiajs/react'
import AppLogoIcon from './app-logo-icon'

type Usertype = 'user' | 'admin' | 'superadmin' | 'ketua'

export default function AppLogo() {
    const { auth } = usePage().props as {
        auth?: {
            user?: {
                usertype?: Usertype
            }
        }
    }

    const usertype: Usertype = auth?.user?.usertype ?? 'user'

    const roleLabel: Record<Usertype, string> = {
        user: 'Mahasiswa Panel',
        admin: 'Admin Panel',
        superadmin: 'Superadmin Panel',
        ketua: 'ketua Panel',
    }

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>

            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {roleLabel[usertype]}
                </span>
            </div>
        </>
    )
}
