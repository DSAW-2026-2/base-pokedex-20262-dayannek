// components/SpecimenCard.jsx
import StatBar from "./StatBar";
import {
  calculateThreatLevel,
  normalizeStats,
  generateDiagnosis,
  extractGenusAndFlavorText,
} from "../utils/calculations";

const TYPE_ICONS = {
  fire: "🔥",
  water: "💧",
  electric: "⚡",
  grass: "🌿",
  ice: "❄️",
  fighting: "🥊",
  poison: "☠️",
  ground: "🪨",
  flying: "🌪️",
  psychic: "🔮",
  bug: "🐛",
  rock: "⛰️",
  ghost: "👻",
  dragon: "🐉",
  dark: "🌑",
  steel: "⚙️",
  fairy: "✨",
  normal: "⭐",
};

export default function SpecimenCard({ data }) {
  const { pokemon, species, evolutionChain } = data;

  const { genus, flavorText } = extractGenusAndFlavorText(species);
  const normalized = normalizeStats(pokemon.stats);
  const threat = calculateThreatLevel(pokemon.stats);
  const diagnosis = generateDiagnosis(normalized);

  const sprite =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default;

  return (
    <section className="specimen-card">
      <header className="specimen-header">
        <div className="specimen-title">
          <span className="type-icons">
            {pokemon.types.map((t) => TYPE_ICONS[t.type.name] || "🔹").join(" ")}
          </span>
          <h2>{pokemon.name}</h2>
        </div>
        <span className="specimen-id">
          #{String(pokemon.id).padStart(4, "0")}
        </span>
      </header>

      <div className="specimen-body">
        <div className="specimen-image-col">
          <img
            className="specimen-sprite"
            src={sprite}
            alt={`Sprite de ${pokemon.name}`}
          />
          {evolutionChain && evolutionChain.length > 1 && (
            <p className="evolution-chain">
              <span className="section-label">EVOLUTION CHAIN:</span>
              <br />
              {evolutionChain.join(" → ")}
            </p>
          )}
        </div>

        <div className="specimen-data-col">
          <p className="section-label">BIOLOGICAL ANALYSIS</p>
          <p>
            <strong>Classification:</strong> {genus}
          </p>
          <p>
            <strong>Type:</strong>{" "}
            {pokemon.types.map((t) => t.type.name).join(", ")}
          </p>
          <p>
            <strong>Abilities:</strong>{" "}
            {pokemon.abilities
              .map((a) => (a.is_hidden ? `${a.ability.name} (Hidden)` : a.ability.name))
              .join(", ")}
          </p>
          <p>
            <strong>Height / Weight:</strong> {(pokemon.height / 10).toFixed(1)} m /{" "}
            {(pokemon.weight / 10).toFixed(1)} kg
          </p>
          <p className="flavor-text">"{flavorText}"</p>
        </div>
      </div>

      <div className="specimen-body">
        <div className="stats-block">
          <p className="section-label">BASE STATS</p>
          <StatBar label="HP  " value={normalized.hp} />
          <StatBar label="ATK " value={normalized.attack} />
          <StatBar label="DEF " value={normalized.defense} />
          <StatBar label="SPA " value={normalized.specialAttack} />
          <StatBar label="SPD " value={normalized.specialDefense} />
          <StatBar label="SPE " value={normalized.speed} />
        </div>

        <div className="analysis-block">
          <p className="section-label">THREAT LEVEL</p>
          <div className="threat-row">
            <span className="stat-bar threat-bar">{threat.bar}</span>
            <span className="threat-percent">{threat.percent}%</span>
          </div>
          <p className="threat-bst">BST: {threat.bst} / 720</p>

          <p className="section-label diagnostic-label">DIAGNOSTIC CONCLUSION</p>
          <p className="diagnosis-text">{diagnosis}</p>
        </div>
      </div>
    </section>
  );
}
