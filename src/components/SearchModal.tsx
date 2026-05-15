import { useEffect, useRef, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    PagefindUI: new (opts: { element: string | HTMLElement; showSubResults?: boolean; translations?: Record<string, string> }) => void;
  }
}

export default function SearchModal({ open, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!open || ready) return;
    const load = () => {
      const script = document.createElement('script');
      script.src = '/pagefind/pagefind-ui.js';
      script.onload = () => {
        try {
          if (containerRef.current && window.PagefindUI) {
            new window.PagefindUI({
              element: containerRef.current,
              showSubResults: true,
              translations: { placeholder: '검색어를 입력하세요...', zero_results: '검색 결과가 없습니다.' },
            });
            setReady(true);
          }
        } catch {
          // PagefindUI 초기화 실패 (dev 환경)
        }
      };
      script.onerror = () => { /* dev 환경에서 pagefind 없음 */ };
      document.head.appendChild(script);

      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = '/pagefind/pagefind-ui.css';
      document.head.appendChild(style);
    };
    load();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-card border border-border rounded-xl shadow-xl overflow-hidden">
        <div ref={containerRef} className="pagefind-ui p-4" />
        {!ready && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            빌드 후 검색이 활성화됩니다.
          </div>
        )}
      </div>
    </div>
  );
}
