import type {AnalyticsAdapter, AnalyticsParams} from './types';

import {ConsoleAnalyticsAdapter} from './adapters/console-analytics-adapter';
import {checkDebugMode} from './utils';

export interface AnalyticsConfig {
    adapters: AnalyticsAdapter[];
    debug?: boolean;
}

export class Analytics {
    private adapters: Set<AnalyticsAdapter>;

    constructor(config: AnalyticsConfig) {
        this.adapters = new Set(config.adapters);
        this.track = this.track.bind(this);

        const isDebug = typeof config.debug === 'boolean' ? config.debug : checkDebugMode();

        if (isDebug) {
            this.adapters.add(new ConsoleAnalyticsAdapter());
        }
    }

    track(event: string, params?: AnalyticsParams) {
        for (const adapter of this.adapters) {
            adapter.send(event, params);
        }
    }
}
