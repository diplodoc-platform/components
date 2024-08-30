import React, {useCallback, useContext, useMemo, useRef} from 'react';
import {Globe} from '@gravity-ui/icons';
import {List, Popover} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import allLangs from 'langs';

import {usePopupState, useTranslation} from '../../../../hooks';
import {Lang} from '../../../../models';
import {getPopupPosition} from '../../../../utils';
import {Control} from '../../../Control';
import {ControlsLayoutContext} from '../../ControlsLayout';

import './LangControl.scss';

const DEFAULT_LANGS = ['en', 'ru', 'he'];
const LEGACY_LANG_ITEMS = [
    {value: Lang.En, text: 'English'},
    {value: Lang.Ru, text: 'Русский'},
    {value: Lang.He, text: 'Hebrew'},
];

const b = block('dc-lang-control');

interface ControlProps {
    lang: Lang;
    langs?: string[];
    onChangeLang: (lang: Lang) => void;
}

interface ListItem {
    value: string;
    text: string;
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
                      }
                    : undefined;
            })
            .filter(Boolean) as ListItem[];

        return preparedLangs.length ? preparedLangs : LEGACY_LANG_ITEMS;
    }, [langs]);
    const renderItem = useCallback((item: ListItem) => {
        return <button className={b('list-item')}>{item.text}</button>;
    }, []);
    const onItemClick = useCallback(
        (item: ListItem) => {
            onChangeLang(item.value as Lang);
        },
        [onChangeLang],
    );

    const itemsHeight = LIST_ITEM_HEIGHT * langItems.length;
    const selectedItemIndex = langItems.findIndex(({value}) => value === lang);
    const onOpenChange = useCallback(
        (opened: boolean) => {
            if (opened) {
                popupState.open();
            } else {
                popupState.close();
            }
        },
        [popupState],
    );

    return (
        <Popover
            autoclosable={false}
            openOnHover={false}
            focusTrap
            autoFocus
            restoreFocusRef={controlRef}
            placement={getPopupPosition(isVerticalView)}
            onCloseClick={popupState.close}
            onOpenChange={onOpenChange}
            className={controlClassName}
            contentClassName={b('popup')}
            tooltipContentClassName={b('popup-tooltip')}
            content={
                <List
                    role={'list'}
                    filterable={false}
                    className={b('list')}
                    items={langItems}
                    onItemClick={onItemClick}
                    selectedItemIndex={selectedItemIndex}
                    itemHeight={LIST_ITEM_HEIGHT}
                    itemsHeight={itemsHeight}
                    renderItem={renderItem}
                />
            }
        >
            <Control
                ref={controlRef}
                size={controlSize}
                onClick={popupState.open}
                isVerticalView={isVerticalView}
                tooltipText={t('lang-text')}
                icon={Globe}
                popupPosition={popupPosition}
                isTooltipHidden={popupState.visible}
            />
        </Popover>
    );
};

export default LangControl;
