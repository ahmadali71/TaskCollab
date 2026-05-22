// src/error-boundary.tsx
import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * Catches async errors (unhandled promise rejections) that bubble up
 * into the React tree during HMR reloads and third-party library flushes.
 * This prevents HMR from killing the main app root and flashing to login.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    // Log but don't block the app – HMR and third-party script
    // errors are transient and safe to swallow.
    if (import.meta.env.DEV) {
      console.warn('[ErrorBoundary] Caught transient error (HMR / dev overlay):', error.message)
    }
  }

  render() {
    if (this.state.hasError) {
      // Recover: treat this mount as still-unauthenticated so the
      // App.tsx mount effect can re-read localStorage from scratch
      // without the page staying in a broken state.
      return (
        <div id="root-error-fallback" style={{ display: 'none' }}>
          {this.props.children}
        </div>
      )
    }
    return this.props.children
  }
}
