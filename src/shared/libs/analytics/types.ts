export type AnalyticsParams = Record<string, unknown>;

export type AnalyticsTrackOptions = {
    includeKeys?: string[];
    excludeKeys?: string[];
};

export interface AnalyticsAdapter {
    key?: string;
    send(event: string, params?: AnalyticsParams): void;
}
