import {Globe} from '@gravity-ui/icons';
import {List, Popup} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import allLangs from 'langs';
import React, {useCallback, useContext, useMemo, useRef} from 'react';

import {usePopupState, useTranslation} from '../../../hooks';
import {Lang} from '../../../models';
import {Control} from '../../Control';
import '../Controls.scss';
import {ControlsLayoutContext} from '../ControlsLayout';

import {getPopupPosition} from './utils';

const ICONS: Record<string, string> = {
    en: '🇬🇧',
    ru: '🇷🇺',
};
const DEFAULT_LANGS = ['en', 'ru'];
const LEGACY_LANG_ITEMS = [
    {value: Lang.En, text: 'English', icon: '🇬🇧'},
    {value: Lang.Ru, text: 'Русский', icon: '🇷🇺'},
];

const b = block('dc-controls');

interface ControlProps {
    lang: Lang;
    langs?: string[];
    onChangeLang: (lang: Lang) => void;
}

interface ListItem {
    value: string;
    text: string;
    icon?: string;
}

const LIST_ITEM_HEIGHT = 36;

const LangControl = (props: ControlProps) => {
    const {t} = useTranslation('controls');
    const {controlClassName, controlSize, isVerticalView, popupPosition} =
        useContext(ControlsLayoutContext);
    const {lang, langs = DEFAULT_LANGS, onChangeLang} = props;

    const controlRef = useRef<HTMLButtonElement | null>(null);

    const popupState = usePopupState();
    const langItems = useMemo(() => {
        const preparedLangs = langs
            .map((code) => {
                const langData = allLangs.where('1', code);

                return langData
                    ? {
                          text: langData.name,
                          value: langData['1'],
                          icon: ICONS[code] || '',
                      }
                    : undefined;
            })
            .filter(Boolean) as ListItem[];

        return preparedLangs.length ? preparedLangs : LEGACY_LANG_ITEMS;
    }, [langs]);
    const renderItem = useCallback((item: ListItem) => {
        return (
            <div className={b('lang-item')}>
                <div className={b('list-icon')}>{item.icon}</div>
                {item.text}
            </div>
        );
    }, []);
    const onItemClick = useCallback(
        (item: ListItem) => {
            onChangeLang(item.value as Lang);
        },
        [onChangeLang],
    );

    const itemsHeight = LIST_ITEM_HEIGHT * langItems.length;
    const selectedItemIndex = langItems.findIndex(({value}) => value === lang);

    return (
        <React.Fragment>
            <Control
                ref={controlRef}
                size={controlSize}
                onClick={popupState.open}
                className={controlClassName}
                isVerticalView={isVerticalView}
                tooltipText={t('lang-text')}
                icon={Globe}
                popupPosition={popupPosition}
            />
            {popupState.visible && (
                <Popup
                    anchorRef={controlRef}
                    open={true}
                    onOutsideClick={popupState.close}
                    placement={getPopupPosition(isVerticalView)}
                >
                    <List
                        filterable={false}
                        className={b('list', {langs: true})}
                        items={langItems}
                        onItemClick={onItemClick}
                        selectedItemIndex={selectedItemIndex}
                        itemHeight={LIST_ITEM_HEIGHT}
                        itemsHeight={itemsHeight}
                        renderItem={renderItem}
                    />
                </Popup>
            )}
        </React.Fragment>
    );
};

export default LangControl;
