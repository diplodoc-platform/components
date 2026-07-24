import type {VcsType} from '@diplodoc/components';

import {Icon, configure as configureUikit} from '@gravity-ui/uikit';
import cn from 'bem-cn-lite';
import {SquareListUl} from '@gravity-ui/icons';
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
    convertPathToOriginalArticle,
    createGeneratePathToVcs,
    renderLoader,
    usePageProps,
} from '../shared/use-page-props';

import {getContent} from './data';

const layoutBlock = cn('Layout');

configureUikit({lang: 'en'});
configureDocs({lang: 'en'});

const DocPageDemo = (
    args: Record<string, boolean> & {Pdf: string; Search: string; VCS: VcsType},
) => {
    const {lang, singlePage, base, overrides} = usePageProps(args, {
        langs: extendedLangs,
        withConsent: true,
    });

    const content = getContent(lang, singlePage);

    let tocTitleIcon = <TocTitleIcon />;
    if (content.toc.extraHeader) {
        content.toc.extraHeader = <ServiceLink />;
        tocTitleIcon = <Icon data={SquareListUl} size={16} />;
    }

    const props = {...content, ...base};
    Object.assign(props, ...overrides);

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
                availableLangs={resolveAvailableLangs(args['AvailableLangs'])}
                beforeSubNavigationContent={beforeSubNavigationContent}
                // TODO: return highlight examples
                // onContentMutation={onContentMutation}
                // onContentLoaded={onContentLoaded}
            />
        </div>
    );
};

export default {
    title: 'Pages/DocPageGallery',
    component: DocPageDemo,
    argTypes: {
        ...commonArgTypes,
        HideTocHeader: {control: 'boolean'},
        HideFeedback: {control: 'boolean'},
        AvailableLangs: availableLangsArgType,
    },
};

export const DocPageGallery = {
    args: {
        ...commonArgs,
        HideTocHeader: false,
        HideFeedback: false,
    },
};
