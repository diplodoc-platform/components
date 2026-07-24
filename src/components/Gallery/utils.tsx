import React from 'react';
import {
    type GalleryItemProps,
    getGalleryItemCopyLinkAction,
    getGalleryItemDownloadAction,
    getGalleryItemImage,
} from '@gravity-ui/components';
import {FilePreview} from '@gravity-ui/uikit';

const MIN_CONTENT_SIZE = 150;

const ICON_SELECTORS = [
    '[class^="icon"]',
    '[class*=" icon"]',
    '[class*="-icon"]',
    '[class*="_icon"]',
    '[class*="Icon"]',
];

const INTERACTIVE_SELECTORS = [
    'button',
    'a[role="button"]',
    '[role="button"]',
    '[role="tab"]',
    '[class*="button"]',
    '[class*="dc-nav-toc-panel__link"]',
    '[class*="erDiagram"]',
    '[class*="mermaid"]',
    'img[src*="mermaid"]',
];

const MISC_EXCLUDED_SELECTORS = ['.dc-contributor-avatars__avatar', '[class*="background"]'];

const EXCLUDED_PARENT_SELECTORS = [
    ...ICON_SELECTORS,
    ...INTERACTIVE_SELECTORS,
    ...MISC_EXCLUDED_SELECTORS,
].join(', ');

export type GetGalleryItemVideoArgs = {
    index: number;
    iframeEl: HTMLIFrameElement | null;
};

export type ImageSource = {
    name: string;
    src: string;
    mimeType: string;
};

export const isExcludedByParent = (el: HTMLElement): boolean =>
    Boolean(el.closest(EXCLUDED_PARENT_SELECTORS));

export const isContentImage = (el: HTMLImageElement): boolean => {
    if (el.getAttribute('aria-hidden') === 'true') return false;
    if (el.getAttribute('role') === 'presentation') return false;

    const hasValidParent = ['figure', 'picture', 'p'].some((tag) => Boolean(el.closest(tag)));
    if (!hasValidParent) return false;

    return true;
};

export const isContentSize = (el: SVGSVGElement): boolean => {
    const rect = el.getBoundingClientRect();
    return rect.width > MIN_CONTENT_SIZE && rect.height > MIN_CONTENT_SIZE;
};

export const isImageElement = (el: HTMLElement): el is HTMLImageElement => {
    return el.tagName?.toLowerCase() === 'img';
};

export const isSvgElement = (el: Element): el is SVGSVGElement => {
    return el.tagName?.toLowerCase() === 'svg';
};

export const isMediaElement = (el: HTMLElement): boolean => {
    if (isExcludedByParent(el)) return false;
    if (isImageElement(el)) return isContentImage(el);
    if (isSvgElement(el)) return isContentSize(el);

    return true;
};

export const getImageMimeType = (src: string): string => {
    const ext = src.split('.').pop()?.split(/[?#]/)[0]?.toLowerCase();

    switch (ext) {
        case 'svg':
            return 'image/svg+xml';
        case 'png':
            return 'image/png';
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'gif':
            return 'image/gif';
        case 'webp':
            return 'image/webp';
        default:
            return 'application/octet-stream';
    }
};

export const serializeInlineSvg = (svgEl: SVGSVGElement): string => {
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgEl);

    if (!/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(svgString)) {
        svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const bytes = new TextEncoder().encode(svgString);
    const binary = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');

    return `data:image/svg+xml;base64,${window.btoa(binary)}`;
};

export function getGalleryItemVideo({index, iframeEl}: GetGalleryItemVideoArgs): GalleryItemProps {
    const rawSrc = iframeEl?.getAttribute('src') ?? '';
    const src = rawSrc.replace(/&amp;/g, '&');
    const name = iframeEl?.getAttribute('title') ?? '';
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
        thumbnail: <FilePreview view="compact" file={new File([], name, {type: 'video'})} />,
        actions: [getGalleryItemCopyLinkAction({copyUrl: url})],
    } as GalleryItemProps;
}

export const getImageSource = (el: HTMLElement): ImageSource => {
    if (isImageElement(el)) {
        return {
            name: el.alt || '',
            src: el.src,
            mimeType: getImageMimeType(el.src),
        };
    }

    if (isSvgElement(el)) {
        return {
            name: el.getAttribute('aria-label') || el.querySelector('title')?.textContent || '',
            src: serializeInlineSvg(el),
            mimeType: 'image/svg+xml',
        };
    }

    throw new Error('Unsupported gallery image element: expected <img> or inline <svg>');
};

export const buildGalleryItem = (el: HTMLElement, index: number): GalleryItemProps => {
    const isVideo = el.classList.contains('embed-responsive');

    if (isVideo) {
        return getGalleryItemVideo({
            index,
            iframeEl: el.querySelector('iframe'),
        });
    }

    const {name, src, mimeType} = getImageSource(el);
    const file = new File([], name, {type: mimeType});
    const url = src.startsWith('http') ? src : new URL(src, window.location.origin).href;
    const actions = isImageElement(el)
        ? [
              getGalleryItemCopyLinkAction({copyUrl: url}),
              getGalleryItemDownloadAction({downloadUrl: src}),
          ]
        : [getGalleryItemDownloadAction({downloadUrl: src})];
    return {
        ...getGalleryItemImage({name, src}),
        thumbnail: <FilePreview view="compact" file={file} imageSrc={src} />,
        actions,
    };
};
