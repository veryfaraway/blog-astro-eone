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
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!open) return;

    const init = () => {
      try {
        if (containerRef.current && window.PagefindUI) {
          new window.PagefindUI({
            element: containerRef.current,
            showSubResults: true,
            translations: { placeholder: '검색어를 입력하세요...', zero_results: '검색 결과가 없습니다.' },
          });
          setReady(true);
          requestAnimationFrame(() => {
            containerRef.current?.querySelector<HTMLInputElement>('.pagefind-ui__search-input')?.focus();
          });
        }
      } catch {
        setLoadError(true);
      }
    };

    if (window.PagefindUI) {
      init();
      return;
    }

    const script = document.createElement('script');
    script.src = '/pagefind/pagefind-ui.js';
    script.onload = init;
    script.onerror = () => {
      setLoadError(true);
    };
    document.head.appendChild(script);

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/pagefind/pagefind-ui.css';
    document.head.appendChild(style);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-card border border-border rounded-xl shadow-xl overflow-y-auto max-h-[70vh]">
        {loadError ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">검색 인덱스를 불러올 수 없습니다.</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              로컬 개발 환경(<code>pnpm dev</code>)에서는 Pagefind 검색 인덱스가 생성되지 않습니다.<br />
              <code>pnpm build && pnpm preview</code>로 실행하면 검색 기능을 확인할 수 있습니다.
            </p>
          </div>
        ) : (
          <>
            <div ref={containerRef} className="pagefind-ui p-4" />
            {!ready && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                검색 엔진을 불러오는 중입니다...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
