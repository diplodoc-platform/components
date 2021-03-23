import React from 'react';
import block from 'bem-cn-lite';
import {withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';

import {List, ListItem} from '../List';
import {Popup, PopupPosition} from '../Popup';
import {Tumbler} from '../Tumbler';
import {ControlButton} from '../ControlButton';
import {Control} from '../Control';
import {Feedback, FeedbackView} from '../Feedback';

import FullScreenIcon from '../../../assets/icons/full-screen.svg';
import FullScreenClickedIcon from '../../../assets/icons/full-screen-clicked.svg';
import SettingsIcon from '../../../assets/icons/cog.svg';
import LangSwitcherIcon from '../../../assets/icons/lang.svg';
import RusIcon from '../../../assets/icons/rus.svg';
import EngIcon from '../../../assets/icons/eng.svg';
import EditIcon from '../../../assets/icons/edit.svg';
import SinglePageIcon from '../../../assets/icons/single-page.svg';
import SinglePageClickedIcon from '../../../assets/icons/single-page-clicked.svg';

import {Lang, TextSizes, Theme, FeedbackSendData, ControlSizes} from '../../models';
import {ChangeHandler} from '../../utils';

import './Controls.scss';

const b = block('dc-controls');

export interface ControlsProps {
    lang: Lang;
    fullScreen: boolean;
    singlePage: boolean;
    wideFormat: boolean;
    showMiniToc: boolean;
    theme: Theme;
    textSize: TextSizes;
    vcsUrl: string;
    vcsType: string;
    showEditControl: boolean;
    isLiked: boolean;
    isDisliked: boolean;
    dislikeVariants: string[];
    onChangeLang?: (lang: Lang) => void;
    onChangeFullScreen?: (value: boolean) => void;
    onChangeSinglePage?: (value: boolean) => void;
    onChangeWideFormat?: (value: boolean) => void;
    onChangeShowMiniToc?: (value: boolean) => void;
    onChangeTheme?: (theme: Theme) => void;
    onChangeTextSize?: (textSize: TextSizes) => void;
    onSendFeedback?: (data: FeedbackSendData) => void;
    className?: string;
    isVerticalView: boolean;
    controlSize?: ControlSizes;
}

interface ControlsState {
    showSettingsPopup: boolean;
    showLangPopup: boolean;
}

type ControlsInnerProps =
    & ControlsProps
    & WithTranslation
    & WithTranslationProps;

class Controls extends React.Component<ControlsInnerProps, ControlsState> {
    settingsRef?: HTMLButtonElement;
    langRef?: HTMLButtonElement;
    singlePageRef?: HTMLButtonElement;

    state: ControlsState = {
        showSettingsPopup: false,
        showLangPopup: false,
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
        const {lang, i18n, className, isVerticalView} = this.props;

        if (i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }

        return (
            <div className={b({vertical: isVerticalView}, className)}>
                {this.renderCommonControls()}
                {this.renderEditLink()}
                {this.renderFeedbackControls()}
                {this.renderSettingsPopup()}
                {this.renderLangPopup()}
            </div>
        );
    }

    private onKeyDown = (event: KeyboardEvent | React.KeyboardEvent) => {
        if (event.key === 'Escape' && this.props.fullScreen) {
            this.onChangeFullScreen();
        }
    };

    private renderEditLink() {
        const {
            vcsUrl,
            vcsType,
            showEditControl,
            singlePage,
            isVerticalView,
            controlSize,
            t,
        } = this.props;

        if (!showEditControl || singlePage) {
            return null;
        }

        return (
            <React.Fragment>
                <div className={b('divider')}/>
                <a
                    href={vcsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={b('control')}
                >
                    <Control
                        size={controlSize}
                        onClick={this.onChangeFullScreen}
                        className={b('control')}
                        isVerticalView={isVerticalView}
                        tooltipText={t(`edit-text-${vcsType}`)}
                        icon={EditIcon}
                    />
                </a>
            </React.Fragment>
        );
    }

    private getPopupPosition() {
        return this.props.isVerticalView ? PopupPosition.left : PopupPosition.bottom;
    }

    private renderLangPopup() {
        const {showLangPopup} = this.state;
        const {lang, onChangeLang} = this.props;


        if (!onChangeLang) {
            return null;
        }

        const popupWidth = 146;
        const ITEMS = [
            {value: Lang.Ru, text: 'Русский', icon: <RusIcon/>},
            {value: Lang.En, text: 'English', icon: <EngIcon/>},
        ];

        return (
            <Popup
                anchor={this.langRef}
                visible={showLangPopup}
                onOutsideClick={this.makeTogglePopup('showLangPopup', false)}
                popupWidth={popupWidth}
                position={this.getPopupPosition()}
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

    private renderSettingsPopup() {
        const {showSettingsPopup} = this.state;
        const {
            textSize,
            theme,
            wideFormat,
            showMiniToc,
            fullScreen,
            singlePage,
            t,
            onChangeTheme,
            onChangeWideFormat,
            onChangeShowMiniToc,
            onChangeTextSize,
        } = this.props;
        const popupWidth = 256;
        const ITEM_HEIGHT = 48;
        const allTextSizes = Object.values(TextSizes);
        const showMiniTocDisabled = fullScreen || singlePage;
        const ITEMS = [
            onChangeWideFormat ? {
                text: t('label_wide_format'),
                description: t(`description_wide_format_${wideFormat ? 'enabled' : 'disabled'}`),
                control: (
                    <Tumbler
                        checked={wideFormat}
                        onChange={this.onChangeWideFormat}
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
                        onChange={this.onChangeShowMiniToc}
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
                        onChange={this.onChangeTheme}
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
                                }, b('control'))}
                                onClick={this.makeOnChangeTextSize(textSizeKey)}
                            >
                                A
                            </ControlButton>
                        ))}
                    </div>
                ),
            } : null,
        ].filter(Boolean);

        return (
            <Popup
                anchor={this.settingsRef}
                visible={showSettingsPopup}
                onOutsideClick={this.makeTogglePopup('showSettingsPopup', false)}
                popupWidth={popupWidth}
                position={this.getPopupPosition()}
            >
                <List
                    items={ITEMS as ListItem[]}
                    itemHeight={ITEM_HEIGHT}
                />
            </Popup>
        );
    }

    private isSettingControlVisible = () => {
        const {
            onChangeWideFormat,
            onChangeTheme,
            onChangeShowMiniToc,
            onChangeTextSize,
        } = this.props;

        return (
            onChangeWideFormat ||
            onChangeTheme ||
            onChangeShowMiniToc ||
            onChangeTextSize
        );
    };

    private renderCommonControls() {
        const {
            fullScreen,
            singlePage,
            onChangeFullScreen,
            onChangeLang,
            onChangeSinglePage,
            isVerticalView,
            controlSize,
            t,
        } = this.props;
        const fullScreenValue = fullScreen ? 'enabled' : 'disabled';

        return (
            <React.Fragment>
                {onChangeFullScreen ?
                    <Control
                        size={controlSize}
                        onClick={this.onChangeFullScreen}
                        className={b('control')}
                        isVerticalView={isVerticalView}
                        tooltipText={t(`full-screen-text-${fullScreenValue}`)}
                        icon={fullScreen ? FullScreenClickedIcon : FullScreenIcon}
                    /> : null
                }
                {this.isSettingControlVisible() ?
                    <Control
                        size={controlSize}
                        onClick={this.makeTogglePopup('showSettingsPopup')}
                        className={b('control')}
                        isVerticalView={isVerticalView}
                        tooltipText={t('settings-text')}
                        setRef={this.makeSetRef('settingsRef')}
                        icon={SettingsIcon}
                    /> : null
                }
                {onChangeLang ?
                    <Control
                        size={controlSize}
                        onClick={this.makeTogglePopup('showLangPopup')}
                        className={b('control')}
                        isVerticalView={isVerticalView}
                        tooltipText={t('lang-text')}
                        setRef={this.makeSetRef('langRef')}
                        icon={LangSwitcherIcon}
                    /> : null
                }
                {onChangeSinglePage ?
                    <Control
                        size={controlSize}
                        onClick={this.onChangeSinglePage}
                        className={b('control')}
                        isVerticalView={isVerticalView}
                        tooltipText={t(`single-page-text-${singlePage ? 'enabled' : 'disabled'}`)}
                        setRef={this.makeSetRef('singlePageRef')}
                        icon={singlePage ? SinglePageClickedIcon : SinglePageIcon}
                    /> : null
                }
            </React.Fragment>
        );
    }

    private renderFeedbackControls = () => {
        const {
            lang,
            singlePage,
            onSendFeedback,
            isLiked,
            isDisliked,
            dislikeVariants,
            isVerticalView,
        } = this.props;

        if (singlePage || !onSendFeedback) {
            return null;
        }

        return (
            <React.Fragment>
                <div className={b('divider')}/>
                <Feedback
                    lang={lang}
                    singlePage={singlePage}
                    isLiked={isLiked}
                    isDisliked={isDisliked}
                    dislikeVariants={dislikeVariants}
                    onSendFeedback={onSendFeedback}
                    isVerticalView={isVerticalView}
                    view={FeedbackView.regular}
                    classNameControl={b('control')}
                />
            </React.Fragment>
        );
    };

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

    private onChangeSinglePage = () => {
        const {singlePage, onChangeSinglePage} = this.props;

        if (typeof onChangeSinglePage === 'function') {
            onChangeSinglePage(!singlePage);
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
