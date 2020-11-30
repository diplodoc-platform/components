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

export function isActiveItem(router: Router, href: string) {
    return normalizePath(router.pathname) === normalizePath(parse(href).pathname);
}

export function isExternalHref(href: string) {
    return href.startsWith('http') || href.startsWith('//');
}

export function getStateKey(showMiniToc: boolean | unknown, wideFormat: boolean | unknown) {
    return [
        showMiniToc ? 'showMiniToc' : '',
        wideFormat ? 'wideFormat' : '',
    ].join('|');
}
