// components/Terminal.jsx
export default function Terminal({ children }) {
  return (
    <div className="terminal-frame">
      <header className="terminal-header">
        <span className="terminal-title">🧪 POKÉLAB</span>
        <span className="terminal-version">Research Terminal v2.6</span>
      </header>

      <main className="terminal-body">{children}</main>

      <footer className="terminal-footer">
        <span>ACTIVE PROTOCOLS: Monitoring</span>
        <span>STATUS: ONLINE</span>
      </footer>
    </div>
  );
}
