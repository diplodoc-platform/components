import React from 'react';
import block from 'bem-cn-lite';
import {withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';

import {Control} from '../Control';
import {Feedback, FeedbackView} from '../Feedback';
import {
    FullScreenControl,
    SettingsControl,
    SinglePageControl,
    LangControl,
    DividerControl,
} from './';

import EditIcon from '../../../assets/icons/edit.svg';

import {Lang, TextSizes, Theme, FeedbackSendData, ControlSizes} from '../../models';

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


type ControlsInnerProps =
    & ControlsProps
    & WithTranslation
    & WithTranslationProps;

class Controls extends React.Component<ControlsInnerProps> {
    componentDidUpdate(prevProps: ControlsProps) {
        const {i18n, lang} = this.props;

        if (prevProps.lang !== lang) {
            i18n.changeLanguage(lang);
        }
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
            </div>
        );
    }

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
                <DividerControl
                    size={controlSize}
                    isVerticalView={!isVerticalView}
                    className={b('divider')}
                />
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

    private renderCommonControls() {
        const {
            fullScreen,
            singlePage,
            theme,
            wideFormat,
            showMiniToc,
            textSize,
            onChangeFullScreen,
            onChangeTheme,
            onChangeShowMiniToc,
            onChangeTextSize,
            onChangeWideFormat,
            onChangeLang,
            onChangeSinglePage,
            isVerticalView,
            controlSize,
            lang,
        } = this.props;

        return (
            <React.Fragment>
                <FullScreenControl
                    lang={lang}
                    size={controlSize}
                    value={fullScreen}
                    onChange={onChangeFullScreen}
                    className={b('control')}
                    isVerticalView={isVerticalView}
                />
                <SettingsControl
                    lang={lang}
                    size={controlSize}
                    theme={theme}
                    wideFormat={wideFormat}
                    showMiniToc={showMiniToc}
                    textSize={textSize}
                    onChangeTheme={onChangeTheme}
                    onChangeShowMiniToc={onChangeShowMiniToc}
                    onChangeTextSize={onChangeTextSize}
                    onChangeWideFormat={onChangeWideFormat}
                    className={b('control')}
                    isVerticalView={isVerticalView}
                />
                <LangControl
                    lang={lang}
                    size={controlSize}
                    onChangeLang={onChangeLang}
                    className={b('control')}
                    isVerticalView={isVerticalView}
                />
                <SinglePageControl
                    lang={lang}
                    size={controlSize}
                    value={singlePage}
                    onChange={onChangeSinglePage}
                    className={b('control')}
                    isVerticalView={isVerticalView}
                />
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
                <DividerControl className={b('divider')} isVerticalView={!isVerticalView}/>
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

    private onChangeFullScreen = () => {
        const {fullScreen, onChangeFullScreen} = this.props;

        if (typeof onChangeFullScreen === 'function') {
            onChangeFullScreen(!fullScreen);
        }
    };
}

export default withTranslation('controls')(Controls);
