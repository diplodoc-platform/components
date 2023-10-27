import React from 'react';

export interface HTMLProps {
    children?: string;
    block?: boolean;
    className?: string;
    id?: string;
}

export const HTML: React.FC<HTMLProps> = ({children, block = false, className, id}) => {
    if (!children) {
        return null;
    }

    return React.createElement(block ? 'div' : 'span', {
        dangerouslySetInnerHTML: {__html: children},
        className,
        id,
    });
};
