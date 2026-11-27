import {expect, test} from '@playwright/test';

import {formatArticleDate} from '../date';

for (const [timeZone, locale] of [
    ['Europe/Moscow', 'en-US-x-moscow'],
    ['UTC', 'en-US-x-utc'],
    ['America/Los_Angeles', 'en-US-x-la'],
]) {
    test(`keeps the authored day in ${timeZone}`, () => {
        const previousTimeZone = process.env.TZ;
        process.env.TZ = timeZone;
        try {
            expect(formatArticleDate('2026-11-12', locale)).toBe('November 12, 2026');
            expect(formatArticleDate('2026-11-12T00:00:00Z', locale)).toBe(
                timeZone === 'America/Los_Angeles' ? 'November 11, 2026' : 'November 12, 2026',
            );
        } finally {
            if (previousTimeZone === undefined) {
                delete process.env.TZ;
            } else {
                process.env.TZ = previousTimeZone;
            }
        }
    });
}
