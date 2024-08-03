export default {
    message: {
        content:
            'Чтобы работать с YFM, можно следовать таким рекомендациям:\n\n* **Создайте проект**. [1] Он состоит из нескольких конфигурационных файлов и страниц с контентом. [1]\n\n* **Запустите сборку проекта**. [1][3] Для этого используйте инструмент Builder в командной строке. [1] Укажите обязательные ключи запуска: **input (–i) — путь до директории проекта, output (–o) — путь до директории для выходных данных (статических HTML)**. [1][3] Пример команды: `yfm -i ./input-folder -o ./ouput-folder`. [1]\n\n* **Настройте сборку в YFM**. [3] Для этого при выполнении команды yfm укажите ключ запуска **--output-format=md**. [3] Сборка в YFM позволяет использовать вставки и условия видимости разделов, условия отображения контента и подстановки переменных. [3]\n\n* **Используйте готовый проект**. [1] Проекты в формате HTML можно использовать локально или разместить на хостинге, в GitHub Pages или S3. [1][4]',
        role: 'assistant',
    },
    links: [
        'https://diplodoc.com/docs/ru/quickstart',
        'https://diplodoc.com/docs/ru/syntax/base',
        'https://diplodoc.com/docs/ru/tools/docs/build',
        'https://diplodoc.com/docs/ru/index-yfm',
        'https://diplodoc.com/docs/en/how-it-work',
    ],
    titles: [
        'Быстрый старт | Diplodoc',
        'Базовая разметка | Diplodoc',
        'Сборка | Diplodoc',
        'Yandex Flavored Markdown | Diplodoc',
        'Main scenarios for Diplodoc usage | Diplodoc',
    ],
    final_search_query: 'как работать с yfm',
    is_answer_rejected: false,
    is_bullet_answer: false,
    search_reqid: '1722674507173832-17567698128095587952-ngp6et3xflkdijxp-BAL',
    reqid: '1722674506477130-4942193876903362238-balancer-l7leveler-kubr-yp-sas-214-BAL',
};
