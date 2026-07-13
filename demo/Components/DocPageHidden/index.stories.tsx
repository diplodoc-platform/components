import type {VcsType} from '@diplodoc/components';

import {configure as configureUikit} from '@gravity-ui/uikit';
import cn from 'bem-cn-lite';
import {DocPage, InterfaceProvider, configure as configureDocs} from '@diplodoc/components';

import {TocTitleIcon} from '../shared/toc-title-icon';
import {commonArgTypes, commonArgs} from '../shared/story-config';
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

const HIDDEN_INTERFACE = {
    toc: false,
    search: false,
    feedback: false,
};

const DocPageHiddenDemo = (
    args: Record<string, boolean> & {Pdf: string; Search: string; VCS: VcsType},
) => {
    const {lang, singlePage, base, overrides} = usePageProps(args);

    const props = {
        ...getContent(lang, singlePage),
        ...base,
        viewerInterface: HIDDEN_INTERFACE,
    };
    Object.assign(props, ...overrides);

    return (
        <div className={layoutBlock('content')}>
            <InterfaceProvider interface={HIDDEN_INTERFACE}>
                <DocPage
                    {...props}
                    tocTitleIcon={<TocTitleIcon />}
                    convertPathToOriginalArticle={convertPathToOriginalArticle}
                    generatePathToVcs={createGeneratePathToVcs(lang)}
                    renderLoader={renderLoader}
                    showSearchBar={true}
                    // TODO: return highlight examples
                    // onContentMutation={onContentMutation}
                    // onContentLoaded={onContentLoaded}
                />
            </InterfaceProvider>
        </div>
    );
};

export default {
    title: 'Pages/DocPageHidden',
    component: DocPageHiddenDemo,
    argTypes: commonArgTypes,
};

export const DocPageHidden = {
    args: commonArgs,
};
