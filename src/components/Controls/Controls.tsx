import React, {memo, useContext} from 'react';
import block from 'bem-cn-lite';

import {FeedbackSendData, Lang, SubscribeData, TextSizes, Theme} from '../../models';
import {Feedback, FeedbackView} from '../Feedback';
import {Subscribe, SubscribeView} from '../Subscribe';

import {ControlsLayoutContext} from './ControlsLayout';

import {
    DividerControl,
    EditControl,
    FullScreenControl,
    LangControl,
    PdfControl,
    SettingsControl,
    SinglePageControl,
} from './';

// eslint-disable-next-line import/order
import './Controls.scss';

const b = block('dc-controls');

export interface ControlsProps {
    lang?: `${Lang}` | Lang;
    langs?: (`${Lang}` | Lang)[];
    fullScreen?: boolean;
    singlePage?: boolean;
    wideFormat?: boolean;
    showMiniToc?: boolean;
    theme?: Theme;
    textSize?: TextSizes;
    vcsUrl?: string;
    vcsType?: string;
    isLiked?: boolean;
    isDisliked?: boolean;
    onChangeLang?: (lang: `${Lang}` | Lang) => void;
    onChangeFullScreen?: (value: boolean) => void;
    onChangeSinglePage?: (value: boolean) => void;
    onChangeWideFormat?: (value: boolean) => void;
    onChangeShowMiniToc?: (value: boolean) => void;
    onChangeTheme?: (theme: Theme) => void;
    onChangeTextSize?: (textSize: TextSizes) => void;
    onSendFeedback?: (data: FeedbackSendData) => void;
    onSubscribe?: (data: SubscribeData) => void;
    onEditClick?: () => void;
    pdfLink?: string;
    className?: string;
    hideEditControl?: boolean;
    hideFeedbackControls?: boolean;
}

type Defined = {
    [P in keyof ControlsProps]-?: ControlsProps[P];
};

function hasLangs(langs?: (`${Lang}` | Lang)[]) {
    return langs?.length && langs.length > 1;
}

const Controls = memo<ControlsProps>((props) => {
    const {isVerticalView} = useContext(ControlsLayoutContext);
    const {
        className,
        fullScreen,
        singlePage,
        theme,
        wideFormat,
        showMiniToc,
        hideEditControl,
        hideFeedbackControls,
        textSize,
        onChangeFullScreen,
        onChangeTheme,
        onChangeShowMiniToc,
        onChangeTextSize,
        onChangeWideFormat,
        onChangeLang,
        onChangeSinglePage,
        onSendFeedback,
        onSubscribe,
        onEditClick,
        lang,
        langs,
        pdfLink,
        vcsUrl,
        vcsType,
        isLiked,
        isDisliked,
    } = props;

    const withFullscreenControl = Boolean(onChangeFullScreen);
    const withSettingsControl = Boolean(
        onChangeWideFormat || onChangeTheme || onChangeShowMiniToc || onChangeTextSize,
    );
    const withLangControl = Boolean(lang && hasLangs(langs) && onChangeLang);
    const withSinglePageControl = Boolean(onChangeSinglePage);
    const withPdfControl = Boolean(pdfLink);
    const withEditControl = Boolean(!singlePage && !hideEditControl && vcsUrl);
    const withFeedbackControl = Boolean(!singlePage && !hideFeedbackControls && onSendFeedback);
    const withSubscribeControls = Boolean(!singlePage && onSubscribe);

    const controls = [
        withFullscreenControl && (
            <FullScreenControl
                key="fullscreen-control"
                value={fullScreen}
                onChange={onChangeFullScreen}
            />
        ),
        withSettingsControl && (
            <SettingsControl
                key="settings-control"
                theme={theme}
                wideFormat={wideFormat}
                showMiniToc={showMiniToc}
                textSize={textSize}
                onChangeTheme={onChangeTheme}
                onChangeShowMiniToc={onChangeShowMiniToc}
                onChangeTextSize={onChangeTextSize}
                onChangeWideFormat={onChangeWideFormat}
            />
        ),
        withLangControl && (
            <LangControl
                key="lang-control"
                lang={lang as Lang}
                langs={langs}
                onChangeLang={onChangeLang as Defined['onChangeLang']}
            />
        ),
        withSinglePageControl && (
            <SinglePageControl
                key="single-page-control"
                value={singlePage}
                onChange={onChangeSinglePage as Defined['onChangeSinglePage']}
            />
        ),
        withPdfControl && <PdfControl key="pdf-control" pdfLink={pdfLink as Defined['pdfLink']} />,
        '---',
        withEditControl && (
            <EditControl
                key="edit-control"
                vcsUrl={vcsUrl as Defined['vcsUrl']}
                vcsType={vcsType as Defined['vcsType']}
                onClick={onEditClick}
            />
        ),
        '---',
        withFeedbackControl && (
            <Feedback
                key="feedback-control"
                isLiked={isLiked}
                isDisliked={isDisliked}
                onSendFeedback={onSendFeedback as Defined['onSendFeedback']}
                view={FeedbackView.Regular}
            />
        ),
        '---',
        withSubscribeControls && (
            <Subscribe
                key="subscribe-control"
                onSubscribe={onSubscribe as Defined['onSubscribe']}
                view={SubscribeView.Regular}
            />
        ),
    ]
        .filter(Boolean)
        .reduce((result, control, index, array) => {
            if (control === '---') {
                if (array[index - 1] && array[index + 1] && array[index + 1] !== '---') {
                    result.push(
                        <DividerControl key={'divider-' + index} className={b('divider')} />,
                    );
                }
            } else {
                result.push(control as React.ReactElement);
            }

            return result;
        }, [] as React.ReactElement[]);

    if (!controls.length) {
        return null;
    }

    return <div className={b({vertical: isVerticalView}, className)}>{controls}</div>;
});

Controls.displayName = 'DCControls';

export default Controls;
