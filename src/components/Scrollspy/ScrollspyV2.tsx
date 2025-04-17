import {PropsWithChildren, RefObject, useEffect, useRef} from 'react';

import {useStableCallback} from '../../hooks/useStableCallback';
import {DocHeadingItem} from '../../models';

interface FlatHeadingItem {
    title: string;
    href: string;
    isChild: boolean;
}

function getFlatHeadings(items: readonly DocHeadingItem[], isChild = false): FlatHeadingItem[] {
    return items.reduce((result, {href, title, items: subItems}) => {
        return result.concat({title, href, isChild}, getFlatHeadings(subItems || [], true));
    }, [] as FlatHeadingItem[]);
}

type ScrollspyArgs = PropsWithChildren<{
    headings: readonly DocHeadingItem[];
    onVisibleHeadingChange: (heading: FlatHeadingItem) => void;
    rootRef?: RefObject<HTMLElement>;
}>;

type HeadingAssocMap = Map<Element, FlatHeadingItem>;

const mapHeadingsToElements = (
    headings: readonly FlatHeadingItem[],
    root?: Element,
): HeadingAssocMap => {
    const map: HeadingAssocMap = new Map();
    const searchRoot = root ?? document;

    headings.forEach((descriptor) => {
        const maybeElement = searchRoot.querySelector(descriptor.href);

        if (maybeElement) {
            map.set(maybeElement, descriptor);
        }
    });

    return map;
};

export const useHeadingIntersectionObserver = ({
    headings,
    onVisibleHeadingChange,
    rootRef,
}: ScrollspyArgs): void => {
    const elementMapRef = useRef<HeadingAssocMap>();

    const intersectionObserverCallback = useStableCallback(
        (entries: IntersectionObserverEntry[]) => {
            for (const {target, isIntersecting} of entries) {
                const maybeDescriptor = elementMapRef.current?.get(target);

                if (isIntersecting && maybeDescriptor) {
                    onVisibleHeadingChange(maybeDescriptor);

                    break;
                }
            }
        },
    );

    useEffect(() => {
        const flatHeadings = getFlatHeadings(headings);
        const mapping = mapHeadingsToElements(flatHeadings, rootRef?.current ?? undefined);

        elementMapRef.current = mapping;

        const instance = new IntersectionObserver(intersectionObserverCallback, {
            root: rootRef?.current,
        });

        [...mapping.keys()].forEach((element) => instance.observe(element));

        return () => instance.disconnect();
    }, [rootRef, headings, intersectionObserverCallback]);
};
