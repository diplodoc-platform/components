import {BackToTop as Component} from '@diplodoc/components';

const BackToTopDemo = () => (
    <div style={{height: '3000px', padding: '24px'}}>
        Scroll down to see the button
        <Component />
    </div>
);

export default {
    title: 'Components/BackToTop',
    component: BackToTopDemo,
};

export const BackToTop = {};
