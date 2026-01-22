import { useState, useEffect } from 'react';
import PlayerControls from './components/PlayerControls';
import { play, pause } from './audio/engine';
import * as Tone from 'tone';
import './index.css';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  // Timer State
  const [mode, setMode] = useState('25');
  const [phase, setPhase] = useState('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // Reset timer when mode changes
  useEffect(() => {
    // Only reset if we change mode intentionally, not during playback
    // But since mode setter is in Timer, we react here.
    setIsActive(false);
    setIsPlaying(false);
    pause();
    setPhase('work');
    if (mode === '25') {
      setTimeLeft(25 * 60);
    } else {
      setTimeLeft(50 * 60);
    }
  }, [mode]);

  const playAlert = () => {
    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease("C5", "8n", now);
    synth.triggerAttackRelease("E5", "8n", now + 0.2);
  };

  const handleTogglePlay = async () => {
    if (!isActive) {
      // STARTING
      setIsActive(true);
      if (phase === 'work') {
        await play();
        setIsPlaying(true);
      }
    } else {
      // PAUSING
      setIsActive(false);
      pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // FINISHED
      playAlert();
      clearInterval(interval);
      setIsActive(false);
      pause();
      setIsPlaying(false);

      // Switch Phase
      if (phase === 'work') {
        setPhase('break');
        setTimeLeft(mode === '25' ? 5 * 60 : 10 * 60);
      } else {
        setPhase('work');
        setTimeLeft(mode === '25' ? 25 * 60 : 50 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase, mode]);

  return (
    <div className="app-container">
      <header>
        <h1 className="title">Focus Flow</h1>
        <p className="subtitle">Generative Lo-fi for Deep Work</p>
      </header>

      <main>
        <PlayerControls
          isActive={isActive}
          onToggle={handleTogglePlay}
          phase={phase}
          timeLeft={timeLeft}
          mode={mode}
          setMode={setMode}
        />
      </main>
    </div>
  );
}

export default App;
