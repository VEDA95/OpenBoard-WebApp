import {Outlet, ScrollRestoration, createRootRoute} from '@tanstack/react-router';
import {createServerFn, Meta, Scripts} from '@tanstack/start';
import {parseCookies, setCookie} from 'vinxi/http';
import {ThemeProvider} from '@/components/theme-provider';
import {clsx} from 'clsx';
import appCss from '@/styles/app.css?url';
import type {FC, ReactElement, ReactNode} from 'react';

export const getServerUIThemeCookie = createServerFn({method: 'GET'}).handler(async (): Promise<string> => {
    const cookies = parseCookies();
    const defaultTheme: string = 'dark';

    if (cookies['ui-theme'] == null) {
        setCookie('ui-theme', defaultTheme);

        return defaultTheme;
    }

    if (cookies['ui-theme'] === 'system') return defaultTheme;

    return cookies['ui-theme'];
});

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'TanStack Start Starter',
            }
        ],
        links: [
            {type: 'text/css', rel: 'stylesheet', href: appCss}
        ]
    }),
    component: RootComponent,
    loader: async () => {
        const uiThemeCookie: string = await getServerUIThemeCookie();

        return {
            uiTheme: uiThemeCookie,
        };
    }
});

function RootComponent(): ReactElement<FC> {
    return (
        <RootDocument>
            <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
                <Outlet />
            </ThemeProvider>
        </RootDocument>
    );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>): ReactElement<FC> {
    const {uiTheme} = Route.useLoaderData();
    const bodyClasses: string = clsx({
        'dark': uiTheme === 'dark',
        'light': uiTheme === 'light'
    }, 'dark:bg-zinc-950', 'dark:text-zinc-50');

    return (
        <html>
            <head>
                <Meta />
            </head>
            <body className={bodyClasses}>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}