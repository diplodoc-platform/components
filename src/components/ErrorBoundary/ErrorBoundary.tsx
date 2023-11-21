import React, {PropsWithChildren} from 'react';

import isEqual from 'lodash/isEqual';

import {ErrorPage} from '../ErrorPage';

interface ErrorBoundaryState {
    error?: Error;
    errorInfo?: unknown;
}

class ErrorBoundary extends React.Component<PropsWithChildren<ErrorBoundaryState>> {
    state: ErrorBoundaryState = {};

    componentDidUpdate(prevProps: ErrorBoundaryState) {
        if (this.state.error && !isEqual(this.props, prevProps)) {
            this.setState({error: undefined, errorInfo: undefined});
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({error, errorInfo});
    }

    render() {
        const {children} = this.props;
        const {error} = this.state;

        return error ? <ErrorPage /> : children;
    }
}

export default ErrorBoundary;
