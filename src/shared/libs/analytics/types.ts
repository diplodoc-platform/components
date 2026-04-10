export type AnalyticsParams = Record<string, unknown>;

export interface AnalyticsAdapter {
    init?(): void | PromiseLike<void>;
    send(event: string, params?: AnalyticsParams): void;
}
