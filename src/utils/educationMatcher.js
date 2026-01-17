// ========================================
// 원클릭 2차 교육자료 매칭 유틸리티
// v51 - 2025-12-18 (새로 작성)
// ========================================
//
// 목적: API 응답값을 교육자료 키로 변환
// 
// API에서 오는 값:
//   - aiSelectedArtist: "Claude Monet", "Vincent van Gogh", "반 고흐" 등
//   - selected_work: "The Starry Night", "Water Lilies" 등 (거장만)
//   - category: "movements" | "masters" | "oriental"
//
// 교육자료 키:
//   - 거장: "vangogh-starrynight", "klimt-kiss" 등
//   - 미술사조: "monet", "gogh", "botticelli" 등  
//   - 동양화: "korean-minhwa", "chinese-gongbi" 등
// ========================================

// ========== 거장 (Masters) 매칭 ==========
// selected_work → 교육자료 키
const MASTERS_WORK_MAP = {
  // 반 고흐 (3작품)
  'The Starry Night': 'vangogh-starrynight',
  '별이 빛나는 밤': 'vangogh-starrynight',
  'Starry Night': 'vangogh-starrynight',
  'Sunflowers': 'vangogh-sunflowers',
  '해바라기': 'vangogh-sunflowers',
  'Self-Portrait': 'vangogh-selfportrait',
  '자화상': 'vangogh-selfportrait',
  'Van Gogh Self-Portrait': 'vangogh-selfportrait',
  
  // 클림트 (3작품)
  'The Kiss': 'klimt-kiss',
  '키스': 'klimt-kiss',
  'Kiss': 'klimt-kiss',
  'The Tree of Life': 'klimt-treeoflife',
  '생명의 나무': 'klimt-treeoflife',
  'Tree of Life': 'klimt-treeoflife',
  'Judith I': 'klimt-judith',
  'Judith': 'klimt-judith',
  '유디트': 'klimt-judith',
  
  // 뭉크 (3작품)
  'The Scream': 'munch-scream',
  '절규': 'munch-scream',
  'Scream': 'munch-scream',
  'Madonna': 'munch-madonna',
  '마돈나': 'munch-madonna',
  'Munch Madonna': 'munch-madonna',
  'Jealousy': 'munch-jealousy',
  '질투': 'munch-jealousy',
  'The Jealousy': 'munch-jealousy',
  
  // 마티스 (4작품)
  'The Dance': 'matisse-dance',
  '춤': 'matisse-dance',
  'Dance': 'matisse-dance',
  'La Danse': 'matisse-dance',
  'The Red Room': 'matisse-redroom',
  '붉은 방': 'matisse-redroom',
  'Red Room': 'matisse-redroom',
  'Harmony in Red': 'matisse-redroom',
  'Woman with a Hat': 'matisse-womanhat',
  '모자를 쓴 여인': 'matisse-womanhat',
  'Femme au Chapeau': 'matisse-womanhat',
  'The Green Stripe': 'matisse-greenstripe',
  '녹색 줄무늬': 'matisse-greenstripe',
  'Green Stripe': 'matisse-greenstripe',
  'Portrait of Madame Matisse': 'matisse-greenstripe',
  
  // 피카소 (2작품)
  'Les Demoiselles d\'Avignon': 'picasso-demoiselles',
  '아비뇽의 처녀들': 'picasso-demoiselles',
  'Demoiselles': 'picasso-demoiselles',
  'Demoiselles d\'Avignon': 'picasso-demoiselles',
  'Guernica': 'picasso-guernica',
  '게르니카': 'picasso-guernica',
  
  // 샤갈 (2작품) - v70 추가
  'Lovers with Flowers': 'chagall-lovers',
  '꽃다발과 연인들': 'chagall-lovers',
  'Lovers': 'chagall-lovers',
  'La Branche': 'chagall-labranche',
  '나뭇가지': 'chagall-labranche',
  'The Branch': 'chagall-labranche',
  'La Mariée': 'chagall-lamariee',
  'La Mariee': 'chagall-lamariee',
  '신부': 'chagall-lamariee',
  'The Bride': 'chagall-lamariee',
  
  // 프리다 칼로 (5작품)
  'Me and My Parrots': 'frida-parrots',
  '나와 내 앵무새들': 'frida-parrots',
  'Self-Portrait with Parrots': 'frida-parrots',
  'The Broken Column': 'frida-brokencolumn',
  '부러진 기둥': 'frida-brokencolumn',
  'Broken Column': 'frida-brokencolumn',
  'Self-Portrait with Thorn Necklace': 'frida-thornnecklace',
  '가시 목걸이와 벌새': 'frida-thornnecklace',
  'Thorn Necklace': 'frida-thornnecklace',
  'Self-Portrait with Thorn Necklace and Hummingbird': 'frida-thornnecklace',
  'Self-Portrait with Monkeys': 'frida-monkeys',
  '원숭이와 자화상': 'frida-monkeys',
  'Monkeys': 'frida-monkeys',
  'Diego and I': 'frida-diegoandi',
  '디에고와 나': 'frida-diegoandi',
  
  // 리히텐슈타인 (5작품) - v70 추가
  'In the Car': 'lichtenstein-inthecar',
  '차 안에서': 'lichtenstein-inthecar',
  'In Car': 'lichtenstein-inthecar',
  'M-Maybe': 'lichtenstein-mmaybe',
  '아마도': 'lichtenstein-mmaybe',
  'Maybe': 'lichtenstein-mmaybe',
  'Forget It!': 'lichtenstein-forgetit',
  'Forget It': 'lichtenstein-forgetit',
  '날 잊어': 'lichtenstein-forgetit',
  'Ohhh...Alright...': 'lichtenstein-ohhhalright',
  'Ohhh Alright': 'lichtenstein-ohhhalright',
  '오 알았어': 'lichtenstein-ohhhalright',
  'Still Life with Crystal Bowl': 'lichtenstein-stilllife',
  'Still Life': 'lichtenstein-stilllife',
  '정물화': 'lichtenstein-stilllife'
};

