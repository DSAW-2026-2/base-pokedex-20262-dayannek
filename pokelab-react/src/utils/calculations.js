// utils/calculations.js
// Funciones puras de cálculo para el análisis sintético del laboratorio.
// No dependen de React: reciben datos y devuelven números/strings.

const MAX_BST = 720; // Total teórico máximo de referencia (BST) usado para normalizar THREAT LEVEL
const MAX_STAT = 200; // Techo usado para normalizar barras individuales de estadística
const BAR_LENGTH = 10; // Cantidad de bloques que forman cada barra ASCII

/**
 * Genera una barra estilo consola: "████████░░"
 * @param {number} value - valor actual de la estadística
 * @param {number} max - valor considerado "lleno" (100%)
 * @param {number} length - cantidad total de bloques en la barra
 */
export function buildAsciiBar(value, max = MAX_STAT, length = BAR_LENGTH) {
  const ratio = Math.max(0, Math.min(1, value / max));
  const filled = Math.round(ratio * length);
  const empty = length - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

/**
 * Calcula el porcentaje de amenaza (THREAT LEVEL) en base al total de stats (BST).
 * @param {Array<{base_stat:number}>} stats - arreglo "stats" tal como lo entrega la PokéAPI
 */
export function calculateThreatLevel(stats) {
  const bst = stats.reduce((sum, s) => sum + s.base_stat, 0);
  const percent = Math.round((bst / MAX_BST) * 100);
  return {
    bst,
    percent: Math.max(0, Math.min(100, percent)),
    bar: buildAsciiBar(percent, 100),
  };
}

/**
 * Extrae un objeto simple { hp, attack, defense, specialAttack, specialDefense, speed }
 * a partir del arreglo "stats" de la PokéAPI.
 */
export function normalizeStats(stats) {
  const map = {
    hp: "hp",
    attack: "attack",
    defense: "defense",
    "special-attack": "specialAttack",
    "special-defense": "specialDefense",
    speed: "speed",
  };

  const normalized = {};
  stats.forEach(({ stat, base_stat }) => {
    const key = map[stat.name];
    if (key) normalized[key] = base_stat;
  });
  return normalized;
}

/**
 * Genera el "Dictamen del Laboratorio": una recomendación estratégica
 * comparando las estadísticas normalizadas del espécimen.
 * @param {{hp:number, attack:number, defense:number, specialAttack:number, specialDefense:number, speed:number}} stats
 */
export function generateDiagnosis(stats) {
  const { attack, defense, specialAttack, specialDefense, speed, hp } = stats;

  const physicalPower = attack;
  const specialPower = specialAttack;
  const bulk = (defense + specialDefense) / 2;
  const isFast = speed >= 90;
  const isSlow = speed <= 50;
  const isFragile = bulk <= 60;
  const isTanky = bulk >= 100;
  const isGlassCannon = isFast && isFragile && (physicalPower >= 90 || specialPower >= 90);

  const notes = [];

  if (isGlassCannon) {
    notes.push(
      "Alta velocidad y poder ofensivo, pero defensas comprometidas. Especimen tipo 'cañón de cristal': prioriza golpear primero, evita intercambios prolongados."
    );
  } else if (isFast && isFragile) {
    notes.push(
      "Velocidad elevada con baja defensa. Recomendado para estrategias ofensivas de golpe rápido antes de recibir daño."
    );
  } else if (isTanky && isSlow) {
    notes.push(
      "Gran resistencia física y especial, pero movilidad reducida. Apto como muro defensivo o iniciador de estrategias de desgaste."
    );
  } else if (isTanky && !isSlow) {
    notes.push(
      "Buen equilibrio entre resistencia y velocidad. Puede sostener el ritmo del combate mientras absorbe daño."
    );
  } else if (physicalPower > specialPower + 15) {
    notes.push(
      "El perfil ofensivo se apoya principalmente en ataque físico. Recomendado priorizar movimientos de esa categoría."
    );
  } else if (specialPower > physicalPower + 15) {
    notes.push(
      "El perfil ofensivo se apoya principalmente en ataque especial. Recomendado priorizar movimientos de esa categoría."
    );
  } else {
    notes.push(
      "Perfil de estadísticas equilibrado, sin una inclinación ofensiva o defensiva marcada. Especimen versátil."
    );
  }

  if (hp >= 100) {
    notes.push("Reservas de HP elevadas: puede sostener más intercambios de lo habitual.");
  } else if (hp <= 50) {
    notes.push("Reservas de HP bajas: vulnerable a eliminaciones en pocos golpes.");
  }

  return notes.join(" ");
}

/**
 * Devuelve la clasificación / especie legible desde el endpoint pokemon-species,
 * priorizando el idioma español y con fallback a inglés.
 * @param {object} species - respuesta de /pokemon-species/{id}
 */
export function extractGenusAndFlavorText(species) {
  const genusEntry =
    species.genera?.find((g) => g.language.name === "es") ||
    species.genera?.find((g) => g.language.name === "en");

  const flavorEntry =
    species.flavor_text_entries?.find((f) => f.language.name === "es") ||
    species.flavor_text_entries?.find((f) => f.language.name === "en");

  const genus = genusEntry ? genusEntry.genus : "Clase desconocida";
  const flavorText = flavorEntry
    ? flavorEntry.flavor_text.replace(/[\n\f\r]/g, " ")
    : "Sin registros en la base de datos del laboratorio.";

  return { genus, flavorText };
}
