import type {RenderSidebarIcon} from '@diplodoc/components';

import {Icon, configure as configureUikit} from '@gravity-ui/uikit';
import {Dots9, SquareListUl, Xmark} from '@gravity-ui/icons';
import {useState} from 'react';
import cn from 'bem-cn-lite';

import {DocPage, configure as configureDocs} from '@diplodoc/components';

import {ServiceLink} from '../shared/service-link';
import {TocTitleIcon} from '../shared/toc-title-icon';
import {
    availableLangsArgType,
    beforeSubNavigationContent,
    commonArgTypes,
    commonArgs,
    extendedLangs,
    resolveAvailableLangs,
} from '../shared/story-config';
import {
    type StoryArgs,
    convertPathToOriginalArticle,
    createGeneratePathToVcs,
    renderLoader,
    usePageProps,
} from '../shared/use-page-props';

import {getContent} from './data';

const layoutBlock = cn('Layout');

configureUikit({lang: 'en'});
configureDocs({lang: 'en'});

const renderSidebarIcon: RenderSidebarIcon = ({isSidebarOpened}) =>
    isSidebarOpened ? <Xmark width={20} height={20} /> : <Dots9 width={20} height={20} />;

type DocPageDemoProps = StoryArgs & {
    HideTocHeader?: boolean;
    HideFeedback?: boolean;
    HideAsideFeedback?: boolean;
    CollapsibleToc?: boolean;
    HeadingCount?: number;
    Summary?: string;
};

const DocPageDemo = (args: DocPageDemoProps) => {
    const {lang, singlePage, mobileView, base, overrides} = usePageProps(args, {
        langs: extendedLangs,
        withConsent: true,
    });
    const [tocCollapsed, setTocCollapsed] = useState(false);

    const content = getContent(lang, singlePage);

    let tocTitleIcon = <TocTitleIcon />;
    if (content.toc.extraHeader) {
        content.toc.extraHeader = <ServiceLink />;
        tocTitleIcon = <Icon data={SquareListUl} size={16} />;
    }

    const props = {
        ...content,
        ...base,
        headings:
            typeof args.HeadingCount === 'number'
                ? content.headings.slice(0, args.HeadingCount)
                : content.headings,
        meta: {...content.meta, summary: args.Summary},
    };
    Object.assign(props, ...overrides);

    const viewerInterface = {
        'feedback-comment': true,
        ...(args['HideAsideFeedback'] ? {'feedback-aside': false} : {}),
    };

    return (
        <div className={layoutBlock('content')}>
            <DocPage
                {...props}
                tocTitleIcon={tocTitleIcon}
                convertPathToOriginalArticle={convertPathToOriginalArticle}
                generatePathToVcs={createGeneratePathToVcs(lang)}
                renderLoader={renderLoader}
                hideTocHeader={args['HideTocHeader']}
                hideFeedback={args['HideFeedback']}
                viewerInterface={viewerInterface}
                availableLangs={resolveAvailableLangs(args['AvailableLangs'])}
                beforeSubNavigationContent={mobileView ? undefined : beforeSubNavigationContent}
                renderSidebarIcon={renderSidebarIcon}
                tocCollapsed={args['CollapsibleToc'] ? tocCollapsed : undefined}
                onChangeTocCollapsed={args['CollapsibleToc'] ? setTocCollapsed : undefined}
                // TODO: return highlight examples
                // onContentMutation={onContentMutation}
                // onContentLoaded={onContentLoaded}
            />
        </div>
    );
};

export default {
    title: 'Pages/Document',
    component: DocPageDemo,
    argTypes: {
        ...commonArgTypes,
        HideTocHeader: {control: 'boolean'},
        HideFeedback: {control: 'boolean'},
        HideAsideFeedback: {control: 'boolean'},
        CollapsibleToc: {control: 'boolean'},
        HeadingCount: {control: 'number'},
        Summary: {control: 'text'},
        AvailableLangs: availableLangsArgType,
    },
};

export const Document = {
    args: {
        ...commonArgs,
        HideTocHeader: false,
        HideFeedback: false,
        HideAsideFeedback: false,
        CollapsibleToc: false,
        Summary: '',
    },
};

export const WithSummary = {
    args: {
        ...Document.args,
        Mobile: true,
        Summary:
            'A short summary that describes the page and helps readers understand what they will find inside.',
    },
};

export const WithSummaryOnly = {
    args: {
        ...Document.args,
        HeadingCount: 1,
        Mobile: true,
        Summary: 'Короткое описание статьи "О нас"',
    },
};
