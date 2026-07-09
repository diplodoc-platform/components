import React, {createContext, useCallback, useMemo} from 'react';

/**
 * Known control-visibility keys. Any other string is still accepted, but the
 * listed keys get autocomplete and typo-checking.
 */
export type InterfaceKey =
    | 'toc'
    | 'toc-header'
    | 'search'
    | 'feedback'
    | 'feedback-aside'
    | 'feedback-comment'
    | 'edit'
    | 'subscribe'
    | 'contributors';

/**
 * Control-visibility map. A key set to `false` hides the control; `true` shows
 * it. Absent keys fall back to each control's own default (most controls are
 * shown by default; `feedback-comment` is opt-in and hidden by default).
 */
export type ViewerInterface = Partial<Record<InterfaceKey | (string & {}), boolean>>;

export interface InterfaceContextType {
    interface: ViewerInterface;
    isHidden: (name: string) => boolean;
}

export const InterfaceContext = createContext<InterfaceContextType>({
    interface: {},
    isHidden: () => false,
});

export interface InterfaceProviderProps {
    interface: ViewerInterface;
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
