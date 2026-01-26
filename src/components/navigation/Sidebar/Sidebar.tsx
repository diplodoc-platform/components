import type {PropsWithChildren} from 'react';

import React, {useEffect, useRef, useState} from 'react';
import block from 'bem-cn-lite';
import ReactDOM from 'react-dom';
import {CSSTransition} from 'react-transition-group';

import './Sidebar.scss';

const b = block('dc-sidebar');
const TRANSITION_TIME = 300;

export interface SidebarProps {
    isOpened: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<PropsWithChildren & SidebarProps> = ({isOpened, children}) => {
    const [body, setBody] = useState<HTMLElement>();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setBody(document.body);
    }, []);

    useEffect(() => {
        document.body.classList.toggle(b('no-scroll'), isOpened);

        return () => {
            document.body.classList.remove(b('no-scroll'));
        };
    }, [isOpened]);

    if (!body) {
        return null;
    }

    return ReactDOM.createPortal(
        <CSSTransition
            in={isOpened}
            classNames={b('transition')}
            unmountOnExit
            timeout={TRANSITION_TIME}
        >
            <div className={b()}>
                <div ref={ref} className={b('bar')}>
                    {children}
                </div>
            </div>
        </CSSTransition>,
        body,
    );
};

export default Sidebar;
