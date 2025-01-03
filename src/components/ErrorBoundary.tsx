import React from 'react';
import { Button } from './ui/button';

// Lightweight error boundary that only catches critical errors
export class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Only log critical errors in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Critical error:', error.message);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-4">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-2"
          >
            Reload
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
} 