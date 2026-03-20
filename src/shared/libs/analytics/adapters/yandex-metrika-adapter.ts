import type {AnalyticsAdapter, AnalyticsParams} from '../types';

export interface YandexMetrikaFn {
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
}

interface YandexMetrikaInternalFn extends YandexMetrikaFn {
    a?: unknown[];
    l?: number;
}

export class YandexMetrikaAdapter implements AnalyticsAdapter {
    private config: YandexMetrikaAdapterConfig;

    constructor(config: YandexMetrikaAdapterConfig) {
        this.config = config;
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
