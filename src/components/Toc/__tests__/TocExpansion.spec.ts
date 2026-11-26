import {expect, test} from '@playwright/test';

import {BASE_URL} from '../../constants';
import {loadDocumentPage} from '../../utils';

const storyUrl = BASE_URL + '/iframe.html?id=components-toc--persistent-expansion&viewMode=story';

test('Restores manual TOC expansion after navigating between articles', async ({page}) => {
    await loadDocumentPage(page, storyUrl);

    const toc = page.getByRole('navigation');
    const guide = toc.getByRole('link', {name: /Guide/});
    const guideToggle = guide.getByRole('button');
    const guideArrow = guideToggle.locator('svg');
    const examples = toc.getByRole('button', {name: /Examples/});

    await expect(guide).toHaveAttribute('aria-expanded', 'true');
    await expect(examples).toHaveAttribute('aria-expanded', 'false');

    await guideToggle.click();
    await examples.click();
    await expect(guide).toHaveAttribute('aria-expanded', 'false');
    await expect(examples).toHaveAttribute('aria-expanded', 'true');
    await expect(guideArrow).toHaveCSS('transition-property', 'transform');

    await loadDocumentPage(page, storyUrl + '&args=article:reference');
    await expect(toc.getByRole('link', {name: 'Reference'})).toHaveAttribute(
        'aria-current',
        'true',
    );
    await expect(guide).toHaveAttribute('aria-expanded', 'false');
    await expect(examples).toHaveAttribute('aria-expanded', 'true');
    await expect(guideArrow).toHaveCSS('transition-property', 'none');

    await loadDocumentPage(page, storyUrl + '&args=article:setup');
    await expect(guide).toHaveAttribute('aria-expanded', 'true');
    await expect(toc.getByRole('link', {name: 'Setup'})).toHaveAttribute('aria-current', 'true');

    await loadDocumentPage(page, storyUrl + '&args=article:reference');
    await expect(guide).toHaveAttribute('aria-expanded', 'false');
    await expect(examples).toHaveAttribute('aria-expanded', 'true');
});
