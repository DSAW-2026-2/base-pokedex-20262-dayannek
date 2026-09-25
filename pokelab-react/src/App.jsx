// App.jsx
import Terminal from "./components/Terminal";
import SearchBar from "./components/SearchBar";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import SpecimenCard from "./components/SpecimenCard";
import { usePokemon, STATUS } from "./hooks/usePokemon";
import "./styles/pokelab.css";

export default function App() {
  const { status, data, error, search } = usePokemon();

  return (
    <Terminal>
      <SearchBar onSearch={search} disabled={status === STATUS.LOADING} />

      {status === STATUS.LOADING && <LoadingState />}
      {status === STATUS.ERROR && <ErrorState message={error} />}
      {status === STATUS.SUCCESS && data && <SpecimenCard data={data} />}
      {status === STATUS.IDLE && (
        <div className="status-panel idle-panel">
          <p>Sistema en espera. Ingresa un espécimen para comenzar el análisis.</p>
        </div>
      )}
    </Terminal>
  );
}
