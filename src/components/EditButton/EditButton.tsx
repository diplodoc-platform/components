import React from 'react';
import block from 'bem-cn-lite';
import {withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';

import EditIcon from '../../../assets/icons/edit.svg';

import {Lang} from '../../models';

import './EditButton.scss';

const b = block('dc-edit-button');

export interface EditButtonProps {
    lang: Lang;
    href: string;
}

type EditButtonInnerProps =
    & EditButtonProps
    & WithTranslation
    & WithTranslationProps;

class EditButton extends React.Component<EditButtonInnerProps> {
    componentDidUpdate(prevProps: EditButtonProps) {
        const {i18n, lang} = this.props;
        if (prevProps.lang !== lang) {
            i18n.changeLanguage(lang);
        }
    }

    render() {
        const {t, href} = this.props;

        return (
            <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
            >
                <button className={b()}>
                    <EditIcon/>
                    <span className={b('text')}>{t('edit-text')}</span>
                </button>
            </a>
        );
    }
}

export default withTranslation('controls')(EditButton);
