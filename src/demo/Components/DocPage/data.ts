import {DocPageProps} from '../../../index';
import getLangControl from '../../controls/lang';
import getVcsControl from '../../controls/vcs';

/* eslint-disable */
export default function getPageInfo(): DocPageProps {
    const lang = getLangControl();
    const vcsType = getVcsControl();

    const router = {pathname: '/'};

    return ({
        'html': '<p><em>Сервис</em> в составе Яндекс.Облака позволяет управлять определенными категориями облачных ресурсов и доступом к ним.</p>\n<h2 id="service-type"><a href="#service-type" class="yfm-anchor" aria-hidden="true"></a>Категории сервисов</h2>\n<p>Сервисы Яндекс.Облака делятся на следующие категории:</p>\n<ul>\n<li><em>Infrastructure</em> — инфраструктурные сервисы для обработки данных, безопасного доступа и обмена трафиком.</li>\n<li><em>Data storage &amp; Analytics</em> — сервисы для надежного хранения, обработки и визуализации данных.</li>\n<li><em>Cloud-native</em> — инструменты для хранения данных и разработки приложений в облаке.</li>\n<li><em>Machine Learning &amp; Artificial Intelligence (ML &amp; AI)</em> — речевые технологии, анализ изображений и машинный перевод.</li>\n</ul>\n<h2 id="list"><a href="#list" class="yfm-anchor" aria-hidden="true"></a>Список сервисов Яндекс.Облака</h2>\n<p>На данный момент в рамках платформы Яндекс.Облако доступны следующие сервисы:</p>\n<ul>\n<li>Infrastructure:\n<ul>\n<li><a href="../../compute/">Yandex Compute Cloud</a> (Сервис Облачных вычислений).</li>\n<li><a href="../../storage/">Yandex Object Storage</a> (Сервис Объектного хранилища).</li>\n<li><a href="../../vpc/">Yandex Virtual Private Cloud</a> (Сервис Виртуальное частное облако).</li>\n<li><a href="../../vpc/interconnect/">Yandex Cloud Interconnect</a> (Сервис управления выделенными сетевыми соединениями).</li>\n<li><a href="../../iam/">Yandex Identity and Access Management</a> (Сервис по управлению доступом к облачным ресурсам).</li>\n<li><a href="../../resource-manager/">Yandex Resource Manager</a> (Сервис по управлению облачными ресурсами).</li>\n<li><a href="../../kms/">Yandex Key Management Service</a> (Сервис для управления ключами шифрования).</li>\n<li><a href="../../load-balancer/">Yandex Load Balancer</a> (Сервис для управления сетевыми балансировщиками нагрузки).</li>\n<li><a href="../../compute/concepts/instance-groups/">Yandex Instance Groups</a> (Сервис для создания и управления группами виртуальных машин).</li>\n<li><a href="../../container-registry/">Yandex Container Registry</a> (Сервис для управления образами контейнеров).</li>\n<li><a href="../../managed-kubernetes/">Yandex Managed Service for Kubernetes<sup>®</sup></a> (Сервис Управления для Kubernetes).</li>\n<li><a href="../../monitoring/">Yandex Monitoring</a> (Сервис мониторинга).</li>\n<li><a href="../../vpc/ddos-protection/">Yandex DDoS Protection</a> (Сервис защиты от DDoS-атак).</li>\n</ul>\n</li>\n<li>Data storage &amp; Analytics:\n<ul>\n<li><a href="../../managed-postgresql/">Yandex Managed Service for PostgreSQL</a> (Сервис Управления для PostgreSQL).</li>\n<li><a href="../../managed-clickhouse/">Yandex Managed Service for ClickHouse</a> (Сервис Управления для ClickHouse).</li>\n<li><a href="../../managed-mongodb/">Yandex Managed Service for MongoDB</a> (Сервис Управления для MongoDB).</li>\n<li><a href="../../managed-mysql/">Yandex Managed Service for MySQL<sup>®</sup></a> (Сервис Управления для MySQL).</li>\n<li><a href="../../managed-redis/">Yandex Managed Service for Redis™</a> (Сервис Управления для Redis).</li>\n<li><a href="../../data-proc/">Yandex Data Proc</a> (Сервис Управления данными Data Proc).</li>\n<li><a href="../../datalens/">Yandex DataLens</a> (Сервис визуализации и анализа данных).</li>\n</ul>\n</li>\n<li>Cloud-native:\n<ul>\n<li><a href="../../ydb/">Yandex Database</a> (Сервис управления для Yandex Database).</li>\n<li><a href="../../message-queue/">Yandex Message Queue</a> (Сервис очередей).</li>\n<li><a href="../../functions/">Yandex Cloud Functions</a> (Сервис бессерверных вычислений).</li>\n<li><a href="../../iot-core/">Yandex IoT Core</a> (Сервис Интернета Вещей).</li>\n</ul>\n</li>\n<li>Machine Learning &amp; Artificial Intelligence (ML &amp; AI):\n<ul>\n<li><a href="../../speechkit/">Yandex SpeechKit</a> (Сервис речевых технологий).</li>\n<li><a href="../../translate/">Yandex Translate</a> (Сервис машинного перевода).</li>\n<li><a href="../../vision/">Yandex Vision</a> (Сервис компьютерного зрения).</li>\n</ul>\n</li>\n</ul>\n<h3 id="enable"><a href="#enable" class="yfm-anchor" aria-hidden="true"></a>Как подключиться к сервисам</h3>\n<p>Для подключения к сервисам и управления ресурсами вы можете использовать консоль управления Яндекс.Облака. С ее помощью вы можете запускать виртуальные машины в Яндекс.Облаке и подключаться к ним, обращаться к объектному хранилищу, создавать базы данных и т. п.</p>\n',
        'title': 'Сервисы Яндекс.Облака',
        'headings': [
            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },            {
                'title': 'Категории сервисов',
                'href': '#service-type',
                'level': 2,
            },
            {
                'title': 'Список сервисов Яндекс.Облака',
                'href': '#list',
                'level': 2,
                'items': [
                    {
                        'title': 'Как подключиться к сервисам',
                        'href': '#enable',
                        'level': 3,
                    },
                ],
            },
        ],
        'meta': {

        },
        'vcsUrl': 'https://github.com/yandex-cloud/docs/tree/master/ru/overview/concepts/services.md',
        vcsType,
        'toc': {
            'title': 'Обзор платформы',
            'href': '/docs/overview/',
            'items': [
                {
                    'name': 'Сервисы Яндекс.Облака',
                    'href': '/docs/overview/concepts/services',
                    'id': 'e619422ec28a87ea25c41d4ad7e45563',
                },
                {
                    'name': 'Сопоставление с другими платформами',
                    'items': [
                        {
                            'name': 'Обзор',
                            'href': '/docs/overview/platform-comparison/',
                            'id': '6cb52f285fd5d6ec04cbd96854dffab6',
                        },
                        {
                            'name': 'Сопоставление с Amazon Web Services',
                            'href': '/docs/overview/platform-comparison/aws',
                            'id': '1d84cf0e31f3f0968bdc6e8c2e11ba2f',
                        },
                        {
                            'name': 'Сопоставление с Google Cloud Platform',
                            'href': '/docs/overview/platform-comparison/gcp',
                            'id': '931f7302b4162c44fbe9bb07cea05b1e',
                        },
                        {
                            'name': 'Сопоставление с Microsoft Azure',
                            'href': '/docs/overview/platform-comparison/azure',
                            'id': 'c14b119f6944d57afd8d4b3e61c37e21',
                        },
                    ],
                    'id': 'fa5cef5c0b0cf236fdaa1562cbc48eb8',
                },
                {
                    'name': 'Зоны доступности',
                    'href': '/docs/overview/concepts/geo-scope',
                    'id': '054328058d7c7b60ff85e3c95be1a264',
                },
                {
                    'name': 'Начало работы',
                    'href': '/docs/overview/quickstart',
                    'id': 'c984893c04c28bc3fe91f5ff87b79c29',
                },
                {
                    'name': 'Стадии готовности сервисов',
                    'href': '/docs/overview/concepts/launch-stages',
                    'id': 'c53a86addb3cf17f0847acde5282ad84',
                },
                {
                    'name': 'Квоты и лимиты',
                    'href': '/docs/overview/concepts/quotas-limits',
                    'id': '56baa37ef41a57f75c4fce09722ab06c',
                },
                {
                    'name': 'API',
                    'href': '/docs/overview/api',
                    'id': '136bdc27253376a450eee99e4539c186',
                },
                {
                    'name': 'Безопасность и соответствие стандартам',
                    'items': [
                        {
                            'name': 'Рекомендации по безопасности',
                            'href': '/docs/overview/security-bulletins/',
                            'id': 'c87ac8d995548646dec5661b1b28e45c',
                        },
                        {
                            'name': 'Безопасность платформы Яндекс.Облако',
                            'items': [
                                {
                                    'name': 'Обзор',
                                    'href': '/docs/overview/security/',
                                    'id': '022cc6311c43fdd3c2848a238c92de1e',
                                },
                                {
                                    'name': 'Ключевые принципы безопасности',
                                    'href': '/docs/overview/security/principles',
                                    'id': 'fba46ca0333fec72f16d0e29fb78e239',
                                },
                                {
                                    'name': 'Разделение ответственности за обеспечение безопасности',
                                    'href': '/docs/overview/security/respons',
                                    'id': '177e184118e1e45bc890a53bf76971c7',
                                },
                                {
                                    'name': 'Следование лучшим практикам и стандартам',
                                    'href': '/docs/overview/security/standarts',
                                    'id': '778f32125645fc81b0f680d2d9d09d23',
                                },
                                {
                                    'name': 'Соответствие требованиям',
                                    'href': '/docs/overview/security/conform',
                                    'id': '4d7329262a479edc4b28a7607a31c2b4',
                                },
                                {
                                    'name': 'Технические меры защиты на стороне провайдера',
                                    'href': '/docs/overview/security/tech-measures',
                                    'id': '98cfa650bb690aa5b9a9aa66f3e7e52b',
                                },
                                {
                                    'name': 'Средства защиты, доступные пользователям облачных сервисов',
                                    'href': '/docs/overview/security/user-side',
                                    'id': 'aaffdd260266d59cd003e6fcab17a1ec',
                                },
                                {
                                    'name': 'Полезные ресурсы',
                                    'href': '/docs/overview/security/resources',
                                    'id': '72071e3e599234cb4df3fe56ac378dc1',
                                },
                            ],
                            'id': 'f8cca556a8df3df325a1dce2ffec52dc',
                        },
                    ],
                    'id': 'a9a73ae9355373490260f6f4eae54f48',
                },
                {
                    'name': 'Удаление данных пользователей',
                    'href': '/docs/overview/concepts/data-deletion',
                    'id': '66fe49c2a324ffd44541fe6a33e14ed0',
                },
                {
                    'name': 'SLA',
                    'href': '/docs/overview/sla',
                    'id': '1636c6203504367fc47f73077e95ebad',
                },
                {
                    'name': 'Вопросы и ответы',
                    'href': '/docs/overview/qa',
                    'id': 'ff7aacc415c714c83d0ea5715eabb016',
                },
            ],
        },
        'breadcrumbs': [
            {
                'name': 'Сервисы Яндекс.Облака',
            },
        ],
        lang,
        router,
    });
}
/* eslint-enable */
