import { useState } from 'react';
import { Play, Pause, Zap, FastForward, Clock, Coffee } from 'lucide-react';
import { setIntensity, skipTrack } from '../audio/engine';

const PlayerControls = ({ isActive, onToggle, phase, timeLeft, mode, setMode }) => {
    const [intensity, setIntensityState] = useState(0.5);

    const handleIntensityChange = (e) => {
        const val = parseFloat(e.target.value);
        setIntensityState(val);
        setIntensity(val);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const getProgress = () => {
        const total = phase === 'work'
            ? (mode === '25' ? 25 * 60 : 50 * 60)
            : (mode === '25' ? 5 * 60 : 10 * 60);
        return ((total - timeLeft) / total) * 100;
    };

    return (
        <div className="card" style={{
            width: '320px',
            marginTop: '2rem',
            padding: '2.5rem',
            background: phase === 'work' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(72, 187, 120, 0.1)',
            borderColor: phase === 'work' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(72, 187, 120, 0.3)',
            transition: 'all 0.5s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
        }}>

            {/* Header: Mode Switch */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {phase === 'work' ? <Clock size={16} color="#90cdf4" /> : <Coffee size={16} color="#68d391" />}
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: phase === 'work' ? '#90cdf4' : '#68d391', letterSpacing: '1px' }}>
                        {phase === 'work' ? 'FOCUS' : 'BREAK'}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '2px' }}>
                    <button
                        onClick={() => setMode('25')}
                        style={{
                            background: mode === '25' ? 'rgba(255,255,255,0.1)' : 'transparent',
                            border: 'none',
                            color: mode === '25' ? '#fff' : '#666',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                        }}
                    >
                        25/5
                    </button>
                    <button
                        onClick={() => setMode('50')}
                        style={{
                            background: mode === '50' ? 'rgba(255,255,255,0.1)' : 'transparent',
                            border: 'none',
                            color: mode === '50' ? '#fff' : '#666',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                        }}
                    >
                        50/10
                    </button>
                </div>
            </div>

            {/* Center: Time Display */}
            <div style={{
                textAlign: 'center',
                position: 'relative',
                padding: '1rem 0'
            }}>
                <div style={{
                    fontSize: '4.5rem',
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-3px',
                    lineHeight: 1,
                    textShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}>
                    {formatTime(timeLeft)}
                </div>

                {/* Progress Bar under time */}
                <div style={{
                    width: '100%',
                    height: '4px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '2px',
                    marginTop: '1.5rem',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        height: '100%',
                        width: `${getProgress()}%`,
                        background: phase === 'work' ? '#90cdf4' : '#68d391',
                        transition: 'width 1s linear'
                    }} />
                </div>
            </div>

            {/* Controls Row */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
                <button
                    onClick={onToggle}
                    style={{
                        padding: '1.2rem',
                        borderRadius: '50%',
                        width: '72px',
                        height: '72px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isActive
                            ? 'rgba(255, 255, 255, 0.1)'
                            : (phase === 'work' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'),
                        border: 'none',
                        boxShadow: isActive ? 'none' : '0 8px 25px rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    {isActive ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" style={{ marginLeft: '4px' }} />}
                </button>

                <button
                    onClick={skipTrack}
                    title="Change Vibe"
                    disabled={phase === 'break'}
                    style={{
                        padding: '0.8rem',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: phase === 'break' ? 'not-allowed' : 'pointer',
                        opacity: phase === 'break' ? 0.3 : 1,
                        transition: 'all 0.2s'
                    }}
                >
                    <FastForward size={20} />
                </button>
            </div>

            {/* Footer: Intensity */}
            <div style={{
                background: 'rgba(0,0,0,0.2)',
                padding: '1rem',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} color="#ffd700" />
                    <span style={{ fontWeight: 500, fontSize: '0.75rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Intensity
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={intensity}
                    onChange={handleIntensityChange}
                    disabled={phase === 'break'}
                    style={{
                        width: '100%',
                        cursor: phase === 'break' ? 'not-allowed' : 'pointer',
                        opacity: phase === 'break' ? 0.5 : 1
                    }}
                />
            </div>

        </div>
    );
};

export default PlayerControls;
