import React, {memo, useCallback} from 'react';
import {ArrowLeft} from '@gravity-ui/icons';
import block from 'bem-cn-lite';

import {useTranslation} from '../../../hooks';

import './ToMainMenu.scss';

const b = block('dc-to-main-menu');

export interface ToMainMenuProps {
    mainMenuIsOpen?: boolean;
    openMainMenu: () => void;
}

const ToMainMenu: React.FC<ToMainMenuProps> = memo(({mainMenuIsOpen, openMainMenu}) => {
    const {t} = useTranslation('controls');

    const openMainMenuHandler = useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();

            openMainMenu();
        },
        [openMainMenu],
    );

    return (
        <button className={b({hidden: mainMenuIsOpen})} type="button" onClick={openMainMenuHandler}>
            <div className={b('icon')}>
                <ArrowLeft width={20} height={20} />
            </div>
            <span className={b('title')}>{t<string>('label_to-main-menu')}</span>
        </button>
    );
});

ToMainMenu.displayName = 'ToMainMenu';

export default ToMainMenu;
