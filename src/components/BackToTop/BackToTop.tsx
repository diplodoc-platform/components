import type {ClassNameProps} from '../../models';

import React, {useEffect, useRef, useState} from 'react';
import {ArrowUp} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import './BackToTop.scss';

const b = block('dc-back-to-top');

const SHOW_AFTER_PX = 400;

export interface BackToTopProps extends ClassNameProps {
    isMobile?: boolean;
}

export const BackToTop: React.FC<BackToTopProps> = ({isMobile, className}) => {
    const previousScroll = useRef(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        previousScroll.current = window.scrollY;

        const handleScroll = () => {
            const currentScroll = window.scrollY;

            setVisible(
                isMobile
                    ? currentScroll > 0 && currentScroll < previousScroll.current
                    : currentScroll > SHOW_AFTER_PX,
            );
            previousScroll.current = currentScroll;
        };

        window.addEventListener('scroll', handleScroll, {passive: true});

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile]);

    if (!visible) {
        return null;
    }

    return (
        <Button
            className={b(null, className)}
            view="raised"
            size="m"
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        >
            <Button.Icon>
                <ArrowUp />
            </Button.Icon>
        </Button>
    );
};
