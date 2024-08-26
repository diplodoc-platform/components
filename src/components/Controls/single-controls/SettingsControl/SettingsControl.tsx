import React, {ReactElement, useCallback, useContext, useRef, useState} from 'react';
import {Gear} from '@gravity-ui/icons';
import {Button, List, Popover, Switch, useDirection} from '@gravity-ui/uikit';
import cn from 'bem-cn-lite';

import {useTranslation} from '../../../../hooks';
import {TextSizes, Theme} from '../../../../models';
import {getPopupPosition} from '../../../../utils';
import {Control} from '../../../Control';
import {ControlsLayoutContext} from '../../ControlsLayout';

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
    onChangeWideFormat?: (value: boolean) => void;
    onChangeShowMiniToc?: (value: boolean) => void;
    onChangeTheme?: (theme: Theme) => void;
    onChangeTextSize?: (textSize: TextSizes) => void;
}

interface SettingControlItem {
    text: string;
    description: string;
    control: ReactElement;
}

const SettingsControl = (props: ControlProps) => {
    const {t} = useTranslation('controls');
    const {controlClassName, controlSize, isVerticalView, isWideView, isMobileView, popupPosition} =
        useContext(ControlsLayoutContext);
    const {
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
    } = props;

    const controlRef = useRef<HTMLButtonElement | null>(null);
    const direction = useDirection();

    const [isVisiblePopup, setIsVisiblePopup] = useState(false);
    const showPopup = () => setIsVisiblePopup(true);
    const hidePopup = () => setIsVisiblePopup(false);

    const _onChangeTextSize = useCallback(
        (textSizeKey: TextSizes) => () => {
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
                      description: t(
                          `description_show_mini_toc_${showMiniToc ? 'enabled' : 'disabled'}`,
                          t(`description_show_mini_toc`),
                      ),
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
                                      onClick={_onChangeTextSize(textSizeKey)}
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
        _onChangeTheme,
        _onChangeWideFormat,
        _onChangeShowMiniToc,
        _onChangeTextSize,
        onChangeWideFormat,
        onChangeShowMiniToc,
        onChangeTheme,
        onChangeTextSize,
    ]);

    const settingsItems = getSettingsItems();

    return (
        <Popover
            autoclosable={false}
            openOnHover={false}
            focusTrap
            autoFocus
            restoreFocusRef={controlRef}
            onCloseClick={hidePopup}
            onOpenChange={setIsVisiblePopup}
            placement={getPopupPosition(isVerticalView, direction)}
            className={controlClassName}
            contentClassName={b('popup')}
            tooltipClassName={b('popup-tooltip')}
            tooltipContentClassName={b('popup-tooltip-content')}
            hasArrow={!isMobileView}
            content={
                <List
                    role={'list'}
                    items={settingsItems}
                    className={b('list')}
                    itemHeight={ITEM_HEIGHT}
                    itemsHeight={ITEM_HEIGHT * settingsItems.length}
                    filterable={false}
                    renderItem={(item: SettingControlItem) => {
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
            }
        >
            <Control
                ref={controlRef}
                size={controlSize}
                onClick={showPopup}
                isWideView={isWideView}
                isVerticalView={isVerticalView}
                tooltipText={t('settings-text')}
                popupPosition={popupPosition}
                icon={Gear}
                buttonExtraProps={{
                    'aria-expanded': isVisiblePopup,
                }}
                isTooltipHidden={isVisiblePopup}
            />
        </Popover>
    );
};

export default SettingsControl;
