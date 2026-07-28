// Backwards compatibility shim for React types in older React versions,
// where the `JSX` namespace was global rather than exported from `react`.
import type React from 'react';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        interface Element extends React.ReactElement<any, any> {}
        interface IntrinsicElements {}
    }
}

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        interface Element extends React.ReactElement<any, any> {}
        interface IntrinsicElements extends globalThis.JSX.IntrinsicElements {}
    }
}
