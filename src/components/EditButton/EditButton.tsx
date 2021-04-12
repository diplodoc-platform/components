import React, {ReactElement} from 'react';
import block from 'bem-cn-lite';
import {withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';

import {Button} from '../Button';

import EditIcon from '../../../assets/icons/edit.svg';

import {ButtonThemes, Lang} from '../../models';

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

        const wrapper = (el: ReactElement) => (
            <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
            >
                {el}
            </a>
        );

        return (
            <Button
                wrapper={wrapper}
                className={b()}
                theme={ButtonThemes.Float}
            >
                <EditIcon/>
                <span className={b('text')}>{t('edit-text')}</span>
            </Button>
        );
    }
}

export default withTranslation('controls')(EditButton);
