export const getPublicTags = (tags: string[], selectedTags: string[] = []) => {
    const selected = new Set(selectedTags);

    return tags
        .filter((tag) => !tag.startsWith('_'))
        .sort((left, right) => Number(selected.has(right)) - Number(selected.has(left)));
};
