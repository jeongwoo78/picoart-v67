// =====================================================
// masterData.js - 마스터 데이터 (Single Source of Truth)
// =====================================================
// 모든 사조, 거장, 동양화 정보를 한 곳에서 관리
// StyleSelection, ProcessingScreen, ResultScreen 등에서 import해서 사용
// =====================================================

// ========== 카테고리 아이콘 (원클릭용) ==========
export const CATEGORY_ICONS = {
  movements: '🎨',
  masters: '⭐',
  oriental: '🎎'
};

// ========== 사조 데이터 ==========
export const MOVEMENTS = {
  ancient: {
    id: 'ancient',
    ko: '그리스·로마',
    en: 'Greek & Roman',
    period: 'BC 800~AD 500',
    icon: '🏛️',
    description: '완벽한 비례와 균형미',
    subtitle: '고대 그리스 조각 · 로마 모자이크'
  },
  medieval: {
    id: 'medieval',
    ko: '중세 미술',
    en: 'Medieval Art',
    period: '5~15세기',
    icon: '⛪',
    description: '비잔틴·고딕·이슬람의 신성함',
    subtitle: '비잔틴 · 고딕 · 이슬람 세밀화'
  },
  renaissance: {
    id: 'renaissance',
    ko: '르네상스',
    en: 'Renaissance',
    period: '14~16세기',
    icon: '🎭',
    description: '인간 중심의 이상적 아름다움',
    subtitle: '다빈치 · 미켈란젤로 · 보티첼리'
  },
  baroque: {
    id: 'baroque',
    ko: '바로크',
    en: 'Baroque',
    period: '17~18세기',
    icon: '👑',
    description: '극적이고 웅장한 표현',
    subtitle: '카라바조 · 렘브란트 · 벨라스케스'
  },
  rococo: {
    id: 'rococo',
    ko: '로코코',
    en: 'Rococo',
    period: '18세기',
    icon: '🌸',
    description: '우아하고 장식적인 취향',
    subtitle: '와토 · 부셰'
  },
  neoclassicism_vs_romanticism_vs_realism: {
    id: 'neoclassicism_vs_romanticism_vs_realism',
    ko: '신고전 vs 낭만 vs 사실주의',
    en: 'Neoclassicism·Romanticism·Realism',
    period: '19세기',
    icon: '⚖️',
    description: '이성 vs 감성 vs 현실',
    subtitle: '다비드 · 들라크루아 · 쿠르베'
  },
  impressionism: {
    id: 'impressionism',
    ko: '인상주의',
    en: 'Impressionism',
    period: '19세기 후반',
    icon: '🌅',
    description: '빛의 순간을 포착',
    subtitle: '모네 · 르누아르 · 드가'
  },
  postImpressionism: {
    id: 'postImpressionism',
    ko: '후기인상주의',
    en: 'Post-Impressionism',
    period: '19세기 말',
    icon: '🌻',
    description: '감정과 구조의 탐구',
    subtitle: '반 고흐 · 고갱 · 세잔'
  },
  fauvism: {
    id: 'fauvism',
    ko: '야수파',
    en: 'Fauvism',
    period: '20세기 초',
    icon: '🎨',
    description: '순수 색채의 해방',
    subtitle: '마티스 · 드랭 · 블라맹크'
  },
  expressionism: {
    id: 'expressionism',
    ko: '표현주의',
    en: 'Expressionism',
    period: '20세기 초',
    icon: '😱',
    description: '내면의 불안과 고독',
    subtitle: '뭉크 · 키르히너 · 코코슈카'
  },
  modernism: {
    id: 'modernism',
    ko: '20세기 모더니즘',
    en: 'Modernism',
    period: '20세기',
    icon: '🔮',
    description: '입체·초현실·팝아트',
    subtitle: '피카소 · 마그리트 · 샤갈'
  }
};

// 20세기 모더니즘 세부 사조 (화가별 분류용)
export const MODERNISM_SUB = {
  cubism: { ko: '입체주의', en: 'Cubism', period: '20세기 초' },
  surrealism: { ko: '초현실주의', en: 'Surrealism', period: '20세기 초중반' },
  popArt: { ko: '팝아트', en: 'Pop Art', period: '20세기 중반' }
};

