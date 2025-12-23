"use client";

import { GalleryVerticalEnd } from 'lucide-react';
import { DarkModeDropdownToggle } from '@components/dark-mode';
import type { ReactElement, FC, PropsWithChildren } from 'react';

export function AuthLayout({ children }: PropsWithChildren): ReactElement<FC> {
  return (
    <>
      <main className="flex flex-col flex-auto items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
          {children}
        </div>
      </main>
      <footer className="flex flex-col items-end p-6 md:p-10">
        <DarkModeDropdownToggle />
      </footer>
    </>
  );
}
