import {expect, test} from '@playwright/test';

import {isActiveItem, isExternalHref, normalizeHash, normalizePath} from '../path';

test.describe('normalizePath', () => {
    test('normalizes the root path for the title page', () => {
        expect(normalizePath('/')).toBe('./');
    });

    test('normalizes article paths', () => {
        expect(normalizePath('/guide/page.html')).toBe('guide/page');
        expect(normalizePath('/guide/index.html')).toBe('guide/');
        expect(normalizePath('/guide/page.html?lang=en')).toBe('guide/page?lang=en');
        expect(normalizePath('/guide/index?lang=en')).toBe('guide/?lang=en');
    });
});

test('normalizes hashes', () => {
    expect(normalizeHash('#section')).toBe('section');
    expect(normalizeHash('section')).toBe('section');
});

test.describe('isActiveItem', () => {
    test('matches the title page against its relative link', () => {
        expect(isActiveItem({pathname: '/'}, './')).toBe(true);
    });

    test('matches equivalent article paths', () => {
        expect(isActiveItem({pathname: '/guide/index.html'}, 'guide/')).toBe(true);
    });

    test('does not match different article paths', () => {
        expect(isActiveItem({pathname: '/guide/one'}, 'guide/two')).toBe(false);
    });

    test('matches hashes in single-page mode', () => {
        const router = {pathname: '/', hash: '#section'};

        expect(isActiveItem(router, './#section', true)).toBe(true);
        expect(isActiveItem(router, './#other', true)).toBe(false);
    });
});

test('detects external links', () => {
    expect(isExternalHref('http://example.com')).toBe(true);
    expect(isExternalHref('https://example.com')).toBe(true);
    expect(isExternalHref('//example.com')).toBe(true);
    expect(isExternalHref('/guide')).toBe(false);
    expect(isExternalHref('./guide')).toBe(false);
});