// 19세기 세부 사조 (화가별 분류용)
export const NINETEENTH_CENTURY_SUB = {
  neoclassicism: { ko: '신고전주의', en: 'Neoclassicism', period: '18~19세기' },
  romanticism: { ko: '낭만주의', en: 'Romanticism', period: '19세기' },
  realism: { ko: '사실주의', en: 'Realism', period: '19세기' }
};

// 아르누보 (클림트용)
export const ART_NOUVEAU = {
  ko: '아르누보',
  en: 'Art Nouveau',
  period: '19세기 말~20세기 초'
};

// ========== 거장 데이터 ==========
export const MASTERS = {
  'vangogh-master': {
    id: 'vangogh-master',
    ko: '빈센트 반 고흐',
    en: 'Vincent van Gogh',
    years: '1853~1890',
    movement: '후기인상주의',
    movementEn: 'Post-Impressionism',
    icon: '🌻',
    description: '1853-1890 | 후기인상주의'
  },
  'klimt-master': {
    id: 'klimt-master',
    ko: '구스타프 클림트',
    en: 'Gustav Klimt',
    years: '1862~1918',
    movement: '아르누보',
    movementEn: 'Art Nouveau',
    icon: '✨',
    description: '1862-1918 | 아르누보'
  },
  'munch-master': {
    id: 'munch-master',
    ko: '에드바르 뭉크',
    en: 'Edvard Munch',
    years: '1863~1944',
    movement: '표현주의',
    movementEn: 'Expressionism',
    icon: '😱',
    description: '1863-1944 | 표현주의'
  },
  'matisse-master': {
    id: 'matisse-master',
    ko: '앙리 마티스',
    en: 'Henri Matisse',
    years: '1869~1954',
    movement: '야수파',
    movementEn: 'Fauvism',
    icon: '🎭',
    description: '1869-1954 | 야수파'
  },
  'chagall-master': {
    id: 'chagall-master',
    ko: '마르크 샤갈',
    en: 'Marc Chagall',
    years: '1887~1985',
    movement: '초현실주의',
    movementEn: 'Surrealism',
    icon: '🎠',
    description: '1887-1985 | 초현실주의'
  },
  'frida-master': {
    id: 'frida-master',
    ko: '프리다 칼로',
    en: 'Frida Kahlo',
    years: '1907~1954',
    movement: '초현실주의',
    movementEn: 'Surrealism',
    icon: '🌺',
    description: '1907-1954 | 초현실주의'
  },
  'lichtenstein-master': {
    id: 'lichtenstein-master',
    ko: '로이 리히텐슈타인',
    en: 'Roy Lichtenstein',
    years: '1923~1997',
    movement: '팝아트',
    movementEn: 'Pop Art',
    icon: '💥',
    description: '1923-1997 | 팝아트'
  }
};

// ========== 동양화 데이터 ==========
export const ORIENTAL = {
  korean: {
    id: 'korean',
    ko: '한국 전통회화',
    en: 'Korean Traditional Painting',
    icon: '🎎',
    description: '여백의 미와 절제미',
    styles: [
      { id: 'minhwa', ko: '민화', en: 'Minhwa' },
      { id: 'pungsokdo', ko: '풍속도', en: 'Pungsokdo' },
      { id: 'jingyeong', ko: '진경산수화', en: 'Jingyeong' }
    ]
  },
  chinese: {
    id: 'chinese',
    ko: '중국 전통회화',
    en: 'Chinese Traditional Painting',
    icon: '🐉',
    description: '기운생동의 수묵화',
    styles: [
      { id: 'gongbi', ko: '공필화', en: 'Gongbi' },
      { id: 'ink-wash', ko: '수묵화', en: 'Ink Wash' }
    ]
  },
  japanese: {
    id: 'japanese',
    ko: '일본 전통회화',
    en: 'Japanese Traditional Painting',
    icon: '🗾',
    description: '섬세한 관찰과 대담한 생략',
    styles: [
      { id: 'ukiyo-e', ko: '우키요에', en: 'Ukiyo-e' }
    ]
  }
};

