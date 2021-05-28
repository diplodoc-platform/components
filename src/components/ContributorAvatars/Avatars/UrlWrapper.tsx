import React, {ReactElement} from 'react';

interface UrlWrapperProps {
    avatar: ReactElement;
    url?: string;
}

const UrlWrapper: React.FC<UrlWrapperProps> = (props) => {
    const {avatar, url} = props;

    return url
        ? <a href={url} target="_blank" rel="noopener noreferrer">{avatar}</a>
        : avatar;
};

export default UrlWrapper;
