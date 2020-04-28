export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function delayBetween(msFrom: number, msTo: number): Promise<void> {
    const ms = Math.floor(Math.random() * Math.abs(msTo - msFrom) + Math.min(msFrom, msTo));
    return delay(ms);
}
