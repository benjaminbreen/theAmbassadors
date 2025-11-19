import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Game Error Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-paper-100 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border-4 border-red-500">
            <h1 className="text-2xl font-display text-red-600 dark:text-red-400 mb-4">
              The Narrative Has Collapsed
            </h1>
            <p className="text-ink-900 dark:text-paper-100 mb-4 font-serif">
              Henry James would call this "a terrible rupture in the fabric of experience."
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded mb-4 font-mono text-xs overflow-auto">
              {this.state.error?.message || 'Unknown error'}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Restart the Experience
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
