import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Pause, Play } from 'lucide-react';
import { getTranscriptProgress, isSpeechSynthesisSupported } from '@/utils/audio';
import { Button, PanelHeader } from '@/components/ui/primitives';

const statusLabels = {
  ready: 'Ready to transmit',
  playing: 'Transmitting narrative',
  stopped: 'Transmission paused',
  complete: 'Transmission complete',
  unavailable: 'Speech unavailable',
  error: 'Playback error',
  empty: 'No transcript',
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
    if (!isPlaying || !equipment) return undefined;
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
      className="instrument-panel archive-scroll pointer-events-auto fixed bottom-16 left-4 z-[35] max-h-[calc(100vh-10.75rem)] w-[calc(100vw-2rem)] overflow-y-auto rounded-lg p-4 sm:left-5 sm:w-[364px] lg:bottom-5 lg:max-h-[48vh]"
      role="dialog"
      aria-modal="false"
      aria-label={`${equipment.name} Final Hours transmission`}
    >
      <PanelHeader
        eyebrow="Final Hours · Mission Narrative"
        eyebrowClass="text-solar-amber"
        title={equipment.name}
        onClose={onClose}
        closeLabel="Close transmission log"
      />
      <div className="mt-3 flex items-center justify-between gap-3 border-y border-white/10 py-1.5">
        <p className="font-mono text-[11px] text-solar-amber" role="status" aria-live="polite">{statusText}</p>
        {hasTranscript && (
          <Button variant="tertiary" size="sm" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} className="!h-7 !px-2 text-[11px]">
            {expanded ? <ChevronUp size={13} aria-hidden="true" /> : <ChevronDown size={13} aria-hidden="true" />}
            {expanded ? 'COLLAPSE' : 'EXPAND'}
          </Button>
        )}
      </div>
      {notice && <p className="mt-2.5 text-xs leading-relaxed text-solar-amber" role="status">{notice}</p>}
      {error && <p className="mt-2.5 text-xs leading-relaxed text-alert-red" role="alert">{error}</p>}
      {hasTranscript ? (
        <div className={`archive-scroll mt-3 overflow-y-auto border-l border-white/15 pl-3 ${expanded ? 'max-h-[20vh]' : 'max-h-16'}`}>
          <p className="whitespace-pre-line font-display text-[15px] italic leading-7 text-ink-primary/90">
            &ldquo;{transcript}&rdquo;
          </p>
        </div>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">No transmission transcript is available for this mission.</p>
      )}
      {hasTranscript && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="flex items-center justify-between gap-3">
            <Button variant={isPlaying ? 'danger' : 'primary'} size="sm" onClick={isPlaying ? onStop : onPlay}>
              {isPlaying ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
              {isPlaying ? 'Stop Transmission' : 'Play Transmission'}
            </Button>
            <div className="flex items-end gap-1" aria-hidden="true">
              {[4, 10, 16, 7, 19, 12, 17, 8, 13, 5].map((height, index) => (
                <span key={index} className={`w-1 rounded-sm transition-colors duration-200 ${isPlaying ? 'bg-ice-accent' : 'bg-white/15'}`} style={{ height: `${height}px` }} />
              ))}
            </div>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-sm bg-white/10" aria-label={`Transmission progress ${Math.round(progress * 100)} percent`}>
            <div className="h-full bg-ice-accent transition-[width] duration-200" style={{ width: `${progress * 100}%` }} />
          </div>
          <p className="mt-2.5 text-[11px] leading-snug text-ink-muted">
            Browser-generated narration. Not original mission audio.
          </p>
        </div>
      )}
    </section>
  );
}
