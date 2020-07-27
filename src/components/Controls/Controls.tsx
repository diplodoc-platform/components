import React from 'react';
import block from 'bem-cn-lite';
import {withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';

import {List, ListItem} from '../List';
import {Popup} from '../Popup';
import {Tumbler} from '../Tumbler';
import {Button} from '../Button';

import FullScreenIcon from '../../../assets/icons/full-screen.svg';
import FullScreenClickedIcon from '../../../assets/icons/full-screen-clicked.svg';
import SettingsIcon from '../../../assets/icons/cog.svg';
import SettingsMarkedIcon from '../../../assets/icons/cog-marked.svg';
import LangSwitcherIcon from '../../../assets/icons/lang.svg';
import RusIcon from '../../../assets/icons/rus.svg';
import EngIcon from '../../../assets/icons/eng.svg';
import EditIcon from '../../../assets/icons/edit.svg';

import {Lang, TextSizes, Theme} from '../../models';
import {isDefaultSettings, ChangeHandler} from '../../utils';

import './Controls.scss';

const b = block('dc-controls');

export interface ControlsProps {
    lang: Lang;
    fullScreen: boolean;
    wideFormat: boolean;
    showMiniToc: boolean;
    theme: Theme;
    textSize: TextSizes;
    vcsUrl: string;
    vcsType: string;
    showEditControl: boolean;
    onChangeLang?: (lang: Lang) => void;
    onChangeFullScreen?: (value: boolean) => void;
    onChangeWideFormat?: (value: boolean) => void;
    onChangeShowMiniToc?: (value: boolean) => void;
    onChangeTheme?: (theme: Theme) => void;
    onChangeTextSize?: (textSize: TextSizes) => void;
    className?: string;
    verticalView?: boolean;
}

interface ControlsState {
    showSettingsPopup: boolean;
    showLangPopup: boolean;
    showFullScreenTooltip: boolean;
    showEditTooltip: boolean;
    showLangTooltip: boolean;
    showSettingsTooltip: boolean;
}

type ControlsInnerProps =
    & ControlsProps
    & WithTranslation
    & WithTranslationProps;

class Controls extends React.Component<ControlsInnerProps, ControlsState> {
    settingsRef?: HTMLButtonElement;
    langRef?: HTMLButtonElement;
    fullScreenRef?: HTMLButtonElement;
    editRef?: HTMLButtonElement;

    state: ControlsState = {
        showSettingsPopup: false,
        showLangPopup: false,
        showFullScreenTooltip: false,
        showEditTooltip: false,
        showLangTooltip: false,
        showSettingsTooltip: false,
    };

    componentDidMount(): void {
        document.addEventListener('keydown', this.onKeyDown);
    }

    componentDidUpdate(prevProps: ControlsProps) {
        const {i18n, lang} = this.props;
        if (prevProps.lang !== lang) {
            i18n.changeLanguage(lang);
        }
    }

    componentWillUnmount(): void {
        document.removeEventListener('keydown', this.onKeyDown);
    }

    render() {
        const {lang, i18n, className, verticalView} = this.props;

        if (i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }

        return (
            <div className={b({vertical: verticalView}, className)}>
                {this.renderSwitchers()}
                {this.renderEditLink()}
                {this.renderSettingsPopup()}
                {this.renderLangPopup()}
                {this.renderFullScreenTooltip()}
                {this.renderEditTooltip()}
                {this.renderSettingsTooltip()}
                {this.renderLangTooltip()}
            </div>
        );
    }

    private onKeyDown = (event: KeyboardEvent | React.KeyboardEvent) => {
        if (event.key === 'Escape' && this.props.fullScreen) {
            this.onChangeFullScreen();
        }
    };

    private renderEditLink() {
        const {vcsUrl, showEditControl} = this.props;
        const iconSize = 16;

        if (!showEditControl) {
            return null;
        }

        return (
            <React.Fragment>
                <div className={b('divider')}/>
                <a
                    href={vcsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <Button
                        buttonRef={this.makeSetRef('editRef')}
                        onMouseOver={this.makeTogglePopup('showEditTooltip', true)}
                        onMouseLeave={this.makeTogglePopup('showEditTooltip', false)}
                    >
                        <EditIcon width={iconSize} height={iconSize}/>
                    </Button>
                </a>
            </React.Fragment>
        );
    }

    private getPopupAlign() {
        return this.props.verticalView ? 'left' : 'bottom';
    }

    private renderLangPopup() {
        const {showLangPopup} = this.state;
        const {lang, onChangeLang} = this.props;


        if (!onChangeLang) {
            return null;
        }

        const popupWidth = 146;
        const ITEMS = [
            {value: Lang.Ru, text: 'Русский язык', icon: <RusIcon/>},
            {value: Lang.En, text: 'English', icon: <EngIcon/>},
        ];

        return (
            <Popup
                anchor={this.langRef}
                visible={showLangPopup}
                onOutsideClick={this.makeTogglePopup('showLangPopup', false)}
                popupWidth={popupWidth}
                align={this.getPopupAlign()}
            >
                <List
                    items={ITEMS}
                    value={lang}
                    onItemClick={(item) => {
                        this.onChangeLang(item.value as Lang);
                    }}
                />
            </Popup>
        );
    }

    private renderFullScreenTooltip() {
        const {t, fullScreen} = this.props;
        const {showFullScreenTooltip} = this.state;
        const fullScreenValue = fullScreen ? 'enabled' : 'disabled';

        if (!this.fullScreenRef) {
            return null;
        }

        return (
            <Popup
                anchor={this.fullScreenRef}
                visible={showFullScreenTooltip}
                onOutsideClick={this.makeTogglePopup('showFullScreenTooltip', false)}
                className={b('tooltip')}
                align={this.getPopupAlign()}
            >
                <span className={b('tooltip-text')}>
                    {t(`full-screen-text-${fullScreenValue}`)}
                </span>
            </Popup>
        );
    }

    private renderEditTooltip() {
        const {t, vcsType} = this.props;
        const {showEditTooltip} = this.state;

        return (
            <Popup
                anchor={this.editRef}
                visible={showEditTooltip}
                onOutsideClick={this.makeTogglePopup('showEditTooltip', false)}
                className={b('tooltip')}
                align={this.getPopupAlign()}
            >
                <span className={b('tooltip-text')}>
                    {t(`edit-text-${vcsType}`)}
                </span>
            </Popup>
        );
    }

    private renderSettingsTooltip() {
        const {t} = this.props;
        const {showSettingsTooltip} = this.state;

        return (
            <Popup
                anchor={this.settingsRef}
                visible={showSettingsTooltip}
                onOutsideClick={this.makeTogglePopup('showSettingsTooltip', false)}
                className={b('tooltip')}
                align={this.getPopupAlign()}
            >
                <span className={b('tooltip-text')}>
                    {t('settings-text')}
                </span>
            </Popup>
        );
    }

    private renderLangTooltip() {
        const {t} = this.props;
        const {showLangTooltip} = this.state;

        return (
            <Popup
                anchor={this.langRef}
                visible={showLangTooltip}
                onOutsideClick={this.makeTogglePopup('showLangTooltip', false)}
                className={b('tooltip')}
                align={this.getPopupAlign()}
            >
                <span className={b('tooltip-text')}>
                    {t('lang-text')}
                </span>
            </Popup>
        );
    }

    private renderSettingsPopup() {
        const {showSettingsPopup} = this.state;
        const {
            textSize,
            theme,
            wideFormat,
            showMiniToc,
            fullScreen,
            t,
            onChangeTheme,
        } = this.props;
        const popupWidth = 256;
        const ITEM_HEIGHT = 48;
        const allTextSizes = Object.values(TextSizes);
        const ITEMS = [
            {
                text: t('label_wide_format'),
                description: wideFormat
                    ? t('description_wide_format_enabled')
                    : t('description_wide_format_disabled'),
                control: (
                    <Tumbler
                        checked={wideFormat}
                        onChange={this.onChangeWideFormat}
                    />
                ),
            },
            {
                text: t('label_show_mini_toc'),
                description: t('description_show_mini_toc'),
                control: (
                    <Tumbler
                        disabled={fullScreen}
                        checked={showMiniToc}
                        onChange={this.onChangeShowMiniToc}
                    />
                ),
            },
            onChangeTheme ? {
                text: t('label_dark_theme'),
                description: Theme.Light === theme
                    ? t('description_disabled_dark_theme')
                    : t('description_enabled_dark_theme'),
                control: (
                    <Tumbler
                        checked={theme === Theme.Dark}
                        onChange={this.onChangeTheme}
                    />
                ),
            } : null,
            {
                text: t('label_text_size'),
                description: t(`description_${textSize}_text_size`),
                control: (
                    <div className={b('text-size-control')}>
                        {allTextSizes.map((textSizeKey) => (
                            <Button
                                key={textSizeKey}
                                className={b('text-size-button', {
                                    [textSizeKey]: true,
                                    active: textSize === textSizeKey,
                                })}
                                onClick={this.makeOnChangeTextSize(textSizeKey)}
                            >
                                A
                            </Button>
                        ))}
                    </div>
                ),
            },
        ].filter(Boolean);

        return (
            <Popup
                anchor={this.settingsRef}
                visible={showSettingsPopup}
                onOutsideClick={this.makeTogglePopup('showSettingsPopup', false)}
                popupWidth={popupWidth}
                align={this.getPopupAlign()}
            >
                <List
                    items={ITEMS as ListItem[]}
                    itemHeight={ITEM_HEIGHT}
                />
            </Popup>
        );
    }

    private renderSwitchers() {
        const {
            fullScreen,
            textSize,
            theme,
            wideFormat,
            showMiniToc,
            onChangeLang,
        } = this.props;
        const showMark = !isDefaultSettings({
            textSize,
            theme,
            wideFormat,
            showMiniToc,
        });

        return (
            <React.Fragment>
                <Button
                    onClick={this.onChangeFullScreen}
                    buttonRef={this.makeSetRef('fullScreenRef')}
                    onMouseOver={this.makeTogglePopup('showFullScreenTooltip', true)}
                    onMouseLeave={this.makeTogglePopup('showFullScreenTooltip', false)}
                >
                    {fullScreen ? <FullScreenClickedIcon/> : <FullScreenIcon/>}
                </Button>
                <Button
                    onClick={this.makeTogglePopup('showSettingsPopup')}
                    buttonRef={this.makeSetRef('settingsRef')}
                    onMouseOver={this.makeTogglePopup('showSettingsTooltip', true)}
                    onMouseLeave={this.makeTogglePopup('showSettingsTooltip', false)}
                >
                    {showMark ? <SettingsMarkedIcon/> : <SettingsIcon/>}
                </Button>
                {onChangeLang ?
                    <Button
                        onClick={this.makeTogglePopup('showLangPopup')}
                        buttonRef={this.makeSetRef('langRef')}
                        onMouseOver={this.makeTogglePopup('showLangTooltip', true)}
                        onMouseLeave={this.makeTogglePopup('showLangTooltip', false)}
                    >
                        <LangSwitcherIcon/>
                    </Button> : null
                }
            </React.Fragment>
        );
    }

    private onChangeLang = (lang: Lang) => {
        const {onChangeLang} = this.props;

        if (typeof onChangeLang === 'function') {
            onChangeLang(lang);
        }
    };

    private onChangeFullScreen = () => {
        const {fullScreen, onChangeFullScreen} = this.props;

        if (typeof onChangeFullScreen === 'function') {
            onChangeFullScreen(!fullScreen);
        }
    };

    private onChangeWideFormat = () => {
        const {wideFormat, onChangeWideFormat} = this.props;

        if (typeof onChangeWideFormat === 'function') {
            onChangeWideFormat(!wideFormat);
        }
    };

    private onChangeShowMiniToc = () => {
        const {showMiniToc, onChangeShowMiniToc} = this.props;

        if (typeof onChangeShowMiniToc === 'function') {
            onChangeShowMiniToc(!showMiniToc);
        }
    };

    private makeOnChangeTextSize = (textSize: TextSizes) => () => {
        const {onChangeTextSize} = this.props;

        if (typeof onChangeTextSize === 'function') {
            onChangeTextSize(textSize);
        }
    };

    private onChangeTheme = () => {
        const {theme, onChangeTheme} = this.props;

        if (typeof onChangeTheme === 'function') {
            onChangeTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark);
        }
    };

    private makeTogglePopup: ChangeHandler<ControlsState> = (field, value?: boolean) => () => {
        const oldValue = this.state[field];
        const newValue = value ?? !oldValue;

        this.setState({[field]: newValue} as unknown as ControlsState);
    };

    private makeSetRef = <K extends keyof Controls>(field: K) => (ref: HTMLButtonElement) => {
        this[field] = ref;
    };
}

export default withTranslation('controls')(Controls);
