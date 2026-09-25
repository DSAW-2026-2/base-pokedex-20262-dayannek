// components/ErrorState.jsx
export default function ErrorState({ message }) {
  return (
    <div className="status-panel error-panel" role="alert">
      <p>⚠ ERROR DE LABORATORIO</p>
      <p className="status-subtext">{message}</p>
    </div>
  );
}