// ========== 사조별 화가 데이터 (AI 선택용) ==========
export const MOVEMENT_ARTISTS = {
  ancient: {
    'greek-sculpture': { ko: '고대 그리스 조각', en: 'Greek Sculpture' },
    'roman-mosaic': { ko: '로마 모자이크', en: 'Roman Mosaic' }
  },
  medieval: {
    'byzantine': { ko: '비잔틴', en: 'Byzantine' },
    'gothic': { ko: '고딕', en: 'Gothic' },
    'islamic-miniature': { ko: '이슬람 세밀화', en: 'Islamic Miniature' }
  },
  renaissance: {
    'leonardo': { ko: '레오나르도 다 빈치', en: 'Leonardo da Vinci', years: '1452~1519' },
    'michelangelo': { ko: '미켈란젤로 부오나로티', en: 'Michelangelo', years: '1475~1564' },
    'raphael': { ko: '라파엘로 산치오', en: 'Raphael', years: '1483~1520' },
    'botticelli': { ko: '산드로 보티첼리', en: 'Botticelli', years: '1445~1510' },
    'titian': { ko: '티치아노 베첼리오', en: 'Titian', years: '1488~1576' }
  },
  baroque: {
    'caravaggio': { ko: '미켈란젤로 메리시 다 카라바조', en: 'Caravaggio', years: '1571~1610' },
    'rembrandt': { ko: '렘브란트 판 레인', en: 'Rembrandt', years: '1606~1669' },
    'vermeer': { ko: '요하네스 페르메이르', en: 'Vermeer', years: '1632~1675' },
    'velazquez': { ko: '디에고 벨라스케스', en: 'Velázquez', years: '1599~1660' },
    'rubens': { ko: '피터 파울 루벤스', en: 'Rubens', years: '1577~1640' }
  },
  rococo: {
    'watteau': { ko: '장 앙투안 와토', en: 'Watteau', years: '1684~1721' },
    'boucher': { ko: '프랑수아 부셰', en: 'Boucher', years: '1703~1770' },
    'fragonard': { ko: '장 오노레 프라고나르', en: 'Fragonard', years: '1732~1806' }
  },
  neoclassicism: {
    'david': { ko: '자크 루이 다비드', en: 'Jacques-Louis David', years: '1748~1825' },
    'ingres': { ko: '장 오귀스트 도미니크 앵그르', en: 'Ingres', years: '1780~1867' }
  },
  romanticism: {
    'delacroix': { ko: '외젠 들라크루아', en: 'Delacroix', years: '1798~1863' },
    'turner': { ko: '조지프 말러드 윌리엄 터너', en: 'Turner', years: '1775~1851' },
    'goya': { ko: '프란시스코 고야', en: 'Goya', years: '1746~1828' }
  },
  realism: {
    'courbet': { ko: '귀스타브 쿠르베', en: 'Courbet', years: '1819~1877' },
    'millet': { ko: '장 프랑수아 밀레', en: 'Millet', years: '1814~1875' }
  },
  impressionism: {
    'monet': { ko: '클로드 모네', en: 'Claude Monet', years: '1840~1926' },
    'renoir': { ko: '피에르 오귀스트 르누아르', en: 'Renoir', years: '1841~1919' },
    'degas': { ko: '에드가 드가', en: 'Degas', years: '1834~1917' },
    'manet': { ko: '에두아르 마네', en: 'Manet', years: '1832~1883' },
    'morisot': { ko: '베르트 모리조', en: 'Morisot', years: '1841~1895' },
    'caillebotte': { ko: '귀스타브 카유보트', en: 'Caillebotte', years: '1848~1894' }
  },
  postImpressionism: {
    'vangogh': { ko: '빈센트 반 고흐', en: 'Vincent van Gogh', years: '1853~1890' },
    'gauguin': { ko: '폴 고갱', en: 'Paul Gauguin', years: '1848~1903' },
    'cezanne': { ko: '폴 세잔', en: 'Paul Cézanne', years: '1839~1906' }
  },
  fauvism: {
    'matisse': { ko: '앙리 마티스', en: 'Henri Matisse', years: '1869~1954' },
    'derain': { ko: '앙드레 드랭', en: 'André Derain', years: '1880~1954' },
    'vlaminck': { ko: '모리스 드 블라맹크', en: 'Maurice de Vlaminck', years: '1876~1958' }
  },
  expressionism: {
    'munch': { ko: '에드바르 뭉크', en: 'Edvard Munch', years: '1863~1944' },
    'kirchner': { ko: '에른스트 루트비히 키르히너', en: 'Ernst Ludwig Kirchner', years: '1880~1938' },
    'kokoschka': { ko: '오스카 코코슈카', en: 'Oskar Kokoschka', years: '1886~1980' }
  },
  modernism: {
    'picasso': { ko: '파블로 피카소', en: 'Pablo Picasso', years: '1881~1973', sub: 'cubism' },
    'lichtenstein': { ko: '로이 리히텐슈타인', en: 'Roy Lichtenstein', years: '1923~1997', sub: 'popArt' },
    'haring': { ko: '키스 해링', en: 'Keith Haring', years: '1958~1990', sub: 'popArt' },
    'miro': { ko: '호안 미로', en: 'Joan Miró', years: '1893~1983', sub: 'surrealism' },
    'magritte': { ko: '르네 마그리트', en: 'René Magritte', years: '1898~1967', sub: 'surrealism' },
    'chagall': { ko: '마르크 샤갈', en: 'Marc Chagall', years: '1887~1985', sub: 'surrealism' }
  }
};

