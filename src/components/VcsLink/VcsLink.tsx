import React from 'react';
import block from 'bem-cn-lite';
import {withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';

import GithubIcon from '../../../assets/icons/github.svg';
import ArcanumIcon from '../../../assets/icons/arcanum.svg';

import {Vcs, Lang} from '../../models';

import './VcsLink.scss';

const b = block('dc-vcs-link');

export interface VcsLinkProps {
    vcsUrl: string;
    vcsType: Vcs;
    lang: Lang;
    className?: string;
}

type VcsLinkInnerProps =
    & VcsLinkProps
    & WithTranslation
    & WithTranslationProps;

export interface IconProps {
    className: string;
    width: number;
    height: number;
}

class VcsLink extends React.Component<VcsLinkInnerProps> {
    componentDidUpdate(prevProps: VcsLinkProps) {
        const {i18n, lang} = this.props;
        if (prevProps.lang !== lang) {
            i18n.changeLanguage(lang);
        }
    }

    render() {
        const {vcsUrl, className} = this.props;

        return (
            <a
                href={vcsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className={b(null, className)}
            >
                {this.renderIcon()}
                {this.renderText()}
            </a>
        );
    }

    private renderIcon() {
        const {vcsType} = this.props;

        const iconSize = 24;
        const iconClassName = b('icon', {type: vcsType});
        const iconProps: IconProps = {
            className: iconClassName,
            width: iconSize,
            height: iconSize,
        };

        switch (vcsType) {
            case Vcs.Github:
                return <GithubIcon {...iconProps}/>;
            case Vcs.Arcanum:
                return <ArcanumIcon {...iconProps}/>;
            default:
                return null;
        }
    }

    private renderText() {
        const {vcsType, lang, i18n, t} = this.props;

        if (i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }

        return t(`label_link-${vcsType}`);
    }
}

export default withTranslation('vcsLink')(VcsLink);
