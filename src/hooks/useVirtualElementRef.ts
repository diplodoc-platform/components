import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

type DOMRectLike = Omit<DOMRect, 'toJSON'>;

export const useVirtualElementRef = (element: HTMLElement | null) => {
    const observer = useRef<ResizeObserver>();
    const rect = useRef<DOMRectLike>();

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

    const update = useCallback(
        ({top, left, right, bottom, height, width}: DOMRectLike) => {
            setTop(top);
            setLeft(left);
            setRight(right);
            setBottom(bottom);
            setHeight(height);
            setWidth(width);
        },
        [setTop, setLeft, setRight, setBottom, setHeight, setWidth],
    );

    const watch = useCallback(() => {
        if (element) {
            rect.current = element.getBoundingClientRect();
            observer.current?.observe(element);
            update(rect.current);
        }

        return () => {
            observer.current?.disconnect();
        };
    }, [element, observer, update]);

    useEffect(() => {
        const _observer = (observer.current = new ResizeObserver((entries) => {
            if (!rect.current) {
                return;
            }

            const {top, left, width, height} = rect.current;

            for (const entry of entries) {
                const dw = width - entry.contentRect.width;
                const dh = height - entry.contentRect.height;

                update({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                    top: dh + top + entry.contentRect.top,
                    left: dw + left + entry.contentRect.left,
                    right: dw + left + entry.contentRect.right,
                    bottom: dh + top + entry.contentRect.bottom,
                    x,
                    y,
                });
            }
        }));

        return () => {
            _observer.disconnect();
        };
    }, [rect, observer, update]);

    useEffect(() => {
        if (element) {
            rect.current = element.getBoundingClientRect();
            update(rect.current);
        }
    }, [element, update]);

    return [box, watch] as const;
};
