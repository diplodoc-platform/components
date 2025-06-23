import React, {FC, useMemo} from 'react';

import RenderBody, {RenderBodyProps} from '../RenderBody/RenderBody';

export type RenderBodyWithHook = (c: FC<RenderBodyProps>) => FC<RenderBodyProps>;

export interface RenderBodyWithHooksProps extends RenderBodyProps {
    hooks: RenderBodyWithHook[];
}

const RenderBodyWithHooks: FC<RenderBodyWithHooksProps> = ({hooks, ...props}) => {
    const Component = useMemo(
        () =>
            hooks.reduce((C, hook) => {
                return hook(C);
            }, RenderBody),
        [hooks],
    );

    return React.createElement(Component, props);
};

export default RenderBodyWithHooks;
