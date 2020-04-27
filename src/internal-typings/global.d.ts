declare module '*.svg' {
    const content: SVGIconData;

    export default content;
}

declare module 'assets/img/*.svg' {
    const path: string;

    export default path;
}
