import PlayerControls from './components/PlayerControls';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1 className="title">Focus Flow</h1>
        <p className="subtitle">Generative Lo-fi for Deep Work</p>
      </header>

      <main>
        <PlayerControls />
      </main>
    </div>
  );
}

export default App;
