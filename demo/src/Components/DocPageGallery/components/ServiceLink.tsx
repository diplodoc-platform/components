import React from 'react';
import {Icon, Link} from '@gravity-ui/uikit';
import {ArrowUpRightFromSquare, TextAlignLeft} from '@gravity-ui/icons';
import block from 'bem-cn-lite';

import './ServiceLink.scss';

const b = block('extra-header');

export const ServiceLink = () => (
    <Link href="/docs/overview/" className={b()} data-router-shallow>
        <div className={b('icon', 'start-icon')}>
            <Icon data={TextAlignLeft} size={16} />
        </div>
        <div className={b('title')}>
            Страница сервиса <br /> Yandex Cloud Logging
        </div>
        <div className={b('icon', 'end-icon')}>
            <Icon data={ArrowUpRightFromSquare} size={16} />
        </div>
    </Link>
);
