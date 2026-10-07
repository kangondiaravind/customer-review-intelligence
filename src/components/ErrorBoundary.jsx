import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="fatal">
          <div className="fatalCard">
            <div className="eyebrow">CTRL+AI</div>
            <h1>Something went wrong</h1>
            <p>The application could not render this page.</p>
            <pre>{this.state.error?.message || String(this.state.error)}</pre>
            <button type="button" onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
