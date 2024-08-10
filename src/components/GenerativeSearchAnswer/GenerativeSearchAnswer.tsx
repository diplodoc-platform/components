import React, {ReactNode, useState} from 'react';

import {ChevronDown, ThumbsDown, ThumbsUp} from '@gravity-ui/icons';
import {Button, Icon, Link, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import MarkdownIt from 'markdown-it';

import {YandexGPTLogo} from './YandexGPTLogo';

import './GenerativeSearchAnswer.scss';

const md = new MarkdownIt();

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

const replaceReferencesWithLinks = (parsedHtml: string, links: string[]) => {
    return parsedHtml.replace(/\[(\d+)\]/g, (match, index) => {
        const link = links[index - 1];
        return link ? `<a href="${link}">${index}</a>` : match;
    });
};

const GenerativeSearchDisclaimer: React.FC = () => {
    return (
        <div className={b('disclaimer')}>
            <Text>
                Ответ сформирован нейросетью YandexGPT на основе документации сервиса. В нём могут
                быть неточности, проверить информацию можно поссылкам на источники.
            </Text>
        </div>
    );
};

const GenerativeSearchSource: React.FC<IGenerativeSearchSource> = ({links, titles}) => {
    const combinedSearchInfo = links.map((link, index) => ({url: link, title: titles[index]}));

    return (
        <div className={b('sources')}>
            <Text>Источники</Text>
            <div className={b('carousel')}>
                {combinedSearchInfo.map((item, index) => (
                    <div key={index} className={b('card')}>
                        <Text className={b('title')}>{item.title}</Text>

                        <div className={b('card-wrapper')}>
                            <Link className={b('link')} view="normal" href={item.url}>
                                {item.url}
                            </Link>
                            <Text className={b('card-number')}>{index + 1}</Text>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GenerativSearchHeader = () => {
    return (
        <div className={b('header')}>
            <h4>Быстрый ответ</h4>
            <p className={b('yandexgpt-mention')}>
                Создан с помощью нейросети
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
    return (
        <GenerativeSearchWrapperBlock>
            <div className={b('content')}>
                <h4>Не удалось найти информацию</h4>
                <p>Сформулируйте запрос иначе или спросите что-нибудь ещё.</p>
            </div>
        </GenerativeSearchWrapperBlock>
    );
};

const GenerativeSearchErrorBlock = () => {
    return (
        <GenerativeSearchWrapperBlock>
            <div className={b('content')}>
                <h4>Что-то пошло не так. Попробуйте ещё раз или обновите страницу.</h4>
            </div>
        </GenerativeSearchWrapperBlock>
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
    const [isExpanded, setIsExpanded] = useState(false);

    const handleRatingClick = () => {
        setIsSubmitted(!isSubmitted);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    if (generativeSearchLoading) {
        return <GenerativeSearchWithoutContentBlock />;
    }

    if (generativeSearchError) {
        return <GenerativeSearchErrorBlock />;
    }

    const {message, links, titles} = generativeSearchData;

    const {content} = message;
    const parserdContent = md.render(content);
    const updatedHtmlContent = replaceReferencesWithLinks(parserdContent, links);

    return (
        <div>
            <GenerativeSearchWrapperBlock isExpanded={isExpanded}>
                <div
                    className={b('content')}
                    dangerouslySetInnerHTML={{__html: updatedHtmlContent}}
                ></div>
                <GenerativeSearchSource {...{links, titles}} />
                <div className={b('rating-container')}>
                    {isSubmitted ? (
                        <Text variant="body-1">Спасибо, что помогаете делать технологию лучше</Text>
                    ) : (
                        <>
                            <Button
                                view="outlined"
                                size="l"
                                className={b('rating-button')}
                                onClick={handleRatingClick}
                            >
                                <Icon data={ThumbsUp} size={15} />
                                Хороший ответ
                            </Button>
                            <Button
                                view="outlined"
                                size="l"
                                className={b('rating-button')}
                                onClick={handleRatingClick}
                            >
                                <Icon data={ThumbsDown} size={15} />
                                Плохой ответ
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
                            Развернуть
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