// 화가 이름으로 화가 ID fallback (v62 - 화가별 키로 변경)
const MASTERS_ARTIST_FALLBACK = {
  'vangogh': 'vangogh',
  'gogh': 'vangogh',
  '고흐': 'vangogh',
  'van gogh': 'vangogh',
  'vincent': 'vangogh',
  '반 고흐': 'vangogh',
  
  'klimt': 'klimt',
  '클림트': 'klimt',
  'gustav': 'klimt',
  'gustav klimt': 'klimt',
  
  'munch': 'munch',
  '뭉크': 'munch',
  'edvard': 'munch',
  'edvard munch': 'munch',
  
  'matisse': 'matisse',
  '마티스': 'matisse',
  'henri': 'matisse',
  'henri matisse': 'matisse',
  
  'picasso': 'picasso',
  '피카소': 'picasso',
  'pablo': 'picasso',
  'pablo picasso': 'picasso',
  
  'chagall': 'chagall',
  '샤갈': 'chagall',
  'marc': 'chagall',
  'marc chagall': 'chagall',
  '마르크 샤갈': 'chagall',
  
  'frida': 'frida',
  '프리다': 'frida',
  'kahlo': 'frida',
  'frida kahlo': 'frida',
  '프리다 칼로': 'frida',
  
  'lichtenstein': 'lichtenstein',
  '리히텐슈타인': 'lichtenstein',
  'roy': 'lichtenstein',
  'roy lichtenstein': 'lichtenstein',
  '로이 리히텐슈타인': 'lichtenstein'
};


