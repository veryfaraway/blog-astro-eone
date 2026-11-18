export interface BaseballTeamTheme {
  code: string;
  nameKo: string;
  shortKo: string;
  league: 'KBO' | 'MLB' | 'NPB' | 'OTHER';
  /** 라이트 모드 포인트 컬러 (보더·배지 텍스트) */
  accentLight: string;
  /** 다크 모드 포인트 컬러 (어두운 네이비·블랙 구단의 가독성 보정) */
  accentDark: string;
}

const KBO_TEAMS: Record<string, BaseballTeamTheme> = {
  KIA: {
    code: 'KIA',
    nameKo: 'KIA 타이거즈',
    shortKo: 'KIA',
    league: 'KBO',
    accentLight: '#EA0029',
    accentDark: '#FF4D6A',
  },
  SAMSUNG: {
    code: 'SAMSUNG',
    nameKo: '삼성 라이온즈',
    shortKo: '삼성',
    league: 'KBO',
    accentLight: '#074CA1',
    accentDark: '#4D94FF',
  },
  LG: {
    code: 'LG',
    nameKo: 'LG 트윈스',
    shortKo: 'LG',
    league: 'KBO',
    accentLight: '#C30452',
    accentDark: '#F45B96',
  },
  DOOSAN: {
    code: 'DOOSAN',
    nameKo: '두산 베어스',
    shortKo: '두산',
    league: 'KBO',
    accentLight: '#131230',
    accentDark: '#8E9AAF',
  },
  KT: {
    code: 'KT',
    nameKo: 'kt 위즈',
    shortKo: 'KT',
    league: 'KBO',
    accentLight: '#231F20',
    accentDark: '#F87171',
  },
  SSG: {
    code: 'SSG',
    nameKo: 'SSG 랜더스',
    shortKo: 'SSG',
    league: 'KBO',
    accentLight: '#CE0E2D',
    accentDark: '#FB566E',
  },
  LOTTE: {
    code: 'LOTTE',
    nameKo: '롯데 자이언츠',
    shortKo: '롯데',
    league: 'KBO',
    accentLight: '#041E42',
    accentDark: '#60A5FA',
  },
  HANWHA: {
    code: 'HANWHA',
    nameKo: '한화 이글스',
    shortKo: '한화',
    league: 'KBO',
    accentLight: '#FC4E00',
    accentDark: '#FF7A3D',
  },
  NC: {
    code: 'NC',
    nameKo: 'NC 다이노스',
    shortKo: 'NC',
    league: 'KBO',
    accentLight: '#315288',
    accentDark: '#7DA2DF',
  },
  KIWOOM: {
    code: 'KIWOOM',
    nameKo: '키움 히어로즈',
    shortKo: '키움',
    league: 'KBO',
    accentLight: '#570514',
    accentDark: '#E05268',
  },
};

const MLB_TEAMS: Record<string, BaseballTeamTheme> = {
  SF: {
    code: 'SF',
    nameKo: '샌프란시스코 자이언츠',
    shortKo: 'SF',
    league: 'MLB',
    accentLight: '#FD5A1E',
    accentDark: '#FF7E4D',
  },
  LAD: {
    code: 'LAD',
    nameKo: 'LA 다저스',
    shortKo: 'LAD',
    league: 'MLB',
    accentLight: '#005A9C',
    accentDark: '#4DA3FF',
  },
  SD: {
    code: 'SD',
    nameKo: '샌디에이고 파드리스',
    shortKo: 'SD',
    league: 'MLB',
    accentLight: '#6F4E37',
    accentDark: '#FFC425',
  },
  NYY: {
    code: 'NYY',
    nameKo: '뉴욕 양키스',
    shortKo: 'NYY',
    league: 'MLB',
    accentLight: '#0C2340',
    accentDark: '#7FA6D6',
  },
  NYM: {
    code: 'NYM',
    nameKo: '뉴욕 메츠',
    shortKo: 'NYM',
    league: 'MLB',
    accentLight: '#002D72',
    accentDark: '#FF7930',
  },
  BOS: {
    code: 'BOS',
    nameKo: '보스턴 레드삭스',
    shortKo: 'BOS',
    league: 'MLB',
    accentLight: '#BD3039',
    accentDark: '#F0626B',
  },
  ATL: {
    code: 'ATL',
    nameKo: '애틀랜타 브레이브스',
    shortKo: 'ATL',
    league: 'MLB',
    accentLight: '#CE1141',
    accentDark: '#F2577E',
  },
  PHI: {
    code: 'PHI',
    nameKo: '필라델피아 필리스',
    shortKo: 'PHI',
    league: 'MLB',
    accentLight: '#E81828',
    accentDark: '#F85C68',
  },
  HOU: {
    code: 'HOU',
    nameKo: '휴스턴 애스트로스',
    shortKo: 'HOU',
    league: 'MLB',
    accentLight: '#EB6E1F',
    accentDark: '#FF9248',
  },
  TEX: {
    code: 'TEX',
    nameKo: '텍사스 레인저스',
    shortKo: 'TEX',
    league: 'MLB',
    accentLight: '#003278',
    accentDark: '#5B9BFF',
  },
  TOR: {
    code: 'TOR',
    nameKo: '토론토 블루제이스',
    shortKo: 'TOR',
    league: 'MLB',
    accentLight: '#134A8E',
    accentDark: '#5CA3FF',
  },
  PIT: {
    code: 'PIT',
    nameKo: '피츠버그 파이리츠',
    shortKo: 'PIT',
    league: 'MLB',
    accentLight: '#B48800',
    accentDark: '#FDB827',
  },
  TB: {
    code: 'TB',
    nameKo: '탬파베이 레이스',
    shortKo: 'TB',
    league: 'MLB',
    accentLight: '#092C5C',
    accentDark: '#8FBCE6',
  },
  SEA: {
    code: 'SEA',
    nameKo: '시애틀 매리너스',
    shortKo: 'SEA',
    league: 'MLB',
    accentLight: '#005C5C',
    accentDark: '#38BDB6',
  },
  CHC: {
    code: 'CHC',
    nameKo: '시카고 컵스',
    shortKo: 'CHC',
    league: 'MLB',
    accentLight: '#0E3386',
    accentDark: '#5C8DF6',
  },
  STL: {
    code: 'STL',
    nameKo: '세인트루이스 카디널스',
    shortKo: 'STL',
    league: 'MLB',
    accentLight: '#C41E3A',
    accentDark: '#F25C75',
  },
};

