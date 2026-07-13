import type {FC, PropsWithChildren} from 'react';

import block from 'bem-cn-lite';

const b = block('header');

export function wait(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

export interface SearchItem {
    title?: string;
    description?: string;
}

export function filter<T extends SearchItem>(items: T[], query: string): T[] {
    return items.filter((item) => {
        const {title = '', description = ''} = item;

        return title.includes(query) || description.includes(query);
    });
}

export interface FakeHeaderProps {
    className: string;
}

export const FakeHeader: FC<PropsWithChildren<FakeHeaderProps>> = (props) => {
    const {children, className} = props;

    return (
        <div className={b(null, className)}>
            <div className="header-left">
                <div className="header-logo"></div>
                <div className="header-title">Example</div>
            </div>
            <div className="header-center"></div>
            <div className="header-right">{children}</div>
        </div>
    );
};
