export type AnalyticsParams = Record<string, unknown>;

export type AnalyticsTrackOptions = {
    includeKeys?: string[];
    excludeKeys?: string[];
};

export interface AnalyticsAdapter {
    init?(): void | PromiseLike<void>;
    key?: string;
    send(event: string, params?: AnalyticsParams): void;
}
