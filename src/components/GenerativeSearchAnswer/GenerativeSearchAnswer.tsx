import React from 'react';

import {Card, Link, Text} from '@gravity-ui/uikit';
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

const GenerativeSearchSource: React.FC<IGenerativeSearchSource> = ({links, titles}) => {
    const combinedSearchInfo = links.map((link, index) => ({url: link, title: titles[index]}));

    return (
        <div className={b('sources')}>
            <h5>Источники</h5>
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

const GenerativeSearchAnswer: React.FC<IGenerativeSearch> = ({
    message,
    links,
    titles,
    // final_search_query,
    // is_answer_rejected,
    // is_bullet_answer,
    // search_reqid,
    // reqid,
}) => {
    const {content} = message;
    const parserdContent = md.render(content);
    const updatedHtmlContent = replaceReferencesWithLinks(parserdContent, links);

    return (
        <>
            <Card className={b('container')}>
                <Card className={b('search-container')} view="filled">
                    <div className={b('header')}>
                        <h4>Быстрый поиск</h4>
                        <p className={b('yandexgpt-mention')}>
                            Создан с помощью нейросети
                            <span className={b('yandexgpt-logo')}>
                                <YandexGPTLogo />
                                YandexGPT
                            </span>
                        </p>
                    </div>
                    <Card className={b('content')} view="filled">
                        <div dangerouslySetInnerHTML={{__html: updatedHtmlContent}} />
                    </Card>
                    <GenerativeSearchSource {...{links, titles}} />
                </Card>
            </Card>
            <div className={b('disclaimer')}>
                Ответ сформирован нейросетью YandexGPT на основе документации сервиса. В нём могут
                быть неточности, проверить информацию можно поссылкам на источники.
            </div>
        </>
    );
};

export default GenerativeSearchAnswer;
