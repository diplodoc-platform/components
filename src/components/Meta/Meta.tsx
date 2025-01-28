import React from 'react';
import {compose} from 'react-recompose';

import {MetaProps, SocialSharingMeta} from '../SocialSharingMeta';
import {DocMeta, DocMetaProps} from '../DocMeta';
import withRouter, {WithRouterProps} from '../../hoc/withRouter';
import withLang, {WithLangProps} from '../../hoc/withLang';
import {sanitizeHtml} from '../../utils/sanitize';

interface SharingProps {
    title?: string;
    description?: string;
}

export interface MetaComponentProps extends DocMetaProps {
    type?: string;
    url?: string;
    image?: string;
    locale?: string;
    sharing?: SharingProps;
    extra?: MetaProps[];
    description?: string;
    keywords?: string | string[];
    noIndex?: boolean;
    canonical?: string;
    alternate?: Record<string, string>;
    schemaJsonLd?: unknown;
    isAwsServer?: boolean;
    metadata?: Record<string, string>[];
}

type MetaComponentInnerProps = MetaComponentProps & WithRouterProps & WithLangProps;

type PickByType<T, K> = {
    [P in keyof T as T[P] extends K | undefined ? P : never]: T[P];
};

interface OpenGraphTags {
    [key: string]: string | undefined;
}

const Meta: React.FC<MetaComponentInnerProps> = (props) => {
    const overrideOpenGraphgTags = (): OpenGraphTags => {
        const {metadata = [], ...rest} = props;

        const result: OpenGraphTags = rest as PickByType<typeof rest, string>;

        for (const meta of metadata) {
            const {property, content} = meta;
            if (property?.startsWith('og')) {
                // @ts-ignore
                result[property.slice(3, property.length)] = content;
            }
        }

        return result;
    };

    const {
        extra,
        router,
        description,
        sharing = {},
        keywords,
        noIndex,
        canonical,
        alternate,
        ...documentMetaProps
    } = props;

    const {
        type,
        url,
        locale,
        image,
        title,
        description: ogDescription,
    }: OpenGraphTags = overrideOpenGraphgTags();

    const sharingTitle = sanitizeHtml(title);
    const sharingDescription = sanitizeHtml(ogDescription || sharing.description);
    const metaDescription = sanitizeHtml(description);
    const metaKeywords = Array.isArray(keywords) ? keywords.join(',') : keywords;
    const fullUrl = typeof window === 'undefined' ? router.pathname : window.location.href;

    return (
        <React.Fragment>
            <DocMeta {...documentMetaProps} />
            <SocialSharingMeta
                type={type}
                url={url || fullUrl}
                locale={locale}
                title={sharingTitle}
                description={sharingDescription}
                image={image}
                extra={extra}
            >
                {noIndex && <meta name="robots" content="noindex, nofollow" />}
                {canonical && <link rel="canonical" href={canonical} />}
                {alternate &&
                    Object.keys(alternate).map((key) => (
                        <link key={key} rel="alternate" hrefLang={key} href={alternate[key]} />
                    ))}
                {description && <meta name="description" content={metaDescription} />}
                {keywords && <meta name="keywords" content={metaKeywords} />}
            </SocialSharingMeta>
        </React.Fragment>
    );
};

export default compose<MetaComponentInnerProps, MetaComponentProps>(withRouter, withLang)(Meta);
