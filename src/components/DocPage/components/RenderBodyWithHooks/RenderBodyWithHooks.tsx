import React, {FC, useContext, useMemo} from 'react';

import RenderBody, {RenderBodyProps} from '../RenderBody/RenderBody';
import {RenderBodyHooksContext} from '../../../../contexts/RenderBodyHooksContext';

const RenderBodyWithHooks: FC<RenderBodyProps> = (props) => {
    const hooks = useContext(RenderBodyHooksContext);

    const Component = useMemo(() => hooks.reduce((C, hook) => hook(C), RenderBody), [hooks]);

    return React.createElement(Component, props);
};

export default RenderBodyWithHooks;
