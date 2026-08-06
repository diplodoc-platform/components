import type {Locator} from '@playwright/test';

import {expect, test} from '@playwright/test';

import {TAGS_FILTER_MOBILE_URL, TAGS_FILTER_URL} from '../../constants';
import {loadDocumentPage} from '../../utils';

const tagsCount = (tagsFilter: Locator) => tagsFilter.locator('.dc-tags-filter__tag').count();

const expectToggleSharesRowWithTag = async (tagsFilter: Locator) => {
    const sharesRow = await tagsFilter.evaluate((element) => {
        const toggle = element.querySelector('.dc-tags-filter__toggle');
        const toggleRect = toggle?.getBoundingClientRect();

        if (!toggleRect) {
            return false;
        }

        return Array.from(element.querySelectorAll('.dc-tags-filter__tag')).some((tag) => {
            const rect = tag.getBoundingClientRect();

            return rect.top < toggleRect.bottom && rect.bottom > toggleRect.top;
        });
    });

    expect(sharesRow, 'toggle should stay on the same row as a tag').toBe(true);
};

const expectTagsToUseContainerFont = async (tagsFilter: Locator) => {
    const {containerFont, tagFont} = await tagsFilter.evaluate((element) => ({
        containerFont: getComputedStyle(element).fontFamily,
        tagFont: getComputedStyle(element.querySelector('.dc-tags-filter__tag') as HTMLElement)
            .fontFamily,
    }));

    expect(tagFont).toBe(containerFont);
};

test('collapses the tag list and expands it with an inline toggle', async ({page}) => {
    await page.setViewportSize({width: 720, height: 420});
    await loadDocumentPage(page, TAGS_FILTER_URL);
    const tagsFilter = page.locator('.dc-tags-filter');
    const toggle = tagsFilter.locator('.dc-tags-filter__toggle');

    await expect(tagsFilter.getByText('_internal')).toHaveCount(0);
    await expectTagsToUseContainerFont(tagsFilter);

    const collapsedCount = await tagsCount(tagsFilter);
    await expect(toggle).toBeVisible();
    await expectToggleSharesRowWithTag(tagsFilter);
    await expect(tagsFilter).toHaveScreenshot('TagsFilter-collapsed.png', {
        maxDiffPixelRatio: 0.01,
    });

    await tagsFilter.getByRole('button', {name: 'Diplodoc'}).click();
    await expect(tagsFilter).toHaveScreenshot('TagsFilter-selected.png', {
        maxDiffPixelRatio: 0.01,
    });

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(await tagsCount(tagsFilter)).toBeGreaterThan(collapsedCount);
    await expectToggleSharesRowWithTag(tagsFilter);
    await expect(tagsFilter).toHaveScreenshot('TagsFilter-expanded.png', {
        maxDiffPixelRatio: 0.01,
    });
});

test('collapses and expands tags on mobile', async ({page}) => {
    await page.setViewportSize({width: 390, height: 640});
    await loadDocumentPage(page, TAGS_FILTER_MOBILE_URL);
    const tagsFilter = page.locator('.dc-tags-filter');
    const toggle = tagsFilter.locator('.dc-tags-filter__toggle');

    const collapsedCount = await tagsCount(tagsFilter);
    await expect(toggle).toBeVisible();
    await expectToggleSharesRowWithTag(tagsFilter);
    await expect(tagsFilter).toHaveScreenshot('TagsFilter-mobile-collapsed.png', {
        maxDiffPixelRatio: 0.01,
    });

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(await tagsCount(tagsFilter)).toBeGreaterThan(collapsedCount);
    await expect(tagsFilter).toHaveScreenshot('TagsFilter-mobile-expanded.png', {
        maxDiffPixelRatio: 0.01,
    });
});
