import { createServerFn } from '@tanstack/react-start';
import { redirect } from '@tanstack/react-router';
import { parseCookies, setCookie } from 'vinxi/http';

export const checkUserAuthentication = createServerFn().handler(async () => {
    const cookies: Record<string, string> = parseCookies();

    if(!cookies['open_board_session'] && !cookies['open_board_session_remember_me']) return null;

    const userResponse: Response = await fetch('http://localhost:8080/auth/@me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies['open_board_session']}`,
        }
    });

    if(userResponse.ok) return (await userResponse.json()).data;
    if(!cookies['open_board_session_remember_me']) return null;

    const refreshResponse: Response = await fetch('http://localhost:8080/auth/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies['open_board_session_remember_me']}`,
        },
        body: JSON.stringify({type: 'token'})
    });

    if(!refreshResponse.ok) return null;

    const refreshData = await refreshResponse.json();
    const cookieConfig = {httpOnly: true, domain: 'localhost'};

    setCookie('open_board_session', refreshData.data.access_token, cookieConfig);
    setCookie('open_board_session_remember_me', refreshData.data.refresh_token, cookieConfig);

    return refreshData.data.user;
});

export async function authMiddleware() {
    const user = await checkUserAuthentication();

    if(user === null) throw redirect({to: '/auth/login'});

    return {user};
}