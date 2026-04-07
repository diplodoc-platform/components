import type {AnalyticsAdapter, AnalyticsParams} from '../types';

import {appendScriptOnce} from '../../script-utils';

const METRIKA_SCRIPT_SRC = 'https://mc.yandex.ru/metrika/tag.js';

export interface YandexMetrikaInitParams {
    accurateTrackBounce?: boolean | number;
    childIframe?: boolean;
    clickmap?: boolean;
    defer?: boolean;
    ecommerce?: boolean | string | string[];
    trackHash?: boolean;
    trackLinks?: boolean;
    trustedDomains?: string[];
    webvisor?: boolean;
    triggerEvent?: boolean;
    sendTitle?: boolean;
    ssr?: boolean;
    experiments?: string;
}

export interface YandexMetrikaFn {
    (counter: number, method: 'init', params: YandexMetrikaInitParams): void;
    (counter: number, method: 'addFileExtension', extensions: string | string[]): void;
    (counter: number, method: 'extLink', url: string, options?: Record<string, unknown>): void;
    (counter: number, method: 'file', url: string, options?: Record<string, unknown>): void;
    (counter: number, method: 'getClientID', callback: (clientId: string) => void): void;
    (counter: number, method: 'hit', url: string, options?: Record<string, unknown>): void;
    (counter: number, method: 'notBounce', options?: Record<string, unknown>): void;
    (counter: number, method: 'params', params: Record<string, unknown>): void;
    (counter: number, method: 'reachGoal', goal: string, params?: Record<string, unknown>): void;
    (counter: number, method: 'setUserID', uid: string): void;
    (counter: number, method: 'userParams', params: Record<string, unknown>): void;
    (counter: number, method: string, ...args: unknown[]): void;
}

export interface YandexMetrikaAdapterConfig {
    id: number;
    params?: YandexMetrikaInitParams;
}

interface YandexMetrikaInternalFn extends YandexMetrikaFn {
    a?: unknown[];
    l?: number;
}

export class YandexMetrikaAdapter implements AnalyticsAdapter {
    private config: YandexMetrikaAdapterConfig;

    private initialized = false;

    constructor(config: YandexMetrikaAdapterConfig) {
        this.config = config;
    }

    async init() {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        try {
            const {id, params = {}} = this.config;
            const ym = getMetrikaFn();

            ym(id, 'init', params);

            await appendScriptOnce({
                url: METRIKA_SCRIPT_SRC,
                element: document.head,
                defer: false,
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Yandex Metrika load failed', error);
        }
    }

    send(event: string, params?: AnalyticsParams) {
        const ym = getMetrikaFn();

        ym(this.config.id, 'reachGoal', event, params);
    }
}

function getMetrikaFn(): YandexMetrikaFn {
    const key = 'ym';
    const win = window as Window & typeof globalThis & {ym: YandexMetrikaInternalFn};

    if (!win[key]) {
        win[key] = ((...args) => {
            (win[key].a = win[key].a || []).push(args);
        }) as YandexMetrikaInternalFn;

        win[key].l = new Date().getTime();
    }

    return win[key];
}
