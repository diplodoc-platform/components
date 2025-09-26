import React from 'react';
import {Button, Link} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {ERROR_CODES} from '../../constants';
import {useTranslation} from '../../hooks';

import './ErrorPage.scss';

const b = block('ErrorPage');

type LinkType = {
    url: string;
    code: string;
};

export interface ErrorPageProps {
    code?: number;
    pageGroup?: string;
    homeUrl?: string;
    receiveAccessUrl?: string;
    links?: LinkType[];
    errorTitle?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
    code = 500,
    homeUrl,
    receiveAccessUrl,
    pageGroup,
    links,
    errorTitle,
}) => {
    let title;
    let description;
    const {t} = useTranslation('error');
    const href = homeUrl || '/';
    const homeLink = (
        <Link href={href}>
            <Button className={b('description-link')}>{t('label_link-main')}</Button>
        </Link>
    );

    switch (code) {
        case ERROR_CODES.ACCESS_DENIED:
            title = pageGroup ? t('label_title-403_page-group') : t('label_title-403_project');
            description = (
                <React.Fragment>
                    {homeLink}
                    {receiveAccessUrl && (
                        <Link href={receiveAccessUrl} target="_blank" rel="noopener noreferrer">
                            <Button view="action" className={b('description-link')}>
                                {t('label_link-access')}
                            </Button>
                        </Link>
                    )}
                </React.Fragment>
            );
            break;
        case ERROR_CODES.NOT_FOUND:
            title = t('label_title-404');
            description = (
                <React.Fragment>
                    {links && links.length > 0 && (
                        <div className={b('subtext')}>
                            {links.map((link) => {
                                return (
                                    <Link href={link.url} key={link.code}>
                                        <Button view="outlined-info">
                                            {t(`label_lang-${link.code}`)}
                                        </Button>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                    <div>{homeLink}</div>
                </React.Fragment>
            );
            break;
        default:
            title = t('label_title-500');
            description = (
                <React.Fragment>
                    {t('label_description-1')}
                    <Button
                        className={b('description-link')}
                        onClick={() => window.location.reload()}
                    >
                        {t('label_description-link')}
                    </Button>
                </React.Fragment>
            );
    }

    return (
        <div className={b()}>
            <div
                title={`Error image for ${code} code`}
                className={b('image', {code: code.toString()})}
            />
            <h1 className={b('code')}>{t('label_title-code', {code})}</h1>
            <h2 className={b('title')}>
                {errorTitle || title}
                {code === ERROR_CODES.NOT_FOUND &&
                    links &&
                    links.length > 0 &&
                    `. ${t('label_subtext')}`}
            </h2>
            <p className={b('description')}>{description}</p>
        </div>
    );
};

export default ErrorPage;
