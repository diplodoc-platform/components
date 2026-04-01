import type {FC, ReactNode} from 'react';

import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';

import './Widgets.scss';

export interface WidgetsProps {
    children?: ReactNode;
}

const Widgets: FC<WidgetsProps> = ({children}) => {
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        let element = document.getElementById('dc-widgets');

        if (!element) {
            element = document.createElement('div');
            element.id = 'dc-widgets';
            element.className = 'dc-widgets';
            document.body.appendChild(element);
        }

        setContainer(element);
    }, []);

    if (!container) {
        return null;
    }

    return createPortal(children, container);
};

export default Widgets;
