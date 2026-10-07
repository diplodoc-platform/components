import type {FlatHeadingItem} from '../useHeadingIntersectionObserver';

import {expect, test} from '@playwright/test';

import {selectIntersectingHeading} from '../selectIntersectingHeading';

// These tests exercise selection only: target identity does not require a DOM.
const pageLayout = {} as Element;
const layoutStructure = {} as Element;
const contentRendering = {} as Element;
const inlineFormatting = {} as Element;
const lists = {} as Element;
const unrelated = {} as Element;

function heading(id: string): FlatHeadingItem {
    return {title: id, href: `components.html#${id}`, isChild: false};
}

const headings = new Map([
    [pageLayout, heading('page-layout')],
    [layoutStructure, heading('layout-structure')],
    [contentRendering, heading('content-rendering')],
    [inlineFormatting, heading('inline-formatting')],
    [lists, heading('lists')],
]);

function entry(target: Element, isIntersecting: boolean, time = 0): IntersectionObserverEntry {
    return {target, isIntersecting, time} as IntersectionObserverEntry;
}

test('selects the current heading from the recorded Windows navigation batch', () => {
    // Relevant mapped entries, in their original delivery order and with their
    // recorded timestamps (testpack run 37622861970, Windows repeat 2).
    const entries = [
        entry(pageLayout, true, 155.3),
        entry(pageLayout, false, 158.2),
        entry(layoutStructure, true, 155.3),
        entry(layoutStructure, false, 158.2),
        entry(contentRendering, false, 155.3),
        entry(contentRendering, true, 158.2),
        entry(inlineFormatting, false, 155.3),
        entry(inlineFormatting, true, 158.2),
        entry(lists, false, 155.3),
        entry(lists, true, 158.2),
    ];

    expect(selectIntersectingHeading(entries, headings)).toBe(headings.get(contentRendering));
});

test('uses the newest timestamp even when a stale entry is delivered last', () => {
    const entries = [
        entry(pageLayout, false, 20),
        entry(pageLayout, true, 10),
        entry(contentRendering, true, 20),
    ];

    expect(selectIntersectingHeading(entries, headings)).toBe(headings.get(contentRendering));
});

test('uses the last observation when timestamps are equal', () => {
    const entries = [
        entry(pageLayout, true, 10),
        entry(pageLayout, false, 10),
        entry(contentRendering, true, 10),
    ];

    expect(selectIntersectingHeading(entries, headings)).toBe(headings.get(contentRendering));
});

test('preserves the delivery order of current observations', () => {
    const entries = [
        entry(pageLayout, false, 10),
        entry(contentRendering, true, 20),
        entry(pageLayout, true, 20),
    ];

    expect(selectIntersectingHeading(entries, headings)).toBe(headings.get(contentRendering));
});

test('ignores unmapped targets and preserves the first valid heading', () => {
    const entries = [
        entry(unrelated, true),
        entry(contentRendering, true),
        entry(pageLayout, true),
    ];

    expect(selectIntersectingHeading(entries, headings)).toBe(headings.get(contentRendering));
});

test('keeps separate observer deliveries independent', () => {
    expect(selectIntersectingHeading([entry(pageLayout, true, 10)], headings)).toBe(
        headings.get(pageLayout),
    );
    expect(
        selectIntersectingHeading(
            [entry(pageLayout, false, 20), entry(contentRendering, true, 20)],
            headings,
        ),
    ).toBe(headings.get(contentRendering));
});

test('retains the active heading when no mapped target is currently intersecting', () => {
    expect(
        selectIntersectingHeading(
            [entry(pageLayout, true, 10), entry(pageLayout, false, 20)],
            headings,
        ),
    ).toBeUndefined();
    expect(selectIntersectingHeading([entry(unrelated, true)], headings)).toBeUndefined();
    expect(selectIntersectingHeading([], headings)).toBeUndefined();
    expect(selectIntersectingHeading([entry(pageLayout, true)], undefined)).toBeUndefined();
});
