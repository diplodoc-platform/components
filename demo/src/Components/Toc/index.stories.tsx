import React, {useEffect, useState} from 'react';
import {Toc as Component, LabelProps, TocItem, TocLabel} from '@diplodoc/components';
import cn from 'bem-cn-lite';

import {getTocItems} from './data';
import './index.scss';

const layoutBlock = cn('Layout');

type Args = {
    Title: string;
    TocTitleIcon: string;
    HideTocHeader: boolean;
    SinglePage: boolean;
    PdfLink: string;
    LabelTitle: string;
    LabelDescription: string;
    LabelTheme: LabelProps['theme'];
};

const useSinglePage = (value: boolean) => {
    const [singlePage, onChangeSinglePage] = useState(value);

    return {
        singlePage,
        onChangeSinglePage,
    };
};

const TocDemo = (args: Args) => {
    const {
        ['Title']: currentTitle,
        ['TocTitleIcon']: currentTocTitleIcon,
        ['HideTocHeader']: currentHideTocHeader,
        ['PdfLink']: currentPdfLink,
        ['SinglePage']: currentSinglePage,
        ['LabelTitle']: currentLalbelTitle,
        ['LabelDescription']: currentLabelDescription,
        ['LabelTheme']: currentLabelTheme,
    } = args;
    const {singlePage, onChangeSinglePage} = useSinglePage(currentSinglePage);

    const router = {pathname: '/docs'};
    const label: TocLabel = {
        title: currentLalbelTitle,
        description: currentLabelDescription,
        theme: currentLabelTheme,
    };
    const items: TocItem[] = getTocItems(singlePage);

    useEffect(() => {
        onChangeSinglePage(currentSinglePage);
    }, [currentSinglePage, onChangeSinglePage]);

    return (
        <div className={layoutBlock('content')}>
            <Component
                items={items}
                singlePage={singlePage}
                onChangeSinglePage={onChangeSinglePage}
                hideTocHeader={currentHideTocHeader}
                tocTitleIcon={currentTocTitleIcon}
                pdfLink={currentPdfLink}
                title={currentTitle}
                router={router}
                label={label}
            />
        </div>
    );
};

export default {
    title: 'Components/ToC',
    component: TocDemo,
    argTypes: {
        Title: {
            control: 'text',
        },
        TocTitleIcon: {
            control: 'text',
        },
        LabelTitle: {
            control: 'text',
        },
        LabelDescription: {
            control: 'text',
        },
        LabelTheme: {
            control: 'select',
            options: [
                'info',
                'normal',
                'danger',
                'warning',
                'success',
                'utility',
                'unknown',
                'clear',
            ],
        },
        HideTocHeader: {
            control: 'boolean',
        },
        SinglePage: {
            control: 'boolean',
        },
        PdfLink: {
            control: 'text',
        },
    },
};

export const ToC = {
    args: {
        Title: 'Table of Contents',
        TocTitleIcon: '📑',
        LabelTitle: 'NEW',
        LabelDescription: 'You can select another theme for the label',
        LabelTheme: 'info',
        HideTocHeader: false,
        SinglePage: false,
        PdfLink: 'https://doc.yandex-team.ru/help/diy/diy-guide.pdf',
    },
};
