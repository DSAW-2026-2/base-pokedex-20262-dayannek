// components/LoadingState.jsx
export default function LoadingState() {
  return (
    <div className="status-panel loading-panel" role="status">
      <p className="blink">🧬 SCANNING SPECIMEN DATABASE...</p>
      <p className="status-subtext">Contactando a PokéAPI · procesando biometría</p>
    </div>
  );
}
