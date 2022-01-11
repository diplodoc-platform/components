import React, {Fragment} from 'react';

interface LinkProps {
    url?: string;
}

const Link: React.FC<LinkProps> = ({children, url}) => {
    return url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    ) : (
        <Fragment>{children}</Fragment>
    );
};

export default Link;
