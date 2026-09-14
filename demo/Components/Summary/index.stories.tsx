import type {SummaryProps} from '@diplodoc/components';

import {Summary as Component} from '@diplodoc/components';

const summary =
    'A short summary that describes the page and helps readers understand what they will find inside.';

type SummaryDemoProps = SummaryProps & {Mobile?: boolean};

const SummaryDemo = ({Mobile, ...props}: SummaryDemoProps) => (
    <div style={{boxSizing: 'border-box', width: Mobile ? '320px' : '200px'}}>
        <Component {...props} />
    </div>
);

export default {
    title: 'Components/Summary',
    component: SummaryDemo,
};

export const Summary = {
    args: {summary, Mobile: false},
};

export const Mobile = {
    args: {summary, Mobile: true},
};
