import { useEffect, useState } from 'react';
import { Pause, Play, X } from 'lucide-react';
import {
  getTranscriptProgress,
  isSpeechSynthesisSupported,
} from '@/utils/audio';

export default function AudioPlayer({ equipment, isPlaying, onPlay, onStop, onClose }) {
  const [supported, setSupported] = useState(true);
  const [spokenCharacters, setSpokenCharacters] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const speech = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (!isSpeechSynthesisSupported()) {
      setSupported(false);
      setError('Speech synthesis is unavailable in this browser.');
      return undefined;
    }
    if (!speech.getVoices().length) {
      setError('No speech voices are available. The transcript remains readable.');
    } else {
      setSupported(true);
      setError('');
    }
    speech.cancel();
    setSpokenCharacters(0);
    return () => speech.cancel();
  }, [equipment, onStop]);

  useEffect(() => {
    if (!isPlaying || !supported || !equipment) return undefined;
    const transcript = equipment.narrativeTranscript?.trim();
    if (!transcript) {
      setError('No transmission transcript is available for this mission.');
      onStop();
      return undefined;
    }
    setError('');
    setSpokenCharacters(0);
    const utterance = new window.SpeechSynthesisUtterance(transcript);
    utterance.pitch = 0.85;
    utterance.rate = 0.9;
    utterance.onboundary = (event) => setSpokenCharacters(event.charIndex);
    utterance.onend = () => {
      setSpokenCharacters(transcript.length);
      onStop();
    };
    utterance.onerror = (event) => {
      if (event.error !== 'canceled') setError('Speech playback failed. You can replay the transcript.');
      onStop();
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [equipment, isPlaying, onStop, supported]);

  if (!equipment) return null;
  const transcript = equipment.narrativeTranscript;
  const progress = getTranscriptProgress(spokenCharacters, transcript.length);
  const hasTranscript = transcript.trim().length > 0;

  return (
    <div className="pointer-events-auto fixed bottom-6 left-1/2 z-50 w-[min(92vw,640px)] -translate-x-1/2 rounded-xl border border-[#00f3ff]/30 bg-[#12141d]/95 p-5 shadow-2xl backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00f3ff]">
            Final Hours // Transmission Log
          </p>
          <h2 className="mt-1 text-lg text-white">{equipment.name}</h2>
        </div>
        <button type="button" onClick={onClose} className="text-white/50 hover:text-white" aria-label="Close transmission log">
          <X size={18} />
        </button>
      </div>
      {!supported ? (
        <p className="mt-5 text-sm text-[#ff4d4d]" role="alert">{error}</p>
      ) : !hasTranscript ? (
        <p className="mt-5 text-sm text-white/60">No transmission transcript is available for this mission.</p>
      ) : (
        <>
          {error && <p className="mt-5 text-sm text-[#ffb703]" role="alert">{error}</p>}
          <p className="mt-5 text-sm leading-relaxed text-white/80">
            {transcript.slice(0, spokenCharacters)}
            <span className="text-white/40">{transcript.slice(spokenCharacters)}</span>
          </p>
          <div className="mt-4 flex h-6 items-end gap-1">
            {[3, 8, 14, 6, 18, 10, 22, 7, 15, 5].map((height, index) => (
              <span
                key={index}
                className={`w-1 rounded-sm ${isPlaying ? 'animate-pulse bg-[#00f3ff]' : 'bg-white/20'}`}
                style={{ height: `${height}px`, animationDelay: `${index * 70}ms` }}
              />
            ))}
          </div>
          <div className="mt-3 h-1 rounded bg-white/10">
            <div className="h-1 rounded bg-[#00f3ff]" style={{ width: `${progress * 100}%` }} />
          </div>
          <button
            type="button"
            onClick={isPlaying ? onStop : onPlay}
            className="mt-4 flex items-center gap-2 rounded border border-[#00f3ff]/40 px-4 py-2 font-mono text-xs text-[#00f3ff] hover:bg-[#00f3ff]/10"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'STOP TRANSMISSION' : 'PLAY TRANSMISSION'}
          </button>
        </>
      )}
    </div>
  );
}
