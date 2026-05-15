import { Languages } from 'lucide-react';

interface Props {
  lang?: 'ko' | 'en';
  alternateUrl?: string;
}

export default function LanguageSwitcher({ lang = 'ko', alternateUrl }: Props) {
  if (!alternateUrl) return null;

  const targetLang = lang === 'ko' ? 'EN' : 'KO';

  return (
    <a
      href={alternateUrl}
      aria-label={`Switch to ${targetLang}`}
      className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors font-medium"
    >
      <Languages size={14} />
      {targetLang}
    </a>
  );
}
