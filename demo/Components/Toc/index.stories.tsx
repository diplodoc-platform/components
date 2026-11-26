import {Toc} from '@diplodoc/components';

export default {
    title: 'Components/Toc',
    render: ({article}: {article: string}) => (
        <Toc
            title="Documentation"
            router={{pathname: article}}
            expansionStorageKey="storybook-toc-expansion"
            items={[
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
            ]}
        />
    ),
};

export const PersistentExpansion = {
    args: {article: 'overview'},
};
