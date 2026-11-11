import { Component } from 'react';

export default class TextureFallbackBoundary extends Component {
  state = { failed: false };

  componentDidUpdate(previousProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.failed) {
      this.setState({ failed: false });
    }
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}
