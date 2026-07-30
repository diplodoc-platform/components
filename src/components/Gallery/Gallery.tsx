import React, {useEffect} from 'react';
import {GalleryProvider} from '@gravity-ui/components';

import {useInterface} from '../../hooks/useInterface';

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

    useEffect(() => {
        const element = document.querySelector(contentSelector);
        if (element) {
            (element as HTMLElement).dataset.galleryEnabled = String(!isGalleryHidden);
        }
    }, [contentSelector, isGalleryHidden]);

    if (isGalleryHidden) return null;

    return (
        <GalleryProvider>
            <GalleryCore contentSelector={contentSelector} />
        </GalleryProvider>
    );
};
