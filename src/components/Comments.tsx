import { useEffect, useRef } from 'react';

interface Props {
  lang?: 'ko' | 'en';
}

export default function Comments({ lang = 'ko' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.querySelector('iframe')) return;

    const repo = import.meta.env.PUBLIC_GISCUS_REPO;
    const repoId = import.meta.env.PUBLIC_GISCUS_REPO_ID;
    const category = import.meta.env.PUBLIC_GISCUS_CATEGORY;
    const categoryId = import.meta.env.PUBLIC_GISCUS_CATEGORY_ID;

    if (!repo || !repoId || !category || !categoryId) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    script.setAttribute('data-lang', lang === 'ko' ? 'ko' : 'en');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    ref.current.appendChild(script);

    // theme sync
    const observer = new MutationObserver(() => {
      const iframe = document.querySelector<HTMLIFrameElement>('.giscus-frame');
      if (!iframe) return;
      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      iframe.contentWindow?.postMessage({ giscus: { setConfig: { theme } } }, 'https://giscus.app');
    });
    observer.observe(document.documentElement, { attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="giscus mt-12 pt-8 border-t border-border" />;
}
