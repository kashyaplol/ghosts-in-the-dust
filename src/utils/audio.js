export function getTranscriptProgress(spokenCharacters, transcriptLength) {
  return Math.min(spokenCharacters / Math.max(transcriptLength, 1), 1);
}

export function isSpeechSynthesisSupported() {
  return typeof window !== 'undefined'
    && Boolean(window.speechSynthesis)
    && typeof window.SpeechSynthesisUtterance === 'function';
}

