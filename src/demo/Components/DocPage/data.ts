import {DocPageProps} from '../../../index';
import getLangControl from '../../controls/lang';
import getVcsControl from '../../controls/vcs';

/* eslint-disable */
export default function getPageInfo(): DocPageProps {
    const lang = getLangControl();
    const vcsType = getVcsControl();

    const router = {pathname: '/'};

    return ({
        "html": "<p>В Яндекс.Облаке есть возможность создать кластер PostgreSQL, оптимизированный для работы с системой «1С:Предприятие». Чтобы настроить работу «1С:Предприятия», нужно создать рабочий сервер, сервер лицензий и кластер Managed Service for PostgreSQL. Для корректной работы серверов 1С на них следует отключить службы безопасности, поэтому доступ к кластеру будет осуществляться через шифрованное соединение c сервером OpenVPN, а сами серверы 1С не будут иметь выхода в интернет. Серверы 1С будут работать под управлением CentOS 8, настройка кластера 1С будет осуществляться с помощью консоли администрирования в Windows.</p>\n<div class=\"yfm-note yfm-accent-info\"><p><strong>Примечание</strong></p>\n<p>Для работы с системой «1С:Предприятие» вам понадобится лицензия. Подробнее о лицензиях и их установке читайте на <a href=\"https://its.1c.ru/\" target=\"_blank\" rel=\"noreferrer noopener\">сайте «1С:Предприятия»</a></p>\n</div><p>Чтобы настроить работу серверов «1С:Предприятия»:</p>\n<ol>\n<li><a href=\"#before-you-begin\">Подготовьте облако к работе</a>.</li>\n<li><a href=\"#prepare\">Подготовьте инфраструктуру</a>.</li>\n<li><a href=\"#create-1c-vm\">Создайте ВМ для сервера «1С:Предприятие»</a>.</li>\n<li><a href=\"#create-1c-license-vm\">Создайте ВМ для сервера лицензирования</a>.</li>\n<li><a href=\"#create-pg-cluster\">Создайте кластер Managed Service for PostgreSQL</a>.</li>\n<li><a href=\"#set-up-samba\">Настройте Samba-сервер</a>.</li>\n<li><a href=\"#set-up-samba-for-license-server\">Настройте Samba-сервер для сервера лицензий</a>.</li>\n<li><a href=\"#setup-cluster\">Настройте кластер серверов</a>.</li>\n<li><a href=\"#setup-infobase\">Настройте информационную базу</a>.</li>\n<li><a href=\"#connect-to-infobase\">Подключитесь к информационной базе</a>.</li>\n<li><a href=\"#clear-out\">Удалите созданные ресурсы</a>.</li>\n</ol>\n<p>Если созданные ресурсы вам больше не нужны, <a href=\"#clear-out\">удалите их</a>.</p>\n<h2 id=\"before-you-begin\"><a href=\"#before-you-begin\" class=\"yfm-anchor\" aria-hidden=\"true\"></a>Подготовьте облако к работе</h2>\n<p>Перед тем, как разворачивать сервер, нужно зарегистрироваться в Облаке и создать платежный аккаунт:</p>\n<ol>\n<li>Перейдите в <a href=\"https://console.cloud.yandex.ru/\" target=\"_blank\" rel=\"noreferrer noopener\">консоль управления</a>, затем войдите в Яндекс.Облако или зарегистрируйтесь, если вы еще не зарегистрированы.</li>\n<li><a href=\"https://console.cloud.yandex.ru/billing\" target=\"_blank\" rel=\"noreferrer noopener\">На странице биллинга</a> убедитесь, что у вас подключен <a href=\"../../billing/concepts/billing-account\">платежный аккаунт</a>, и он находится в статусе <code>ACTIVE</code> или <code>TRIAL_ACTIVE</code>. Если платежного аккаунта нет, <a href=\"../../billing/quickstart/#create_billing_account\">создайте его</a>.</li>\n</ol>\n<p>Если у вас есть активный платежный аккаунт, вы можете создать или выбрать каталог, в котором будет работать ваша виртуальная машина, на <a href=\"https://console.cloud.yandex.ru/cloud\" target=\"_blank\" rel=\"noreferrer noopener\">странице облака</a>.</p>\n<p><a href=\"../../resource-manager/concepts/resources-hierarchy\">Подробнее об облаках и каталогах</a>.</p>\n<h3 id=\"paid-resources\"><a href=\"#paid-resources\" class=\"yfm-anchor\" aria-hidden=\"true\"></a>Необходимые платные ресурсы</h3>\n<p>В стоимость поддержки инфраструктуры «1С:Предприятия» в Яндекс.Облаке входит:</p>\n<ul>\n<li>плата за диски и постоянно запущенные виртуальные машины (см. <a href=\"../../compute/pricing\">тарифы Yandex Compute Cloud</a>);</li>\n<li>плата за постоянно запущенный кластер Managed Service for PostgreSQL (см. <a href=\"../../compute/pricing\">тарифы Yandex Compute Cloud</a>)</li>\n<li>плата за использование динамического или статического внешнего IP-адреса (см. <a href=\"../../vpc/pricing\">тарифы Yandex Virtual Private Cloud</a>).</li>\n</ul>\n<h2 id=\"prepare\"><a href=\"#prepare\" class=\"yfm-anchor\" aria-hidden=\"true\"></a>Подготовьте инфраструктуру</h2>\n<ol>\n<li>На вашем компьютере должен быть установлен клиент «1С:Предприятия» для проверки работы информационной базы и административная консоль 1С для управления кластером сервером.</li>\n<li>В вашем облаке должна быть запущена ВМ с <a href=\"../routing/openvpn\">настроенным OpenVPN</a> для безопасного соединения с серверами 1C.</li>\n</ol>\n<div class=\"yfm-note yfm-accent-info\"><p><strong>Примечание</strong></p>\n<p>Необходимые дистрибутивы вы можете загрузить на <a href=\"https://its.1c.ru/\" target=\"_blank\" rel=\"noreferrer noopener\">сайте «1С:Предприятия»</a>.</p>\n</div><h2 id=\"create-1c-vm\"><a href=\"#create-1c-vm\" class=\"yfm-anchor\" aria-hidden=\"true\"></a>Создайте ВМ для сервера «1С:Предприятие»</h2>\n<p>Чтобы создать виртуальную машину:</p>\n<ol>\n<li>\n<p>На странице каталога в <a href=\"https://console.cloud.yandex.ru/\" target=\"_blank\" rel=\"noreferrer noopener\">консоли управления</a> нажмите кнопку <strong>Создать ресурс</strong> и выберите <strong>Виртуальная машина</strong>.</p>\n</li>\n<li>\n<p>В поле <strong>Имя</strong> введите имя виртуальной машины: <code>server-1c</code>.</p>\n</li>\n<li>\n<p>Выберите <a href=\"../../overview/concepts/geo-scope\">зону доступности</a>, в которой будет находиться виртуальная машина.</p>\n</li>\n<li>\n<p>В блоке <strong>Образы из Cloud Marketplace</strong> нажмите кнопку <strong>Выбрать</strong>. Выберите публичный образ <strong>CentOS 8</strong>.</p>\n</li>\n<li>\n<p>В блоке <strong>Вычислительные ресурсы</strong>:</p>\n<ul>\n<li>Выберите <a href=\"../../compute/concepts/vm-platforms\">платформу</a>.</li>\n<li>Укажите необходимое количество vCPU и объем RAM:\n<ul>\n<li><strong>vCPU</strong> — 4.</li>\n<li><strong>Гарантированная доля vCPU</strong> — 100%.</li>\n<li><strong>RAM</strong> — 4 ГБ.</li>\n</ul>\n</li>\n</ul>\n</li>\n<li>\n<p>В блоке <strong>Сетевые настройки</strong> выберите сеть и подсеть, к которым нужно подключить виртуальную машину. Если нужной сети или подсети еще нет, вы можете создать их прямо на странице создания ВМ.</p>\n</li>\n<li>\n<p>В поле <strong>Публичный адрес</strong> оставьте значение <strong>Без адреса</strong>. Доступ на виртуальную машину будет осуществляться через сервер OpenVPN.</p>\n</li>\n<li>\n<p>Укажите данные для доступа на виртуальную машину:</p>\n<ul>\n<li>\n<p>В поле <strong>Логин</strong> введите имя пользователя.</p>\n</li>\n<li>\n<p>В поле <strong>SSH-ключ</strong> вставьте содержимое файла открытого ключа.</p>\n<p>Пару ключей для подключения по SSH необходимо создать самостоятельно, см. <a href=\"../../compute/operations/vm-connect/ssh\">раздел о подключении к виртуальным машинам по SSH</a>.</p>\n</li>\n</ul>\n</li>\n<li>\n<p>Нажмите кнопку <strong>Создать ВМ</strong>.</p>\n</li>\n</ol>\n<p>Создание виртуальной машины может занять несколько минут.</p>\n<h2 id=\"create-1c-license-vm\"><a href=\"#create-1c-license-vm\" class=\"yfm-anchor\" aria-hidden=\"true\"></a>Создайте ВМ для сервера лицензирования</h2>\n<p>Лицензия для «1С:Предприятия» должна быть установлена на отдельном сервере, чтобы изменения конфигурации других серверов не затрагивали установленную лицензию.</p>\n<p>Чтобы создать виртуальную машину:</p>\n<ol>\n<li>\n<p>На странице каталога в <a href=\"https://console.cloud.yandex.ru/\" target=\"_blank\" rel=\"noreferrer noopener\">консоли управления</a> нажмите кнопку <strong>Создать ресурс</strong> и выберите <strong>Виртуальная машина</strong>.</p>\n</li>\n<li>\n<p>В поле <strong>Имя</strong> введите имя виртуальной машины: <code>licensing-server-1c</code>.</p>\n</li>\n<li>\n<p>Выберите <a href=\"../../overview/concepts/geo-scope\">зону доступности</a>, в которой будет находиться виртуальная машина.</p>\n</li>\n<li>\n<p>В блоке <strong>Образы из Cloud Marketplace</strong> нажмите кнопку <strong>Выбрать</strong>. Выберите публичный образ <strong>CentOS 8</strong>.</p>\n</li>\n<li>\n<p>В блоке <strong>Вычислительные ресурсы</strong>:</p>\n<ul>\n<li>Выберите <a href=\"../../compute/concepts/vm-platforms\">платформу</a>.</li>\n<li>Укажите необходимое количество vCPU и объем RAM:\n<ul>\n<li><strong>vCPU</strong> — 4.</li>\n<li><strong>Гарантированная доля vCPU</strong> — 100%.</li>\n<li><strong>RAM</strong> — 4 ГБ.</li>\n</ul>\n</li>\n</ul>\n</li>\n<li>\n<p>В блоке <strong>Сетевые настройки</strong> выберите сеть и подсеть, к которым нужно подключить виртуальную машину. ВМ нужно создавать в той же подсети, где находится сервер OpenVPN.</p>\n</li>\n<li>\n<p>В поле <strong>Публичный адрес</strong> оставьте значение <strong>Без адреса</strong>. Доступ на виртуальную машину будет осуществляться через сервер OpenVPN.</p>\n</li>\n<li>\n<p>Укажите данные для доступа на виртуальную машину:</p>\n<ul>\n<li>В поле <strong>Логин</strong> введите имя пользователя.</li>\n<li>В поле <strong>SSH-ключ</strong> вставьте содержимое файла открытого ключа.</li>\n</ul>\n</li>\n<li>\n<p>Нажмите кнопку <strong>Создать ВМ</strong>.</p>\n</li>\n</ol>\n<p>Создание виртуальной машины может занять несколько минут.</p>\n<h2 id=\"create-pg-cluster\"><a href=\"#create-pg-cluster\" class=\"yfm-anchor\" aria-hidden=\"true\"></a>Создайте кластер Managed Service for PostgreSQL</h2>\n<p>В Яндекс.Облаке можно создать кластер Managed Service for PostgreSQL с настройками, оптимизированными для работы с платформой «1С:Предприятие». Настройки кластера могут варьироваться в зависимости от требований вашего проекта.</p>\n<p>Чтобы создать оптимизированный для работы с 1С кластер Managed Service for PostgreSQL:</p>\n<ol>\n<li>\n<p>На странице каталога в <a href=\"https://console.cloud.yandex.ru/\" target=\"_blank\" rel=\"noreferrer noopener\">консоли управления</a> нажмите кнопку <strong>Создать ресурс</strong> и выберите <strong>Кластер Managed Service for PostgreSQL</strong>.</p>\n</li>\n<li>\n<p>В поле <strong>Имя</strong> введите имя кластера: <code>1c-pg</code>.</p>\n</li>\n<li>\n<p>В списке <strong>Версия</strong> выберите <code>10-1c</code>.</p>\n</li>\n<li>\n<p>В блоке <strong>Класс хоста</strong> выберите <strong>s2.small</strong>.</p>\n</li>\n<li>\n<p>В блоке <strong>Размер хранилища</strong> укажите <strong>local-ssd</strong> и укажите размер 100 ГБ.</p>\n</li>\n<li>\n<p>В блоке <strong>База данных</strong>:</p>\n<ul>\n<li><strong>Имя БД</strong> — <code>1c-database</code>.</li>\n<li><strong>Имя пользователя</strong> — <code>user1</code>.</li>\n<li><strong>Пароль</strong> – пароль, который вы будете использовать для доступа к базе.</li>\n<li><strong>Сеть</strong> — сеть, в которой будет находиться кластер.</li>\n<li><strong>Локаль сортировки</strong> — <code>ru_RU.UTF-8</code>.</li>\n<li><strong>Локаль набора символов</strong> — <code>ru_RU.UTF-8</code>.</li>\n</ul>\n</li>\n<li>\n<p>В блоке <strong>Хосты</strong> выберите разные зоны доступности для ваших хостов, чтобы обеспечить отказоустойчивость.</p>\n</li>\n<li>\n<p>Нажмите кнопку <strong>Создать кластер</strong>.</p>\n</li>\n</ol>\n<p>Создание кластера БД может занять несколько минут.</p>\n<h2 id=\"set-up-samba\"><a href=\"#set-up-samba\" class=\"yfm-anchor\" aria-hidden=\"true\"></a>Настройте Samba-сервер</h2>\n<p><a href=\"../../compute/operations/vm-connect/ssh\">Подключитесь</a> к ВМ <code>server-1c</code> по SSH.</p>\n<ol>\n<li>\n<p>Установите Samba, необходимые зависимости и текстовый редактор <code>nano</code>:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ sudo yum install nano samba samba-client samba-common, net-utils\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"441\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-441\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-441\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-441.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Отключите работу протокола IPv6, чтобы избежать конфликтов в работе сервера. Для этого откройте файл <code>/etc/sysctl.conf</code>:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ sudo nano /etc/sysctl.conf\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"447\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-447\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-447\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-447.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Добавьте в файл следующие строки:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">net.ip6.conf.all.disable_ipv6 = 1\nnet.ip6.conf.default.disable_ipv6 = 1\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"453\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-453\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-453\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-453.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Добавьте следующие строки в файл <code>/etc/sysconfig/network</code>:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">NETWORKING_IPv6=no\nHOSTNAME=server-1c\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"459\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-459\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-459\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-459.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Настройте общий каталог. Откройте файл конфигурации Samba:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ sudo nano /etc/samba/smb.conf\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"465\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-465\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-465\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-465.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Приведите файл к следующему виду:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">[global]\n        workgroup = WORKGROUP\n        server string = Samba Server%v\n        netbios name = centos\n        security = user\n        map to guest = bad user\n        dns proxy = no\n        passdb backend = tdbsam\n        printing = cups\n        printcap name = cups\n        load printers = yes\n        cups iptions = raw\n        security = user\n\n[files]\n        path = /1c-files\n        browsable = yes\n        writable = yes\n        guest ok = yes\n        read only = no\n\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"471\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-471\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-471\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-471.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Создайте общий каталог и дайте на него права:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ sudo mkdir /1c-files\n$ sudo chmod -R 777 /1c-files\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"477\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-477\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-477\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-477.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Отключите фаерволл:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ sudo systemctl stop firewalld\n$ sudo systemctl disable firewalld\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"483\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-483\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-483\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-483.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Отключите SELinux. Откройте конфигурацию SELinux командой <code>sudo nano /etc/sysconfig/selinux</code> и измените параметр <code>SELINUX</code>:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">SELINUX=disabled\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"489\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-489\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-489\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-489.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Добавьте службу Samba-сервера в список автозагрузки и перезапустите ее:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ sudo systemctl enable smb.service\nCreated symlink from /etc/systemd/system/multi-user.target.wants/smb.service to /usr/lib/systemd/system/smb.service.\n$ sudo systemctl restart smb.service\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"495\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-495\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-495\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-495.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n</ol>\n<h2 id=\"setup-1c-server\"><a href=\"#setup-1c-server\" class=\"yfm-anchor\" aria-hidden=\"true\"></a>Установите сервер «1С:Предприятия»</h2>\n<p>Установите сервер «1С:Предприятия» на ВМ:</p>\n<ol>\n<li>Загрузите архив с дистрибутивом на вашу ВМ в папку <code>1c-files</code>.</li>\n<li>Распакуйте дистрибутив и запустите установку:</li>\n</ol>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ sudo tar –xvf  /1c-files/&lt;имя архива&gt;\n$ sudo yum localinstall /1c-files/*.rpm \n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"516\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-516\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-516\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-516.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n<ol>\n<li>Запустите сервер 1С:</li>\n</ol>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ sudo systemctl start srv1cv83\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"524\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-524\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-524\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-524.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n<ol>\n<li>Убедитесь, что служба сервера «1С:Предприятие» запущена:</li>\n</ol>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ systemctl status srv1cv83\n● srv1cv83.service - SYSV: Starts and stops the 1C:Enterprise daemons\n   Loaded: loaded (/etc/rc.d/init.d/srv1cv83; bad; vendor preset: disabled)\n   Active: active (exited) since Tue 2020-02-04 14:40:43 UTC; 4 days ago\n     Docs: man:systemd-sysv-generator(8)\n  Process: 27364 ExecStart=/etc/rc.d/init.d/srv1cv83 start (code=exited, status=0/SUCCESS)\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"532\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-532\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-532\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-532.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n<h2 id=\"set-up-samba-for-license-server\"><a href=\"#set-up-samba-for-license-server\" class=\"yfm-anchor\" aria-hidden=\"true\"></a>Настройте Samba-сервер для сервера лицензий</h2>\n<p><a href=\"../../compute/operations/vm-connect/ssh\">Подключитесь</a> к ВМ <code>server-1c</code> по SSH.</p>\n<ol>\n<li>\n<p>Установите Samba, необходимые зависимости и текстовый редактор <code>nano</code>:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ sudo yum install nano samba samba-client samba-common, net-utils\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"544\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-544\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-544\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-544.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Отключите работу протокола IPv6, чтобы избежать конфликтов в работе сервера. Для этого откройте файл <code>/etc/sysctl.conf</code>:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ sudo nano /etc/sysctl.conf\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"550\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-550\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-550\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-550.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Добавьте в файл следующие строки:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">net.ip6.conf.all.disable_ipv6 = 1\nnet.ip6.conf.default.disable_ipv6 = 1\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"556\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-556\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-556\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-556.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Добавьте следующие строки в файл <code>/etc/sysconfig/network</code>, выполнив команду <code>sudo nano /etc/sysconfig/network</code>:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">NETWORKING_IPv6=no\nHOSTNAME=server-1c\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"562\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-562\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-562\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-562.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Настройте общий каталог. Для откройте файл конфигурации Samba:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ sudo nano /etc/samba/smb.conf\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"568\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-568\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-568\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-568.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Приведите файл к следующему виду:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">[global]\n        workgroup = WORKGROUP\n        server string = Samba Server%v\n        netbios name = centos\n        security = user\n        map to guest = bad user\n        dns proxy = no\n        passdb backend = tdbsam\n        printing = cups\n        printcap name = cups\n        load printers = yes\n        cups iptions = raw\n        security = user\n\n[files]\n        path = /1c-files\n        browsable = yes\n        writable = yes\n        guest ok = yes\n        read only = no\n\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"574\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-574\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-574\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-574.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Создайте общий каталог и дайте на него права:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ sudo mkdir /1c-files\n$ sudo chmod -R 777 /1c-files\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"580\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-580\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-580\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-580.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Отключите фаерволл:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ sudo systemctl stop firewalld\n$ sudo systemctl disable firewalld\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"586\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-586\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-586\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-586.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Отключите SELinux. Откройте конфигурацию SELinux командой <code>sudo nano /etc/sysconfig/selinux</code> и измените параметр <code>SELINUX</code>:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">SELINUX=disabled\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"592\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-592\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-592\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-592.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n<li>\n<p>Добавьте службу Samba-сервера в список автозагрузки и перезапустите ее:</p>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ sudo systemctl enable smb.service\nCreated symlink from /etc/systemd/system/multi-user.target.wants/smb.service to /usr/lib/systemd/system/smb.service.\n$ sudo systemctl restart smb.service\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"598\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-598\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-598\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-598.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n</li>\n</ol>\n<h2 id=\"setup-1c-license-server\"><a href=\"#setup-1c-license-server\" class=\"yfm-anchor\" aria-hidden=\"true\"></a>Установите сервер «1С:Предприятия» для сервиса лицензий</h2>\n<p>Установите сервер «1С:Предприятия» на ВМ:</p>\n<ol>\n<li>Загрузите архив с дистрибутивом на вашу ВМ в папку <code>1c-files</code>.</li>\n<li>Распакуйте дистрибутив и запустите установку:</li>\n</ol>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ sudo tar –xvf  /1c-files/&lt;имя архива&gt;\n$ sudo yum localinstall /1c-files/*.rpm \n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"619\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-619\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-619\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-619.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n<ol>\n<li>Запустите сервер 1С:</li>\n</ol>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ sudo systemctl start srv1cv83\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"627\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-627\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-627\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-627.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n<ol>\n<li>Убедитесь, что служба сервера «1С:Предприятие» запущена:</li>\n</ol>\n\n    <div class=\"yfm-clipboard\">\n    <pre><code class=\"hljs\">$ systemctl status srv1cv83\n● srv1cv83.service - SYSV: Starts and stops the 1C:Enterprise daemons\n   Loaded: loaded (/etc/rc.d/init.d/srv1cv83; bad; vendor preset: disabled)\n   Active: active (exited) since Tue 2020-02-04 14:40:43 UTC; 4 days ago\n     Docs: man:systemd-sysv-generator(8)\n  Process: 27364 ExecStart=/etc/rc.d/init.d/srv1cv83 start (code=exited, status=0/SUCCESS)\n</code></pre>\n\n    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"yfm-clipboard-button\" data-animation=\"635\">\n        <path\n            fill=\"currentColor\"\n            d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\"\n        />\n        <path\n            stroke=\"currentColor\"\n            fill=\"transparent\"\n            strokeWidth=\"1.5\"\n            d=\"M9.5 13l3 3l5 -5\"\n            visibility=\"hidden\"\n        >\n            <animate\n                id=\"visibileAnimation-635\"\n                attributeName=\"visibility\"\n                from=\"hidden\"\n                to=\"visible\"\n                dur=\"0.2s\"\n                fill=\"freeze\"\n                begin=\"\"\n            />\n            <animate\n                id=\"hideAnimation-635\"\n                attributeName=\"visibility\"\n                from=\"visible\"\n                to=\"hidden\"\n                dur=\"1s\"\n                begin=\"visibileAnimation-635.end+1\"\n                fill=\"freeze\"\n            />\n        </path>\n    </svg>\n    </div>\n<h2 id=\"setup-cluster\"><a href=\"#setup-cluster\" class=\"yfm-anchor\" aria-hidden=\"true\"></a>Настройте кластер серверов</h2>\n<p>Перед работой необходимо настроить роли серверов и добавить в кластер информационную базу.</p>\n<ol>\n<li>Запустите консоль администрирования 1С на вашем компьютере.</li>\n<li>Добавьте центральный сервер «1С:Предприятия». Откройте контекстное меню списка серверов, выберите <strong>Новый</strong> и <strong>Центральный сервер 1С:Предприятия 8.3</strong>.</li>\n<li>В поле <strong>Имя</strong> введите <code>server-1c</code> и нажмите <strong>OK</strong>. В дереве слева отобразится локальный кластер.</li>\n<li>Добавьте рабочий сервер в кластер. Откройте контекстное меню <strong>Рабочие серверы</strong>, выберите <strong>Новый</strong> и <strong>Рабочий сервер</strong>. В открывшемся окне в поле компьютер введите <code>licensing-server-1c</code>. Этот сервер будет использоваться для раздачи лицензий другим серверам.</li>\n<li>В блоке <strong>Требования назначения функциональности</strong> сервера <code>licensing-server-1c</code> откройте контекстное меню, выберите <strong>Новый</strong> и <strong>Требование назначения функциональности</strong>.\n<ul>\n<li>В списке <strong>Объект требования</strong> выберите <strong>Любой объект требования</strong>.</li>\n<li>В списке <strong>Тип требования</strong> выберите <strong>Не назначать</strong>.</li>\n<li>Остальные параметры оставьте без изменений и нажмите кнопку <strong>OK</strong>.</li>\n</ul>\n</li>\n<li>Примените требования назначения к кластеру: откройте контекстное меню кластера и выберите <strong>Применить требования назначения функциональности (полное)</strong>.</li>\n<li>Добавьте еще одно требование назначения функциональности серверу <code>licensing-server-1c</code> со следующими параметрами:\n<ul>\n<li>В списке <strong>Объект требования</strong> выберите <strong>Сервис лицензирования</strong>.</li>\n<li>В списке <strong>Тип требования</strong> выберите <strong>Назначать</strong>.</li>\n<li>Остальные параметры оставьте без изменений и нажмите кнопку <strong>OK</strong>.</li>\n</ul>\n</li>\n<li>Примените требования назначения функциональности к кластеру: откройте контекстное меню кластера и выберите <strong>Применить требования назначения функциональности (полное)</strong>.</li>\n<li>Добавьте требование назначения функциональности серверу <code>server-1c</code> со следующими параметрами:\n<ul>\n<li>В списке <strong>Объект требования</strong> выберите <strong>Клиентское соединение</strong>.</li>\n<li>В списке <strong>Тип требования</strong> выберите <strong>Назначать</strong>.</li>\n<li>Остальные параметры оставьте без изменений и нажмите кнопку <strong>OK</strong>.</li>\n</ul>\n</li>\n<li>Добавьте еще одно требование назначения функциональности серверу <code>server-1c</code> со следующими параметрами:\n<ul>\n<li>В списке <strong>Объект требования</strong> выберите <strong>Сервис лицензирования</strong>.</li>\n<li>В списке <strong>Тип требования</strong> выберите <strong>Не назначать</strong>.</li>\n<li>Остальные параметры оставьте без изменений и нажмите кнопку <strong>OK</strong>.</li>\n</ul>\n</li>\n<li>Примените требования назначения функциональности к кластеру: откройте контекстное меню кластера и выберите <strong>Применить требования назначения функциональности (полное)</strong>.</li>\n</ol>\n<h2 id=\"setup-infobase\"><a href=\"#setup-infobase\" class=\"yfm-anchor\" aria-hidden=\"true\"></a>Настройте информационную базу</h2>\n<ol>\n<li>\n<p>В консоли администрирования откройте контекстное меню элемента <strong>Информационные базы</strong>, выберите пункт <strong>Новая</strong> и <strong>Информационная база</strong>.</p>\n</li>\n<li>\n<p>В открывшемся окне задайте параметры:</p>\n<ul>\n<li><strong>Имя</strong> — имя базы данных в кластере Managed Service for PostgreSQL — <code>1c-database</code>.</li>\n<li><strong>Защищенное соединение</strong> — <strong>постоянно</strong>.</li>\n<li><strong>Сервер баз данных</strong> — адрес вашего хоста БД и порт, например <code>rc1a-cwxzr4yimhzgn5pp.mdb.yandexcloud.net port=6432</code>.</li>\n<li><strong>Тип СУБД</strong> — <strong>PostgreSQL</strong>.</li>\n<li><strong>База данных</strong> — имя базы данных, <code>1c-database</code>.</li>\n<li><strong>Пользователь сервера БД</strong> — <code>user1</code>.</li>\n<li><strong>Пароль пользователя БД</strong> — пароль пользователя, который вы задали при создании кластера.</li>\n<li><strong>Разрешить выдачу лицензий сервером 1С:Предприятия</strong> — <strong>Да</strong>.</li>\n<li><strong>Язык (Страна)</strong> — <strong>русский (Россия)</strong>.</li>\n<li><strong>Создать базу данных в случае ее отсутствия</strong> — отключено.</li>\n<li><strong>Установить блокировку регламентных заданий</strong> — отключено.</li>\n</ul>\n<p>Нажмите <strong>ОК</strong>.</p>\n</li>\n</ol>\n<h2 id=\"connect-to-infobase\"><a href=\"#connect-to-infobase\" class=\"yfm-anchor\" aria-hidden=\"true\"></a>Подключитесь к информационной базе</h2>\n<ol>\n<li>\n<p>Подключитесь к серверу OpenVPN с помощью клиента.</p>\n</li>\n<li>\n<p>Запустите клиент «1С:Предприятия».</p>\n</li>\n<li>\n<p>Нажмите кнопку <strong>Добавить</strong>.</p>\n</li>\n<li>\n<p>Выберите <strong>Добавление в список существующей информационной базы</strong> и нажмите <strong>Далее</strong>.</p>\n</li>\n<li>\n<p>Введите имя информационной базы, выберите <strong>На сервере 1С:Предприятия</strong> задайте следующие настройки:</p>\n<ul>\n<li><strong>Кластер серверов</strong> — <code>server-1c.ru-central1.internal</code>.</li>\n<li><strong>Имя информационной базы</strong> — <code>1c</code>.</li>\n</ul>\n<p>Нажмите <strong>Далее</strong>.</p>\n</li>\n<li>\n<p>Нажмите <strong>Готво</strong>.</p>\n</li>\n</ol>\n<p>Информационная база должна появиться в списке баз. После этого вы можете приступить к конфигурированию и использованию базы.</p>\n<h2 id=\"clear-out\"><a href=\"#clear-out\" class=\"yfm-anchor\" aria-hidden=\"true\"></a>Удалите созданные ресурсы</h2>\n<p>Чтобы перестать платить за развернутую инфраструктуру, <a href=\"../../compute/operations/vm-control/vm-delete\">удалите</a> виртуальные машины <code>server-1c</code> и <code>licensing-server-1c</code>, а также кластер <code>1c-pg</code>.</p>\n<p>Если вы зарезервировали публичный статический IP-адрес, <a href=\"../../vpc/operations/address-delete\">удалите его</a>.</p>\n",
        "title": "Использование «1С:Предприятия» с Managed Service for PostgreSQL",
        "headings": [
            {
                "title": "Подготовьте облако к работе",
                "href": "#before-you-begin",
                "level": 2,
                "items": [
                    {
                        "title": "Необходимые платные ресурсы",
                        "href": "#paid-resources",
                        "level": 3
                    }
                ]
            },
            {
                "title": "Подготовьте инфраструктуру",
                "href": "#prepare",
                "level": 2
            },
            {
                "title": "Создайте ВМ для сервера «1С:Предприятие»",
                "href": "#create-1c-vm",
                "level": 2
            },
            {
                "title": "Создайте ВМ для сервера лицензирования",
                "href": "#create-1c-license-vm",
                "level": 2
            },
            {
                "title": "Создайте кластер Managed Service for PostgreSQL",
                "href": "#create-pg-cluster",
                "level": 2
            },
            {
                "title": "Настройте Samba-сервер",
                "href": "#set-up-samba",
                "level": 2
            },
            {
                "title": "Установите сервер «1С:Предприятия»",
                "href": "#setup-1c-server",
                "level": 2
            },
            {
                "title": "Настройте Samba-сервер для сервера лицензий",
                "href": "#set-up-samba-for-license-server",
                "level": 2
            },
            {
                "title": "Установите сервер «1С:Предприятия» для сервиса лицензий",
                "href": "#setup-1c-license-server",
                "level": 2
            },
            {
                "title": "Настройте кластер серверов",
                "href": "#setup-cluster",
                "level": 2
            },
            {
                "title": "Настройте информационную базу",
                "href": "#setup-infobase",
                "level": 2
            },
            {
                "title": "Подключитесь к информационной базе",
                "href": "#connect-to-infobase",
                "level": 2
            },
            {
                "title": "Удалите созданные ресурсы",
                "href": "#clear-out",
                "level": 2
            }
        ],
        "meta": {},
        "toc": {
            "title": "Сценарии использования",
            "href": "/docs/solutions/",
            "items": [
                {
                    "name": "Веб-сервис",
                    "items": [
                        {
                            "name": "Все сценарии",
                            "href": "/docs/solutions/web/",
                            "id": "77fadc60461d164e2a49e87f12dce869"
                        },
                        {
                            "name": "Cтатический сайт в Object Storage",
                            "href": "/docs/solutions/web/static",
                            "id": "95f9faac42d21dc358fe3524727d5907"
                        },
                        {
                            "name": "Cайт на LAMP- или LEMP-стеке",
                            "href": "/docs/solutions/web/lamp-lemp",
                            "id": "954bfe9114f1434c98cf4ffba6b25f68"
                        },
                        {
                            "name": "Отказоустойчивый сайт с балансировкой нагрузки через Yandex Load Balancer",
                            "href": "/docs/solutions/web/load-balancer-website",
                            "id": "0ac2805f020a0887e477f039447d4575"
                        },
                        {
                            "name": "Отказоустойчивый сайт с использованием DNS-балансировки",
                            "href": "/docs/solutions/web/dns-load-balancer",
                            "id": "cf6b1d361d53f7e49a7b4cf9a61ae8fe"
                        },
                        {
                            "name": "Сайт на базе Joomla с БД PostgreSQL",
                            "href": "/docs/solutions/web/joomla-postgresql",
                            "id": "62284e4d23a46c2b39b0d85faf41e98a"
                        },
                        {
                            "name": "Сайт на WordPress",
                            "href": "/docs/solutions/web/wordpress",
                            "id": "3b4e1a074917aa5422367f50f74a3300"
                        },
                        {
                            "name": "Сайт на WordPress с БД MySQL",
                            "href": "/docs/solutions/web/wordpress-mysql",
                            "id": "f8b004acd234b543e408fd53f8d2b727"
                        },
                        {
                            "name": "Веб-сайт на базе 1С-Битрикс",
                            "href": "/docs/solutions/web/bitrix-website",
                            "id": "92b7b98e98d177239eb9948209089d0a"
                        }
                    ],
                    "id": "37f9d0b0409dfaabca24813918c87427"
                },
                {
                    "name": "Интернет-магазины",
                    "items": [
                        {
                            "name": "Все сценарии",
                            "href": "/docs/solutions/internet-store/",
                            "id": "6495b6c0005a7e53c1fd3d9b03df3fb2"
                        },
                        {
                            "name": "Интернет-магазин на 1С-Битрикс",
                            "href": "/docs/solutions/internet-store/bitrix-shop",
                            "id": "76055b637dff6d0efcd42e43b4598cf6"
                        },
                        {
                            "name": "Интернет-магазин на Opencart",
                            "href": "/docs/solutions/internet-store/opencart",
                            "id": "8a3231c978a02a16f81d09e534b97602"
                        }
                    ],
                    "id": "1c88d1bc008a3d5017d645fecb20e7a4"
                },
                {
                    "name": "Архив данных",
                    "items": [
                        {
                            "name": "Все сценарии",
                            "href": "/docs/solutions/archive/",
                            "id": "4782bcb43fa7b1d0c85fe3635eb6fea8"
                        },
                        {
                            "name": "Однонодовый файловый сервер",
                            "href": "/docs/solutions/archive/single-node-file-server",
                            "id": "d906668c2eaee4851bec3471d58b3274"
                        },
                        {
                            "name": "Настройка SFTP-сервера на Centos 7",
                            "href": "/docs/solutions/archive/backup-and-archive-to-sftp",
                            "id": "fbdbfc9bf1d18675fe854d2a26990be7"
                        },
                        {
                            "name": "Резервное копирование в Object Storage через Acronis",
                            "href": "/docs/solutions/archive/object-storage-acronis",
                            "id": "268d2f8b2792dffcca8f3562da909c4c"
                        },
                        {
                            "name": "Резервное копирование в Object Storage через CloudBerry Desktop Backup",
                            "href": "/docs/solutions/archive/object-storage-cloudberry",
                            "id": "346e439b174d68a3c87f8cfa9ec3abff"
                        },
                        {
                            "name": "Резервное копирование в Object Storage через Duplicati",
                            "href": "/docs/solutions/archive/object-storage-duplicati",
                            "id": "7d4da85f5396b541b09e90f03a8a53fe"
                        },
                        {
                            "name": "Резервное копирование в Object Storage через Bacula",
                            "href": "/docs/solutions/archive/backup-with-bacula",
                            "id": "1355b5ead43f6a40a35ebc27408fb42b"
                        },
                        {
                            "name": "Настройка SFTP-сервера на Centos 7",
                            "href": "/docs/solutions/archive/backup-and-archive-to-sftp",
                            "id": "fbdbfc9bf1d18675fe854d2a26990be7"
                        },
                        {
                            "name": "Оцифровка архива в Yandex Vision",
                            "href": "/docs/solutions/archive/archive-from-vision-to-object-storage",
                            "id": "84d7aeaf2cd3658b95f3dcdf22d34cae"
                        }
                    ],
                    "id": "c387b0ca4e2ba00c53b4bc09f38f3962"
                },
                {
                    "name": "Тестовая среда",
                    "items": [
                        {
                            "name": "Все сценарии",
                            "href": "/docs/solutions/testing/",
                            "id": "904d7be8b60b9b2717b4a0ca7b3f64f6"
                        },
                        {
                            "name": "Тестирование приложений с помощью GitLab",
                            "href": "/docs/solutions/testing/gitlab",
                            "id": "7f39a62cf23b74bf8581b2e8e9aa5214"
                        },
                        {
                            "name": "Создание тестовых ВМ через GitLab CI",
                            "href": "/docs/solutions/testing/ci-for-snapshots",
                            "id": "46a558a5c07467323a0dbf740500d587"
                        },
                        {
                            "name": "Высокопроизводительные вычисления на прерываемых виртуальных машинах",
                            "href": "/docs/solutions/testing/hpc-on-preemptible",
                            "id": "9fd70c66b59e00c5710a5b923784fed6"
                        }
                    ],
                    "id": "290c2ac2227a0f3de28cec46b8b56545"
                },
                {
                    "name": "Управление инфраструктурой",
                    "items": [
                        {
                            "name": "Все сценарии",
                            "href": "/docs/solutions/infrastructure-management/",
                            "id": "2d684167e1cd25ec655f8dc7a8bbb426"
                        },
                        {
                            "name": "Начало работы с Terraform",
                            "href": "/docs/solutions/infrastructure-management/terraform-quickstart",
                            "id": "fdd31b71999a7a6ca96786feba97a26b"
                        },
                        {
                            "name": "Хранение состояний Terraform в Object Storage",
                            "href": "/docs/solutions/infrastructure-management/terraform-state-storage",
                            "id": "4f14693db166eac4ebf54c1822a8c997"
                        },
                        {
                            "name": "Начало работы с Packer",
                            "href": "/docs/solutions/infrastructure-management/packer-quickstart",
                            "id": "f309be358600f8d56920f6c68eafe02e"
                        },
                        {
                            "name": "Автоматизация сборки образов ВМ с помощью Jenkins",
                            "href": "/docs/solutions/infrastructure-management/jenkins",
                            "id": "7c4722c05e80c8864befba4609204585"
                        },
                        {
                            "name": "Непрерывное развертывание контейнеризованных приложений с помощью GitLab",
                            "href": "/docs/solutions/infrastructure-management/gitlab-containers",
                            "id": "6c6bd257dfa1e67932385ca88747f260"
                        },
                        {
                            "name": "Создание кластера Linux-серверов «1С:Предприятия» с кластером Managed Service for PostgreSQL",
                            "href": "/docs/solutions/infrastructure-management/1c-postgresql-linux",
                            "id": "93f6bc0d941e9e10f297459b9f79237d"
                        },
                        {
                            "name": "Создание кластера Windows-серверов «1С:Предприятия» с базой данных MS SQL Server",
                            "href": "/docs/solutions/infrastructure-management/1c-mssql-windows",
                            "id": "2a7543d775f2658cf40fd1b83328727f"
                        },
                        {
                            "name": "Миграция в Яндекс.Облако с помощью Hystax Acura",
                            "href": "/docs/solutions/infrastructure-management/hystax-migration",
                            "id": "c6ba78d7792c9a57490bcbdc47f94f16"
                        },
                        {
                            "name": "Аварийное восстановление в Яндекс.Облако с помощью Hystax Acura",
                            "href": "/docs/solutions/infrastructure-management/hystax-disaster-recovery",
                            "id": "7e1c3a52b1369d56dc1ce261e092ddbf"
                        }
                    ],
                    "id": "c7a6de00b4f95a58163496d27cd1a9a8"
                },
                {
                    "name": "Windows в Яндекс.Облаке",
                    "items": [
                        {
                            "name": "Все сценарии",
                            "href": "/docs/solutions/windows/",
                            "id": "f44cfc6a6faf5883491065f7abd74424"
                        },
                        {
                            "name": "Развертывание Active Directory",
                            "href": "/docs/solutions/windows/active-directory",
                            "id": "e610b32d476738781c795a95c072ab5b"
                        },
                        {
                            "name": "Развертывание Microsoft Exchange",
                            "href": "/docs/solutions/windows/exchange",
                            "id": "e1283dc9f511d66c531a0f863343b5cf"
                        },
                        {
                            "name": "Развертывание Remote Desktop Services",
                            "href": "/docs/solutions/windows/rds",
                            "id": "01e32dfc980185272bb19bf0bd945639"
                        }
                    ],
                    "id": "39d7df5c489b54dc802479412c627c75"
                },
                {
                    "name": "Сетевая маршрутизация",
                    "items": [
                        {
                            "name": "Все сценарии",
                            "href": "/docs/solutions/routing/",
                            "id": "a6bdca14c36aa7408213d2ecd986984c"
                        },
                        {
                            "name": "Маршрутизация с помощью NAT-инстанса",
                            "href": "/docs/solutions/routing/nat-instance",
                            "id": "8e9460d782056f2c0531fb57f3f6b36b"
                        },
                        {
                            "name": "Создание VPN-туннеля",
                            "href": "/docs/solutions/routing/ipsec-vpn",
                            "id": "a96d498bb8b8817d4d5118d15d6db9b2"
                        },
                        {
                            "name": "Установка виртуального роутера Cisco CSR1000v",
                            "href": "/docs/solutions/routing/cisco",
                            "id": "69fabdc7ed95ef716096fd0c5511d246"
                        },
                        {
                            "name": "Установка виртуального роутера Mikrotik CHR",
                            "href": "/docs/solutions/routing/mikrotik",
                            "id": "54c2c11832ee3192697c5d581f061192"
                        },
                        {
                            "name": "Создание VPN-соединения с помощью OpenVPN",
                            "href": "/docs/solutions/routing/openvpn",
                            "id": "171fb5f0b4227735ab3fa6d3b2abf572"
                        }
                    ],
                    "id": "273c2638ab8bc4858e0edb5f8283e48e"
                },
                {
                    "name": "DataLens",
                    "items": [
                        {
                            "name": "Все сценарии",
                            "href": "/docs/solutions/datalens/",
                            "id": "b7478426d63ead6e9262f902c383e689"
                        },
                        {
                            "name": "Визуализация данных из CSV-файла",
                            "href": "/docs/solutions/datalens/data-from-csv-visualization",
                            "id": "6c5b6a0cf771a52eba3314c3fc65a1cc"
                        },
                        {
                            "name": "Визуализация данных из базы данных ClickHouse",
                            "href": "/docs/solutions/datalens/data-from-ch-visualization",
                            "id": "b9f86a6854eec17de929d33e80e0adc0"
                        },
                        {
                            "name": "Визуализация данных из Метрики",
                            "href": "/docs/solutions/datalens/data-from-metrica-visualization",
                            "id": "c41c318af7b3711301473b68f7e10db2"
                        },
                        {
                            "name": "Визуализация данных из Metriсa Logs API",
                            "href": "/docs/solutions/datalens/data-from-metrica-logsapi-visualization",
                            "id": "e05d4c04785bf8bd6c9d3018c5200596"
                        },
                        {
                            "name": "Публикация в DataLens Public диаграммы с картой на основе CSV-файла",
                            "href": "/docs/solutions/datalens/data-from-csv-to-public-visualization",
                            "id": "b93cbd6a81582cd0289f3af156fcf4d9"
                        },
                        {
                            "name": "Визуализация данных из AppMetrica",
                            "href": "/docs/solutions/datalens/data-from-appmetrica-visualization",
                            "id": "0f0557d09554c700716d79670da8121e"
                        },
                        {
                            "name": "Визуализация геоданных из CSV-файла",
                            "href": "/docs/solutions/datalens/data-from-csv-geo-visualization",
                            "id": "b4786057d9609ec864230f450eed53f7"
                        }
                    ],
                    "id": "aaa4d8f3c0d6dc765f5950f8f2b91a62"
                }
            ]
        },
        "breadcrumbs": [
            {
                "name": "Управление инфраструктурой"
            },
            {
                "name": "Создание кластера Linux-серверов «1С:Предприятия» с кластером Managed Service for PostgreSQL"
            }
        ],
        vcsType,
        "vcsUrl": "https://github.com/yandex-cloud/docs/tree/master/ru/solutions/infrastructure-management/1c-postgresql-linux.md",
        lang,
        router
    });
}
/* eslint-enable */
