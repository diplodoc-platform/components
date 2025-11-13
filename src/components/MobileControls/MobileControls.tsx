import type {ControlsProps} from '../Controls';
import type {
    AvailableLangs,
    ControlSizes,
    DocSettings,
    ExtendedLang,
    LangOptions,
    ListItem,
    OnChangeValue,
    TFunction,
} from '../../models';

import React, {memo, useMemo} from 'react';
import {Globe, Sun} from '@gravity-ui/icons';
import block from 'bem-cn-lite';
import allLangs from 'langs';

import {DEFAULT_LANGS, LEGACY_LANG_ITEMS} from '../../constants';
import {ControlsLayout} from '../Controls';
import {useTranslation} from '../../hooks';
import {Lang, Theme} from '../../models';

import MobileControl from './MobileControl/MobileControl';
import './MobileControls.scss';

const b = block('dc-mobile-controls');

export interface MobileControlsProps {
    controlSize: ControlSizes;
    userSettings: DocSettings & ControlsProps;
}

const useLangControl = (
    t: TFunction,
    lang: `${Lang}` | Lang,
    availableLangs: AvailableLangs,
    langs?: (string | ExtendedLang)[],
    onChangeLang?: (lang: `${Lang}` | Lang, options?: LangOptions) => void,
) => {
    const langItems = useMemo(() => {
        const preparedLangs = (langs ?? DEFAULT_LANGS)
            .map((code) => {
                let lang: string;
                let domain: string | undefined;
                let href: string | undefined;

                if (typeof code === 'string') {
                    lang = code;
                } else {
                    lang = code.lang;
                    domain = code.domain;
                    href = code.href;
                }

                const locale = lang.split('-')[0];
                const langData = allLangs.where('1', locale);

                const regionNames = new Intl.DisplayNames([lang], {type: 'region'});
                const country = domain ? regionNames.of(domain.toUpperCase()) : undefined;

                return langData
                    ? {
                          text: langData.local,
                          country,
                          value: lang,
                          options: {
                              domain,
                              href,
                          },
                      }
                    : undefined;
            })
            .filter(Boolean) as ListItem[];

        return preparedLangs.length ? preparedLangs : LEGACY_LANG_ITEMS;
    }, [langs]);

    const selectedItemIndex = useMemo(() => (langs ? langs.indexOf(lang) : -1), [lang, langs]);

    return (
        <MobileControl
            name={'lang'}
            title={t('lang-text')}
            Icon={Globe}
            selectedItem={lang}
            selectedItemIndex={selectedItemIndex}
            displayItems={langItems}
            availableLangs={availableLangs}
            onChangeValue={onChangeLang as OnChangeValue}
        />
    );
};
const themes = [Theme.Light, Theme.Dark];

const useThemeControl = (t: TFunction, theme: Theme, onChangeTheme?: (theme: Theme) => void) => {
    const themesItems = useMemo(
        () =>
            themes.map((value) => {
                const text = t(`label_${value}_theme`);

                return {
                    text,
                    value,
                };
            }),
        [t],
    );

    const buttonLabel = useMemo(() => {
        for (const item of themesItems) {
            if (theme !== item.value) {
                continue;
            }

            return t(`full_label_${item.value}_theme`);
        }

        return '';
    }, [t, theme, themesItems]);

    const selectedItemIndex = useMemo(() => (theme ? themes.indexOf(theme) : -1), [theme]);

    return (
        <MobileControl
            name={'theme'}
            title={t('label_theme')}
            buttonLabel={buttonLabel}
            Icon={Sun}
            selectedItem={theme}
            selectedItemIndex={selectedItemIndex}
            displayItems={themesItems}
            onChangeValue={onChangeTheme as OnChangeValue}
        />
    );
};

const MobileControls = memo(({controlSize, userSettings}: MobileControlsProps) => {
    const {t} = useTranslation('controls');
    const {onChangeLang, lang, langs, availableLangs = [], onChangeTheme, theme} = userSettings;

    const langControl = useLangControl(t, lang ?? Lang.En, availableLangs, langs, onChangeLang);
    const themeControl = useThemeControl(t, theme ?? Theme.Light, onChangeTheme);

    if (!onChangeTheme && !onChangeLang) {
        return null;
    }

    return (
        <div className={b()}>
            <ControlsLayout controlClassName={b('control')} controlSize={controlSize}>
                {onChangeTheme && themeControl}
                {onChangeLang && langControl}
            </ControlsLayout>
        </div>
    );
});

MobileControls.displayName = 'MobileControls';

export default MobileControls;
