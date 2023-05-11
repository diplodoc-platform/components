import React from 'react';
import block from 'bem-cn-lite';
import {withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';
import {Link, Button} from '@gravity-ui/uikit';

import {Lang} from '../../models';
import {ERROR_CODES} from '../../constants';

import './ErrorPage.scss';

const b = block('ErrorPage');

export interface ErrorPageProps {
    code?: number;
    lang?: Lang;
    pageGroup?: string;
    homeUrl?: string;
    receiveAccessUrl?: string;
}

type ErrorPagePropsInnerProps = ErrorPageProps & WithTranslation & WithTranslationProps;

const ErrorPage = ({
    code = 500,
    lang = Lang.En,
    i18n,
    t,
    homeUrl,
    receiveAccessUrl,
    pageGroup,
}: ErrorPagePropsInnerProps): JSX.Element => {
    let title;
    let description;
    const href = homeUrl || '/';
    const homeLink = (
        <Link href={href}>
            <Button className={b('description-link')}>{t('label_link-main')}</Button>
        </Link>
    );

    if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
    }

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
            description = homeLink;
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
            <h2 className={b('title')}>{title}</h2>
            <p className={b('description')}>{description}</p>
        </div>
    );
};

export default withTranslation('error')(ErrorPage);
