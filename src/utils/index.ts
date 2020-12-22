import _ from 'lodash';
import {parse} from 'url';

import {DEFAULT_SETTINGS} from '../constants';
import {DocSettings, Router} from '../models';

export type InnerProps<TProps extends Partial<TDefaultProps>, TDefaultProps> =
    Omit<TProps, keyof TDefaultProps> &
    Required<Pick<TProps, keyof TDefaultProps>>;


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const {fullScreen, ...settingsWithoutFullScreen} = DEFAULT_SETTINGS;
export const isDefaultSettings = (settings: DocSettings) => {
    return _.isEqual(settingsWithoutFullScreen, settings);
};

export type ChangeHandler<S> = <K extends keyof S, V extends S[K]>(field: K, value?: V) => () => void;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].indexOf(el.tagName) !== -1;
}

export function createElementFromHTML(htmlString: string) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    return div.firstChild as Node;
}