// ========== 유틸리티 함수 ==========

/**
 * 사조 전체 이름 생성: 한글명(영문명, 시기)
 */
export const getMovementFullName = (movementId) => {
  const m = MOVEMENTS[movementId];
  if (!m) return movementId;
  return `${m.ko}(${m.en}, ${m.period})`;
};

/**
 * 거장 전체 이름 생성: 한글명(영문명, 생몰연도)
 */
export const getMasterFullName = (masterId) => {
  const m = MASTERS[masterId];
  if (!m) return masterId;
  return `${m.ko}(${m.en}, ${m.years})`;
};

/**
 * 동양화 전체 이름 생성: 한글명(영문명)
 */
export const getOrientalFullName = (orientalId) => {
  const o = ORIENTAL[orientalId];
  if (!o) return orientalId;
  return `${o.ko}(${o.en})`;
};

/**
 * ID로 사조 정보 찾기 (한글명으로도 검색 가능)
 */
export const findMovement = (nameOrId) => {
  // ID로 직접 찾기
  if (MOVEMENTS[nameOrId]) return MOVEMENTS[nameOrId];
  
  // 한글명으로 찾기
  const normalized = nameOrId?.toLowerCase().trim();
  for (const key in MOVEMENTS) {
    const m = MOVEMENTS[key];
    if (m.ko === nameOrId || m.ko.toLowerCase() === normalized) {
      return m;
    }
  }
  return null;
};

/**
 * ID로 거장 정보 찾기 (한글명으로도 검색 가능)
 */
export const findMaster = (nameOrId) => {
  // ID로 직접 찾기
  if (MASTERS[nameOrId]) return MASTERS[nameOrId];
  
  // 한글명으로 찾기
  for (const key in MASTERS) {
    const m = MASTERS[key];
    if (m.ko === nameOrId || m.en.toLowerCase() === nameOrId?.toLowerCase()) {
      return m;
    }
  }
  return null;
};

/**
 * StyleSelection용 배열 생성
 */
export const getStyleSelectionArray = () => {
  const styles = [];
  
  // 사조
  Object.values(MOVEMENTS).forEach(m => {
    styles.push({
      id: m.id,
      name: m.ko,
      category: 'movements',
      icon: m.icon,
      description: m.description
    });
  });
  
  // 거장
  Object.values(MASTERS).forEach(m => {
    styles.push({
      id: m.id,
      name: m.ko,
      nameEn: m.en,
      category: 'masters',
      icon: m.icon,
      description: m.description
    });
  });
  
  // 동양화
  Object.values(ORIENTAL).forEach(o => {
    styles.push({
      id: o.id,
      name: o.ko,
      nameEn: o.en,
      category: 'oriental',
      icon: o.icon,
      description: o.description
    });
  });
  
  return styles;
};

// ========== 기본 export ==========
export default {
  CATEGORY_ICONS,
  MOVEMENTS,
  MODERNISM_SUB,
  NINETEENTH_CENTURY_SUB,
  ART_NOUVEAU,
  MASTERS,
  ORIENTAL,
  MOVEMENT_ARTISTS,
  getMovementFullName,
  getMasterFullName,
  getOrientalFullName,
  findMovement,
  findMaster,
  getStyleSelectionArray
};
