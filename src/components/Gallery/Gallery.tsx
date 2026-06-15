import React from 'react';
import {GalleryProvider} from '@gravity-ui/components';

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
    return (
        <GalleryProvider>
            <GalleryCore contentSelector={contentSelector} />
        </GalleryProvider>
    );
};
