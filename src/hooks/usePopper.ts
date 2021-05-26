import React from 'react';
import popper from '@popperjs/core';
import {Modifier, usePopper as useReactPopper} from 'react-popper';

export type PopperPlacement = popper.Placement | popper.Placement[];
export type PopperOffset = [number, number];
export type PopperModifiers = Modifier<unknown, Record<string, unknown>>[];

export interface PopperProps {
    anchorRef: HTMLElement | null;
    popupRef: React.RefObject<HTMLDivElement>;
    placement?: PopperPlacement;
    offset?: [number, number];
    modifiers?: PopperModifiers;
}

export enum PopperPosition {
    BOTTOM_START = 'bottom-start',
    BOTTOM = 'bottom',
    BOTTOM_END = 'bottom-end',
    TOP_START = 'top-start',
    TOP = 'top',
    TOP_END = 'top-end',
    RIGHT_START = 'right-start',
    RIGHT = 'right',
    RIGHT_END = 'right-end',
    LEFT_START = 'left-start',
    LEFT = 'left',
    LEFT_END = 'left-end',
}

const DEFAULT_PLACEMENT: PopperPlacement = Object.values(PopperPosition);

export interface PopoverHook {
    attributes: Record<string, Record<string, string> | undefined>;
    styles: Record<string, React.CSSProperties>;
    setPopperRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
    setArrowRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
}

export function usePopper(props: PopperProps): PopoverHook {
    const {anchorRef, placement = DEFAULT_PLACEMENT, offset, modifiers = []} = props;

    const [popperElement, setPopperElement] = React.useState<HTMLDivElement | null>(null);
    const [arrowElement, setArrowElement] = React.useState<HTMLDivElement | null>(null);
    const placements = Array.isArray(placement) ? placement : [placement];

    const {attributes, styles} = useReactPopper(anchorRef, popperElement, {
        modifiers: [
            {name: 'arrow', options: {enabled: Boolean(arrowElement), element: arrowElement}},
            {name: 'offset', options: {offset}},
            { name: 'flip', options: { fallbackPlacements: [PopperPosition.BOTTOM, PopperPosition.RIGHT, PopperPosition.LEFT, PopperPosition.TOP] } },
            {
                name: 'computeStyles',
                options: {
                    gpuAcceleration: false,
                },
            },
            ...modifiers,
        ],
        placement: placements[0],
    });

    return {
        attributes,
        styles,
        setPopperRef: setPopperElement,
        setArrowRef: setArrowElement,
    };
}
