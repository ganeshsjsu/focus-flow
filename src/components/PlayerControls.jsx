import { useState, useEffect } from 'react';
import { Play, Pause, Zap, FastForward } from 'lucide-react';
import { play, pause, setIntensity, skipTrack } from '../audio/engine';

const PlayerControls = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [intensity, setIntensityState] = useState(0.5);

    const togglePlay = async () => {
        if (!isPlaying) {
            await play();
            setIsPlaying(true);
        } else {
            pause();
            setIsPlaying(false);
        }
    };

    const handleIntensityChange = (e) => {
        const val = parseFloat(e.target.value);
        setIntensityState(val);
        setIntensity(val);
    };

    return (
        <div className="controls-container">
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <button
                    onClick={togglePlay}
                    style={{
                        fontSize: '2rem',
                        padding: '1.5rem',
                        borderRadius: '50%',
                        width: '100px',
                        height: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isPlaying
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        boxShadow: isPlaying ? 'none' : '0 10px 30px rgba(118, 75, 162, 0.5)'
                    }}
                >
                    {isPlaying ? <Pause size={48} /> : <Play size={48} fill="white" />}
                </button>

                <button
                    onClick={skipTrack}
                    title="Next Vibe"
                    style={{
                        padding: '1rem',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <FastForward size={24} />
                </button>
            </div>

            <div className="card" style={{ width: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Zap size={18} color="#ffd700" />
                    <span style={{ fontWeight: 500, fontSize: '0.9rem', color: '#ccc' }}>
                        Tempo / Intensity
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={intensity}
                    onChange={handleIntensityChange}
                    style={{ width: '100%', cursor: 'pointer' }}
                />
            </div>

            {isPlaying && (
                <div style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    Generating infinite focus stream...
                </div>
            )}
        </div>
    );
};

export default PlayerControls;
