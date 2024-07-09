import React from 'react';

import {ArrowShapeTurnUpRight, SquareListUl} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
// import { DocHeadingItem, Router } from 'src/models';

// import { MiniToc } from '../MiniToc';

import './SubNavigation.scss';

const b = block('dc-subnavigation');

export interface SubNavigationProps {
    title: string;
}

export const SubNavigation = (props: SubNavigationProps) => {
    return (
        <div className={b()}>
            <div className={b('left')}>
                <a href={''} className={b('link')}>
                    <div className={b('icon')}>
                        <SquareListUl width={20} height={20} />
                    </div>
                    <span className={b('title')}>{props.title}</span>
                </a>
            </div>
            <div className={b('right')}>
                <Button size="xs" view='flat' className={b('button')}>
                    <Button.Icon>
                        <ArrowShapeTurnUpRight width={20} height={20} />
                    </Button.Icon>
                </Button>
            </div>
        </div>
    );
};

// export const MiniTocMobile = () => {
//     const headings: DocHeadingItem[] = [
//         {title: 'Title 0', href: '', level: 0},
//         {title: 'Title 1', href: '', level: 1},
//         {title: 'Title 1', href: '', level: 1},
//         {title: 'Title 2', href: '', level: 2},
//         {title: 'Title 2', href: '', level: 2},
//         {title: 'Title 2', href: '', level: 2},
//         {title: 'Title 2', href: '', level: 2},
//         {title: 'Title 2', href: '', level: 2},
//         {title: 'Title 2', href: '', level: 2},
//         {title: 'Title 2', href: '', level: 2},
//         {title: 'Title 2', href: '', level: 2},
//         {title: 'Title 2', href: '', level: 2},
//         {title: 'Title 2', href: '', level: 2},
//     ];
//     const router: Router = {pathname: ''};

//     return (
//         <div className="mini-toc-wrapper">
//             <MiniToc headings={headings} router={router} />
//         </div>
//     )
// }

export default SubNavigation;
