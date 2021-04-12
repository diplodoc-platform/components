import React, {useCallback, useEffect, useState, useRef} from 'react';
import {WithTranslation, withTranslation, WithTranslationProps} from 'react-i18next';
import cn from 'bem-cn-lite';

import {Control} from '../../../Control';
import {ControlSizes, Lang, TextSizes, Theme} from '../../../../models';

import SettingsIcon from '../../../../../assets/icons/cog.svg';
import {Tumbler} from '../../../Tumbler';
import {ControlButton} from '../../../ControlButton';
import {Popup} from '../../../Popup';
import {List, ListItem} from '../../../List';

import {getPopupPosition} from '../utils';

import './SettingsControl.scss';

const POPUP_WIDTH = 256;
const ITEM_HEIGHT = 48;
const b = cn('dc-settings-control');

interface ControlProps {
    fullScreen?: boolean;
    singlePage?: boolean;
    wideFormat?: boolean;
    showMiniToc?: boolean;
    theme?: Theme;
    textSize?: TextSizes;
    lang: Lang;
    isVerticalView?: boolean;
    className?: string;
    size?: ControlSizes;
    onChangeWideFormat?: (value: boolean) => void;
    onChangeShowMiniToc?: (value: boolean) => void;
    onChangeTheme?: (theme: Theme) => void;
    onChangeTextSize?: (textSize: TextSizes) => void;
}

type ControlInnerProps =
    & ControlProps
    & WithTranslation
    & WithTranslationProps;

const SettingsControl = (props: ControlInnerProps) => {
    const {
        className,
        isVerticalView,
        size,
        lang,
        i18n,
        textSize,
        theme,
        wideFormat,
        showMiniToc,
        fullScreen,
        singlePage,
        onChangeTheme,
        onChangeWideFormat,
        onChangeShowMiniToc,
        onChangeTextSize,
        t,
    } = props;

    const controlRef = useRef<HTMLButtonElement | null>(null);
    const [isVisiblePopup, setIsVisiblePopup] = useState(false);
    const showPopup = () => setIsVisiblePopup(true);
    const hidePopup = () => setIsVisiblePopup(false);

    const makeOnChangeTextSize = useCallback((textSizeKey) => () => {
        if (onChangeTextSize) {
            onChangeTextSize(textSizeKey);
        }
    }, [onChangeTextSize]);
    const _onChangeTheme = useCallback(() => {
        if (onChangeTheme) {
            onChangeTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark);
        }
    }, [theme, onChangeTheme]);
    const _onChangeWideFormat = useCallback(() => {
        if (onChangeWideFormat) {
            onChangeWideFormat(!wideFormat);
        }
    }, [wideFormat, onChangeWideFormat]);
    const _onChangeShowMiniToc = useCallback(() => {
        if (onChangeShowMiniToc) {
            onChangeShowMiniToc(!showMiniToc);
        }
    }, [showMiniToc, onChangeShowMiniToc]);

    const getSettingsItems = useCallback(() => {
        const allTextSizes = Object.values(TextSizes);
        const showMiniTocDisabled = fullScreen || singlePage;

        return [
            onChangeWideFormat ? {
                text: t('label_wide_format'),
                description: t(`description_wide_format_${wideFormat ? 'enabled' : 'disabled'}`),
                control: (
                    <Tumbler
                        checked={wideFormat}
                        onChange={_onChangeWideFormat}
                    />
                ),
            } : null,
            onChangeShowMiniToc ? {
                text: t('label_show_mini_toc'),
                description: t('description_show_mini_toc'),
                control: (
                    <Tumbler
                        disabled={showMiniTocDisabled}
                        checked={showMiniToc}
                        onChange={_onChangeShowMiniToc}
                    />
                ),
            } : null,
            onChangeTheme ? {
                text: t('label_dark_theme'),
                description: Theme.Light === theme
                    ? t('description_disabled_dark_theme')
                    : t('description_enabled_dark_theme'),
                control: (
                    <Tumbler
                        checked={theme === Theme.Dark}
                        onChange={_onChangeTheme}
                    />
                ),
            } : null,
            onChangeTextSize ? {
                text: t('label_text_size'),
                description: t(`description_${textSize}_text_size`),
                control: (
                    <div className={b('text-size-control')}>
                        {allTextSizes.map((textSizeKey) => (
                            <ControlButton
                                key={textSizeKey}
                                className={b('text-size-button', {
                                    [textSizeKey]: true,
                                    active: textSize === textSizeKey,
                                })}
                                onClick={makeOnChangeTextSize(textSizeKey)}
                            >
                                A
                            </ControlButton>
                        ))}
                    </div>
                ),
            } : null,
        ].filter(Boolean);
    }, [
        t,
        textSize,
        theme,
        wideFormat,
        showMiniToc,
        fullScreen,
        singlePage,
        onChangeTheme,
        onChangeWideFormat,
        onChangeShowMiniToc,
        _onChangeTheme,
        _onChangeWideFormat,
        _onChangeShowMiniToc,
        onChangeTextSize,
        makeOnChangeTextSize,
    ]);

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [i18n, lang]);

    const setRef = useCallback((ref: HTMLButtonElement) => {
        controlRef.current = ref;
    }, []);

    if (!(
        onChangeWideFormat ||
        onChangeTheme ||
        onChangeShowMiniToc ||
        onChangeTextSize
    )) {
        return null;
    }

    const settingsItems = getSettingsItems();

    return (
        <React.Fragment>
            <Control
                size={size}
                onClick={showPopup}
                className={className}
                isVerticalView={isVerticalView}
                tooltipText={t('settings-text')}
                icon={SettingsIcon}
                setRef={setRef}
            />
            <Popup
                anchor={controlRef.current}
                visible={isVisiblePopup}
                onOutsideClick={hidePopup}
                popupWidth={POPUP_WIDTH}
                position={getPopupPosition(isVerticalView)}
            >
                <List
                    items={settingsItems as ListItem[]}
                    itemHeight={ITEM_HEIGHT}
                />
            </Popup>
        </React.Fragment>
    );
};

export default withTranslation('controls')(SettingsControl);
