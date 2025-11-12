import type {AvailableLangs, ExtendedLang, LangOptions, ListItem} from '../../../../models';

import React, {useCallback, useContext, useMemo, useRef} from 'react';
import {Globe} from '@gravity-ui/icons';
import {List, Popover} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import allLangs from 'langs';

import {DEFAULT_LANGS, LEGACY_LANG_ITEMS} from '../../../../constants';
import {usePopupState, useTranslation} from '../../../../hooks';
import {Lang} from '../../../../models';
import {getPopupPosition} from '../../../../utils';
import {Control} from '../../../Control';
import {ControlsLayoutContext} from '../../ControlsLayout';

import './LangControl.scss';

const b = block('dc-lang-control');

interface ControlProps {
    lang: `${Lang}` | Lang;
    langs?: (string | ExtendedLang)[];
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
                let langCode: string;
                let domain: string | undefined;
                let href: string | undefined;

                if (typeof code === 'string') {
                    langCode = code;
                } else {
                    langCode = code.lang;
                    domain = code.domain;
                    href = code.href;
                }

                const langData = allLangs.where('1', langCode);
                const lang = (langData?.['1'] as Lang) || Lang.En;
                const disabled = isLangDisabled(lang) && !domain && !href;

                const regionNames = new Intl.DisplayNames([lang], {type: 'region'});
                const country = domain ? regionNames.of(domain.toUpperCase()) : undefined;

                return langData
                    ? {
                          text: langData.local,
                          country,
                          value: lang,
                          disabled,
                          options: {
                              domain,
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
            const {domain, href} = item.options || {};

            const disabled = isLangDisabled(item.value) && !domain && !href;
            const country = item.country;

            return (
                <button
                    className={b('list-item', {disabled, domain: Boolean(domain)})}
                    disabled={disabled}
                >
                    {item.text}
                    {domain && country && <span>{country}</span>}
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

    const calcItemHeight = useCallback((item: ListItem) => {
        const domain = item.options?.domain;
        const domainItemHeight = domain ? 12 : 0;

        return LIST_ITEM_HEIGHT + domainItemHeight;
    }, []);

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
                    itemHeight={(item) => calcItemHeight(item)}
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
