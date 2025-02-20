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
    VersionControl,
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
    onChangeVersion?: (version: string) => void;
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
    versions?: string[];
    version?: string;
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

function hasVersions(versions?: string[]) {
    return versions?.length && versions.length > 1;
}

function getControlFlags(props: ControlsProps) {
    const {
        singlePage,
        hideEditControl,
        hideFeedbackControls,
        onChangeVersion,
        onChangeFullScreen,
        onChangeTheme,
        onChangeShowMiniToc,
        onChangeTextSize,
        onChangeWideFormat,
        onChangeLang,
        onChangeSinglePage,
        onSendFeedback,
        onSubscribe,
        version,
        versions,
        lang,
        langs,
        pdfLink,
        vcsUrl,
    } = props;

    const withVersionControl = Boolean(version && hasVersions(versions) && onChangeVersion);
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

    return {
        withVersionControl,
        withFullscreenControl,
        withSettingsControl,
        withLangControl,
        withSinglePageControl,
        withPdfControl,
        withEditControl,
        withFeedbackControl,
        withSubscribeControls,
    };
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
        textSize,
        onChangeVersion,
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
        version,
        versions,
        lang,
        langs,
        pdfLink,
        vcsUrl,
        vcsType,
        isLiked,
        isDisliked,
    } = props;

    const controlFlags = getControlFlags(props);

    const controls = [
        controlFlags.withVersionControl && (
            <VersionControl
                version={version ?? ''}
                versions={versions ?? []}
                onChange={onChangeVersion ?? ((_version: string) => {})}
            />
        ),
        controlFlags.withFullscreenControl && (
            <FullScreenControl
                key="fullscreen-control"
                value={fullScreen}
                onChange={onChangeFullScreen}
            />
        ),
        controlFlags.withSettingsControl && (
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
        controlFlags.withLangControl && (
            <LangControl
                key="lang-control"
                lang={lang as Lang}
                langs={langs}
                onChangeLang={onChangeLang as Defined['onChangeLang']}
            />
        ),
        controlFlags.withSinglePageControl && (
            <SinglePageControl
                key="single-page-control"
                value={singlePage}
                onChange={onChangeSinglePage as Defined['onChangeSinglePage']}
            />
        ),
        controlFlags.withPdfControl && (
            <PdfControl key="pdf-control" pdfLink={pdfLink as Defined['pdfLink']} />
        ),
        '---',
        controlFlags.withEditControl && (
            <EditControl
                key="edit-control"
                vcsUrl={vcsUrl as Defined['vcsUrl']}
                vcsType={vcsType as Defined['vcsType']}
                onClick={onEditClick}
            />
        ),
        '---',
        controlFlags.withFeedbackControl && (
            <Feedback
                key="feedback-control"
                isLiked={isLiked}
                isDisliked={isDisliked}
                onSendFeedback={onSendFeedback as Defined['onSendFeedback']}
                view={FeedbackView.Regular}
            />
        ),
        '---',
        controlFlags.withSubscribeControls && (
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
