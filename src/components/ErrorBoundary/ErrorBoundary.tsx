import React from 'react';
import _ from 'lodash';

import {ErrorPage} from '../ErrorPage';

interface ErrorBoundaryState {
    error?: Error;
    errorInfo?: unknown;
}

class ErrorBoundary extends React.Component<ErrorBoundaryState> {
    state: ErrorBoundaryState = {};

    componentDidUpdate(prevProps: ErrorBoundaryState) {
        if (this.state.error && !_.isEqual(this.props, prevProps)) {
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
