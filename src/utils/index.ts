import {parse} from 'url';

import {ThemeContextProps} from '@gravity-ui/uikit';

import {DocContentPage} from '../components/DocContentPage';
import {DocLeadingPage} from '../components/DocLeadingPage';
import {DocPage} from '../components/DocPage';
import {PopperPosition} from '../hooks';
import {
    Contributor,
    DocContentPageData,
    DocLeadingPageData,
    DocPageData,
    DocumentType,
    Router,
} from '../models';

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

export const getRandomKey = () => Math.random();

export function isInvalidEmail(email: string) {
    const EMAIL_RE = /\S+@\S+/;

    return !EMAIL_RE.test(email);
}

export function isContributor(contributor: unknown): contributor is Contributor {
    if (!contributor || typeof contributor !== 'object') {
        return false;
    }

    const fields = ['avatar', 'login', 'url', 'name', 'email'];

    for (const field of fields) {
        if (field in contributor) {
            return true;
        }
    }

    return false;
}

export const getPopupPosition = (
    isVerticalView: boolean | undefined,
    direction?: ThemeContextProps['direction'],
) => {
    if (isVerticalView && direction === 'rtl') {
        return PopperPosition.RIGHT_START;
    }

    return isVerticalView ? PopperPosition.LEFT_START : PopperPosition.BOTTOM_END;
};

export function getPageByType(type: DocumentType) {
    const PageTypes = {
        [DocumentType.Base]: DocPage,
        [DocumentType.Leading]: DocLeadingPage,
        [DocumentType.PageConstructor]: DocContentPage,
    };

    return PageTypes[type] || null;
}

export function getPageType({
    data,
    leading,
}: DocLeadingPageData | (DocPageData & {data?: undefined}) | DocContentPageData): DocumentType {
    if (leading && data) {
        return Object.prototype.hasOwnProperty.call(data, 'links')
            ? DocumentType.Leading
            : DocumentType.PageConstructor;
    }

    return DocumentType.Base;
}
