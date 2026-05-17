import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────

interface Holding {
  ticker: string;
  shares: number;
  sector?: string;
}

interface Account {
  name: string;
  holdings: Holding[];
}

interface PriceEntry {
  close: number;
  change: number;
  changePercent: number;
}

interface PriceData {
  date: string;
  prices: Record<string, PriceEntry>;
}

interface Portfolio {
  accounts: Record<string, Account>;
}

interface Props {
  portfolio: Portfolio;
  priceData: PriceData;
  availableDates: string[];
  selectedDate: string;
}

// ── Color helpers ──────────────────────────────────────────────────────────

function getChangeColor(changePercent: number): string {
  if (changePercent >= 3) return '#1a7a4a';
  if (changePercent >= 1) return '#2ea855';
  if (changePercent > -1) return '#4a5060';
  if (changePercent > -3) return '#c0392b';
  return '#8b0000';
}

function getTextColor(changePercent: number): string {
  if (changePercent >= 1) return '#b0ffcc';
  if (changePercent > -1) return '#c8cdd8';
  return '#ffc4bb';
}

// ── Cell component ─────────────────────────────────────────────────────────

interface CellProps {
  ticker: string;
  shares: number;
  price: PriceEntry | undefined;
  weightPercent: number;
}

function HeatMapCell({ ticker, shares, price, weightPercent }: CellProps) {
  const [hovered, setHovered] = useState(false);

  const bgColor = price ? getChangeColor(price.changePercent) : '#2a2d35';
  const textColor = price ? getTextColor(price.changePercent) : '#888fa0';
  const changeSign = price && price.changePercent >= 0 ? '+' : '';
  const changePct = price ? `${changeSign}${price.changePercent.toFixed(2)}%` : 'N/A';

  return (
    <div
      className="vault-cell"
      style={{
        flexBasis: `${weightPercent}%`,
        minWidth: '80px',
        minHeight: '72px',
        backgroundColor: bgColor,
        borderRadius: '4px',
        margin: '2px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'default',
        position: 'relative',
        transition: 'filter 0.15s ease',
        filter: hovered ? 'brightness(1.2)' : 'brightness(1)',
        boxSizing: 'border-box',
        padding: '8px 4px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ticker label */}
      <span
        style={{
          color: textColor,
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 700,
          fontSize: '0.85rem',
          letterSpacing: '0.04em',
        }}
      >
        {ticker}
      </span>

      {/* Change percent */}
      <span
        style={{
          color: textColor,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.72rem',
          marginTop: '2px',
          opacity: 0.9,
        }}
      >
        {changePct}
      </span>

      {/* Hover tooltip */}
      {hovered && price && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0d1117',
            border: '1px solid #2ea855',
            borderRadius: '6px',
            padding: '10px 14px',
            zIndex: 50,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
          }}
        >
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.8rem',
              color: '#72e8a0',
              fontWeight: 700,
              marginBottom: '4px',
            }}
          >
            {ticker}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#c8cdd8', lineHeight: 1.7 }}>
            <span style={{ color: '#888fa0' }}>현재가  </span>${price.close.toFixed(2)}
            <br />
            <span style={{ color: '#888fa0' }}>등락률  </span>
            <span style={{ color: price.changePercent >= 0 ? '#2ea855' : '#c0392b' }}>
              {changeSign}{price.changePercent.toFixed(2)}%
            </span>
            <br />
            <span style={{ color: '#888fa0' }}>보유비중 </span>{weightPercent.toFixed(1)}%
          </div>
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #2ea855',
            }}
          />
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function HeatMap({ portfolio, priceData, availableDates, selectedDate }: Props) {
  const accountKeys = Object.keys(portfolio.accounts) as Array<keyof typeof portfolio.accounts>;
  const [activeAccount, setActiveAccount] = useState<string>(accountKeys[0]);

  const currentAccount = portfolio.accounts[activeAccount];
  const sortedDates = [...availableDates].sort();
  const currentDateIndex = sortedDates.indexOf(selectedDate);

  // Navigate to a different date via query string
  function navigateToDate(date: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('date', date);
    window.location.href = url.toString();
  }

  const canGoPrev = currentDateIndex > 0;
  const canGoNext = currentDateIndex < sortedDates.length - 1;

  // Compute total value of current account at selected prices
  const holdings = currentAccount.holdings;
  const totalValue = holdings.reduce((sum, h) => {
    const p = priceData.prices[h.ticker];
    return sum + (p ? p.close * h.shares : 0);
  }, 0);

  // Build cell data with weights
  const cells = holdings.map((h) => {
    const p = priceData.prices[h.ticker];
    const value = p ? p.close * h.shares : 0;
    const weightPercent = totalValue > 0 ? (value / totalValue) * 100 : 100 / holdings.length;
    return { ...h, price: p, weightPercent };
  });

  // 섹터별 그룹핑 (sector 없으면 'Other')
  const hasSectors = holdings.some(h => h.sector);
  const sectorMap: Record<string, typeof cells> = {};
  if (hasSectors) {
    cells.forEach(cell => {
      const s = cell.sector ?? 'Other';
      if (!sectorMap[s]) sectorMap[s] = [];
      sectorMap[s].push(cell);
    });
    // 섹터 내 비중 내림차순 정렬
    Object.values(sectorMap).forEach(g => g.sort((a, b) => b.weightPercent - a.weightPercent));
  } else {
    cells.sort((a, b) => b.weightPercent - a.weightPercent);
  }

  return (
    <div
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        color: 'oklch(0.72 0.18 145)',
      }}
    >
      {/* Account tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '16px',
          borderBottom: '1px solid oklch(0.27 0.012 120 / 60%)',
          paddingBottom: '0',
        }}
      >
        {accountKeys.map((key) => {
          const isActive = key === activeAccount;
          return (
            <button
              key={key}
              onClick={() => setActiveAccount(key)}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 400,
                padding: '6px 18px',
                border: 'none',
                borderBottom: isActive ? '2px solid #2ea855' : '2px solid transparent',
                background: 'transparent',
                color: isActive ? '#2ea855' : '#697565',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                transition: 'color 0.15s',
                marginBottom: '-1px',
              }}
            >
              {portfolio.accounts[key].name}
            </button>
          );
        })}
      </div>

      {/* Date navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={() => canGoPrev && navigateToDate(sortedDates[currentDateIndex - 1])}
          disabled={!canGoPrev}
          style={{
            background: 'transparent',
            border: '1px solid oklch(0.27 0.012 120 / 60%)',
            borderRadius: '4px',
            padding: '4px 8px',
            color: canGoPrev ? '#2ea855' : '#3a3f48',
            cursor: canGoPrev ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="이전 날짜"
        >
          <ChevronLeft size={16} />
        </button>

        <span
          style={{
            fontSize: '0.8rem',
            color: '#72e8a0',
            letterSpacing: '0.08em',
          }}
        >
          {selectedDate}
        </span>

        <button
          onClick={() => canGoNext && navigateToDate(sortedDates[currentDateIndex + 1])}
          disabled={!canGoNext}
          style={{
            background: 'transparent',
            border: '1px solid oklch(0.27 0.012 120 / 60%)',
            borderRadius: '4px',
            padding: '4px 8px',
            color: canGoNext ? '#2ea855' : '#3a3f48',
            cursor: canGoNext ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="다음 날짜"
        >
          <ChevronRight size={16} />
        </button>

        <span
          style={{
            marginLeft: 'auto',
            fontSize: '0.7rem',
            color: '#697565',
            letterSpacing: '0.04em',
          }}
        >
          {holdings.length}개 종목 · 비중 기준
        </span>
      </div>

      {/* Heatmap grid — 섹터별 또는 단순 flex */}
      {hasSectors ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          {Object.entries(sectorMap).map(([sector, group]) => (
            <div key={sector}>
              {/* 섹터 헤더 */}
              <div
                style={{
                  fontSize: '0.68rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#697565',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                  borderLeft: '2px solid #2ea855',
                  paddingLeft: '8px',
                }}
              >
                {sector}
              </div>
              {/* 섹터 내 종목 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                {group.map(cell => (
                  <HeatMapCell
                    key={cell.ticker}
                    ticker={cell.ticker}
                    shares={cell.shares}
                    price={cell.price}
                    weightPercent={cell.weightPercent}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', minHeight: '200px' }}>
          {cells.map((cell) => (
            <HeatMapCell
              key={cell.ticker}
              ticker={cell.ticker}
              shares={cell.shares}
              price={cell.price}
              weightPercent={cell.weightPercent}
            />
          ))}
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginTop: '16px',
          flexWrap: 'wrap',
          fontSize: '0.68rem',
          color: '#697565',
          letterSpacing: '0.04em',
        }}
      >
        {[
          { color: '#1a7a4a', label: '+3% 이상' },
          { color: '#2ea855', label: '+1%~+3%' },
          { color: '#4a5060', label: '중립' },
          { color: '#c0392b', label: '-1%~-3%' },
          { color: '#8b0000', label: '-3% 이하' },
        ].map(({ color, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                backgroundColor: color,
                borderRadius: '2px',
              }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
