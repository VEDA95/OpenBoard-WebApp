'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {getCookie, setCookie} from '@/lib/cookies';
import type { ReactElement, FC, Context } from 'react';

export type Theme = 'dark' | 'light' | 'system';

export type ThemeProviderProps = {
    children: ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

export type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: 'system',
    setTheme: () => null,
};

const ThemeProviderContext: Context<ThemeProviderState> = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'ui-theme', ...props}: ThemeProviderProps): ReactElement<FC> {
    const [theme, setTheme] = useState<Theme>((getCookie(storageKey) as Theme) || defaultTheme);

    useEffect((): void => {
        const root: HTMLElement = window.document.body;

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

            root.classList.add(systemTheme);

            if (systemTheme === 'dark') root.classList.remove('light');
            if (systemTheme === 'light') root.classList.remove('dark');

            return;
        }

        root.classList.add(theme);

        if (theme === 'dark') root.classList.remove('light');
        if (theme === 'light') root.classList.remove('dark');
    }, [theme])

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            if (typeof window === 'undefined') return;

            setTheme(theme);
            setCookie('ui-theme', theme);
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme: () => ThemeProviderState = (): ThemeProviderState => {
    const context: ThemeProviderState = useContext(ThemeProviderContext);

    if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

    return context;
}
