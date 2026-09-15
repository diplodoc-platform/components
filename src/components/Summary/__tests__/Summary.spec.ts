import {expect, test} from '@playwright/test';

import {
    DOC_PAGE_SUMMARY_MOBILE_URL,
    DOC_PAGE_SUMMARY_ONLY_MOBILE_URL,
    SUMMARY_MOBILE_URL,
    SUMMARY_URL,
} from '../../constants';
import {loadDocumentPage} from '../../utils';

const MAX_LENGTH_SUMMARY =
    'Summary Summary Summary Summary Summary Summary Summary Summary Summary Summary Summary Summary test';
const LONG_SUMMARY = Array(120).fill('Summary').join(' ');

for (const [name, height, summary] of [
    ['short', 768, MAX_LENGTH_SUMMARY],
    ['long', 320, LONG_SUMMARY],
] as const) {
    test(`keeps the last desktop section accessible with a ${name} summary`, async ({page}) => {
        await page.setViewportSize({width: 1280, height});
        await loadDocumentPage(
            page,
            `${DOC_PAGE_SUMMARY_MOBILE_URL}&args=Mobile:false;Summary:${encodeURIComponent(summary)}`,
        );

        const miniToc = page.locator('.dc-mini-toc');
        const sections = miniToc.locator('.dc-mini-toc__sections');
        const lastLink = sections.getByRole('link').last();

        await expect(miniToc.locator('.dc-summary__text')).toHaveText(summary);
        await miniToc.evaluate((element) => element.scrollTo({top: element.scrollHeight}));
        await sections.evaluate((element) => element.scrollTo({top: element.scrollHeight}));
        await expect(lastLink).toBeInViewport({ratio: 1});
        await lastLink.click();
        await expect(page).toHaveURL(/#vision$/);
    });
}

test('updates mini toc overflow after resizing the viewport', async ({page}) => {
    await page.setViewportSize({width: 1280, height: 1200});
    await loadDocumentPage(page, `${DOC_PAGE_SUMMARY_MOBILE_URL}&args=Mobile:false`);

    const sections = page.locator('.dc-mini-toc__sections');
    await expect(sections).not.toHaveClass(/dc-mini-toc_overflowed/);

    await page.setViewportSize({width: 1280, height: 400});
    await expect(sections).toHaveClass(/dc-mini-toc_overflowed/);

    await page.setViewportSize({width: 1280, height: 1200});
    await expect(sections).not.toHaveClass(/dc-mini-toc_overflowed/);
});

test('renders summary with predictable spacing', async ({page}) => {
    await loadDocumentPage(page, SUMMARY_URL);

    const summary = page.locator('.dc-summary');
    const text = summary.locator('p');

    await expect(text).toHaveText(
        'A short summary that describes the page and helps readers understand what they will find inside.',
    );
    await expect(text).toHaveCSS('margin-top', '0px');
    await expect(text).toHaveCSS('margin-bottom', '0px');
    await expect(summary).toHaveScreenshot('Summary.png', {maxDiffPixelRatio: 0.01});
});

test('renders summary on mobile', async ({page}) => {
    await page.setViewportSize({width: 390, height: 320});
    await loadDocumentPage(page, SUMMARY_MOBILE_URL);

    await expect(page.locator('.dc-summary')).toHaveScreenshot('Summary-mobile.png', {
        maxDiffPixelRatio: 0.01,
    });
});

test('keeps the mobile mini toc scrollable with summary', async ({page}) => {
    await page.setViewportSize({width: 390, height: 320});
    await loadDocumentPage(page, DOC_PAGE_SUMMARY_MOBILE_URL);

    const panel = page.locator('.dc-subnavigation__mini-toc');
    const sections = panel.locator('.dc-mini-toc__sections');

    await page.locator('.dc-subnavigation__mini-toc-button').click();
    await expect(panel).toHaveClass(/dc-subnavigation__mini-toc_open/);
    await panel.evaluate(async (element) => {
        await Promise.all(element.getAnimations().map((animation) => animation.finished));
    });
    await expect(sections).toHaveClass(/dc-mini-toc_overflowed/);

    const panelDimensions = await panel.evaluate((element) => ({
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
    }));
    const sectionsDimensions = await sections.evaluate((element) => ({
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
    }));

    expect(panelDimensions.scrollHeight).toBeLessThanOrEqual(panelDimensions.clientHeight + 1);
    expect(sectionsDimensions.scrollHeight).toBeGreaterThan(sectionsDimensions.clientHeight);
    await expect(panel.locator('.dc-mini-toc')).toHaveScreenshot('Summary-mini-toc-mobile.png', {
        maxDiffPixelRatio: 0.01,
    });
});

for (const [name, summaryText] of [
    ['100-character', MAX_LENGTH_SUMMARY],
    ['long', LONG_SUMMARY],
] as const) {
    test(`keeps the last mobile section accessible with a ${name} summary`, async ({page}) => {
        await page.setViewportSize({width: 390, height: 240});
        await loadDocumentPage(
            page,
            `${DOC_PAGE_SUMMARY_MOBILE_URL}&args=Summary:${encodeURIComponent(summaryText)}`,
        );

        const panel = page.locator('.dc-subnavigation__mini-toc');
        const miniToc = panel.locator('.dc-mini-toc');
        const summary = miniToc.locator('.dc-summary');
        const sections = miniToc.locator('.dc-mini-toc__sections');
        const lastLink = sections.getByRole('link').last();

        await page.locator('.dc-subnavigation__mini-toc-button').click();
        await expect(panel).toHaveClass(/dc-subnavigation__mini-toc_open/);
        await panel.evaluate(async (element) => {
            await Promise.all(element.getAnimations().map((animation) => animation.finished));
        });
        await expect(summary.locator('.dc-summary__text')).toHaveText(summaryText);
        await expect(summary).toHaveCSS('overflow-y', 'visible');
        expect(
            await summary.evaluate((element) => element.scrollHeight - element.clientHeight),
        ).toBe(0);

        await miniToc.evaluate((element) => element.scrollTo({top: element.scrollHeight}));
        await sections.evaluate((element) => element.scrollTo({top: element.scrollHeight}));
        await expect(lastLink).toBeInViewport({ratio: 1});
        await lastLink.click();
        await expect(page).toHaveURL(/#vision$/);
        await expect(panel).not.toHaveClass(/dc-subnavigation__mini-toc_open/);
    });
}

test('wraps an unbroken summary inside the mini toc', async ({page}) => {
    const summaryText = 'Summary'.repeat(14);
    await page.setViewportSize({width: 1280, height: 768});
    await loadDocumentPage(
        page,
        `${DOC_PAGE_SUMMARY_MOBILE_URL}&args=Mobile:false;Summary:${summaryText}`,
    );

    const miniToc = page.locator('.dc-mini-toc');
    await expect(miniToc.locator('.dc-summary__text')).toHaveText(summaryText);
    expect(await miniToc.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0);
});

for (const mobile of [false, true]) {
    test(`keeps a long summary readable without sections on ${mobile ? 'mobile' : 'desktop'}`, async ({
        page,
    }) => {
        await page.setViewportSize({width: mobile ? 390 : 1280, height: 320});
        await loadDocumentPage(
            page,
            `${DOC_PAGE_SUMMARY_ONLY_MOBILE_URL}&args=Mobile:${mobile};HeadingCount:0;Summary:${encodeURIComponent(LONG_SUMMARY)}`,
        );

        const miniToc = page.locator('.dc-mini-toc');
        const summary = miniToc.locator('.dc-summary');

        if (mobile) {
            await page.locator('.dc-subnavigation__mini-toc-button').click();
            await page.locator('.dc-subnavigation__mini-toc').evaluate(async (element) => {
                await Promise.all(element.getAnimations().map((animation) => animation.finished));
            });
        }

        await expect(summary.locator('.dc-summary__text')).toHaveText(LONG_SUMMARY);
        await expect(summary).toHaveCSS('overflow-y', 'visible');
        await expect(miniToc.locator('.dc-mini-toc__sections')).toHaveCount(0);
        await miniToc.evaluate((element) => element.scrollTo({top: element.scrollHeight}));

        expect(await miniToc.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
        expect(
            await summary.evaluate((element) => element.getBoundingClientRect().bottom),
        ).toBeLessThanOrEqual(320);
    });
}

for (const headingCount of [0, 1]) {
    test(`renders only summary with ${headingCount} headings`, async ({page}) => {
        await page.setViewportSize({width: 390, height: 320});
        await loadDocumentPage(
            page,
            `${DOC_PAGE_SUMMARY_ONLY_MOBILE_URL}&args=HeadingCount:${headingCount}`,
        );

        const panel = page.locator('.dc-subnavigation__mini-toc');
        await page.locator('.dc-subnavigation__mini-toc-button').click();

        const miniToc = panel.locator('.dc-mini-toc');
        const summary = panel.locator('.dc-summary');

        await expect(miniToc).toHaveClass(/dc-mini-toc_summary-only/);
        await expect(summary).toHaveCSS('margin-bottom', '0px');
        await expect(summary.locator('.dc-summary__text')).toHaveText(
            'Короткое описание статьи "О нас"',
        );
        await expect(summary.locator('.dc-summary__text')).toHaveCSS('text-wrap', 'balance');
        await expect(panel.locator('.dc-mini-toc__sections')).toHaveCount(0);
    });
}

test('renders mini toc sections with 2 headings', async ({page}) => {
    await page.setViewportSize({width: 390, height: 320});
    await loadDocumentPage(page, `${DOC_PAGE_SUMMARY_ONLY_MOBILE_URL}&args=HeadingCount:2`);

    const panel = page.locator('.dc-subnavigation__mini-toc');
    await page.locator('.dc-subnavigation__mini-toc-button').click();

    await expect(panel.locator('.dc-mini-toc')).not.toHaveClass(/dc-mini-toc_summary-only/);
    expect(await panel.locator('.dc-mini-toc__section').count()).toBeGreaterThanOrEqual(2);
});
