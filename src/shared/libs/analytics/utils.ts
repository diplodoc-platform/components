const DEBUG_KEY = '_analytics_debug';

export function checkDebugMode() {
    try {
        if (typeof window === 'undefined') {
            return false;
        }

        const query = new URLSearchParams(window.location.search);
        const queryValue = query.get(DEBUG_KEY);
        const cookieValue = getCookieValue(DEBUG_KEY);

        if (queryValue === '1') {
            if (cookieValue !== '1') {
                setCookieValue(DEBUG_KEY, '1');
            }

            return true;
        }

        if (queryValue === '0') {
            if (cookieValue) {
                removeCookie(DEBUG_KEY);
            }

            return false;
        }

        return cookieValue === '1';
    } catch {
        return false;
    }
}

function getCookieValue(name: string) {
    const match = document.cookie.match(new RegExp(`(^| )${encodeURIComponent(name)}=([^;]+)`));

    return match ? match[2] : null;
}

function setCookieValue(name: string, value: string, maxAge = 1) {
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAge * 24 * 60 * 60}`;
}

function removeCookie(name: string) {
    document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0`;
}
