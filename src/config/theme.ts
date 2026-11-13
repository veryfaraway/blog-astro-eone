export type BaseColorTheme = 'sage' | 'ocean' | 'sand' | 'slate';
export type SeasonalColorTheme =
  | 'new-year'
  | 'sakura'
  | 'resort'
  | 'thanksgiving'
  | 'christmas';

export type ColorTheme = BaseColorTheme | SeasonalColorTheme;

export interface SeasonalSchedule {
  theme: SeasonalColorTheme;
  /** 'MM-DD' 형식 양력 시작일 (포함) */
  start: string;
  /** 'MM-DD' 형식 양력 종료일 (포함) */
  end: string;
  /** 음력 설 연휴(음력 12.29 ～ 01.03) 추가 자동 매칭 여부 */
  includeLunarNewYear?: boolean;
  /** 홈 Hero에 표시할 시즌 마이크로 배지 문구 */
  badge: {
    ko: string;
    en: string;
  };
}

export const VALID_COLOR_THEMES: readonly ColorTheme[] = [
  'sage',
  'ocean',
  'sand',
  'slate',
  'new-year',
  'sakura',
  'resort',
  'thanksgiving',
  'christmas',
] as const;

export const SEASONAL_COLOR_THEMES: readonly SeasonalColorTheme[] = [
  'new-year',
  'sakura',
  'resort',
  'thanksgiving',
  'christmas',
] as const;

export const THEME_CONFIG = {
  /** 비시즌 평상시 기본 테마 */
  defaultTheme: 'ocean' as ColorTheme,

  /**
   * 운영자 수동 강제 고정 테마
   * - null: 아래 schedules에 따라 날짜별 자동 전환 (기본값)
   * - 특정 테마 지정(예: 'christmas' | 'ocean'): 날짜와 무관하게 해당 테마 고정 적용
   * - 미리보기: 브라우저에서 ?theme=christmas 등 쿼리로 언제든 테스트 가능 (?theme=auto 로 해제)
   */
  overrideTheme: null as ColorTheme | null,

  /** 시즌 자동 전환 스케줄 (위에서 아래 순서로 매칭) */
  schedules: [
    {
      theme: 'new-year',
      start: '01-01',
      end: '01-07',
      includeLunarNewYear: true,
      badge: { ko: '새해 복 많이 받으세요', en: 'Happy New Year' },
    },
    {
      theme: 'sakura',
      start: '03-25',
      end: '04-15',
      badge: { ko: '봄, 벚꽃이 피는 계절', en: 'Spring Blossom' },
    },
    {
      theme: 'resort',
      start: '07-15',
      end: '08-20',
      badge: { ko: '여름 휴양지의 바람', en: 'Summer Escape' },
    },
    {
      theme: 'thanksgiving',
      start: '11-14',
      end: '11-30',
      badge: { ko: '추수감사절 · 깊어가는 만추', en: 'Autumn Harvest' },
    },
    {
      theme: 'christmas',
      start: '12-15',
      end: '12-31',
      badge: { ko: '성탄 · 구유에 오신 빛', en: 'Nativity · Silent Night' },
    },
  ] satisfies SeasonalSchedule[],
};

/** SSR/정적 빌드 초기 폴백 값 (실제 테마는 BaseLayout 인라인 스크립트가 첫 페인트 전에 즉시 확정) */
export const colorTheme: ColorTheme =
  THEME_CONFIG.overrideTheme ?? THEME_CONFIG.defaultTheme;
