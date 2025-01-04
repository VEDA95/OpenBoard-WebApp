import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme-provider';
import type { ReactElement, FC } from 'react';
import type { Theme } from './theme-provider';

export function DarkModeToggle(): ReactElement<FC> {
    const { setTheme } = useTheme();
    const handleTheme = (theme: Theme): () => void => (): void => setTheme(theme);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleTheme('light')}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTheme('dark')}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTheme('system')}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