const TEAM_ALIASES: Record<string, string> = {
  // KBO 한글·약칭 매핑
  '기아': 'KIA',
  'KIA타이거즈': 'KIA',
  '기아타이거즈': 'KIA',
  '삼성': 'SAMSUNG',
  '삼성라이온즈': 'SAMSUNG',
  '엘지': 'LG',
  'LG트윈스': 'LG',
  '두산': 'DOOSAN',
  '두산베어스': 'DOOSAN',
  '케이티': 'KT',
  'KT위즈': 'KT',
  'KTWIZ': 'KT',
  'SSG랜더스': 'SSG',
  '랜더스': 'SSG',
  '롯데': 'LOTTE',
  '롯데자이언츠': 'LOTTE',
  '한화': 'HANWHA',
  '한화이글스': 'HANWHA',
  'NC다이노스': 'NC',
  '엔씨': 'NC',
  '키움': 'KIWOOM',
  '키움히어로즈': 'KIWOOM',
  // MLB 영문 풀네임·약칭 매핑 (MLB Stats API currentTeam.name 호환)
  'SANFRANCISCOGIANTS': 'SF',
  'SFG': 'SF',
  'LOSANGELESDODGERS': 'LAD',
  'SANDIEGOPADRES': 'SD',
  'SDP': 'SD',
  'NEWYORKYANKEES': 'NYY',
  'NEWYORKMETS': 'NYM',
  'BOSTONREDSOX': 'BOS',
  'ATLANTABRAVES': 'ATL',
  'PHILADELPHIAPHILLIES': 'PHI',
  'HOUSTONASTROS': 'HOU',
  'TEXASZRANGERS': 'TEX',
  'TEXASRANGERS': 'TEX',
  'TORONTOBLUEJAYS': 'TOR',
  'PITTSBURGHPIRATES': 'PIT',
  'TAMPABAYRAYS': 'TB',
  'TBR': 'TB',
  'SEATTLEMARINERS': 'SEA',
  'CHICAGOCUBS': 'CHC',
  'STLOUISCARDINALS': 'STL',
  'ST.LOUISCARDINALS': 'STL',
};

const DEFAULT_TEAM: BaseballTeamTheme = {
  code: 'PRO',
  nameKo: '프로야구',
  shortKo: '야구',
  league: 'OTHER',
  accentLight: '#2563EB',
  accentDark: '#60A5FA',
};

export function resolveBaseballTeam(rawTeam?: string, fallbackLeague?: 'KBO' | 'MLB'): BaseballTeamTheme {
  if (!rawTeam) {
    return fallbackLeague === 'MLB'
      ? { ...DEFAULT_TEAM, code: 'MLB', nameKo: 'MLB', shortKo: 'MLB', league: 'MLB' }
      : DEFAULT_TEAM;
  }

  const normalized = rawTeam.replace(/\s+/g, '').toUpperCase();
  const key = TEAM_ALIASES[normalized] ?? TEAM_ALIASES[rawTeam.replace(/\s+/g, '')] ?? normalized;

  if (KBO_TEAMS[key]) return KBO_TEAMS[key];
  if (MLB_TEAMS[key]) return MLB_TEAMS[key];

  return {
    code: rawTeam.slice(0, 4).toUpperCase(),
    nameKo: rawTeam,
    shortKo: rawTeam,
    league: fallbackLeague ?? 'OTHER',
    accentLight: '#2563EB',
    accentDark: '#60A5FA',
  };
}
