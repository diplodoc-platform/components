import type {ReactNode} from 'react';

import React from 'react';

import './Widgets.scss';

interface WidgetsParams {
    children?: ReactNode;
}

const Widgets: React.FC<WidgetsParams> = ({children}) => {
    if (!children) {
        return null;
    }

    return <div className="dc-widgets">{children}</div>;
};

export default Widgets;
