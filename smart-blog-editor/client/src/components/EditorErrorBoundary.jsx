import React from 'react';

export default class EditorErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Editor crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <h3 className="font-bold text-base mb-2">Editor Error</h3>
          <pre className="text-xs bg-white p-3 rounded border border-red-100 overflow-x-auto">
            {this.state.error?.message || String(this.state.error)}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-3 px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 font-medium"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
