import React from 'react';
import cn from 'bem-cn-lite';
import {
    ControlSizes,
    LangControl,
    FullScreenControl,
    DividerControl,
} from '../../../index';
import {Lang} from '../../../models';

const headBlock = cn('Header');
const layoutBlock = cn('Layout');

export interface HeaderProps {
    lang: Lang;
    fullScreen: boolean;
    onChangeLang?: (lang: Lang) => void;
    onChangeFullScreen?: (value: boolean) => void;
}


const Header: React.FC<HeaderProps> = ({
    lang,
    fullScreen,
    onChangeFullScreen,
    onChangeLang,
}) => {
    return (
        <div className={layoutBlock('header')}>
            <div className={headBlock()}>
                <FullScreenControl
                    lang={lang}
                    value={fullScreen}
                    onChange={onChangeFullScreen}
                    size={ControlSizes.M}
                    className={headBlock('control')}
                />
                <DividerControl
                    size={ControlSizes.M}
                    className={headBlock('divider')}
                />
                <LangControl
                    lang={lang}
                    onChangeLang={onChangeLang}
                    size={ControlSizes.M}
                    className={headBlock('control')}
                />
            </div>
        </div>
    );
};

export default Header;
