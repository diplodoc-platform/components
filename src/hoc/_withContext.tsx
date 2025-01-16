import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function <P extends Record<string, any>>(
    prop: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Context: React.Context<any> & {name?: string},
) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function <T extends Record<string, any>>(Component: React.ComponentType<any>) {
        const contextName = Context.displayName || Context.name || 'Context';
        const componentName = Component.displayName || Component.name || 'Component';

        class WithContextProp extends React.Component<Omit<T, keyof P>> {
            static displayName = `with${contextName}(${componentName})`;

            static contextType = Context;

            render() {
                return <Component {...this.props} {...{[prop]: this.context}} />;
            }
        }

        // Copies non-react specific statics from a child component to a parent component
        hoistNonReactStatics(WithContextProp, Component);

        return WithContextProp;
    };
}
