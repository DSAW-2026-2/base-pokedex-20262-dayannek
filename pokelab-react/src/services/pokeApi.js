// services/pokeApi.js
// Capa de acceso a datos: toda comunicación con la PokéAPI vive aquí.

const BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Trae los datos base de un Pokémon (/pokemon/{name}).
 */
async function fetchPokemon(nameOrId) {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  if (!response.ok) {
    throw new Error("SPECIMEN_NOT_FOUND");
  }
  return response.json();
}

/**
 * Trae los datos de especie (/pokemon-species/{name}) — clase/categoría y descripción.
 */
async function fetchSpecies(nameOrId) {
  const response = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`);
  if (!response.ok) {
    throw new Error("SPECIES_NOT_FOUND");
  }
  return response.json();
}

/**
 * Trae la cadena evolutiva completa a partir de la URL de especie.
 * Se resuelve en dos pasos porque pokemon-species solo trae el link a evolution-chain.
 */
async function fetchEvolutionChain(evolutionChainUrl) {
  if (!evolutionChainUrl) return null;
  const response = await fetch(evolutionChainUrl);
  if (!response.ok) return null;
  const data = await response.json();
  return flattenEvolutionChain(data.chain);
}

// Convierte el árbol anidado de evoluciones en una lista plana de nombres.
function flattenEvolutionChain(chainNode) {
  const names = [];
  let current = chainNode;
  while (current) {
    names.push(current.species.name);
    current = current.evolves_to?.[0]; // se sigue la primera rama (suficiente para el expediente)
  }
  return names;
}

/**
 * Punto de entrada principal usado por el hook: obtiene en paralelo
 * los datos base y de especie, y luego resuelve la cadena evolutiva.
 * @param {string} nameOrId - nombre (minúsculas) o ID numérico del Pokémon
 */
export async function fetchSpecimenData(nameOrId) {
  const query = String(nameOrId).toLowerCase().trim();

  const [pokemon, species] = await Promise.all([
    fetchPokemon(query),
    fetchSpecies(query),
  ]);

  const evolutionChain = await fetchEvolutionChain(species.evolution_chain?.url);

  return { pokemon, species, evolutionChain };
}
