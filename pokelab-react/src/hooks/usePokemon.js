// hooks/usePokemon.js
import { useState, useCallback, useRef } from "react";
import { fetchSpecimenData } from "../services/pokeApi";

// Estados posibles del laboratorio
export const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

/**
 * Encapsula el ciclo de búsqueda: idle -> loading -> success | error.
 * Expone `search(nombre)` para disparar una nueva consulta.
 */
export function usePokemon() {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [data, setData] = useState(null); // { pokemon, species, evolutionChain }
  const [error, setError] = useState(null);

  // Evita "race conditions": si el usuario busca dos veces rápido,
  // solo el resultado de la última búsqueda debe aplicarse.
  const requestIdRef = useRef(0);

  const search = useCallback(async (rawName) => {
    const name = rawName.trim().toLowerCase();
    if (!name) {
      setStatus(STATUS.ERROR);
      setError("Ingresa el nombre o ID de un espécimen para analizar.");
      return;
    }

    const requestId = ++requestIdRef.current;
    setStatus(STATUS.LOADING);
    setError(null);

    try {
      const result = await fetchSpecimenData(name);
      if (requestIdRef.current !== requestId) return; // respuesta obsoleta, se descarta
      setData(result);
      setStatus(STATUS.SUCCESS);
    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      setData(null);
      setStatus(STATUS.ERROR);
      setError(
        err.message === "SPECIMEN_NOT_FOUND" || err.message === "SPECIES_NOT_FOUND"
          ? "Espécimen no encontrado en la base de datos del laboratorio."
          : "Fallo de conexión con la base de datos central. Intenta nuevamente."
      );
    }
  }, []);

  const reset = useCallback(() => {
    requestIdRef.current++;
    setStatus(STATUS.IDLE);
    setData(null);
    setError(null);
  }, []);

  return { status, data, error, search, reset };
}
