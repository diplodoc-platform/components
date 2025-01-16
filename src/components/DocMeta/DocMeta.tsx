import React from 'react';
import {Helmet} from 'react-helmet';
import {compose} from 'recompose';

import {sanitizeHtml} from '../../utils/sanitize';
import withRouter, {WithRouterProps} from '../../hoc/withRouter';

export interface DocMetaProps {
    title?: string;
    defaultTitle?: string;
    titleTemplate?: string;
    metadata?: Record<string, string>[];
}

type DocMetaInnerProps = DocMetaProps & WithRouterProps;

const sanitizeObject = (target: Record<string, string>) => {
    const clear = Object.entries(target).map(
        ([name, content]) => [sanitizeHtml(name), sanitizeHtml(content)] as [string, string],
    );

    return Object.fromEntries(clear);
};

const DocMeta: React.FC<DocMetaInnerProps> = (props) => {
    const title = sanitizeHtml(props.title);
    const titleTemplate = sanitizeHtml(props.titleTemplate);
    const defaultTitle = sanitizeHtml(props.defaultTitle);

    const {metadata = []} = props;

    return (
        <Helmet title={title} defaultTitle={defaultTitle} titleTemplate={titleTemplate}>
            {metadata.map((element, index) => {
                /* list is immutable */
                return <meta key={index} {...sanitizeObject(element)} />;
            })}
        </Helmet>
    );
};

export default compose<DocMetaInnerProps, DocMetaProps>(withRouter)(DocMeta);
