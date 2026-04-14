import type {AnalyticsAdapter, AnalyticsParams} from './types';

import {ConsoleAnalyticsAdapter} from './adapters/console-analytics-adapter';
import {checkDebugMode} from './utils';

export interface AnalyticsConfig {
    adapters: AnalyticsAdapter[];
    debug?: boolean;
}

export class Analytics {
    private adapters: Set<AnalyticsAdapter>;

    private initialized = false;

    constructor(config: AnalyticsConfig) {
        this.adapters = new Set(config.adapters);
        this.track = this.track.bind(this);

        const isDebug = typeof config.debug === 'boolean' ? config.debug : checkDebugMode();

        if (isDebug) {
            this.adapters.add(new ConsoleAnalyticsAdapter());
        }
    }

    async init() {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        try {
            const promises = Array.from(this.adapters, (adapter) => {
                if (typeof adapter.init === 'function') {
                    return adapter.init();
                }

                return null;
            });

            await Promise.all(promises);
        } catch (error) {
            this.initialized = false;

            // eslint-disable-next-line no-console
            console.error('Failed to initialize the analytics service:', error);
        }
    }

    track(event: string, params?: AnalyticsParams) {
        for (const adapter of this.adapters) {
            adapter.send(event, params);
        }
    }
}
