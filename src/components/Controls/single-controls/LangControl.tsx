import React, {useCallback, useEffect, useState, useRef} from 'react';
import {WithTranslation, withTranslation, WithTranslationProps} from 'react-i18next';
import allLangs from 'langs';

import {Control} from '../../Control';
import {ControlSizes, Lang} from '../../../models';
import {Popup} from '../../Popup';
import {List, ListItem} from '../../List';
import {getPopupPosition} from './utils';

import LangIcon from '../../../../assets/icons/lang.svg';
import RusIcon from '../../../../assets/icons/rus.svg';
import EngIcon from '../../../../assets/icons/eng.svg';

const LEGACY_LANG_ITEMS = [
    {value: Lang.En, text: 'English', icon: <EngIcon />},
    {value: Lang.Ru, text: 'Русский', icon: <RusIcon />},
];

interface ControlProps {
    lang: Lang;
    langs?: string[];
    isVerticalView?: boolean;
    className?: string;
    size?: ControlSizes;
    onChangeLang?: (lang: Lang) => void;
}

type ControlInnerProps = ControlProps & WithTranslation & WithTranslationProps;

const LangControl = (props: ControlInnerProps) => {
    const {className, isVerticalView, size, lang, langs = [], i18n, onChangeLang, t} = props;

    const [langItems, setLangItems] = useState<ListItem[]>(LEGACY_LANG_ITEMS);
    const controlRef = useRef<HTMLButtonElement | null>(null);
    const [isVisiblePopup, setIsVisiblePopup] = useState(false);
    const showPopup = () => setIsVisiblePopup(true);
    const hidePopup = () => setIsVisiblePopup(false);

    const _onChangeLang = useCallback(
        (value: Lang) => {
            if (onChangeLang) {
                onChangeLang(value);
            }
        },
        [onChangeLang],
    );

    useEffect(() => {
        const preparedLangs = langs
            .map((code) => {
                const langData = allLangs.where('1', code);

                return langData
                    ? {
                          text: langData.name,
                          value: langData['1'],
                      }
                    : undefined;
            })
            .filter(Boolean) as ListItem[];

        if (preparedLangs.length) {
            setLangItems(preparedLangs);
        } else {
            setLangItems(LEGACY_LANG_ITEMS);
        }
    }, [langs]);

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
                anchor={controlRef.current}
                visible={isVisiblePopup}
                onOutsideClick={hidePopup}
                position={getPopupPosition(isVerticalView)}
            >
                <List
                    items={langItems as ListItem[]}
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
