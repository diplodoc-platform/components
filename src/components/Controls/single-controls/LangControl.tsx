import React, {useCallback, useEffect, useState, useRef} from 'react';
import {WithTranslation, withTranslation, WithTranslationProps} from 'react-i18next';
import allLangs from 'langs';
import {Popup, Icon as IconComponent, List} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {Control} from '../../Control';
import {ControlSizes, Lang} from '../../../models';
import {getPopupPosition} from './utils';
import {PopperPosition} from '../../../hooks';

import LangIcon from '../../../../assets/icons/lang.svg';

import '../Controls.scss';

const LEGACY_LANG_ITEMS = [
    {value: Lang.En, text: 'English', icon: '🇬🇧'},
    {value: Lang.Ru, text: 'Русский', icon: '🇷🇺'},
];

const b = block('dc-controls');

interface ControlProps {
    lang: Lang;
    langs?: string[];
    isVerticalView?: boolean;
    className?: string;
    size?: ControlSizes;
    onChangeLang?: (lang: Lang) => void;
    popupPosition?: PopperPosition;
}

interface ListItem {
    value: string;
    text: string;
    icon?: string;
}

const LIST_ITEM_HEIGHT = 36;

type ControlInnerProps = ControlProps & WithTranslation & WithTranslationProps;

const LangControl = (props: ControlInnerProps) => {
    const {
        className,
        isVerticalView,
        size,
        lang,
        langs = [],
        i18n,
        onChangeLang,
        popupPosition,
        t,
    } = props;

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

    const itemsHeight = LIST_ITEM_HEIGHT * langItems.length;
    const selectedItemIndex = langItems.findIndex(({value}) => value === lang);

    return (
        <React.Fragment>
            <Control
                size={size}
                onClick={showPopup}
                className={className}
                isVerticalView={isVerticalView}
                tooltipText={t('lang-text')}
                icon={(args) => <IconComponent data={LangIcon} {...args} />}
                setRef={setRef}
                popupPosition={popupPosition}
            />
            <Popup
                anchorRef={controlRef}
                open={isVisiblePopup}
                onOutsideClick={hidePopup}
                placement={getPopupPosition(isVerticalView)}
            >
                <List
                    filterable={false}
                    className={b('list', {langs: true})}
                    items={langItems}
                    onItemClick={(item) => {
                        _onChangeLang(item.value as Lang);
                    }}
                    selectedItemIndex={selectedItemIndex}
                    itemHeight={LIST_ITEM_HEIGHT}
                    itemsHeight={itemsHeight}
                    renderItem={(item) => {
                        return (
                            <div className={b('lang-item')}>
                                <div className={b('list-icon')}>{item.icon}</div> {item.text}
                            </div>
                        );
                    }}
                />
            </Popup>
        </React.Fragment>
    );
};

export default withTranslation('controls')(LangControl);
