import {useCallback, useEffect} from 'react';
import {useGallery} from '@gravity-ui/components';

import {buildGalleryItem, isMediaElement} from '../utils';

export interface UseGalleryOpenProps {
    contentSelector: string;
}

export function useGalleryOpen({contentSelector}: UseGalleryOpenProps) {
    const {openGallery} = useGallery();

    const handleGlobalClick = useCallback(
        (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            const clickedMedia = target.closest<HTMLElement>('img');
            if (!clickedMedia || !isMediaElement(clickedMedia) || clickedMedia.closest('a')) return;

            const container = clickedMedia.closest(contentSelector);
            if (!container) return;

            const allMedia = Array.from(
                container.querySelectorAll<HTMLElement>('img, .embed-responsive'),
            ).filter(isMediaElement);

            const clickedIndex = allMedia.indexOf(clickedMedia);
            if (clickedIndex === -1) return;

            openGallery(allMedia.map(buildGalleryItem), clickedIndex);
        },
        [contentSelector, openGallery],
    );

    useEffect(() => {
        document.addEventListener('click', handleGlobalClick, true);
        return () => document.removeEventListener('click', handleGlobalClick, true);
    }, [handleGlobalClick]);
}
