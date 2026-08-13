import {expect, test} from '@playwright/test';

import {loadDocumentPage} from '../../utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
});

test.describe('Controls test', () => {
    test('Markdown actions are rendered in controls', async ({page}) => {
        const markdown = '# Markdown companion';
        const markdownUrl = '/docs/overview/index.md';

        await page.route(`**${markdownUrl}`, async (route) => {
            expect(route.request().headers().accept).toBe('text/markdown');
            await route.fulfill({body: markdown, contentType: 'text/markdown'});
        });
        await page.evaluate(() => {
            Object.defineProperty(navigator, 'clipboard', {
                configurable: true,
                value: {
                    writeText: (value: string) => {
                        (window as typeof window & {copiedMarkdown?: string}).copiedMarkdown =
                            value;
                        return Promise.resolve();
                    },
                },
            });
            Object.defineProperty(window, 'open', {
                configurable: true,
                value: (url: string) => {
                    (window as typeof window & {openedMarkdownUrl?: string}).openedMarkdownUrl =
                        url;
                    return null;
                },
            });
        });

        const controls = page.locator('.dc-controls');
        const markdownMenu = controls.locator('.g-dropdown-menu__switcher-wrapper');

        await expect(markdownMenu).toHaveCount(1);
        await markdownMenu.click();

        const copyAction = page.getByRole('menuitem', {name: 'Copy as Markdown'});
        const viewAction = page.getByRole('menuitem', {name: 'View as Markdown'});

        await expect(copyAction).toBeVisible();
        await expect(viewAction).toBeVisible();

        await viewAction.click();
        await expect
            .poll(() =>
                page.evaluate(
                    () =>
                        (window as typeof window & {openedMarkdownUrl?: string}).openedMarkdownUrl,
                ),
            )
            .toBe(markdownUrl);

        await markdownMenu.click();
        await copyAction.click();
        await expect
            .poll(() =>
                page.evaluate(
                    () => (window as typeof window & {copiedMarkdown?: string}).copiedMarkdown,
                ),
            )
            .toBe(markdown);
    });

    test('SettingsControl test', async ({page}) => {
        const controls = page.locator('.dc-doc-page__controls');
        const control = controls.locator('button').nth(1);

        await control.click();
        await page.hover('body');

        await expect(page).toHaveScreenshot('SettingsControl-default.png', {
            maxDiffPixelRatio: 0.01,
        });

        const label = page.locator('[title="Wide format"]');

        await label.click();

        await expect(page).toHaveScreenshot('SettingsControl-clicked.png', {
            maxDiffPixelRatio: 0.01,
        });
    });

    test('LangControl test', async ({page}) => {
        const controls = page.locator('.dc-doc-page__controls');
        const control = controls.locator('button').nth(2);

        await control.click();
        await page.hover('body');

        await expect(page).toHaveScreenshot('LangControl-default.png', {
            maxDiffPixelRatio: 0.01,
        });
    });
});
