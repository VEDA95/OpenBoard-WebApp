"use client";

import { DarkModeDropdownToggle } from '@components/dark-mode';
import type { ReactElement, FC, PropsWithChildren } from 'react';

export function AuthLayout({ children }: PropsWithChildren): ReactElement<FC> {
  return (
    <>
      {children}
      <footer className="flex flex-col items-end p-6 md:p-10">
        <DarkModeDropdownToggle />
      </footer>
    </>
  );
}
