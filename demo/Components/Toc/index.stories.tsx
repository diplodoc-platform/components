import {useState} from 'react';

import {Toc} from '@diplodoc/components';

const toc = {
    title: 'Documentation',
    items: [
        {id: 'overview', name: 'Overview', href: 'overview'},
        {
            id: 'guide',
            name: 'Guide',
            href: 'guide',
            expanded: true,
            items: [{id: 'setup', name: 'Setup', href: 'setup'}],
        },
        {
            id: 'examples',
            name: 'Examples',
            items: [{id: 'basic-example', name: 'Basic example', href: 'basic-example'}],
        },
        {id: 'reference', name: 'Reference', href: 'reference'},
    ],
};

export default {
    title: 'Components/Toc',
};

export const PersistentExpansion = {
    args: {article: 'overview'},
    render: ({article}: {article: string}) => (
        <Toc {...toc} router={{pathname: article}} expansionStorageKey="storybook-toc-expansion" />
    ),
};

function SpaNavigationDemo() {
    const [article, setArticle] = useState('overview');

    return (
        <>
            <button type="button" onClick={() => setArticle('setup')}>
                Navigate to Setup
            </button>
            <button type="button" onClick={() => setArticle('reference')}>
                Navigate to Reference
            </button>
            <Toc
                {...toc}
                router={{pathname: article}}
                expansionStorageKey="storybook-toc-spa-expansion"
            />
        </>
    );
}

export const SpaNavigation = {
    render: SpaNavigationDemo,
};
