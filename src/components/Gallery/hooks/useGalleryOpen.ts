import {useCallback, useEffect} from 'react';
import {useGallery} from '@gravity-ui/components';

import {buildGalleryItem, getGalleryMedia, isMediaElement} from '../utils';

export interface UseGalleryOpenProps {
    contentSelector: string;
}

export function useGalleryOpen({contentSelector}: UseGalleryOpenProps) {
    const {openGallery} = useGallery();

    const handleGlobalClick = useCallback(
        (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            const clickedMedia = target.closest<HTMLElement>('img, svg');
            if (!clickedMedia || !isMediaElement(clickedMedia) || clickedMedia.closest('a')) return;

            const container = clickedMedia.closest<HTMLElement>(contentSelector);
            if (!container) return;

            const allMedia = Array.from(
                container.querySelectorAll<HTMLElement>('img, svg, .embed-responsive'),
            ).filter(isMediaElement);
            const galleryMedia = getGalleryMedia(allMedia, clickedMedia, container);

            const clickedIndex = galleryMedia.indexOf(clickedMedia);
            if (clickedIndex === -1) return;

            openGallery(
                galleryMedia.map((media, index) => buildGalleryItem(media, index)),
                clickedIndex,
            );
        },
        [contentSelector, openGallery],
    );

    useEffect(() => {
        document.addEventListener('click', handleGlobalClick, true);
        return () => document.removeEventListener('click', handleGlobalClick, true);
    }, [handleGlobalClick]);
}
