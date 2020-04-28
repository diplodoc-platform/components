export type InnerProps<TProps extends Partial<TDefaultProps>, TDefaultProps> =
    Omit<TProps, keyof TDefaultProps> &
    Required<Pick<TProps, keyof TDefaultProps>>;
