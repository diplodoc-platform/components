import {expect, test} from '@playwright/test';

import {getPublicTags} from '../utils';

test('filters technical tags from the public tag list', () => {
    expect(getPublicTags(['security', '_internal', 'syntax'])).toEqual(['security', 'syntax']);
});

test('keeps selected public tags at the start of the collapsed list', () => {
    expect(getPublicTags(['security', 'syntax', 'reference'], ['reference'])).toEqual([
        'reference',
        'security',
        'syntax',
    ]);
    expect(getPublicTags(['security'], ['unknown', '_internal'])).toEqual(['security']);
});
