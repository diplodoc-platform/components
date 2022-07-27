import React, {useCallback, useEffect, useState, useRef} from 'react';
import {WithTranslation, withTranslation, WithTranslationProps} from 'react-i18next';
import cn from 'bem-cn-lite';
import {Button, Popup, Switch, List} from '@yandex-cloud/uikit';

import {Control} from '../../../Control';
import {ControlSizes, Lang, TextSizes, Theme} from '../../../../models';

import SettingsIcon from '../../../../../assets/icons/cog.svg';

import {getPopupPosition} from '../utils';

import './SettingsControl.scss';

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

type ControlInnerProps = ControlProps & WithTranslation & WithTranslationProps;

interface SettingControlItem {
    text: string;
    description: string;
    control: Element;
}

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

    const makeOnChangeTextSize = useCallback(
        (textSizeKey) => () => {
            if (onChangeTextSize) {
                onChangeTextSize(textSizeKey);
            }
        },
        [onChangeTextSize],
    );
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
            onChangeWideFormat
                ? {
                      text: t('label_wide_format'),
                      description: t(
                          `description_wide_format_${wideFormat ? 'enabled' : 'disabled'}`,
                      ),
                      control: <Switch checked={wideFormat} onChange={_onChangeWideFormat} />,
                  }
                : null,
            onChangeShowMiniToc
                ? {
                      text: t('label_show_mini_toc'),
                      description: t('description_show_mini_toc'),
                      control: (
                          <Switch
                              disabled={showMiniTocDisabled}
                              checked={showMiniToc}
                              onChange={_onChangeShowMiniToc}
                          />
                      ),
                  }
                : null,
            onChangeTheme
                ? {
                      text: t('label_dark_theme'),
                      description:
                          Theme.Light === theme
                              ? t('description_disabled_dark_theme')
                              : t('description_enabled_dark_theme'),
                      control: <Switch checked={theme === Theme.Dark} onChange={_onChangeTheme} />,
                  }
                : null,
            onChangeTextSize
                ? {
                      text: t('label_text_size'),
                      description: t(`description_${textSize}_text_size`),
                      control: (
                          <div className={b('text-size-control')}>
                              {allTextSizes.map((textSizeKey) => (
                                  <Button
                                      key={textSizeKey}
                                      className={b('text-size-button', {
                                          [textSizeKey]: true,
                                      })}
                                      view="flat"
                                      onClick={makeOnChangeTextSize(textSizeKey)}
                                  >
                                      <Button.Icon
                                          className={b('text-size-button-icon', {
                                              active: textSize === textSizeKey,
                                          })}
                                      >
                                          A
                                      </Button.Icon>
                                  </Button>
                              ))}
                          </div>
                      ),
                  }
                : null,
        ].filter(Boolean) as unknown as SettingControlItem[];
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

    if (!(onChangeWideFormat || onChangeTheme || onChangeShowMiniToc || onChangeTextSize)) {
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
                anchorRef={controlRef}
                open={isVisiblePopup}
                className={b('popup')}
                onOutsideClick={hidePopup}
                placement={getPopupPosition(isVerticalView)}
            >
                <List
                    items={settingsItems}
                    className={b('list')}
                    itemHeight={ITEM_HEIGHT}
                    itemsHeight={ITEM_HEIGHT * settingsItems.length}
                    filterable={false}
                    renderItem={(item) => {
                        return (
                            <div className={b('list-item')}>
                                <div className={b('list-item-content')}>
                                    <div className={b('list-item-text')}>{item.text}</div>
                                    <div className={b('list-item-description')}>
                                        {item.description}
                                    </div>
                                </div>
                                <div className={b('list-item-control')}>{item.control}</div>
                            </div>
                        );
                    }}
                />
            </Popup>
        </React.Fragment>
    );
};

export default withTranslation('controls')(SettingsControl);
