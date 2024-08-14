import React, {ReactNode, useState} from 'react';

import {ChevronDown, ChevronLeft, ChevronRight, ThumbsDown, ThumbsUp} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {useTranslation} from '../../hooks';
import {simplifyUrl} from '../../utils';
import {HTML} from '../HTML';

import {YandexGPTLogo} from './YandexGPTLogo';
import {useCarousel} from './useCarousel';

import './GenerativeSearchAnswer.scss';

const b = block('generative-search-answer');

interface Message {
    content: string;
    role: string;
}

export interface IGenerativeSearch {
    message: Message;
    links: string[];
    titles: string[];
    final_search_query: string;
    is_answer_rejected: boolean;
    is_bullet_answer: boolean;
    search_reqid: string;
    reqid: string;
}

interface IGenerativeSearchSource {
    links: string[];
    titles: string[];
}

const GenerativeSearchDisclaimer: React.FC = () => {
    const {t} = useTranslation('generative-search');

    return (
        <div className={b('disclaimer')}>
            <p>{t<string>('generative-search_disclaimer')}</p>
        </div>
    );
};

const GenerativeSearchSource: React.FC<IGenerativeSearchSource> = ({links, titles}) => {
    const {
        containerRef,
        showPrevButton,
        showNextButton,
        nextSlide,
        prevSlide,
        updateButtonsVisibility,
    } = useCarousel();

    const {t} = useTranslation('generative-search');

    return (
        <div className={b('sources')}>
            <h3>{t<string>('generative-search_sources_title')}</h3>

            <div className={b('carousel-wrapper')}>
                <div
                    className={b('carousel')}
                    ref={containerRef}
                    onScroll={updateButtonsVisibility}
                >
                    {links.map((link, index) => (
                        <div key={index} className={b('card')}>
                            <p className={b('title')}>{titles[index]}</p>
                            <a className={b('link')} href={link}>
                                {simplifyUrl(link)}
                            </a>
                            <span className={b('card-number')}>{index + 1}</span>
                        </div>
                    ))}
                </div>

                <div className={b('controls')}>
                    {showPrevButton && (
                        <ChevronLeft
                            width={20}
                            height={20}
                            className={b('chevron-left')}
                            onClick={prevSlide}
                        >
                            left
                        </ChevronLeft>
                    )}
                    {showNextButton && (
                        <ChevronRight
                            width={20}
                            height={20}
                            className={b('chevron-right')}
                            onClick={nextSlide}
                        >
                            right
                        </ChevronRight>
                    )}
                </div>
            </div>
        </div>
    );
};

const GenerativSearchHeader = () => {
    const {t} = useTranslation('generative-search');

    return (
        <div className={b('header')}>
            <h4>{t<string>('generative-search_header_title')}</h4>
            <p className={b('yandexgpt-mention')}>
                {t<string>('generative-search_header_text')}
                <span className={b('yandexgpt-logo')}>
                    <YandexGPTLogo />
                    YandexGPT
                </span>
            </p>
        </div>
    );
};

interface IGenerativeSearchWrapper {
    children: ReactNode;
    isExpanded?: boolean;
}

const GenerativeSearchWrapperBlock: React.FC<IGenerativeSearchWrapper> = ({
    children,
    isExpanded,
}) => {
    return (
        <>
            <div className={b('container', {expanded: !isExpanded})}>
                <div className={b('gradient-background')}></div>
                <GenerativSearchHeader />
                {children}
            </div>
        </>
    );
};

const GenerativeSearchWithoutContentBlock = () => {
    const {t} = useTranslation('generative-search');

    return (
        <GenerativeSearchWrapperBlock>
            <div className={b('content')}>
                <h4>{t<string>('generative-search_not_found_title')}</h4>
                <p>{t<string>('generative-search_not_found_text')}</p>
            </div>
        </GenerativeSearchWrapperBlock>
    );
};

const GenerativeSearchErrorBlock = () => {
    const {t} = useTranslation('generative-search');

    return (
        <GenerativeSearchWrapperBlock>
            <div className={b('content')}>
                <h4>{t<string>('generative-search_something_went_wrong')}</h4>
            </div>
        </GenerativeSearchWrapperBlock>
    );
};

const GenerativeSearchLoadingBlock = () => {
    const {t} = useTranslation('generative-search');

    return (
        <div className={b('loader')}>
            <div className={b('gradient-background')}></div>
            <YandexGPTLogo width={20} height={20} />
            <h2>{t<string>('generative-search_loading_title')}</h2>
        </div>
    );
};

interface IGenerativeSearchI {
    generativeSearchData: IGenerativeSearch;
    generativeSearchLoading: boolean;
    generativeSearchError: boolean;
}

const GenerativeSearchAnswer: React.FC<IGenerativeSearchI> = ({
    generativeSearchData,
    generativeSearchLoading,
    generativeSearchError,
}) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    const {t} = useTranslation('generative-search');

    const handleRatingClick = () => {
        setIsSubmitted(!isSubmitted);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    if (generativeSearchLoading) {
        <GenerativeSearchLoadingBlock />;
    }

    if (generativeSearchError) {
        return <GenerativeSearchErrorBlock />;
    }

    const {message, links, titles} = generativeSearchData;

    const {content} = message;

    if (content.startsWith('Не удалось найти информацию')) {
        return <GenerativeSearchWithoutContentBlock />;
    }

    return (
        <div>
            <GenerativeSearchWrapperBlock isExpanded={isExpanded}>
                <div className={b('content')}>
                    <HTML>{content}</HTML>
                </div>
                <GenerativeSearchSource {...{links, titles}} />
                <div className={b('rating-container')}>
                    {isSubmitted ? (
                        <p>{t<string>('generative-search_feedback_answer')}</p>
                    ) : (
                        <>
                            <Button
                                view="outlined"
                                size="l"
                                className={b('rating-button')}
                                onClick={handleRatingClick}
                            >
                                <Icon data={ThumbsUp} size={15} />
                                {t<string>('generative-search_good_response')}
                            </Button>
                            <Button
                                view="outlined"
                                size="l"
                                className={b('rating-button')}
                                onClick={handleRatingClick}
                            >
                                <Icon data={ThumbsDown} size={15} />
                                {t<string>('generative-search_bad_response')}
                            </Button>
                        </>
                    )}
                </div>
                {!isExpanded && (
                    <div className={b('expanded-bottom')}>
                        <Button
                            view="normal-contrast"
                            size="l"
                            className={b('toggle-button')}
                            onClick={toggleExpand}
                        >
                            {t<string>('generative-search_expand')}
                            <Icon data={ChevronDown} size={15} />
                        </Button>
                    </div>
                )}
            </GenerativeSearchWrapperBlock>
            <GenerativeSearchDisclaimer />
        </div>
    );
};

export default GenerativeSearchAnswer;
