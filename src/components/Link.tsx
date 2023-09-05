import React, {Fragment, PropsWithChildren} from 'react';

interface LinkProps {
    url?: string;
}

const Link: React.FC<PropsWithChildren<LinkProps>> = ({children, url}) => {
    return url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    ) : (
        <Fragment>{children}</Fragment>
    );
};

export default Link;
