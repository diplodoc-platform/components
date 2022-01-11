import React from 'react';

import {HTML} from '../HTML';

export interface TextProps {
    data: string | string[];
    html: boolean;
    block: boolean;
}

export const Text: React.FC<TextProps> = ({data = '', html = false, block = false}) => {
    if (!data) {
        return null;
    }

    const paragraphs = Array.isArray(data) ? data : [data];

    return (
        <React.Fragment>
            {paragraphs.map((text, index) =>
                React.createElement(
                    block ? 'div' : 'p',
                    {
                        key: index,
                        className: block ? 'p' : null,
                    },
                    html ? <HTML>{text}</HTML> : text,
                ),
            )}
        </React.Fragment>
    );
};
