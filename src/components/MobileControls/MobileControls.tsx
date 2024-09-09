/* eslint-disable react-hooks/rules-of-hooks */
import React, {memo, useMemo} from 'react';
import {Globe, Sun} from '@gravity-ui/icons';
import block from 'bem-cn-lite';
import allLangs from 'langs';
import {KeyPrefix, Namespace, TFunction} from 'react-i18next';

import {ControlSizes, ControlsLayout, ControlsProps, DocSettings, Lang, Theme} from '../..';
import {useTranslation} from '../../hooks';
import {ListItem, OnChangeValue} from '../../models';

import MobileControl from './MobileControl/MobileControl';
import './MobileControls.scss';

const b = block('dc-mobile-controls');

type UseTranslationReturnType = TFunction<Namespace<string>, KeyPrefix<Namespace<string>>>;

export interface MobileControlsProps {
    controlSize: ControlSizes;
    lang: Lang;
    userSettings: DocSettings & ControlsProps;
}

const LEGACY_LANG_ITEMS = [
    {value: Lang.En, text: 'English'},
    {value: Lang.Ru, text: 'Русский'},
    {value: Lang.He, text: 'Hebrew'},
];

const useLangControl = (
    t: UseTranslationReturnType,
    lang: Lang,
    langs?: Lang[],
    onChangeLang?: (lang: Lang) => void,
) => {
    const controlName = 'lang';
    const icon = Globe;

    const langItems = useMemo(() => {
        const preparedLangs = (langs ?? [])
            .map((code) => {
                const langData = allLangs.where('1', code);

                return langData
                    ? {
                          text: langData.local,
                          value: langData['1'],
                      }
                    : undefined;
            })
            .filter(Boolean) as ListItem[];

        return preparedLangs.length ? preparedLangs : LEGACY_LANG_ITEMS;
    }, [langs]);

    const selectedItemIndex = useMemo(() => (langs ? langs.indexOf(lang) : -1), [lang, langs]);

    return (
        <MobileControl
            name={controlName}
            title={t('lang-text')}
            Icon={icon}
            selectedItem={lang}
            selectedItemIndex={selectedItemIndex}
            displayItems={langItems}
            onChangeValue={onChangeLang as OnChangeValue}
        />
    );
};
const themes = [Theme.Light, Theme.Dark];

const useThemeControl = (
    t: UseTranslationReturnType,
    theme?: Theme,
    onChangeTheme?: (theme: Theme) => void,
) => {
    const controlName = 'theme';
    const icon = Sun;

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
            name={controlName}
            title={t('label_theme')}
            buttonLabel={buttonLabel}
            Icon={icon}
            selectedItem={theme}
            selectedItemIndex={selectedItemIndex}
            displayItems={themesItems}
            onChangeValue={onChangeTheme as OnChangeValue}
        />
    );
};

const MobileControls = memo(({controlSize, lang, userSettings}: MobileControlsProps) => {
    const {t} = useTranslation('controls');

    const {onChangeLang, langs, onChangeTheme, theme} = userSettings;

    if (!onChangeTheme && !onChangeLang) {
        return null;
    }

    const langControl = useLangControl(t, lang, langs, onChangeLang);

    const themeControl = useThemeControl(t, theme, onChangeTheme);

    return (
        <div className={b()}>
            <ControlsLayout controlClassName={b('control')} controlSize={controlSize}>
                {themeControl}
                {langControl}
            </ControlsLayout>
        </div>
    );
});

MobileControls.displayName = 'MobileControls';

export default MobileControls;
