import React from 'react';
import {LogoMarkdown} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';

import {useTranslation} from '../../../../hooks';

export interface MarkdownButtonProps {
    mdDocsUrl: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
}

const MarkdownButton: React.FC<MarkdownButtonProps> = ({mdDocsUrl, onClick}) => {
    const {t} = useTranslation('markdown-button');

    return (
        <Button size="m" href={mdDocsUrl} target="_blank" onClick={onClick}>
            <Icon data={LogoMarkdown} /> {t('view-in-markdown')}
        </Button>
    );
};

export default MarkdownButton;
