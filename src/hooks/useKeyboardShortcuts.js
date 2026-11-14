import { useEffect } from 'react';

const isEditable = (target) => (
  ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName)
);

export default function useKeyboardShortcuts({
  inputRef,
  isTutorialOpen,
  isInspectorOpen,
  isAudioOpen,
  isShortcutGuideOpen,
  searchOpen,
  hasSearchResults,
  hasSelection,
  onCameraAction,
  onClearSearch,
  onDismissSearch,
  onFocusSearch,
  onNavigateSearch,
  onSelectSearch,
  onCloseInspector,
  onCloseAudio,
  onCloseShortcutGuide,
  onToggleShortcutGuide,
  onCloseSelection,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isTutorialOpen) return;
      const editable = isEditable(event.target);
      if (event.key === 'Escape') {
        if (isShortcutGuideOpen) onCloseShortcutGuide();
        else if (hasSearchResults || searchOpen) {
          onClearSearch();
          onDismissSearch();
        }
        else if (isAudioOpen) onCloseAudio();
        else if (isInspectorOpen) onCloseInspector();
        else onCloseSelection();
        return;
      }
      if (editable) {
        if (event.target !== inputRef.current) return;
        if (event.key === 'ArrowDown') onNavigateSearch(1);
        if (event.key === 'ArrowUp') onNavigateSearch(-1);
        if (event.key === 'Enter') onSelectSearch();
        return;
      }
      if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        onFocusSearch();
      } else if (event.key.toLowerCase() === 'r') onCameraAction('reset');
      else if (event.key.toLowerCase() === 'f' && hasSelection) onCameraAction('focus');
      else if (event.key.toLowerCase() === 'g') onCameraAction('explore');
      else if (event.key === '?') onToggleShortcutGuide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    hasSearchResults,
    hasSelection,
    inputRef,
    isAudioOpen,
    isInspectorOpen,
    isShortcutGuideOpen,
    isTutorialOpen,
    onCameraAction,
    onClearSearch,
    onCloseAudio,
    onCloseInspector,
    onCloseSelection,
    onCloseShortcutGuide,
    onDismissSearch,
    onFocusSearch,
    onNavigateSearch,
    onSelectSearch,
    onToggleShortcutGuide,
    searchOpen,
  ]);
}
