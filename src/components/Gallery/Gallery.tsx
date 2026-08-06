import React, {useEffect} from 'react';
import {GalleryProvider} from '@gravity-ui/components';

import {useInterface} from '../../hooks/useInterface';

import {isMediaElement} from './utils';
import {useGalleryOpen} from './hooks/useGalleryOpen';
import './Gallery.scss';

export interface GalleryProps {
    contentSelector?: string;
}

const GalleryCore: React.FC<{contentSelector: string}> = ({contentSelector}) => {
    useEffect(() => {
        const handlePointerOver = (event: PointerEvent) => {
            if (!(event.target instanceof Element)) return;

            const media = event.target.closest<HTMLElement>('img, svg');
            if (!media || !media.closest(contentSelector)) return;

            const isZoomable = isMediaElement(media) && !media.closest('a');

            media.classList.toggle('dc-gallery__item', isZoomable);
        };

        document.addEventListener('pointerover', handlePointerOver, true);

        return () => {
            document.removeEventListener('pointerover', handlePointerOver, true);
        };
    }, [contentSelector]);

    useGalleryOpen({contentSelector});
    return null;
};

export const Gallery: React.FC<GalleryProps> = ({contentSelector = '.dc-doc-page__main'}) => {
    const isGalleryHidden = useInterface('gallery');

    if (isGalleryHidden) return null;

    return (
        <GalleryProvider>
            <GalleryCore contentSelector={contentSelector} />
        </GalleryProvider>
    );
};
