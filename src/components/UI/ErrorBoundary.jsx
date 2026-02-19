import { Component } from 'react';

/**
 * Error Boundary component to catch React errors gracefully
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-6">
                    <div className="max-w-2xl w-full bg-white/95 backdrop-blur-2xl rounded-3xl shadow-premium-lg border border-rose-200 p-8">
                        {/* Error Icon */}
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center mx-auto mb-6">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-600">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>

                        {/* Error Message */}
                        <h2 className="text-2xl font-bold text-surface-900 text-center mb-3">
                            Oops! Something went wrong
                        </h2>
                        <p className="text-surface-600 text-center mb-6">
                            We encountered an unexpected error. Don't worry, your data is safe.
                        </p>

                        {/* Error Details (Development) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="bg-surface-50 rounded-xl p-4 mb-6 border border-surface-200">
                                <p className="text-xs font-mono text-surface-700 mb-2">
                                    <strong>Error:</strong> {this.state.error.toString()}
                                </p>
                                {this.state.errorInfo && (
                                    <details className="text-xs font-mono text-surface-600">
                                        <summary className="cursor-pointer hover:text-surface-800">
                                            Stack trace
                                        </summary>
                                        <pre className="mt-2 overflow-auto max-h-40">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="btn-premium"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="btn-secondary"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
