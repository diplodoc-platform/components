import type {AvailableLangs, ExtendedLang, Lang, LangOptions, ListItem} from '../../../../models';

import React, {useCallback, useContext, useMemo, useRef} from 'react';
import {Globe} from '@gravity-ui/icons';
import {List, Popover} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import allLangs from 'langs';

import {DEFAULT_LANGS, LEGACY_LANG_ITEMS} from '../../../../constants';
import {usePopupState, useTranslation} from '../../../../hooks';
import {getItemHeight, getItemsHeight, getPopupPosition} from '../../../../utils';
import {Control} from '../../../Control';
import {ControlsLayoutContext} from '../../ControlsLayout';

import './LangControl.scss';

const b = block('dc-lang-control');

interface ControlProps {
    lang: `${Lang}` | Lang;
    langs?: (`${Lang}` | Lang | ExtendedLang)[];
    availableLangs: AvailableLangs;
    onChangeLang: (lang: `${Lang}` | Lang, options?: LangOptions) => void;
}

const LIST_ITEM_HEIGHT = 36;

const LangControl = (props: ControlProps) => {
    const {t} = useTranslation('controls');
    const {controlClassName, controlSize, isVerticalView, popupPosition} =
        useContext(ControlsLayoutContext);
    const {lang, langs = DEFAULT_LANGS, availableLangs, onChangeLang} = props;

    const controlRef = useRef<HTMLButtonElement | null>(null);

    const isLangDisabled = useCallback(
        (lang: string) => {
            return Boolean(availableLangs?.length && !availableLangs.includes(lang as Lang));
        },
        [availableLangs],
    );

    const popupState = usePopupState();
    const langItems = useMemo(() => {
        const preparedLangs = langs
            .map((code) => {
                let lang: string;
                let tld: string | undefined;
                let href: string | undefined;

                if (typeof code === 'string') {
                    lang = code;
                } else {
                    lang = code.lang;
                    tld = code.tld;
                    href = code.href;
                }

                const locale = lang.split('-')[0];
                const langData = allLangs.where('1', locale);
                const disabled = isLangDisabled(lang) && !href;

                const regionNames = new Intl.DisplayNames([lang], {type: 'region'});
                const country = tld ? regionNames.of(tld.toUpperCase()) : undefined;

                return langData
                    ? {
                          text: langData.local,
                          country,
                          value: lang,
                          disabled,
                          options: {
                              tld,
                              href,
                          },
                      }
                    : undefined;
            })
            .filter(Boolean) as ListItem[];

        return preparedLangs.length ? preparedLangs : LEGACY_LANG_ITEMS;
    }, [langs, isLangDisabled]);

    const renderItem = useCallback(
        (item: ListItem) => {
            const {tld, href} = item.options || {};

            const disabled = isLangDisabled(item.value) && !href;
            const country = item.country;

            return (
                <button
                    className={b('list-item', {disabled, tld: Boolean(tld)})}
                    disabled={disabled}
                >
                    {item.text}
                    {tld && country && <span>{country}</span>}
                </button>
            );
        },
        [isLangDisabled],
    );

    const onItemClick = useCallback(
        (item: ListItem) => {
            const options = item.options;

            onChangeLang(item.value as Lang, options);
        },
        [onChangeLang],
    );

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
                    itemHeight={(items) => getItemHeight(LIST_ITEM_HEIGHT, items)}
                    itemsHeight={(items) => getItemsHeight(LIST_ITEM_HEIGHT, items)}
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