// ========== 미술사조 (Movements) 매칭 ==========
// aiSelectedArtist → 교육자료 키
const MOVEMENTS_ARTIST_MAP = {
  // 고대 그리스-로마
  'Classical Sculpture': 'ancient-greek-sculpture',
  'Greek Sculpture': 'ancient-greek-sculpture',
  'Polykleitos': 'ancient-greek-sculpture',
  'Phidias': 'ancient-greek-sculpture',
  'Myron': 'ancient-greek-sculpture',
  'Praxiteles': 'ancient-greek-sculpture',
  'Roman Mosaic': 'roman-mosaic',
  'Mosaic': 'roman-mosaic',
  
  // 중세
  'Byzantine': 'byzantine',
  'Byzantine Art': 'byzantine',
  'Gothic': 'gothic',
  'Gothic Art': 'gothic',
  'Limbourg Brothers': 'gothic',
  'Islamic': 'islamic-miniature',
  'Islamic Miniature': 'islamic-miniature',
  'Persian Miniature': 'islamic-miniature',
  
  // 르네상스
  'Leonardo': 'leonardo',
  'Leonardo da Vinci': 'leonardo',
  'Da Vinci': 'leonardo',
  'Michelangelo': 'michelangelo',
  'Michelangelo Buonarroti': 'michelangelo',
  'Raphael': 'raphael',
  'Raphael Sanzio': 'raphael',
  'Raffaello': 'raphael',
  'Botticelli': 'botticelli',
  'Sandro Botticelli': 'botticelli',
  'Titian': 'titian',
  'Tiziano': 'titian',
  
  // 바로크
  'Caravaggio': 'caravaggio',
  'Rembrandt': 'rembrandt',
  'Rembrandt van Rijn': 'rembrandt',
  'Vermeer': 'vermeer',
  'Johannes Vermeer': 'vermeer',
  'Jan Vermeer': 'vermeer',
  'Velazquez': 'velazquez',
  'Velázquez': 'velazquez',
  'Diego Velázquez': 'velazquez',
  'Rubens': 'rubens',
  'Peter Paul Rubens': 'rubens',
  
  // 로코코
  'Watteau': 'watteau',
  'Antoine Watteau': 'watteau',
  'Jean-Antoine Watteau': 'watteau',
  'Boucher': 'boucher',
  'François Boucher': 'boucher',
  'Fragonard': 'boucher',  // Fragonard도 로코코이므로 boucher로 매핑
  
  // 신고전주의/낭만주의/사실주의
  'Jacques-Louis David': 'jacques-louis-david',
  'David': 'jacques-louis-david',
  'Ingres': 'ingres',
  'Jean-Auguste-Dominique Ingres': 'ingres',
  'Turner': 'turner',
  'J.M.W. Turner': 'turner',
  'William Turner': 'turner',
  'Goya': 'goya',
  'Francisco Goya': 'goya',
  'Delacroix': 'delacroix',
  'Eugène Delacroix': 'delacroix',
  'Eugene Delacroix': 'delacroix',
  'Millet': 'millet',
  'Jean-François Millet': 'millet',
  'Courbet': 'millet',  // Courbet도 사실주의이므로 millet로 매핑
  
  // 인상주의
  'Monet': 'monet',
  'Claude Monet': 'monet',
  'Manet': 'manet',
  'Édouard Manet': 'manet',
  'Edouard Manet': 'manet',
  'Renoir': 'renoir',
  'Pierre-Auguste Renoir': 'renoir',
  'Auguste Renoir': 'renoir',
  'Degas': 'degas',
  'Edgar Degas': 'degas',
  'Caillebotte': 'caillebotte',
  'Gustave Caillebotte': 'caillebotte',
  
  // 후기인상주의
  'Van Gogh': 'vangogh',
  'Vincent van Gogh': 'vangogh',
  'Vincent Van Gogh': 'vangogh',
  'van gogh': 'vangogh',
  'VAN GOGH': 'vangogh',
  'Cezanne': 'cezanne',
  'Cézanne': 'cezanne',
  'Paul Cézanne': 'cezanne',
  'Paul Cezanne': 'cezanne',
  'Gauguin': 'gauguin',
  'Paul Gauguin': 'gauguin',
  
  // 야수파
  'Matisse': 'matisse',
  'Henri Matisse': 'matisse',
  'Derain': 'derain',
  'André Derain': 'derain',
  'Andre Derain': 'derain',
  'Vlaminck': 'vlaminck',
  'Maurice de Vlaminck': 'vlaminck',
  
  // 표현주의
  'Munch': 'munch',
  'Edvard Munch': 'munch',
  'Kokoschka': 'kokoschka',
  'Oskar Kokoschka': 'kokoschka',
  'Kirchner': 'kirchner',
  'Ernst Ludwig Kirchner': 'kirchner',
  'Kandinsky': 'kandinsky',
  'Wassily Kandinsky': 'kandinsky',
  
  // 모더니즘 (피카소, 초현실주의 등)
  'Picasso': 'picasso',
  'Pablo Picasso': 'picasso',
  'Magritte': 'magritte',
  'René Magritte': 'magritte',
  'Rene Magritte': 'magritte',
  'Miro': 'miro',
  'Miró': 'miro',
  'Joan Miró': 'miro',
  'Joan Miro': 'miro',
  'Chagall': 'chagall',
  'Marc Chagall': 'chagall',
  
  // 팝아트 (워홀 제거)
  'Lichtenstein': 'lichtenstein',
  'Roy Lichtenstein': 'lichtenstein',
  'Keith Haring': 'keith-haring',
  'Haring': 'keith-haring',
};


