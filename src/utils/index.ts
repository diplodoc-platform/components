import {parse} from 'url';

import {Router} from '../models';

export type InnerProps<TProps extends Partial<TDefaultProps>, TDefaultProps> = Omit<
    TProps,
    keyof TDefaultProps
> &
    Required<Pick<TProps, keyof TDefaultProps>>;

export type ChangeHandler<S> = <K extends keyof S, V extends S[K]>(
    field: K,
    value?: V,
) => () => void;

export function normalizePath(path?: string | null) {
    return path?.replace(/\/index$/, '/');
}

export function normalizeHash(hash?: string | null) {
    if (hash && hash.startsWith('#')) {
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

export function getStateKey(
    showMiniToc: boolean | unknown,
    wideFormat: boolean | unknown,
    singlePage: boolean | unknown,
) {
    return [
        showMiniToc ? 'showMiniToc' : '',
        wideFormat ? 'wideFormat' : '',
        singlePage ? 'singlePage' : '',
    ].join('|');
}

export function callSafe(func: ((path: string) => string) | undefined, path: string) {
    if (typeof func === 'function') {
        return func(path);
    }

    if (typeof func === 'undefined') {
        return path;
    }

    throw new Error('Path converter should be a function');
}

export function getHeaderTag(el: HTMLElement) {
    let resultEl: HTMLElement = el;

    while (!isHeaderTag(resultEl) && resultEl.tagName !== 'BODY') {
        if (!resultEl.parentElement) {
            break;
        }

        resultEl = resultEl.parentElement;
    }

    if (!isHeaderTag(resultEl) || resultEl.tagName === 'BODY') {
        return null;
    }

    return resultEl;
}
function isHeaderTag(el: HTMLElement) {
    return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName);
}

export function createElementFromHTML(htmlString: string) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    return div.firstChild as Node;
}

export const getRandomKey = () => Math.random();

export const mailValidation = (email: string) => {
    const EMAIL_RE =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return EMAIL_RE.test(email);
};
