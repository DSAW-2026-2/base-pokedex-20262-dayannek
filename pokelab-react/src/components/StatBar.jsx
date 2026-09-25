// components/StatBar.jsx
import { buildAsciiBar } from "../utils/calculations";

export default function StatBar({ label, value, max = 200 }) {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span className="stat-bar">{buildAsciiBar(value, max)}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}
