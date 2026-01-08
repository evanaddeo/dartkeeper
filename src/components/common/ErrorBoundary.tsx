import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import styles from './ErrorBoundary.module.css';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>🎯 Oops!</h1>
            <p className={styles.message}>
              Something went wrong. Don't worry, your game data is safe.
            </p>
            {this.state.error && (
              <details className={styles.details}>
                <summary>Error Details</summary>
                <pre className={styles.errorText}>{this.state.error.toString()}</pre>
              </details>
            )}
            <div className={styles.actions}>
              <Button variant="primary" size="lg" onClick={this.handleReset}>
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

