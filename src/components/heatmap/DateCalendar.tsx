import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  availableDates: string[];
  availableMonths: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onClose: () => void;
}

const MONTH_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const DAY_LABELS = ['Mo','Tu','We','Th','Fr','Sa','Su'];

export default function DateCalendar({ availableDates, availableMonths, selectedDate, onSelectDate, onClose }: Props) {
  const [calendarMonth, setCalendarMonth] = useState(selectedDate.slice(0, 7));
  const [availableInMonth, setAvailableInMonth] = useState<Set<string>>(new Set());
  const [loadingDates, setLoadingDates] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Close on ESC
  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Load available dates for the displayed month
  useEffect(() => {
    const daily = availableDates.filter(d => d.startsWith(calendarMonth));
    if (daily.length > 0) {
      setAvailableInMonth(new Set(daily));
      return;
    }
    if (availableMonths.includes(calendarMonth)) {
      setLoadingDates(true);
      fetch(`/data/prices/monthly/${calendarMonth}.json`)
        .then(r => r.json())
        .then(data => setAvailableInMonth(new Set(
          (data.days ?? []).map((d: { date: string }) => d.date)
        )))
        .catch(() => setAvailableInMonth(new Set()))
        .finally(() => setLoadingDates(false));
    } else {
      setAvailableInMonth(new Set());
    }
  }, [calendarMonth, availableDates, availableMonths]);

  // Navigation limits
  const allMonths = [...new Set([
    ...availableDates.map(d => d.slice(0, 7)),
    ...availableMonths,
  ])].sort();
  const earliestMonth = allMonths[0] ?? calendarMonth;
  const latestMonth = allMonths[allMonths.length - 1] ?? calendarMonth;
  const canGoPrev = calendarMonth > earliestMonth;
  const canGoNext = calendarMonth < latestMonth;

  function changeMonth(delta: number) {
    const [y, m] = calendarMonth.split('-').map(Number);
    const raw = m + delta;
    const year = y + Math.floor((raw - 1) / 12);
    const month = ((raw - 1 + 120) % 12) + 1;
    setCalendarMonth(`${year}-${String(month).padStart(2, '0')}`);
  }

  // Calendar grid
  const [year, monthNum] = calendarMonth.split('-').map(Number);
  const firstDow = new Date(year, monthNum - 1, 1).getDay(); // 0=Sun
  const startOffset = (firstDow + 6) % 7;                    // Mo=0
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function toDateStr(day: number) {
    return `${calendarMonth}-${String(day).padStart(2, '0')}`;
  }

  const C = {
    bg:          '#0d1117',
    border:      'oklch(0.27 0.012 120 / 60%)',
    green:       '#2ea855',
    greenDim:    '#1a5c35',
    textPrimary: '#72e8a0',
    textMuted:   '#697565',
    textDim:     '#3a3f48',
    selected:    '#2ea855',
  } as const;

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: 0,
        zIndex: 100,
        backgroundColor: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: '6px',
        padding: '14px',
        width: '228px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
        fontFamily: 'JetBrains Mono, monospace',
      }}
    >
      {/* Month header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <button
          onClick={() => canGoPrev && changeMonth(-1)}
          disabled={!canGoPrev}
          style={{ background: 'none', border: 'none', padding: '2px 4px', cursor: canGoPrev ? 'pointer' : 'not-allowed', color: canGoPrev ? C.green : C.textDim, display: 'flex', alignItems: 'center' }}
          aria-label="이전 달"
        >
          <ChevronLeft size={13} />
        </button>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: C.textPrimary, letterSpacing: '0.1em' }}>
          {MONTH_ABBR[monthNum - 1]}&nbsp;&nbsp;{year}
        </span>
        <button
          onClick={() => canGoNext && changeMonth(1)}
          disabled={!canGoNext}
          style={{ background: 'none', border: 'none', padding: '2px 4px', cursor: canGoNext ? 'pointer' : 'not-allowed', color: canGoNext ? C.green : C.textDim, display: 'flex', alignItems: 'center' }}
          aria-label="다음 달"
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Day-of-week header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
        {DAY_LABELS.map((d, i) => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.6rem', color: i >= 5 ? C.textDim : C.textMuted, letterSpacing: '0.02em' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      {loadingDates ? (
        <div style={{ textAlign: 'center', color: C.textMuted, fontSize: '0.7rem', padding: '14px 0' }}>
          loading...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
          {cells.map((day, i) => {
            if (day === null) return <div key={`e-${i}`} />;
            const ds = toDateStr(day);
            const hasData = availableInMonth.has(ds);
            const isSelected = ds === selectedDate;
            const isWeekend = (i % 7) >= 5;
            return (
              <button
                key={ds}
                onClick={() => { if (hasData) { onSelectDate(ds); onClose(); } }}
                disabled={!hasData}
                title={hasData ? ds : undefined}
                style={{
                  background: isSelected ? C.green : 'transparent',
                  border: hasData && !isSelected ? `1px solid ${C.greenDim}` : '1px solid transparent',
                  borderRadius: '3px',
                  padding: '4px 0',
                  fontSize: '0.68rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: isSelected
                    ? '#0d1117'
                    : hasData
                      ? C.green
                      : isWeekend ? '#252830' : C.textDim,
                  cursor: hasData ? 'pointer' : 'default',
                  textAlign: 'center',
                  fontWeight: isSelected ? 700 : 400,
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (hasData && !isSelected) (e.target as HTMLElement).style.background = '#1a3d28'; }}
                onMouseLeave={e => { if (hasData && !isSelected) (e.target as HTMLElement).style.background = 'transparent'; }}
              >
                {day}
              </button>
            );
          })}
        </div>
      )}

      {/* Archive quick-access */}
      {availableMonths.length > 0 && (
        <div style={{ marginTop: '12px', borderTop: `1px solid ${C.border}`, paddingTop: '10px' }}>
          <div style={{ fontSize: '0.58rem', color: C.textDim, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
            archive
          </div>
          {[...availableMonths].sort().reverse().map(m => {
            const [y, mo] = m.split('-').map(Number);
            const isActive = calendarMonth === m;
            return (
              <button
                key={m}
                onClick={() => setCalendarMonth(m)}
                style={{
                  display: 'block',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '3px 4px',
                  fontSize: '0.7rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: isActive ? C.green : C.textMuted,
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                  borderRadius: '3px',
                }}
                onMouseEnter={e => { if (!isActive) (e.target as HTMLElement).style.color = C.green; }}
                onMouseLeave={e => { if (!isActive) (e.target as HTMLElement).style.color = C.textMuted; }}
              >
                {MONTH_ABBR[mo - 1]}&nbsp;&nbsp;{y}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
