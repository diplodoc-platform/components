import React from 'react';

export interface ContentWrapperProps extends React.HTMLAttributes<HTMLElement> {
    useMainTag?: boolean;
}

export const ContentWrapper: React.FC<ContentWrapperProps>  = ({ useMainTag = true, children, ...rest }) => {
    const Tag = useMainTag ? 'main' : 'div';

    return <Tag {...rest}>{children}</Tag>;
}
