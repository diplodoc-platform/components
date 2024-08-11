import React, {useState} from 'react';

import {ArrowShapeRight, FileText, Person} from '@gravity-ui/icons';
import block from 'bem-cn-lite';
import MarkdownIt from 'markdown-it';

import {YandexGPTLogo} from '../GenerativeSearchAnswer/YandexGPTLogo';

import ChatBotIcon from './ChatBotIcon';

import './ChatBot.scss';

const md = new MarkdownIt();
const b = block('dc-chat-bot');

interface IChatMessage {
    content: string;
    role: string;
}

interface ChatBotProps {
    messages?: IChatMessage[];
}

const ChatMessage: React.FC<IChatMessage> = ({content, role}) => {
    const parserdContent = md.render(content);

    return (
        <div>
            <div
                className={b('message-card', {role: role})}
                dangerouslySetInnerHTML={{__html: parserdContent}}
            ></div>
        </div>
    );
};

const messagesMocks = [
    {
        content:
            'Привет! Я твой помощник, работаю на основе нейросети YandexGPT. Задавай мне вопросы по работе этого сервиса, и я быстро отвечу. Кратко и по делу. Если вдруг мой ответ тебе не поможет, я подскажу, как связаться с поддержкой. Давай начнём?',
        role: 'assistant',
    },
    {
        content: 'Как работать с YFM',
        role: 'user',
    },
    {
        content:
            'Чтобы работать с YFM, можно следовать таким рекомендациям:\n\n* **Создайте проект**. [1] Он состоит из нескольких конфигурационных файлов и страниц с контентом. [1]\n\n* **Запустите сборку проекта**. [1][3] Для этого используйте инструмент Builder в командной строке. [1] Укажите обязательные ключи запуска: **input (–i) — путь до директории проекта, output (–o) — путь до директории для выходных данных (статических HTML)**. [1][3] Пример команды: `yfm -i ./input-folder -o ./ouput-folder`. [1]\n\n* **Настройте сборку в YFM**. [3] Для этого при выполнении команды yfm укажите ключ запуска **--output-format=md**. [3] Сборка в YFM позволяет использовать вставки и условия видимости разделов, условия отображения контента и подстановки переменных. [3]\n\n* **Используйте готовый проект**. [1] Проекты в формате HTML можно использовать локально или разместить на хостинге, в GitHub Pages или S3. [1][4]',
        role: 'assistant',
    },
];

const ChatBot: React.FC<ChatBotProps> = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHover, setHover] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSendMessage = () => {
        setInputValue('');
    };

    return (
        <div>
            {isOpen && (
                <div className={b('modal', {open: isOpen})}>
                    <div className={b('content')}>
                        <header className={b('header')}>
                            <div className={b('header-wrapper')}>
                                <YandexGPTLogo width={27} height={27} fill="#79529D" />
                                <div className={b('header-title')}>
                                    <h1>Бот-помощник</h1>
                                    <p>24/7 на связи с вами</p>
                                </div>
                            </div>
                            <div className={b('header-icons-wrapper')}>
                                <FileText width={20} height={20} />
                                <Person width={20} height={20} />
                            </div>
                        </header>
                        <main className={b('message-container')}>
                            {messagesMocks.map((message, index) => (
                                <ChatMessage {...message} key={index} />
                            ))}
                        </main>
                        <footer className={b('footer')}>
                            <div className={b('footer-input-wrapper')}>
                                <input
                                    type="text"
                                    placeholder="Введите запрос"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                />
                                <ArrowShapeRight
                                    width={26}
                                    height={26}
                                    onClick={handleSendMessage}
                                    className={b('footer-send-message')}
                                />
                            </div>
                            <div className={b('footer-disclaimer')}>
                                <p>
                                    Ответы в чат-боте формируются нейросетью YandexGPT на основе
                                    документации сервиса В них могут быть неточности, проверить
                                    информацию можно в источниках.
                                </p>
                            </div>
                        </footer>
                    </div>
                </div>
            )}

            <ChatBotIcon
                isHovered={isHover}
                handleHover={setHover}
                handleClick={setIsOpen}
                className={b('chat-bot-icon')}
            />
        </div>
    );
};

export default ChatBot;
