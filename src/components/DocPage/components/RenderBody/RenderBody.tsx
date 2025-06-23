import React, {FC, useMemo} from 'react';

export interface RenderBodyProps {
    html: string;
    forwardRef: (el: HTMLDivElement) => void;
    className: string;
    mdxArtifacts: unknown;
}

const RenderBody: FC<RenderBodyProps> = ({html, forwardRef, className = ''}) => {
    const htmlProps = useMemo(() => ({__html: html}), [html]);

    return <div ref={forwardRef} className={className} dangerouslySetInnerHTML={htmlProps} />;
};

export default RenderBody;
