import React, {useCallback, useEffect, useState, useRef} from 'react';
import {WithTranslation, withTranslation, WithTranslationProps} from 'react-i18next';

import {Control} from '../../Control';
import {ControlSizes, Lang} from '../../../models';

import {Popup} from '../../Popup';
import {List, ListItem} from '../../List';
import {
    getPopupPosition,
} from './utils';

import LangIcon from '../../../../assets/icons/lang.svg';
import RusIcon from '../../../../assets/icons/rus.svg';
import EngIcon from '../../../../assets/icons/eng.svg';

const POPUP_WIDTH = 146;
const ITEMS = [
    {value: Lang.Ru, text: 'Русский', icon: <RusIcon/>},
    {value: Lang.En, text: 'English', icon: <EngIcon/>},
];

interface ControlProps {
    lang: Lang;
    isVerticalView?: boolean;
    className?: string;
    size?: ControlSizes;
    onChangeLang?: (lang: Lang) => void;
}

type ControlInnerProps =
    & ControlProps
    & WithTranslation
    & WithTranslationProps;

const LangControl = (props: ControlInnerProps) => {
    const {
        className,
        isVerticalView,
        size,
        lang,
        i18n,
        onChangeLang,
        t,
    } = props;

    const controlRef = useRef<HTMLButtonElement | null>(null);
    const [isVisiblePopup, setIsVisiblePopup] = useState(false);
    const showPopup = () => setIsVisiblePopup(true);
    const hidePopup = () => setIsVisiblePopup(false);

    const _onChangeLang = useCallback((value: Lang) => {
        if (onChangeLang) {
            onChangeLang(value);
        }
    }, [onChangeLang]);

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [i18n, lang]);

    const setRef = useCallback((ref: HTMLButtonElement) => {
        controlRef.current = ref;
    }, []);

    if (!onChangeLang) {
        return null;
    }

    return (
        <React.Fragment>
            <Control
                size={size}
                onClick={showPopup}
                className={className}
                isVerticalView={isVerticalView}
                tooltipText={t('lang-text')}
                icon={LangIcon}
                setRef={setRef}
            />
            <Popup
                anchorRef={controlRef.current}
                visible={isVisiblePopup}
                onOutsideClick={hidePopup}
                popupWidth={POPUP_WIDTH}
                position={getPopupPosition(isVerticalView)}
            >
                <List
                    items={ITEMS as ListItem[]}
                    value={lang}
                    onItemClick={(item) => {
                        _onChangeLang(item.value as Lang);
                    }}
                />
            </Popup>
        </React.Fragment>
    );
};

export default withTranslation('controls')(LangControl);