// ========== 동양화 (Oriental) 매칭 ==========
// aiSelectedArtist → 교육자료 키
const ORIENTAL_STYLE_MAP = {
  // 한국
  'Korean Minhwa': 'korean-minhwa',
  'Korean Minhwa Folk Painting': 'korean-minhwa',
  'Minhwa': 'korean-minhwa',
  '민화': 'korean-minhwa',
  'Korean Folk Painting': 'korean-minhwa',
  
  'Korean Pungsokdo': 'korean-genre',
  'Korean Pungsokdo Genre Painting': 'korean-genre',
  'Pungsokdo': 'korean-genre',
  '풍속도': 'korean-genre',
  'Korean Genre Painting': 'korean-genre',
  'Kim Hong-do': 'korean-genre',
  
  'Korean Jingyeong': 'korean-jingyeong',
  'Korean Jingyeong Landscape': 'korean-jingyeong',
  'Jingyeong': 'korean-jingyeong',
  '진경산수': 'korean-jingyeong',
  'Jeong Seon': 'korean-jingyeong',
  
  // 중국
  'Chinese Ink Wash': 'chinese-ink',
  'Chinese Ink': 'chinese-ink',
  'Ink Wash': 'chinese-ink',
  '수묵화': 'chinese-ink',
  'Shuimo': 'chinese-ink',
  
  'Chinese Gongbi': 'chinese-gongbi',
  'Gongbi': 'chinese-gongbi',
  '공필화': 'chinese-gongbi',
  'Chinese Fine Brush': 'chinese-gongbi',
  
  'Chinese Huaniao': 'chinese-gongbi',  // 화조화도 공필로 매핑
  'Huaniao': 'chinese-gongbi',
  
  // 일본
  'Japanese Ukiyo-e': 'japanese-ukiyoe',
  'Ukiyo-e': 'japanese-ukiyoe',
  'Ukiyoe': 'japanese-ukiyoe',
  '우키요에': 'japanese-ukiyoe',
  'Hokusai': 'japanese-ukiyoe',
  'Hiroshige': 'japanese-ukiyoe',
  
  // 일반 fallback
  'Korean': 'korean',
  'Chinese': 'chinese',
  'Japanese': 'japanese',
};


// ========== 메인 매칭 함수 ==========
/**
 * API 응답값을 교육자료 키로 변환
 * @param {string} category - 'masters' | 'movements' | 'oriental'
 * @param {string} artist - aiSelectedArtist 값 (예: "Claude Monet", "반 고흐")
 * @param {string} work - selected_work 값 (거장만, 예: "The Starry Night")
 * @returns {string|null} 교육자료 키
 */
