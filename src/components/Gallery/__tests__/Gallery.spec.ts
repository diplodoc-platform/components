import {expect, test} from '@playwright/test';

import {loadDocumentPage} from 'src/components/utils';

import {DOC_PAGE_GALLERY_URL} from '../../constants';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page, DOC_PAGE_GALLERY_URL);
});

test('Gallery test with clickable image', async ({page}) => {
    const image = page.getByRole('img', {name: 'Обычная картинка'});
    await image.click();
    const gallery = page.locator('.gc-gallery__content');
    await expect(gallery).toHaveCount(1);
    await expect(gallery).toHaveScreenshot('GalleryWithImage.png', {
        maxDiffPixelRatio: 0.02,
    });
});

test('Gallery test with non-clickable image-link', async ({page, context}) => {
    const image = page.getByRole('link', {name: 'Картинка-ссылка'});
    const pagePromise = context.waitForEvent('page');
    await image.click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/yandex.com\/images/);
    const gallery = page.locator('.gc-gallery__content');
    await expect(gallery).toHaveCount(0);
});

test('Gallery test contains image-link inside gallery', async ({page}) => {
    const image = page.getByRole('img', {name: 'Обычная картинка'});
    await image.click();
    const gallery = page.locator('.gc-gallery__content');
    await expect(gallery).toHaveCount(1);

    const imageLinkThumbnail = gallery.locator(
        '.gc-gallery__preview-list img[src*="index-trust-support.png"]',
    );
    await expect(imageLinkThumbnail).toHaveCount(1);
    await imageLinkThumbnail.click();
    await expect(gallery).toHaveScreenshot('GalleryWithImageLink.png', {
        maxDiffPixelRatio: 0.02,
    });
});

test('Gallery test with iframe-video', async ({page}) => {
    const image = page.getByRole('img', {name: 'Обычная картинка'});
    await image.click();
    const videoIcon = page.locator('.g-file-preview__icon_type_video');
    await videoIcon.click();
    const galleryIframe = page.locator('.dc-gallery__iframe');
    const gallery = page.locator('.gc-gallery__content');
    await expect(galleryIframe).toHaveCount(1);
    await expect(gallery).toHaveScreenshot('GalleryWithIframe.png', {
        maxDiffPixelRatio: 0.02,
    });
});
