import React, {createContext, useCallback, useMemo} from 'react';

export interface InterfaceContextType {
    interface: Record<string, boolean>;
    isHidden: (name: string) => boolean;
}

export const InterfaceContext = createContext<InterfaceContextType>({
    interface: {},
    isHidden: () => false,
});

export interface InterfaceProviderProps {
    interface: Record<string, boolean>;
    children: React.ReactNode;
}

export const InterfaceProvider: React.FC<InterfaceProviderProps> = ({
    interface: viewerInterface,
    children,
}) => {
    const isHidden = useCallback(
        (name: string) => {
            if (viewerInterface && name in viewerInterface) {
                return !viewerInterface[name];
            }
            return false;
        },
        [viewerInterface],
    );

    const value = useMemo(
        () => ({
            interface: viewerInterface,
            isHidden,
        }),
        [viewerInterface, isHidden],
    );

    return <InterfaceContext.Provider value={value}>{children}</InterfaceContext.Provider>;
};
