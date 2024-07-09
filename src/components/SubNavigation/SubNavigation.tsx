import React from 'react';

// import {DocHeadingItem, MiniToc, Router} from '@diplodoc/components';
import {ArrowShapeTurnUpRight, SquareListUl} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import './subnavigation.scss';

const b = block('dc-subnavigation');

// interface SubNavigationProps {
//     children?: ReactElement;
// }

export const SubNavigation = () => {
    // const headings: DocHeadingItem[] = [
    //     {title: 'Title 0', href: '', level: 0},
    //     {title: 'Title 1', href: '', level: 1},
    //     {title: 'Title 1', href: '', level: 1},
    //     {title: 'Title 2', href: '', level: 2},
    //     {title: 'Title 2', href: '', level: 2},
    //     {title: 'Title 2', href: '', level: 2},
    //     {title: 'Title 2', href: '', level: 2},
    //     {title: 'Title 2', href: '', level: 2},
    //     {title: 'Title 2', href: '', level: 2},
    //     {title: 'Title 2', href: '', level: 2},
    //     {title: 'Title 2', href: '', level: 2},
    //     {title: 'Title 2', href: '', level: 2},
    //     {title: 'Title 2', href: '', level: 2},
    // ];
    // const router: Router = {pathname: ''};

    return (
        <>
            <div className={b()}>
                <div className={b('left')}>
                    <a href={''} className={b('link')}>
                        <div className={b('icon')}>
                            <SquareListUl width={20} height={20} />
                        </div>
                        <span className={b('title')}>Типы данных</span>
                    </a>
                </div>
                <div className={b('right')}>
                    <Button size="xs" className={b('button')}>
                        <Button.Icon>
                            <ArrowShapeTurnUpRight width={20} height={20} />
                        </Button.Icon>
                    </Button>
                </div>
            </div>
            {/* <div className="mini-toc-wrapper">
                <MiniToc headings={headings} router={router} />
            </div> */}
        </>
    );
};

// const SubNavigationDemo = () => {
//     return <SubNavigationOriginal />;
// };

// export default {
//     title: 'Components/SubNavigation',
//     component: SubNavigationDemo,
//     parameters: {
//         layout: 'fullscreen',
//     },
// };

// export const SubNavigation = {};
