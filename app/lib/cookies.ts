
export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const cname: string = `${name}=`;
    const decodedCookie: string = decodeURIComponent(document.cookie);
    const ca: Array<string> = decodedCookie.split(';');

    for(let currentString of ca) {
        while (currentString.charAt(0) == ' ') currentString = currentString.substring(1);
        if (!currentString.includes(cname)) continue;

        return currentString.substring(cname.length, currentString.length);
    }

    return null;
}

export function setCookie(name: string, value: string): void {
    if (typeof document === 'undefined') return;

    document.cookie = `${name}=${value}; path=/`;
}