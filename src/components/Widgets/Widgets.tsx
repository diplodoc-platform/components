import type {ReactNode} from 'react';

import React from 'react';

import './Widgets.scss';

export interface WidgetsProps {
    children?: ReactNode;
}

const Widgets: React.FC<WidgetsProps> = ({children}) => {
    return (
        <div id="dc-widgets" className="dc-widgets">
            {children}
        </div>
    );
};

export default Widgets;
