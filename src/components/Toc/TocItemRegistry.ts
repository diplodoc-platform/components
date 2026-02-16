import type {TocItem} from '../../models';

type NormalizeUrl = (path: string, hash: string | undefined) => string | null | undefined;

export class TocItemRegistry {
    private itemById: Map<string, TocItem> = new Map();

    private parentById: Map<string, string> = new Map();

    private itemIdByUrl: Map<string, string> = new Map();

    private normalizeUrl: NormalizeUrl;

    constructor(items: TocItem[], normalizeUrl: NormalizeUrl) {
        this.normalizeUrl = normalizeUrl;

        this.consumeItems(items);
    }

    getIdByUrl(url: string): string | undefined {
        return this.itemIdByUrl.get(url);
    }

    getItemById(id: string): TocItem | undefined {
        return this.itemById.get(id);
    }

    getParentId(id: string): string {
        return this.parentById.get(id) || '';
    }

    getParentIds(id: string): string[] {
        const result = [];

        let parentId = this.getParentId(id);
        while (parentId) {
            result.push(parentId);
            parentId = this.getParentId(parentId);
        }

        return result;
    }

    getChildIds(id: string): string[] {
        const item = this.itemById.get(id);

        if (!item) {
            return [];
        }

        return (item.items || ([] as TocItem[])).reduce((acc, child) => {
            return acc.concat([child.id], this.getChildIds(child.id));
        }, [] as string[]);
    }

    private consumeItems(items: TocItem[], parent?: TocItem) {
        items.forEach((item) => {
            this.itemById.set(item.id, item);

            if (item.href) {
                const [leftPart, hash] = item.href.split('#');
                const [pathname] = leftPart.split('?');
                const url = this.normalizeUrl(pathname, hash);

                if (url) {
                    this.itemIdByUrl.set(url, item.id);
                }
            }

            if (parent) {
                this.parentById.set(item.id, parent.id);
            }

            if (item.items) {
                this.consumeItems(item.items, item);
            }
        });
    }
}
