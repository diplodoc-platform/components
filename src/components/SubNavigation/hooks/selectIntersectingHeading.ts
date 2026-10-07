import type {FlatHeadingItem} from './useHeadingIntersectionObserver';

/**
 * Selects the first current, intersecting, mapped heading in delivery order.
 * @param entries - Observations delivered by the observer callback
 * @param headings - Heading descriptors keyed by their observed elements
 * @returns The selected heading, or undefined to retain the active heading
 */
export function selectIntersectingHeading(
    entries: readonly IntersectionObserverEntry[],
    headings: ReadonlyMap<Element, FlatHeadingItem> | undefined,
): FlatHeadingItem | undefined {
    const latestEntries = new Map<Element, IntersectionObserverEntry>();

    // A single delivery can contain multiple observations of the same target
    // while initial layout and anchor scrolling overlap. Ignore stale states.
    for (const entry of entries) {
        const previous = latestEntries.get(entry.target);

        if (!previous || entry.time >= previous.time) {
            latestEntries.set(entry.target, entry);
        }
    }

    for (const entry of entries) {
        const {target, isIntersecting} = entry;
        const descriptor = headings?.get(target);

        if (entry === latestEntries.get(target) && isIntersecting && descriptor) {
            return descriptor;
        }
    }

    return undefined;
}
