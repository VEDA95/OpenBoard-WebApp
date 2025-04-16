import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { DarkModeToggle } from '@/components/dark-mode-toggle';
import { GalleryVerticalEnd } from 'lucide-react';
import type { ReactElement, FC } from 'react';

function AuthPage(): ReactElement<FC> {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="relative hidden bg-muted lg:block">
                <img
                    src="https://ui.shadcn.com/placeholder.svg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-between">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">
                            <GalleryVerticalEnd className="size-4"/>
                        </div>
                        Acme Inc.
                    </a>
                    <DarkModeToggle />
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <Outlet/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const Route = createFileRoute('/auth')({
    component: AuthPage,
    beforeLoad: async ({location: {pathname}}): Promise<void> => {
        if (pathname === '/auth') throw redirect({to: '/auth/login'});
    }
});