import type {Router} from '../models';

import {parse} from 'url';

export function normalizePath(path?: string | null) {
    if (!path) {
        return path;
    }

    if (path === '/') {
        return './';
    }

    return path
        .replace(/^\//, '')
        .replace(/\.html(\?.*)?$/, '$1')
        .replace(/\/index(\?.*)?$/, '/$1');
}

export function normalizeHash(hash?: string | null) {
    if (hash?.startsWith('#')) {
        return hash.substring(1);
    }
    return hash;
}

export function isActiveItem(router: Router, href: string, singlePage?: boolean) {
    if (singlePage) {
        return normalizeHash(router.hash) === normalizeHash(parse(href).hash);
    }

    return normalizePath(router.pathname) === normalizePath(parse(href).pathname);
}

export function isExternalHref(href: string) {
    return href.startsWith('http') || href.startsWith('//');
}
