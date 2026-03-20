import type {AnalyticsAdapter, AnalyticsParams} from '../types';

export class ConsoleAnalyticsAdapter implements AnalyticsAdapter {
    send(event: string, params?: AnalyticsParams) {
        const _console = console;
        const prefix = '📊 Analytics';
        const timestamp = new Date().toLocaleTimeString();

        _console.groupCollapsed(
            `%c${prefix}%c ${event} %c${timestamp}`,
            'color: #2196F3; font-weight: bold;',
            'color: #4CAF50; font-weight: bold;',
            'color: #999; font-size: 0.9em;',
        );

        if (params) {
            _console.log('Params:', params);
        }

        _console.groupEnd();
    }
}
