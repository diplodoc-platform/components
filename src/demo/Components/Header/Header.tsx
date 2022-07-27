import React from 'react';
import cn from 'bem-cn-lite';
import {TextInput} from '@yandex-cloud/uikit';
import {ControlSizes, LangControl, FullScreenControl, DividerControl} from '../../../index';
import {Lang} from '../../../models';
import './Header.scss';

const headBlock = cn('Header');
const layoutBlock = cn('Layout');

export interface HeaderProps {
    lang: Lang;
    fullScreen: boolean;
    searchText?: string;
    onChangeLang?: (lang: Lang) => void;
    onChangeFullScreen?: (value: boolean) => void;
    onChangeSearch?: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({
    lang,
    fullScreen,
    searchText,
    onChangeFullScreen,
    onChangeLang,
    onChangeSearch,
}) => {
    return (
        <div className={layoutBlock('header')}>
            <div className={headBlock()}>
                <FullScreenControl
                    lang={lang}
                    value={fullScreen}
                    onChange={onChangeFullScreen}
                    size={ControlSizes.L}
                    className={headBlock('control')}
                />
                <DividerControl size={ControlSizes.L} className={headBlock('divider')} />
                <LangControl
                    lang={lang}
                    onChangeLang={onChangeLang}
                    size={ControlSizes.L}
                    className={headBlock('control')}
                />

                {onChangeFullScreen ? (
                    <TextInput
                        value={searchText}
                        onUpdate={onChangeSearch}
                        className={headBlock('control-input')}
                    />
                ) : null}
            </div>
        </div>
    );
};

export default Header;