export const getEducationKey = (category, artist, work) => {
  // console.log('');
  // console.log('🔑 getEducationKey called:');
  // console.log('   - category:', category);
  // console.log('   - artist:', artist);
  // console.log('   - work:', work);
  
  if (!category) {
    // console.log('❌ No category provided');
    return null;
  }
  
  let key = null;
  
  // ========== 거장 ==========
  if (category === 'masters') {
    // 1. 작품명으로 먼저 시도 (가장 정확)
    if (work) {
      // 직접 매칭
      key = MASTERS_WORK_MAP[work];
      if (key) {
        // console.log('✅ Masters matched by work (direct):', key);
        return key;
      }
      
      // 괄호 제거 후 시도: "The Starry Night (별이 빛나는 밤)" → "The Starry Night"
      const cleanWork = work.split('(')[0].trim();
      key = MASTERS_WORK_MAP[cleanWork];
      if (key) {
        // console.log('✅ Masters matched by work (cleaned):', key);
        return key;
      }
      
      // 괄호 안 한글로 시도
      const koreanMatch = work.match(/\(([^)]+)\)/);
      if (koreanMatch) {
        key = MASTERS_WORK_MAP[koreanMatch[1].trim()];
        if (key) {
          // console.log('✅ Masters matched by work (korean):', key);
          return key;
        }
      }
      
      // 부분 매칭 시도 (Starry Night → The Starry Night)
      const workLower = work.toLowerCase();
      for (const [mapWork, mapKey] of Object.entries(MASTERS_WORK_MAP)) {
        if (mapWork.toLowerCase().includes(workLower) || 
            workLower.includes(mapWork.toLowerCase())) {
          // console.log('✅ Masters matched by work (partial):', mapKey);
          return mapKey;
        }
      }
    }
    
    // 2. 작품명 매칭 실패 시 화가명으로 fallback
    if (artist) {
      const artistLower = artist.toLowerCase();
      
      // 직접 매칭
      key = MASTERS_ARTIST_FALLBACK[artistLower];
      if (key) {
        // console.log('✅ Masters fallback by artist (direct):', key);
        return key;
      }
      
      // 부분 매칭
      for (const [mapArtist, mapKey] of Object.entries(MASTERS_ARTIST_FALLBACK)) {
        if (artistLower.includes(mapArtist) || mapArtist.includes(artistLower)) {
          // console.log('✅ Masters fallback by artist (partial):', mapKey);
          return mapKey;
        }
      }
    }
    
    // console.log('❌ Masters: No match found');
    return null;
  }
  
  // ========== 미술사조 ==========
  if (category === 'movements') {
    if (!artist) {
      // console.log('❌ Movements: No artist provided');
      return null;
    }
    
    // 직접 매칭
    key = MOVEMENTS_ARTIST_MAP[artist];
    if (key) {
      // console.log('✅ Movements matched (direct):', key);
      return key;
    }
    
    // 대소문자 무시 매칭
    const artistLower = artist.toLowerCase();
    for (const [mapArtist, mapKey] of Object.entries(MOVEMENTS_ARTIST_MAP)) {
      if (mapArtist.toLowerCase() === artistLower) {
        // console.log('✅ Movements matched (case-insensitive):', mapKey);
        return mapKey;
      }
    }
    
    // 부분 매칭 (이름 일부만 포함)
    for (const [mapArtist, mapKey] of Object.entries(MOVEMENTS_ARTIST_MAP)) {
      const mapArtistLower = mapArtist.toLowerCase();
      if (artistLower.includes(mapArtistLower) || mapArtistLower.includes(artistLower)) {
        // console.log('✅ Movements matched (partial):', mapKey);
        return mapKey;
      }
    }
    
    // 성(last name)만으로 시도
    const lastName = artist.split(' ').pop();
    if (lastName) {
      key = MOVEMENTS_ARTIST_MAP[lastName];
      if (key) {
        // console.log('✅ Movements matched (last name):', key);
        return key;
      }
    }
    
    // console.log('❌ Movements: No match found for:', artist);
    return null;
  }
  
  // ========== 동양화 ==========
  if (category === 'oriental') {
    if (!artist) {
      // console.log('❌ Oriental: No artist provided');
      return null;
    }
    
    // 직접 매칭
    key = ORIENTAL_STYLE_MAP[artist];
    if (key) {
      // console.log('✅ Oriental matched (direct):', key);
      return key;
    }
    
    // 대소문자 무시 매칭
    const artistLower = artist.toLowerCase();
    for (const [mapArtist, mapKey] of Object.entries(ORIENTAL_STYLE_MAP)) {
      if (mapArtist.toLowerCase() === artistLower) {
        // console.log('✅ Oriental matched (case-insensitive):', mapKey);
        return mapKey;
      }
    }
    
    // 부분 매칭
    for (const [mapArtist, mapKey] of Object.entries(ORIENTAL_STYLE_MAP)) {
      const mapArtistLower = mapArtist.toLowerCase();
      if (artistLower.includes(mapArtistLower) || mapArtistLower.includes(artistLower)) {
        // console.log('✅ Oriental matched (partial):', mapKey);
        return mapKey;
      }
    }
    
    // console.log('❌ Oriental: No match found for:', artist);
    return null;
  }
  
  // console.log('❌ Unknown category:', category);
  return null;
};


