import React from 'react';
import {
    type GalleryItemProps,
    getGalleryItemCopyLinkAction,
    getGalleryItemDownloadAction,
    getGalleryItemImage,
} from '@gravity-ui/components';
import {FilePreview, type FilePreviewProps} from '@gravity-ui/uikit';

export type GetGalleryItemVideoArgs = {
    index: number;
    iframeEl: HTMLIFrameElement | null;
};

export const isExcludedByParent = (el: HTMLElement): boolean => {
    if (el.closest('.dc-contributor-avatars__avatar')) return true;

    if (el.closest('[class*="background"]')) return true;

    return Boolean(
        el.closest(
            '[class^="icon"], [class*=" icon"], [class*="-icon"], [class*="_icon"], [class*="Icon"]',
        ),
    );
};

export const isContentImage = (el: HTMLImageElement): boolean => {
    if (el.getAttribute('aria-hidden') === 'true') return false;
    if (el.getAttribute('role') === 'presentation') return false;

    const hasValidParent = ['figure', 'picture', 'p'].some((tag) => Boolean(el.closest(tag)));
    if (!hasValidParent) return false;

    return true;
};

export const isMediaElement = (el: HTMLElement): boolean => {
    if (isExcludedByParent(el)) return false;
    if (el instanceof HTMLImageElement) return isContentImage(el);
    return true;
};

export function getGalleryItemVideo({index, iframeEl}: GetGalleryItemVideoArgs): GalleryItemProps {
    const rawSrc = iframeEl?.getAttribute('src') ?? '';
    const src = rawSrc.replace(/&amp;/g, '&');
    const name = iframeEl?.getAttribute('title') ?? `video-${index + 1}`;
    const url = src.startsWith('http') ? src : new URL(src, window.location.origin).href;

    return {
        id: `video-iframe-${index}`,
        name,
        interactive: true,
        view: (
            <iframe
                src={src}
                title={name}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                className="dc-gallery__iframe"
            />
        ),
        thumbnail: (
            <FilePreview view="compact" file={{name, type: 'video'} as FilePreviewProps['file']} />
        ),
        actions: [getGalleryItemCopyLinkAction({copyUrl: url})],
    } as GalleryItemProps;
}

export const buildGalleryItem = (el: HTMLElement, index: number): GalleryItemProps => {
    if (el.classList.contains('embed-responsive')) {
        return getGalleryItemVideo({
            index,
            iframeEl: el.querySelector('iframe'),
        });
    }

    const imgEl = el as HTMLImageElement;
    const src = imgEl.src;
    const name = imgEl.alt || `image-${index + 1}`;
    const url = src.startsWith('http') ? src : new URL(src, window.location.origin).href;

    return {
        ...getGalleryItemImage({name, src}),
        thumbnail: (
            <FilePreview
                view="compact"
                file={{name, type: 'image/png'} as FilePreviewProps['file']}
                imageSrc={src}
            />
        ),
        actions: [
            getGalleryItemCopyLinkAction({copyUrl: url}),
            getGalleryItemDownloadAction({downloadUrl: src}),
        ],
    };
};
