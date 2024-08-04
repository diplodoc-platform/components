import React from 'react';

import {Card, Link, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {YandexGPTLogo} from './YandexGPTLogo';

import './GenerativeSearchAnswer.scss';

const b = block('generative-search-answer');

const titles = [
    'Быстрый старт | Diplodoc',
    'Базовая разметка | Diplodoc',
    'Сборка | Diplodoc',
    'Yandex Flavored Markdown | Diplodoc',
    'Main scenarios for Diplodoc usage | Diplodoc',
];

const links = [
    '.../docs/ru/quickstart',
    '.../docs/ru/syntax/base',
    '.../docs/ru/tools/docs/build',
    '.../docs/ru/index-yfm',
    '.../docs/en/how-it-work',
];

const combinedData = titles.map((title, index) => ({
    title,
    url: links[index],
}));

const GenerativeSearchAnswer: React.FC = () => {
    return (
        <>
            <Card className={b('container')} view="filled">
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
                    <p>Чтобы работать с YFM, можно следовать таким рекомендациям:</p>
                    <ul>
                        <li>
                            <p>
                                <strong>Создайте проект</strong>. [1] Он состоит из нескольких
                                конфигурационных файлов и страниц с контентом. [1]
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>Запустите сборку проекта</strong>. [1][3] Для этого
                                используйте инструмент Builder в командной строке. [1] Укажите
                                обязательные ключи запуска:{' '}
                                <strong>
                                    input (–i) — путь до директории проекта, output (–o) — путь до
                                    директории для выходных данных (статических HTML)
                                </strong>
                                . [1][3] Пример команды:{' '}
                                <code>yfm -i ./input-folder -o ./ouput-folder</code>. [1]
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>Настройте сборку в YFM</strong>. [3] Для этого при
                                выполнении команды yfm укажите ключ запуска{' '}
                                <strong>--output-format=md</strong>. [3] Сборка в YFM позволяет
                                использовать вставки и условия видимости разделов, условия
                                отображения контента и подстановки переменных. [3]
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>Используйте готовый проект</strong>. [1] Проекты в формате
                                HTML можно использовать локально или разместить на хостинге, в
                                GitHub Pages или S3. [1][4]
                            </p>
                        </li>
                    </ul>
                </Card>
                <div className={b('sources')}>
                    <h5>Источники</h5>
                    <div className={b('carousel')}>
                        {combinedData.map((item, index) => (
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
            </Card>
            <div className={b('disclaimer')}>
                Ответ сформирован нейросетью YandexGPT на основе документации сервиса. В нём могут
                быть неточности, проверить информацию можно поссылкам на источники.
            </div>
        </>
    );
};

export default GenerativeSearchAnswer;
