import {useEffect, useMemo, useRef, useState} from 'react';

export const useVirtualElementRef = (element: HTMLElement | null) => {
    const observer = useRef<ResizeObserver>();
    const rect = useRef<DOMRect>();

    const x = 0;
    const y = 0;

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [top, setTop] = useState(0);
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(0);
    const [bottom, setBottom] = useState(0);
    const box = useMemo(() => {
        const rect = {top, left, right, bottom, height, width, x, y};
        return {
            ...rect,
            current: {
                getBoundingClientRect() {
                    return {
                        ...rect,
                        toJSON() {
                            return rect;
                        },
                    };
                },
            },
        };
    }, [top, left, right, bottom, height, width, x, y]);

    useEffect(() => {
        const _observer = (observer.current = new ResizeObserver((entries) => {
            if (!rect.current) {
                return;
            }

            const {top, left, width, height} = rect.current;

            for (const entry of entries) {
                const dw = width - entry.contentRect.width;
                const dh = height - entry.contentRect.height;

                setWidth(entry.contentRect.width);
                setHeight(entry.contentRect.height);
                setTop(dh + top + entry.contentRect.top);
                setLeft(dw + left + entry.contentRect.left);
                setRight(dw + left + entry.contentRect.right);
                setBottom(dh + top + entry.contentRect.bottom);
            }
        }));

        return () => {
            _observer.disconnect();
        };
    }, [rect]);

    useEffect(() => {
        if (element) {
            rect.current = element.getBoundingClientRect();
            observer.current?.observe(element);

            return () => {
                observer.current?.unobserve(element);
            };
        } else {
            observer.current?.disconnect();

            return () => {};
        }
    }, [element]);

    return box;
};
