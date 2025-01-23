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

export class SocialSharingMeta extends React.Component<SocialSharingMetaProps> {
    render() {
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
        } = this.props;
        let meta = [
            this.renderSchemaOrgTag('name', title),
            this.renderSchemaOrgTag('description', description),
            this.renderSchemaOrgTag('image', image),

            this.renderOpenGraphTag('type', type),
            this.renderOpenGraphTag('url', url),
            this.renderOpenGraphTag('title', title),
            this.renderOpenGraphTag('description', description),
            this.renderOpenGraphTag('image', image),
            this.renderOpenGraphTag('image:width', imageWidth),
            this.renderOpenGraphTag('image:height', imageHeight),
            this.renderOpenGraphTag('locale', locale),

            title && this.renderTwitterTag('card', 'summary_large_image'),
            this.renderTwitterTag('title', title),
            this.renderTwitterTag('description', description),
            this.renderTwitterTag('image', image),
        ].filter(Boolean);

        if (extra) {
            meta = meta.concat(extra.map(this.renderExtraMeta));
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
    }

    private renderSchemaOrgTag(name: string, value?: string | number) {
        return value && <meta key={`${name}-${value}`} itemProp={name} content={String(value)} />;
    }

    private renderOpenGraphTag(name: string, value?: string | number) {
        return (
            value && (
                <meta key={`${name}-${value}`} property={`og:${name}`} content={String(value)} />
            )
        );
    }

    private renderTwitterTag(name: string, value?: string | number) {
        return (
            value && (
                <meta key={`${name}-${value}`} name={`twitter:${name}`} content={String(value)} />
            )
        );
    }

    private renderExtraMeta(props: MetaProps, index: number) {
        return React.createElement('meta', {...props, key: `extra-${index}`});
    }
}
