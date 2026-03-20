export type AnalyticsParams = Record<string, unknown>;

export interface AnalyticsAdapter {
    send(event: string, params?: AnalyticsParams): void;
}
