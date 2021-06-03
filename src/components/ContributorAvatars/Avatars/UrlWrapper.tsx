import React, {ReactElement} from 'react';

interface UrlWrapperProps {
    children: ReactElement;
    url?: string;
}

const UrlWrapper: React.FC<UrlWrapperProps> = (props) => {
    const {children, url} = props;

    return url
        ? <a href={url} target="_blank" rel="noopener noreferrer">{children}</a>
        : children;
};

export default UrlWrapper;
