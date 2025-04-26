import {RefObject, useEffect, useMemo, useRef, useState} from 'react';

import {DocHeadingItem} from '../../../models';
import {useStableCallback} from '../../../hooks/useStableCallback';

export type FlatHeadingItem = {
    title: string;
    href: string;
    isChild: boolean;
};

function getFlatHeadings(items: readonly DocHeadingItem[], isChild = false): FlatHeadingItem[] {
    return items.reduce((result, {href, title, items: subItems}) => {
        return result.concat({title, href, isChild}, getFlatHeadings(subItems || [], true));
    }, [] as FlatHeadingItem[]);
}

type HeadingIntersectionObserverHookArgs = {
    headings: readonly DocHeadingItem[];
    rootRef?: RefObject<HTMLElement>;
};

type HeadingIntersectionObserverHookReturn = {
    flatHeadings: readonly FlatHeadingItem[];
    activeHeading: FlatHeadingItem | null;
};

type HeadingAssocMap = Map<Element, FlatHeadingItem>;

const parseIdSelectorFromHref = (href: string) => {
    const [, maybeAnchor = ''] = href.split('#');

    return maybeAnchor;
};

const mapHeadingsToElements = (headings: readonly FlatHeadingItem[]): HeadingAssocMap => {
    const map: HeadingAssocMap = new Map();

    headings.forEach((descriptor) => {
        const maybeElement = document.getElementById(parseIdSelectorFromHref(descriptor.href));

        if (maybeElement) {
            map.set(maybeElement, descriptor);
        }
    });

    return map;
};

export const useHeadingIntersectionObserver = ({
    headings,
    rootRef,
}: HeadingIntersectionObserverHookArgs): HeadingIntersectionObserverHookReturn => {
    const [activeHeading, setActiveHeading] = useState<FlatHeadingItem | null>(null);

    const elementMapRef = useRef<HeadingAssocMap>();

    const intersectionObserverCallback = useStableCallback(
        (entries: IntersectionObserverEntry[]) => {
            for (const {target, isIntersecting} of entries) {
                const maybeDescriptor = elementMapRef.current?.get(target);

                if (isIntersecting && maybeDescriptor) {
                    setActiveHeading(maybeDescriptor);

                    break;
                }
            }
        },
    );

    const flatHeadings = useMemo(() => getFlatHeadings(headings), [headings]);

    useEffect(() => {
        const mapping = mapHeadingsToElements(flatHeadings);

        elementMapRef.current = mapping;

        const instance = new IntersectionObserver(intersectionObserverCallback, {
            root: rootRef?.current,
        });

        [...mapping.keys()].forEach((element) => instance.observe(element));

        return () => instance.disconnect();
    }, [rootRef, flatHeadings, intersectionObserverCallback]);

    return {flatHeadings, activeHeading};
};
