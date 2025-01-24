import React, {Fragment} from 'react';
import {Helmet} from 'react-helmet';

export type MetaProps = JSX.IntrinsicElements['meta'];

export interface SocialSharingMetaProps {
    url?: string;
    title?: string;
    description?: string;
    image?: string;
    imageWidth?: number;
    imageHeight?: number;
    type?: string;
    locale?: string;
    extra?: MetaProps[];
    withoutHelmet?: boolean;
    children?: React.ReactNode;
}

export const SocialSharingMeta: React.FC<SocialSharingMetaProps> = (props) => {
    const renderSchemaOrgTag = (name: string, value?: string | number) => {
        return value && <meta key={`${name}-${value}`} itemProp={name} content={String(value)} />;
    };

    const renderOpenGraphTag = (name: string, value?: string | number) => {
        return (
            value && (
                <meta key={`${name}-${value}`} property={`og:${name}`} content={String(value)} />
            )
        );
    };

    const renderTwitterTag = (name: string, value?: string | number) => {
        return (
            value && (
                <meta key={`${name}-${value}`} name={`twitter:${name}`} content={String(value)} />
            )
        );
    };

    const renderExtraMeta = (props: MetaProps, index: number) => {
        return React.createElement('meta', {...props, key: `extra-${index}`});
    };

    const {
        url,
        title,
        description,
        image,
        imageWidth,
        imageHeight,
        type,
        locale,
        extra,
        children,
        withoutHelmet,
    } = props;
    let meta = [
        renderSchemaOrgTag('name', title),
        renderSchemaOrgTag('description', description),
        renderSchemaOrgTag('image', image),

        renderOpenGraphTag('type', type),
        renderOpenGraphTag('url', url),
        renderOpenGraphTag('title', title),
        renderOpenGraphTag('description', description),
        renderOpenGraphTag('image', image),
        renderOpenGraphTag('image:width', imageWidth),
        renderOpenGraphTag('image:height', imageHeight),
        renderOpenGraphTag('locale', locale),

        title && renderTwitterTag('card', 'summary_large_image'),
        renderTwitterTag('title', title),
        renderTwitterTag('description', description),
        renderTwitterTag('image', image),
    ].filter(Boolean);

    if (extra) {
        meta = meta.concat(extra.map(renderExtraMeta));
    }

    return withoutHelmet ? (
        <Fragment>
            {meta}
            {children}
        </Fragment>
    ) : (
        <Helmet>
            {meta}
            {children}
        </Helmet>
    );
};
