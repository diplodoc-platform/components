// Backwards compatibility shim for React types in older React versions,
// where the `JSX` namespace was global rather than exported from `react`.
import 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {}
    }
}

declare module 'react' {
    namespace JSX {
        interface Element extends React.ReactElement<any, any> {}
        interface IntrinsicElements extends globalThis.JSX.IntrinsicElements {}
    }
}
