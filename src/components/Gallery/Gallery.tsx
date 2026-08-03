import React, {useLayoutEffect} from 'react';
import {GalleryProvider} from '@gravity-ui/components';

import {useInterface} from '../../hooks/useInterface';

import {applyGalleryCursors} from './utils';
import {useGalleryOpen} from './hooks/useGalleryOpen';
import './Gallery.scss';

export interface GalleryProps {
    contentSelector?: string;
}

const GalleryCore: React.FC<{contentSelector: string}> = ({contentSelector}) => {
    useGalleryOpen({contentSelector});
    return null;
};

export const Gallery: React.FC<GalleryProps> = ({contentSelector = '.dc-doc-page__main'}) => {
    const isGalleryHidden = useInterface('gallery');

    useLayoutEffect(() => {
        const container = document.querySelector<HTMLElement>(contentSelector);
        if (!container) return;
        applyGalleryCursors(container);

        const images = container.querySelectorAll<HTMLImageElement>('img, svg');
        const handleLoad = () => applyGalleryCursors(container);
        images.forEach((img) => {
            if (img instanceof HTMLImageElement && !img.complete) {
                img.addEventListener('load', handleLoad, {once: true});
            }
        });
        return () => {
            images.forEach((img) => img.removeEventListener('load', handleLoad));
        };
    }, [contentSelector]);

    if (isGalleryHidden) return null;

    return (
        <GalleryProvider>
            <GalleryCore contentSelector={contentSelector} />
        </GalleryProvider>
    );
};
