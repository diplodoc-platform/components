declare module 'url' {
    export const parse: (href: string) => {
        hash?: string;
        pathname?: string;
    };
}
