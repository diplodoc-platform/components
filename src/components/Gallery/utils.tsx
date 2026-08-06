import {
    type GalleryItemProps,
    getGalleryItemCopyLinkAction,
    getGalleryItemDownloadAction,
    getGalleryItemImage,
} from '@gravity-ui/components';
import {FilePreview} from '@gravity-ui/uikit';

const MIN_CONTENT_SIZE = 150;

const INTERACTIVE_SELECTORS = [
    '[class*="dc-nav-toc-panel__link"]',
    '[class*="erDiagram"]',
    '[class*="mermaid"]',
    'img[src*="mermaid"]',
];

const MISC_EXCLUDED_SELECTORS = ['.dc-contributor-avatars__avatar', '[class*="background"]'];
const EXCLUDED_PARENT_SELECTORS = [...INTERACTIVE_SELECTORS, ...MISC_EXCLUDED_SELECTORS].join(', ');
const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6';
const TABS_SELECTOR = '.yfm-tabs';
const TAB_PANEL_SELECTOR = '.yfm-tab-panel';
const MEDIA_SELECTOR = 'img, svg, .embed-responsive';

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

export const isContentSize = (el: Element): boolean => {
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

    if (el.dataset.galleryId) return true;

    const galleryAttr = el.dataset.gallery;
    if (galleryAttr === 'true') return true;
    if (galleryAttr === 'false') return false;
    if (el.dataset.gallerySrc) return true;

    return isContentSize(el);
};

const getGalleryId = (el: HTMLElement): string | undefined => el.dataset.galleryId || undefined;

const getGroupingContext = (el: HTMLElement, container: HTMLElement): HTMLElement => {
    const tabPanel = el.closest<HTMLElement>(TAB_PANEL_SELECTOR);

    return tabPanel && container.contains(tabPanel) ? tabPanel : container;
};

const getContextGalleryMedia = (
    media: HTMLElement[],
    clickedMedia: HTMLElement,
    context: HTMLElement,
    container: HTMLElement,
): HTMLElement[] => {
    const structureSelector = context.matches(TAB_PANEL_SELECTOR)
        ? TABS_SELECTOR
        : `${HEADING_SELECTOR}, ${TABS_SELECTOR}`;
    const mediaSet = new Set(media);
    const elements = Array.from(
        context.querySelectorAll<HTMLElement>(`${structureSelector}, ${MEDIA_SELECTOR}`),
    );
    let currentGroup: HTMLElement[] = [];

    for (const element of elements) {
        if (getGroupingContext(element, container) !== context) continue;

        const isGalleryMedia = mediaSet.has(element);
        const isBoundary =
            element.matches(structureSelector) ||
            (isGalleryMedia && Boolean(getGalleryId(element)));

        if (isBoundary) {
            if (currentGroup.includes(clickedMedia)) return currentGroup;

            currentGroup = [];
            continue;
        }

        if (isGalleryMedia) {
            currentGroup.push(element);
        }
    }

    return currentGroup.includes(clickedMedia) ? currentGroup : [];
};

export const getGalleryMedia = (
    media: HTMLElement[],
    clickedMedia: HTMLElement,
    container: HTMLElement,
): HTMLElement[] => {
    const galleryId = getGalleryId(clickedMedia);

    if (galleryId) {
        return media.filter((el) => getGalleryId(el) === galleryId);
    }

    const context = getGroupingContext(clickedMedia, container);

    return getContextGalleryMedia(media, clickedMedia, context, container);
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
        const src = el.dataset.gallerySrc || el.src;
        return {
            name: el.alt || '',
            src,
            mimeType: getImageMimeType(src),
        };
    }

    if (isSvgElement(el)) {
        const name = el.getAttribute('aria-label') || el.querySelector('title')?.textContent || '';

        if (el.dataset.gallerySrc) {
            const src = el.dataset.gallerySrc;
            return {
                name,
                src: src,
                mimeType: getImageMimeType(src),
            };
        }
        return {
            name,
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
