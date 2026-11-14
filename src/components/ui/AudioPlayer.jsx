import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Pause, Play, X } from 'lucide-react';
import {
  getTranscriptProgress,
  isSpeechSynthesisSupported,
} from '@/utils/audio';

const statusLabels = {
  ready: 'READY TO TRANSMIT',
  playing: 'TRANSMITTING',
  stopped: 'TRANSMISSION STOPPED',
  complete: 'TRANSMISSION COMPLETE',
  unavailable: 'SPEECH UNAVAILABLE',
  error: 'PLAYBACK ERROR',
  empty: 'NO TRANSCRIPT',
};

export default function AudioPlayer({ equipment, isPlaying, onPlay, onStop, onClose }) {
  const [supported, setSupported] = useState(true);
  const [spokenCharacters, setSpokenCharacters] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [status, setStatus] = useState('ready');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const generation = useRef(0);
  const utteranceRef = useRef(null);
  const finished = useRef(false);

  useEffect(() => {
    const speech = typeof window !== 'undefined' ? window.speechSynthesis : null;
    generation.current += 1;
    speech?.cancel();
    utteranceRef.current = null;
    finished.current = false;
    setSpokenCharacters(0);
    setExpanded(true);
    setError('');
    setNotice('');
    if (!isSpeechSynthesisSupported()) {
      setSupported(false);
      setStatus('unavailable');
      setNotice('Speech synthesis is unavailable. The full transcript remains available.');
      return undefined;
    }
    setSupported(true);
    setStatus('ready');
    if (!speech.getVoices().length) {
      setNotice('No speech voices are available. The full transcript remains available.');
    }
    return () => {
      generation.current += 1;
      speech.cancel();
      utteranceRef.current = null;
    };
  }, [equipment?.id]);

  useEffect(() => {
    if (!isPlaying || !equipment) {
      return undefined;
    }
    const transcript = equipment.narrativeTranscript?.trim() || '';
    if (!supported) {
      setStatus('unavailable');
      onStop();
      return undefined;
    }
    if (!transcript) {
      setStatus('empty');
      setNotice('No transmission transcript is available for this mission.');
      onStop();
      return undefined;
    }
    const speech = window.speechSynthesis;
    speech.cancel();
    const token = generation.current;
    finished.current = false;
    setError('');
    setNotice('');
    setSpokenCharacters(0);
    setStatus('playing');
    const utterance = new window.SpeechSynthesisUtterance(transcript);
    utterance.pitch = 0.85;
    utterance.rate = 0.9;
    utteranceRef.current = utterance;
    utterance.onboundary = (event) => {
      if (generation.current === token) setSpokenCharacters(event.charIndex);
    };
    utterance.onend = () => {
      if (generation.current !== token) return;
      finished.current = true;
      setSpokenCharacters(transcript.length);
      setStatus('complete');
      onStop();
    };
    utterance.onerror = (event) => {
      if (generation.current !== token || event.error === 'canceled') return;
      setStatus('error');
      setError('Speech playback failed. You can replay the transcript.');
      onStop();
    };
    speech.speak(utterance);
    return () => {
      if (generation.current !== token) return;
      generation.current += 1;
      speech.cancel();
      utteranceRef.current = null;
      if (!finished.current) setStatus('stopped');
    };
  }, [equipment?.id, isPlaying, onStop, supported]);

  useEffect(() => {
    if (!isPlaying && status === 'playing') setStatus('stopped');
  }, [isPlaying, status]);

  if (!equipment) return null;
  const transcript = equipment.narrativeTranscript || '';
  const progress = getTranscriptProgress(spokenCharacters, transcript.length);
  const hasTranscript = transcript.trim().length > 0;
  const statusText = statusLabels[status] || statusLabels.ready;

  return (
    <section
      className="pointer-events-auto fixed bottom-6 left-1/2 z-[35] max-h-[70vh] w-[min(92vw,520px)] -translate-x-1/2 overflow-y-auto rounded-xl border border-[#00f3ff]/30 bg-[#12141d]/95 p-5 shadow-2xl backdrop-blur-md lg:left-6 lg:translate-x-0"
      role="dialog"
      aria-modal="false"
      aria-label={`${equipment.name} Final Hours transmission`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00f3ff]">Final Hours // Transmission Log</p>
          <h2 className="mt-1 text-lg text-white">{equipment.name}</h2>
        </div>
        <button type="button" onClick={onClose} className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#00f3ff]/70" aria-label="Close transmission log">
          <X size={18} />
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-y border-white/10 py-2">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[#ffb703]" role="status" aria-live="polite">{statusText}</p>
        {hasTranscript && (
          <button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} className="flex items-center gap-1 rounded px-2 py-1 font-mono text-[10px] text-white/55 hover:bg-white/10 hover:text-white">
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {expanded ? 'COLLAPSE' : 'EXPAND'} TRANSCRIPT
          </button>
        )}
      </div>
      {notice && <p className="mt-3 text-xs leading-relaxed text-[#ffb703]" role="status">{notice}</p>}
      {error && <p className="mt-3 text-xs leading-relaxed text-[#ff4d4d]" role="alert">{error}</p>}
      {hasTranscript ? (
        <div className={`mt-4 overflow-y-auto rounded border border-white/10 bg-black/10 p-4 ${expanded ? 'max-h-[36vh]' : 'max-h-24'}`}>
          <p className="whitespace-pre-line text-sm leading-7 text-white/85">{transcript}</p>
        </div>
      ) : (
        <p className="mt-4 rounded border border-white/10 p-4 text-sm leading-relaxed text-white/60">No transmission transcript is available for this mission.</p>
      )}
      {hasTranscript && (
        <>
          <div className="mt-4 flex h-6 items-end gap-1" aria-hidden="true">
            {[3, 8, 14, 6, 18, 10, 22, 7, 15, 5].map((height, index) => (
              <span key={index} className={`w-1 rounded-sm ${isPlaying ? 'animate-pulse bg-[#00f3ff]' : 'bg-white/20'}`} style={{ height: `${height}px`, animationDelay: `${index * 70}ms` }} />
            ))}
          </div>
          <div className="mt-3 h-1 rounded bg-white/10" aria-label={`Transmission progress ${Math.round(progress * 100)} percent`}>
            <div className="h-1 rounded bg-[#00f3ff]" style={{ width: `${progress * 100}%` }} />
          </div>
          <button type="button" onClick={isPlaying ? onStop : onPlay} className="mt-4 flex items-center gap-2 rounded border border-[#00f3ff]/40 px-4 py-2 font-mono text-xs text-[#00f3ff] hover:bg-[#00f3ff]/10 focus:outline-none focus:ring-2 focus:ring-[#00f3ff]/70">
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'STOP TRANSMISSION' : 'PLAY TRANSMISSION'}
          </button>
        </>
      )}
    </section>
  );
}
