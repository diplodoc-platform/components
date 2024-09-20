import React, {memo, useMemo} from 'react';
import {Globe, Sun} from '@gravity-ui/icons';
import block from 'bem-cn-lite';
import allLangs from 'langs';
import {KeyPrefix, Namespace, TFunction} from 'react-i18next';

import {
    ControlSizes,
    ControlsLayout,
    ControlsProps,
    DEFAULT_LANGS,
    DocSettings,
    LEGACY_LANG_ITEMS,
    Lang,
    Theme,
} from '../..';
import {useTranslation} from '../../hooks';
import {ListItem, OnChangeValue} from '../../models';

import MobileControl from './MobileControl/MobileControl';
import './MobileControls.scss';

const b = block('dc-mobile-controls');

type UseTranslationReturnType = TFunction<Namespace<string>, KeyPrefix<Namespace<string>>>;

export interface MobileControlsProps {
    controlSize: ControlSizes;
    userSettings: DocSettings & ControlsProps;
}

const useLangControl = (
    t: UseTranslationReturnType,
    lang: Lang,
    langs?: Lang[],
    onChangeLang?: (lang: Lang) => void,
) => {
    const langItems = useMemo(() => {
        const preparedLangs = (langs ?? DEFAULT_LANGS)
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
            name={'lang'}
            title={t('lang-text')}
            Icon={Globe}
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
    theme: Theme,
    onChangeTheme?: (theme: Theme) => void,
) => {
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
    const {onChangeLang, lang, langs, onChangeTheme, theme} = userSettings;

    const langControl = useLangControl(t, lang ?? Lang.En, langs, onChangeLang);
    const themeControl = useThemeControl(t, theme ?? Theme.Light, onChangeTheme);

    if (!onChangeTheme && !onChangeLang) {
        return null;
    }

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