// ========== 작품키 → 화가키 변환 (거장 원클릭용) ==========
// 거장 원클릭 교육자료는 화가별로 구성되어 있으므로
// "vangogh-starrynight" → "vangogh" 변환 필요
const WORK_TO_ARTIST_KEY = {
  'vangogh-starrynight': 'vangogh',
  'vangogh-sunflowers': 'vangogh',
  'vangogh-selfportrait': 'vangogh',
  'klimt-kiss': 'klimt',
  'klimt-treeoflife': 'klimt',
  'klimt-judith': 'klimt',
  'munch-scream': 'munch',
  'munch-madonna': 'munch',
  'munch-jealousy': 'munch',
  'matisse-dance': 'matisse',
  'matisse-redroom': 'matisse',
  'matisse-womanhat': 'matisse',
  'matisse-greenstripe': 'matisse',
  'chagall-lovers': 'chagall',
  'chagall-labranche': 'chagall',
  'chagall-lamariee': 'chagall',
  'picasso-demoiselles': 'picasso',
  'picasso-guernica': 'picasso',
  'frida-parrots': 'frida',
  'frida-brokencolumn': 'frida',
  'frida-thornnecklace': 'frida',
  'frida-monkeys': 'frida',
  'frida-diegoandi': 'frida',
  'lichtenstein-inthecar': 'lichtenstein',
  'lichtenstein-mmaybe': 'lichtenstein',
  'lichtenstein-forgetit': 'lichtenstein',
  'lichtenstein-ohhhalright': 'lichtenstein',
  'lichtenstein-stilllife': 'lichtenstein'
};

// ========== 교육자료 내용 가져오기 ==========
/**
 * 교육자료 키로 실제 내용 가져오기
 * @param {string} category - 'masters' | 'movements' | 'oriental'
 * @param {string} key - 교육자료 키 (예: "vangogh-starrynight", "monet")
 * @param {object} educationData - { masters, movements, oriental } 교육자료 객체
 * @returns {string|null} 교육자료 내용
 */
export const getEducationContent = (category, key, educationData) => {
  // console.log('');
  // console.log('📚 getEducationContent called:');
  // console.log('   - category:', category);
  // console.log('   - key:', key);
  
  if (!key || !educationData) {
    // console.log('❌ Missing key or educationData');
    return null;
  }
  
  let data = null;
  
  if (category === 'masters') {
    // 거장: 작품키 → 화가키 변환 (원클릭 교육자료는 화가별로 구성)
    let lookupKey = WORK_TO_ARTIST_KEY[key] || key;
    // console.log('   - masters lookupKey:', lookupKey);
    data = educationData.masters?.[lookupKey];
  } else if (category === 'movements') {
    data = educationData.movements?.[key];
  } else if (category === 'oriental') {
    data = educationData.oriental?.[key];
  }
  
  if (data?.content) {
    // console.log('✅ Education content found!');
    // console.log('   - preview:', data.content.substring(0, 50) + '...');
    return data.content;
  }
  
  // console.log('❌ No content found for key:', key);
  return null;
};


// ========== 테스트용 함수 ==========
export const testEducationMatcher = () => {
  // console.log('');
  // console.log('========================================');
  // console.log('🧪 Testing Education Matcher');
  // console.log('========================================');
  
  const testCases = [
    // 거장 테스트 (v62 - 화가별 키)
    { category: 'masters', artist: '반 고흐', work: null, expected: 'vangogh' },
    { category: 'masters', artist: 'Edvard Munch', work: null, expected: 'munch' },
    { category: 'masters', artist: '마티스', work: null, expected: 'matisse' },
    { category: 'masters', artist: 'Gustav Klimt', work: null, expected: 'klimt' },
    { category: 'masters', artist: '피카소', work: null, expected: 'picasso' },
    { category: 'masters', artist: 'Frida Kahlo', work: null, expected: 'frida' },
    
    // 미술사조 테스트
    { category: 'movements', artist: 'Claude Monet', work: null, expected: 'monet' },
    { category: 'movements', artist: 'Vincent van Gogh', work: null, expected: 'gogh' },
    { category: 'movements', artist: 'Edvard Munch', work: null, expected: 'munch' },
    { category: 'movements', artist: 'Henri Matisse', work: null, expected: 'matisse' },
    
    // 동양화 테스트
    { category: 'oriental', artist: 'Korean Minhwa', work: null, expected: 'korean-minhwa' },
    { category: 'oriental', artist: 'Chinese Gongbi', work: null, expected: 'chinese-gongbi' },
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const tc of testCases) {
    const result = getEducationKey(tc.category, tc.artist, tc.work);
    const success = result === tc.expected;
    
    if (success) {
      passed++;
      // console.log(`✅ PASS: ${tc.category}/${tc.artist} → ${result}`);
    } else {
      failed++;
      // console.log(`❌ FAIL: ${tc.category}/${tc.artist} → ${result} (expected: ${tc.expected})`);
    }
  }
  
  // console.log('');
  // console.log(`Result: ${passed}/${testCases.length} passed, ${failed} failed`);
  // console.log('========================================');
  
  return { passed, failed, total: testCases.length };
};
