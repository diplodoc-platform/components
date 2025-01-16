import React from 'react';

export default function <T>(name: string, defaults: T): React.Context<T> {
    const Context = React.createContext(defaults);

    Context.displayName = name;

    return Context;
}
