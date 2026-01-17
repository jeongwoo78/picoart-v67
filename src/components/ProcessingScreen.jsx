// PicoArt v69 - ProcessingScreen (단일변환 반복 = 원클릭)
// 원칙: 단일 변환 로직만 있고, 원클릭은 그걸 N번 반복
// v67: 로딩 화면 개선 - 원본 고정 + TMI + 자세히 보기 바텀시트
// v68: 로딩 시 화가 성만 표시 (모바일 최적화)
// v69: masterData.js 통합 - 모든 사조/거장/동양화 데이터 일원화
// ----------------------------------------
import React, { useEffect, useState } from 'react';
import { processStyleTransfer } from '../utils/styleTransferAPI';
import { educationContent } from '../data/educationContent';
// 원클릭 교육자료 (분리된 파일)
import { oneclickMovementsPrimary, oneclickMovementsSecondary } from '../data/oneclickMovementsEducation';
import { oneclickMastersPrimary, oneclickMastersSecondary } from '../data/oneclickMastersEducation';
import { oneclickOrientalPrimary, oneclickOrientalSecondary } from '../data/oneclickOrientalEducation';
// v68: 기본정보 (로딩용 성 표시)
import { movementsBasicInfo } from '../data/movementsEducation';
import { mastersBasicInfo } from '../data/mastersEducation';
import { orientalBasicInfo } from '../data/orientalEducation';
// v51: 새로운 교육자료 매칭 유틸리티 (ResultScreen과 동일)
import { getEducationKey, getEducationContent } from '../utils/educationMatcher';
// v69: 마스터 데이터 (Single Source of Truth)
import { 
  MOVEMENTS, MASTERS, ORIENTAL, MOVEMENT_ARTISTS,
  MODERNISM_SUB, NINETEENTH_CENTURY_SUB, ART_NOUVEAU,
  CATEGORY_ICONS,
  getMovementFullName, getMasterFullName, getOrientalFullName,
  findArtistByName, findMasterByNameOrWork, findOrientalStyle
} from '../data/masterData';

const ProcessingScreen = ({ photo, selectedStyle, onComplete }) => {
  const [statusText, setStatusText] = useState('준비 중...');
  const [showEducation, setShowEducation] = useState(false);
  
  // 원클릭 상태
  const [completedResults, setCompletedResults] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [viewIndex, setViewIndex] = useState(-1);
  const [touchStartX, setTouchStartX] = useState(0);
  
  // 원클릭 여부
  const isFullTransform = selectedStyle?.isFullTransform === true;
  const category = selectedStyle?.category;
  
  // 원클릭 시 전달받은 스타일 배열 사용 (styleData import 불필요!)
  const styles = isFullTransform ? (selectedStyle?.styles || []) : [];
  const totalCount = styles.length;

  useEffect(() => {
    startProcess();
  }, []);

  // ========== 메인 프로세스 ==========
  const startProcess = async () => {
    if (isFullTransform) {
      // 원클릭: 1차 교육 표시 후 순차 변환 (단일 변환 반복!)
      setShowEducation(true);
      setStatusText(`${totalCount}개 스타일 변환을 시작합니다...`);
      await sleep(1500);
      
      const results = [];
      for (let i = 0; i < styles.length; i++) {
        const style = styles[i]; // 공통 데이터에서 가져온 스타일 (category 포함)
        setStatusText(`[${i}/${totalCount}] ${style.name} 변환 중...`);
        
        // 단일 변환과 동일하게 호출!
        const result = await processSingleStyle(style, i, totalCount);
        results.push(result);
        setCompletedCount(i + 1);
        setCompletedResults([...results]);
        
        // API 부하 방지: 각 변환 후 2초 딜레이 (마지막 제외)
        if (i < styles.length - 1) {
          await sleep(2000);
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      setStatusText(`완료! ${successCount}/${totalCount}개 변환 성공`);
      await sleep(1000);
      
      onComplete(selectedStyle, results, { isFullTransform: true, category, results });
    } else {
      // 단일 변환
      setShowEducation(true);
      const eduContent = getSingleEducationContent(selectedStyle);
      if (eduContent) {
        setStatusText(`${eduContent.title} 스타일 분석 중...`);
      }
      await sleep(1000);
      
      const result = await processSingleStyle(selectedStyle);
      
      if (result.success) {
        setStatusText(`${result.aiSelectedArtist || selectedStyle.name} 화풍으로 변환 완료!`);
        await sleep(1000);
        onComplete(selectedStyle, result.resultUrl, result);
      } else {
        // 실패 시에도 ResultScreen으로 이동하여 다시 시도 버튼 표시
        setStatusText(`오류: ${result.error}`);
        await sleep(1500);
        onComplete(selectedStyle, null, { ...result, success: false });
      }
    }
  };

  // ========== 단일 스타일 변환 (핵심 함수 - 원클릭도 이거 사용) ==========
  const processSingleStyle = async (style, index = 0, total = 1) => {
    try {
      const result = await processStyleTransfer(
        photo,
        style, // category 포함된 스타일 객체 그대로 전달
        null,
        (progressText) => {
          if (total > 1) {
            setStatusText(`[${index}/${total}] ${progressText}`);
          } else {
            setStatusText(progressText);
          }
        }
      );

      if (result.success) {
        return {
          style,
          resultUrl: result.resultUrl,
          aiSelectedArtist: result.aiSelectedArtist,
          selected_work: result.selected_work,  // 거장 모드: 선택된 작품
          success: true
        };
      } else {
        return { 
          style, 
          error: result.error, 
          aiSelectedArtist: result.aiSelectedArtist,  // 실패해도 보존
          selected_work: result.selected_work,
          success: false 
        };
      }
    } catch (err) {
      return { style, error: err.message, success: false };
    }
  };

  // ========== 교육자료 ==========
  
  // 단일 변환용 1차 교육 (로컬 함수 - import된 getEducationContent와 구분)
  const getSingleEducationContent = (style) => {
    const cat = style.category;
    if (cat === 'movements') return educationContent.movements[style.id];
    if (cat === 'masters') return educationContent.masters[style.id];
    if (cat === 'oriental') return educationContent.oriental[style.id];
    return null;
  };

  // 원클릭 1차 교육 (분리된 파일에서 가져오기)
  const getPrimaryEducation = () => {
    // console.log('🎓 getPrimaryEducation called, category:', category);
    
    if (category === 'movements') {
      // console.log('🎓 Using oneclickMovementsPrimary');
      // v68: 제목은 oneclickMovementsPrimary.title 그대로 사용
      return oneclickMovementsPrimary;
    } else if (category === 'masters') {
      // console.log('🎓 Using oneclickMastersPrimary');
      return oneclickMastersPrimary;
    } else if (category === 'oriental') {
      // console.log('🎓 Using oneclickOrientalPrimary');
      return oneclickOrientalPrimary;
    }
    return null;
  };

  // v68: 원클릭 1차 교육 (자세히 보기용) - Full/UI 통합
  const getPrimaryEducationFull = () => {
    if (category === 'movements') {
      return oneclickMovementsPrimary;
    } else if (category === 'masters') {
      return oneclickMastersPrimary;
    } else if (category === 'oriental') {
      return oneclickOrientalPrimary;
    }
    return null;
  };

  // ========== 포맷 함수들 (ResultScreen과 통일) ==========
  
  // ========== 화가명 포맷: 한글명(영문명) - v68: masterData 사용 ==========
  const formatArtistName = (artistName) => {
    if (!artistName) return '';
    
    // masterData에서 화가 정보 찾기
    const artist = findArtistByName(artistName);
    if (artist) {
      return `${artist.ko}(${artist.en})`;
    }
    
    // 거장 검색
    const master = findMasterByNameOrWork(artistName, null);
    if (master) {
      return `${master.master.ko}(${master.master.en})`;
    }
    
    // 동양화 스타일 검색
    const oriental = findOrientalStyle(artistName);
    if (oriental) {
      return `${oriental.style.ko}(${oriental.style.en})`;
    }
    
    // 매핑에 없으면 원본 반환
    return artistName;
  };

  // ========== 작품명 포맷: 한글명(영문명) - 거장용 - v68: masterData 사용 ==========
  const formatWorkName = (workName) => {
    if (!workName) return '';
    
    // masterData MASTERS에서 작품 검색
    for (const [masterId, master] of Object.entries(MASTERS)) {
      if (master.works) {
        for (const [workKey, workNames] of Object.entries(master.works)) {
          // workNames 배열에서 매칭
          if (workNames.some(w => w.toLowerCase() === workName.toLowerCase())) {
            // 첫 번째가 영문, 두 번째가 한글 (있으면)
            const enName = workNames[0];
            const koName = workNames[1] || enName;
            return `${koName}(${enName})`;
          }
        }
      }
    }
    
    return workName;
  };

  // 작품 제작연도 매핑
  const workYearMap = {
    // 반 고흐
    'The Starry Night': 1889,
    'Starry Night': 1889,
    'Sunflowers': 1888,
    'Self-Portrait': 1889,
    '별이 빛나는 밤': 1889,
    '해바라기': 1888,
    '자화상': 1889,
    // 클림트
    'The Kiss': 1908,
    'Judith I': 1901,
    'Judith': 1901,
    'The Tree of Life': 1909,
    'Tree of Life': 1909,
    '키스': 1908,
    '유디트': 1901,
    '생명의 나무': 1909,
    // 뭉크
    'The Scream': 1893,
    'Madonna': 1894,
    'Jealousy': 1895,
    '절규': 1893,
    '마돈나': 1894,
    '질투': 1895,
    // 마티스
    'The Dance': 1910,
    'The Red Room': 1908,
    'Harmony in Red': 1908,
    'Woman with a Hat': 1905,
    '춤': 1910,
    '붉은 방': 1908,
    '모자를 쓴 여인': 1905,
    // 피카소
    "Les Demoiselles d'Avignon": 1907,
    'Guernica': 1937,
    '아비뇽의 처녀들': 1907,
    '게르니카': 1937,
    // 프리다 칼로
    'The Broken Column': 1944,
    'Self-Portrait with Monkeys': 1943,
    'Me and My Parrots': 1941,
    'Self-Portrait with Parrots': 1941,
    'Self-Portrait with Thorn Necklace': 1940,
    'Self-Portrait with Thorn Necklace and Hummingbird': 1940,
    '부러진 기둥': 1944,
    '원숭이와 자화상': 1943,
    '나와 앵무새': 1941,
    '앵무새와 자화상': 1941,
    '가시 목걸이 자화상': 1940,
    '가시 목걸이와 벌새': 1940
  };

  // 작품 연도 가져오기
  const getWorkYear = (workName) => {
    if (!workName) return null;
    
    // 직접 매칭
    if (workYearMap[workName]) return workYearMap[workName];
    
    // 괄호 제거 후 매칭 시도
    const withoutParens = workName.split('(')[0].trim();
    if (workYearMap[withoutParens]) return workYearMap[withoutParens];
    
    // 괄호 안 내용으로 매칭 시도
    const match = workName.match(/\(([^)]+)\)/);
    if (match && workYearMap[match[1]]) return workYearMap[match[1]];
    
    return null;
  };

  // ========== 동양화 스타일 포맷 (v68: masterData 사용) ==========
  const formatOrientalStyle = (styleName) => {
    if (!styleName) return '';
    
    // masterData에서 동양화 스타일 찾기
    const result = findOrientalStyle(styleName);
    if (result) {
      return `${result.style.ko}(${result.style.en})`;
    }
    
    return styleName;
  };

  // ========== 거장 화가명 풀네임 + 화파 매핑 (v69: masterData 사용) ==========
  // 제목: 풀네임(영문, 생몰연도)
  // 부제: 사조(시기)
  const getMasterInfo = (artistName) => {
    if (!artistName) return { fullName: '거장', movement: '' };
    
    const normalized = artistName.toLowerCase().trim();
    
    // masterData MASTERS에서 검색
    for (const [key, master] of Object.entries(MASTERS)) {
      if (master.ko === artistName || 
          master.en.toLowerCase() === normalized ||
          key.replace('-master', '') === normalized ||
          master.ko.includes(artistName) ||
          normalized.includes(key.replace('-master', ''))) {
        return {
          fullName: `${master.ko}(${master.en}, ${master.years})`,
          movement: master.movement
        };
      }
    }
    
    return { fullName: artistName, movement: '' };
  };

  // ========== 미술사조 표시용 함수 (v69: masterData 사용) ==========
  // 제목: 사조(영문, 시기)
  // 부제: 화가명
  const getMovementDisplayInfo = (styleName, artistName) => {
    // masterData에서 사조 정보 찾기
    const findMovementInfo = (name) => {
      // MOVEMENTS에서 직접 검색
      for (const [key, mv] of Object.entries(MOVEMENTS)) {
        if (mv.ko === name || key === name) {
          return { en: mv.en, period: mv.period };
        }
      }
      // 세부 사조 검색
      if (MODERNISM_SUB[name]) {
        const sub = MODERNISM_SUB[name];
        return { en: sub.en, period: sub.period };
      }
      if (NINETEENTH_CENTURY_SUB[name]) {
        const sub = NINETEENTH_CENTURY_SUB[name];
        return { en: sub.en, period: sub.period };
      }
      // 한글명으로 세부 사조 검색
      for (const [key, sub] of Object.entries(MODERNISM_SUB)) {
        if (sub.ko === name) return { en: sub.en, period: sub.period };
      }
      for (const [key, sub] of Object.entries(NINETEENTH_CENTURY_SUB)) {
        if (sub.ko === name) return { en: sub.en, period: sub.period };
      }
      // 아르누보
      if (name === '아르누보' || name === 'artNouveau') {
        return { en: ART_NOUVEAU.en, period: ART_NOUVEAU.period };
      }
      return null;
    };
    
    // masterData에서 화가 정보 찾기
    const findArtistInfo = (name) => {
      if (!name) return null;
      const normalized = name.toLowerCase().trim();
      
      // MOVEMENT_ARTISTS에서 검색
      for (const [movement, artists] of Object.entries(MOVEMENT_ARTISTS)) {
        for (const [key, artist] of Object.entries(artists)) {
          if (key === normalized || 
              artist.ko === name || 
              artist.en?.toLowerCase() === normalized) {
            return { name: artist.ko, years: artist.years || '' };
          }
        }
      }
      return null;
    };
    
    // 제목 생성: 사조(영문, 시기)
    let actualMovement = styleName;
    
    // "신고전 vs 낭만 vs 사실주의"인 경우 화가에 따라 사조 결정
    if (styleName === '신고전 vs 낭만 vs 사실주의' && artistName) {
      const normalized = artistName.toLowerCase().trim();
      if (MOVEMENT_ARTISTS.neoclassicism?.[normalized]) {
        actualMovement = '신고전주의';
      } else if (MOVEMENT_ARTISTS.romanticism?.[normalized]) {
        actualMovement = '낭만주의';
      } else if (MOVEMENT_ARTISTS.realism?.[normalized]) {
        actualMovement = '사실주의';
      } else {
        // 부분 매칭
        for (const [key, artist] of Object.entries(MOVEMENT_ARTISTS.neoclassicism || {})) {
          if (normalized.includes(key) || key.includes(normalized)) {
            actualMovement = '신고전주의';
            break;
          }
        }
        for (const [key, artist] of Object.entries(MOVEMENT_ARTISTS.romanticism || {})) {
          if (normalized.includes(key) || key.includes(normalized)) {
            actualMovement = '낭만주의';
            break;
          }
        }
        for (const [key, artist] of Object.entries(MOVEMENT_ARTISTS.realism || {})) {
          if (normalized.includes(key) || key.includes(normalized)) {
            actualMovement = '사실주의';
            break;
          }
        }
      }
    }
    
    // "20세기 모더니즘"인 경우 화가에 따라 사조 결정
    if (styleName === '20세기 모더니즘' && artistName) {
      const normalized = artistName.toLowerCase().trim();
      const modernismArtist = MOVEMENT_ARTISTS.modernism?.[normalized];
      if (modernismArtist?.sub) {
        const subMovement = MODERNISM_SUB[modernismArtist.sub];
        if (subMovement) actualMovement = subMovement.ko;
      } else {
        // 부분 매칭
        for (const [key, artist] of Object.entries(MOVEMENT_ARTISTS.modernism || {})) {
          if ((normalized.includes(key) || key.includes(normalized)) && artist.sub) {
            const subMovement = MODERNISM_SUB[artist.sub];
            if (subMovement) actualMovement = subMovement.ko;
            break;
          }
        }
      }
    }
    
    const mvInfo = findMovementInfo(actualMovement) || { en: styleName, period: '' };
    const title = mvInfo.period ? `${actualMovement}(${mvInfo.en}, ${mvInfo.period})` : `${actualMovement}(${mvInfo.en})`;
    
    // 부제 생성: 화가명
    const artInfo = findArtistInfo(artistName);
    const subtitle = artInfo?.name || artistName || '';
    
    return { title, subtitle };
  };

  // ========== 동양화 표시용 함수 (v69: masterData 사용) ==========
  // 제목: 국가 전통회화(영문)
  // 부제: 스타일(영문)
  const getOrientalDisplayInfo = (artistName) => {
    if (!artistName) return { title: '동양화', subtitle: '' };
    
    const normalized = artistName.toLowerCase().trim();
    
    // ORIENTAL에서 검색
    for (const [countryKey, country] of Object.entries(ORIENTAL)) {
      // 국가명 매칭
      if (country.ko === artistName || countryKey === normalized) {
        return {
          title: `${country.ko}(${country.en})`,
          subtitle: ''
        };
      }
      
      // 스타일 매칭
      for (const style of country.styles || []) {
        if (style.ko === artistName || 
            style.id === normalized ||
            style.en.toLowerCase() === normalized ||
            normalized.includes(style.id) ||
            normalized.includes(style.ko)) {
          return {
            title: `${country.ko}(${country.en})`,
            subtitle: `${style.ko}(${style.en})`
          };
        }
      }
    }
    
    // 부분 매칭 (한국/중국/일본 키워드)
    if (normalized.includes('korean') || normalized.includes('한국') || normalized.includes('민화') || normalized.includes('풍속') || normalized.includes('진경')) {
      const korean = ORIENTAL.korean;
      for (const style of korean.styles) {
        if (normalized.includes(style.id) || normalized.includes(style.ko)) {
          return {
            title: `${korean.ko}(${korean.en})`,
            subtitle: `${style.ko}(${style.en})`
          };
        }
      }
      return { title: `${korean.ko}(${korean.en})`, subtitle: '' };
    }
    
    if (normalized.includes('chinese') || normalized.includes('중국') || normalized.includes('공필') || normalized.includes('수묵')) {
      const chinese = ORIENTAL.chinese;
      for (const style of chinese.styles) {
        if (normalized.includes(style.id) || normalized.includes(style.ko)) {
          return {
            title: `${chinese.ko}(${chinese.en})`,
            subtitle: `${style.ko}(${style.en})`
          };
        }
      }
      return { title: `${chinese.ko}(${chinese.en})`, subtitle: '' };
    }
    
    if (normalized.includes('japanese') || normalized.includes('일본') || normalized.includes('ukiyo') || normalized.includes('우키요에')) {
      const japanese = ORIENTAL.japanese;
      const ukiyoe = japanese.styles[0];
      return {
        title: `${japanese.ko}(${japanese.en})`,
        subtitle: `${ukiyoe.ko}(${ukiyoe.en})`
      };
    }
    
    return { title: '동양화', subtitle: artistName || '' };
  };

  // 카테고리별 부제 포맷 (v67: 새 표기 형식)
  // 거장: 대표작 (원클릭 변환 중 미리보기)
  // 미술사조: 화가명
  // 동양화: 스타일(영문)
  const getSubtitle = (result) => {
    const cat = result?.style?.category;
    const artist = result?.aiSelectedArtist;
    const styleName = result?.style?.name;
    
    if (cat === 'masters') {
      // v68: mastersBasicInfo에서 result.subtitle (대표작) 사용
      const artistToMasterId = {
        '반 고흐': 'vangogh', '빈센트 반 고흐': 'vangogh', 'Van Gogh': 'vangogh',
        '클림트': 'klimt', '구스타프 클림트': 'klimt', 'Klimt': 'klimt',
        '뭉크': 'munch', '에드바르 뭉크': 'munch', 'Munch': 'munch',
        '마티스': 'matisse', '앙리 마티스': 'matisse', 'Matisse': 'matisse',
        '샤갈': 'chagall', '마르크 샤갈': 'chagall', 'Chagall': 'chagall',
        '피카소': 'picasso', '파블로 피카소': 'picasso', 'Picasso': 'picasso',
        '프리다': 'frida', '프리다 칼로': 'frida', 'Frida': 'frida', 'Frida Kahlo': 'frida',
        '리히텐슈타인': 'lichtenstein', '로이 리히텐슈타인': 'lichtenstein', 'Lichtenstein': 'lichtenstein'
      };
      const masterId = artistToMasterId[artist] || '';
      if (masterId && mastersBasicInfo[masterId]?.result?.subtitle) {
        return mastersBasicInfo[masterId].result.subtitle;
      }
      // fallback
      const masterInfo = getMasterInfo(artist);
      return masterInfo.movement || '거장';
    } else if (cat === 'movements') {
      const movementInfo = getMovementDisplayInfo(styleName, artist);
      return movementInfo.subtitle;
    } else if (cat === 'oriental') {
      const orientalInfo = getOrientalDisplayInfo(artist);
      return orientalInfo.subtitle;
    } else {
      return formatArtistName(artist);
    }
  };

  // 제목 반환 (v67: 새 표기 형식)
  // 거장: 풀네임(영문, 생몰연도)
  // 미술사조: 사조(영문, 시기)
  // 동양화: 국가 전통회화
  const getTitle = (result) => {
    const cat = result?.style?.category;
    const artist = result?.aiSelectedArtist;
    const styleName = result?.style?.name;
    
    if (cat === 'masters' && artist) {
      const masterInfo = getMasterInfo(artist);
      return masterInfo.fullName;
    } else if (cat === 'movements') {
      const movementInfo = getMovementDisplayInfo(styleName, artist);
      return movementInfo.title;
    } else if (cat === 'oriental') {
      const orientalInfo = getOrientalDisplayInfo(artist);
      return orientalInfo.title;
    }
    return result?.style?.name || '';
  };

  // 하위 호환성: getMasterFullName → getTitle 으로 대체
  const getMasterFullName = (result) => getTitle(result);

  // 원클릭 2차 교육 (결과별) - v51: educationMatcher.js 사용
  const getSecondaryEducation = (result) => {
    if (!result) return null;
    
    const artistName = result.aiSelectedArtist || '';
    const workName = result.selected_work || '';
    const resultCategory = result.style?.category;
    
    // v51: educationMatcher.js 사용 (ResultScreen과 동일)
    const key = getEducationKey(resultCategory, artistName, workName);
    
    // v66: 간단한 매칭 로그
    console.log(`📚 교육자료 매칭: ${resultCategory} → ${key || '없음'} (${artistName}, ${workName || '-'})`);
    
    if (key) {
      // 교육자료 데이터 객체 구성
      const educationData = {
        masters: oneclickMastersSecondary,
        movements: oneclickMovementsSecondary,
        oriental: oneclickOrientalSecondary
      };
      
      // console.log('📦 educationData constructed:');
      // console.log('   - masters keys:', Object.keys(oneclickMastersSecondary || {}).slice(0, 5));
      // console.log('   - checking key:', key, 'in category:', resultCategory);
      
      // 직접 확인
      if (resultCategory === 'masters') {
        // console.log('   - direct check:', oneclickMastersSecondary?.[key] ? 'EXISTS' : 'NOT FOUND');
      }
      
      const content = getEducationContent(resultCategory, key, educationData);
      // console.log('   - getEducationContent returned:', content ? 'HAS CONTENT' : 'NULL');
      
      if (content) {
        // console.log('✅ Found education content for:', key);
        // 교육자료 파일에서 name 가져오기
        let eduName = artistName;
        if (resultCategory === 'masters' && oneclickMastersSecondary[key]) {
          eduName = oneclickMastersSecondary[key].name || artistName;
        } else if (resultCategory === 'movements' && oneclickMovementsSecondary[key]) {
          eduName = oneclickMovementsSecondary[key].name || artistName;
        } else if (resultCategory === 'oriental' && oneclickOrientalSecondary[key]) {
          eduName = oneclickOrientalSecondary[key].name || artistName;
        }
        return { name: eduName, content: content };
      }
    }
    
    // console.log('❌ No education found');
    return null;
  };

  // v51: artistNameToKey 함수는 더 이상 사용하지 않음
  // educationMatcher.js의 getEducationKey로 대체됨
  // (하위 호환성을 위해 주석으로 보존)
  /*
  const artistNameToKey = (artistName, workName, resultCategory, educationData) => {
    // ... 기존 코드 생략 ...
  };
  */

  // ========== UI 핸들러 ==========
  const handleDotClick = (idx) => {
    if (idx < completedCount) setViewIndex(idx);
  };
  
  const handleBackToEducation = () => setViewIndex(-1);

  const [touchStartY, setTouchStartY] = useState(0);

  const handleTouchStart = (e) => {
    if (!isFullTransform) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (!isFullTransform || !touchStartX) return;
    const diffX = touchStartX - e.changedTouches[0].clientX;
    const diffY = touchStartY - e.changedTouches[0].clientY;
    
    // 수평 스와이프만 인식 (X축 이동이 Y축보다 커야 함)
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0 && viewIndex < completedCount - 1) setViewIndex(v => v + 1);
      if (diffX < 0 && viewIndex > -1) setViewIndex(v => v - 1);
    }
    setTouchStartX(0);
    setTouchStartY(0);
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // 현재 보여줄 결과
  const previewResult = viewIndex >= 0 ? completedResults[viewIndex] : null;
  const previewEdu = previewResult ? getSecondaryEducation(previewResult) : null;

  return (
    <div className="processing-screen">
      <div 
        className="processing-content"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* 헤더 */}
        <div className="header">
          <h2>{isFullTransform ? '✨ 전체 변환' : '🎨 변환 중'}</h2>
        </div>

        {/* 상태 */}
        <div className="status">
          <div className="spinner"></div>
          <p>{statusText}</p>
        </div>

        {/* ===== 원클릭 모드 ===== */}
        {isFullTransform && (
          <>
            {/* 1차 교육 + 원본 사진 */}
            {viewIndex === -1 && showEducation && getPrimaryEducation() && (
              <div className="preview">
                <img src={URL.createObjectURL(photo)} alt="원본 사진" />
                <div className="preview-info title-only">
                  {/* v69: 카테고리 이모지 + 제목 (부제 없으면 가운데 정렬) */}
                  <div className="preview-style">
                    <span className="category-icon">{CATEGORY_ICONS[category] || '🎨'}</span>
                    {' '}{getPrimaryEducation().title || selectedStyle?.name || '전체 변환'}
                  </div>
                </div>
                <div className="edu-card primary">
                  <p>{getPrimaryEducation().content}</p>
                  {/* v68: 자세히 보기 버튼 제거 - 제목이 시적 첫 줄이 되어 전체 내용이 카드에 표시됨 */}
                  {completedCount > 0 && <p className="hint">👆 완료된 결과를 확인하세요</p>}
                </div>
              </div>
            )}

            {/* 결과 미리보기 */}
            {viewIndex >= 0 && previewResult && (
              <div className="preview">
                <img src={previewResult.resultUrl} alt="" />
                <div className="preview-info">
                  <div className="preview-style">
                    {getTitle(previewResult)}
                  </div>
                  <div className="preview-subtitle">{getSubtitle(previewResult)}</div>
                </div>
                {previewEdu && (
                  <div className="edu-card secondary">
                    <p>{previewEdu.content}</p>
                  </div>
                )}
              </div>
            )}

            {/* 점 네비게이션 + 이전/다음 버튼 */}
            <div className="dots-nav">
              <button 
                className="nav-btn"
                onClick={() => {
                  if (viewIndex === -1 && completedCount > 0) {
                    setViewIndex(completedCount - 1);
                  } else if (viewIndex > 0) {
                    setViewIndex(viewIndex - 1);
                  } else if (viewIndex === 0) {
                    setViewIndex(-1);
                  }
                }}
                disabled={viewIndex === -1 && completedCount === 0}
              >
                ◀ 이전
              </button>
              
              <div className="dots">
                <button className={`dot edu ${viewIndex === -1 ? 'active' : ''}`} onClick={handleBackToEducation}>📚</button>
                {styles.map((_, idx) => (
                  <button 
                    key={idx}
                    className={`dot ${idx < completedCount ? 'done' : ''} ${viewIndex === idx ? 'active' : ''}`}
                    onClick={() => handleDotClick(idx)}
                    disabled={idx >= completedCount}
                  />
                ))}
                <span className="count">[{viewIndex === -1 ? 0 : viewIndex + 1}/{totalCount}]</span>
              </div>
              
              <button 
                className="nav-btn"
                onClick={() => {
                  if (viewIndex === -1 && completedCount > 0) {
                    setViewIndex(0);
                  } else if (viewIndex >= 0 && viewIndex < completedCount - 1) {
                    setViewIndex(viewIndex + 1);
                  }
                }}
                disabled={viewIndex >= completedCount - 1 || completedCount === 0}
              >
                다음 ▶
              </button>
            </div>
          </>
        )}

        {/* ===== 단일 변환 모드 ===== */}
        {!isFullTransform && showEducation && (
          <div className="preview">
            <img src={URL.createObjectURL(photo)} alt="원본 사진" />
            <div className="preview-info">
              {/* v69: 스타일 아이콘 + 로딩용 제목+부제 */}
              <div className="preview-style">
                <span className="category-icon">{selectedStyle?.icon || '🎨'}</span>
                {' '}
                {(() => {
                  const cat = selectedStyle?.category;
                  const styleName = selectedStyle?.name;
                  const styleId = selectedStyle?.id;
                  
                  // 사조: movementsBasicInfo 사용
                  if (cat === 'movements' && styleId && movementsBasicInfo[styleId]) {
                    return movementsBasicInfo[styleId].loading.name;
                  }
                  // 거장: mastersBasicInfo 사용 (masterId 추출)
                  if (cat === 'masters' && styleId) {
                    const masterId = styleId.replace('-master', ''); // 'vangogh-master' → 'vangogh'
                    if (mastersBasicInfo[masterId]) {
                      return mastersBasicInfo[masterId].loading.name;
                    }
                  }
                  // 동양화: orientalBasicInfo 사용 (국가 ID 추출)
                  if (cat === 'oriental' && styleId) {
                    const countryId = styleId.split('-')[0]; // 'korean-minhwa' → 'korean'
                    if (orientalBasicInfo[countryId]) {
                      return orientalBasicInfo[countryId].loading.name;
                    }
                  }
                  return styleName || '스타일 변환';
                })()}
              </div>
              <div className="preview-subtitle">
                {(() => {
                  const cat = selectedStyle?.category;
                  const styleId = selectedStyle?.id;
                  
                  // 사조: 대표 화가 성 (카라바조 · 렘브란트 · 벨라스케스)
                  if (cat === 'movements' && styleId && movementsBasicInfo[styleId]) {
                    return movementsBasicInfo[styleId].loading.subtitle;
                  }
                  // 거장: 사조 · 국가 (후기인상주의 · 네덜란드)
                  if (cat === 'masters' && styleId) {
                    const masterId = styleId.replace('-master', '');
                    if (mastersBasicInfo[masterId]) {
                      return mastersBasicInfo[masterId].loading.subtitle;
                    }
                  }
                  // 동양화: 스타일 목록 (민화 · 풍속도 · 진경산수화)
                  if (cat === 'oriental' && styleId) {
                    const countryId = styleId.split('-')[0];
                    if (orientalBasicInfo[countryId]) {
                      return orientalBasicInfo[countryId].loading.subtitle;
                    }
                  }
                  return '';
                })()}
              </div>
            </div>
            {getSingleEducationContent(selectedStyle) && (
              <div className="edu-card primary">
                <p>{getSingleEducationContent(selectedStyle).desc}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .processing-screen {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .processing-content {
          background: white;
          padding: 24px;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .header h2 { margin: 0; font-size: 18px; color: #333; }
        .back-btn {
          padding: 6px 12px;
          background: #f0f0f0;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
        }
        .status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 16px 0;
        }
        .status p { margin: 0; color: #666; font-size: 14px; }
        .spinner {
          width: 20px; height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .edu-card {
          padding: 16px;
          border-radius: 10px;
          margin: 16px 0;
        }
        .edu-card.primary {
          background: linear-gradient(135deg, #fff5f5, #ffe5e5);
          border-left: 3px solid #667eea;
        }
        .edu-card.secondary {
          background: linear-gradient(135deg, #f0fff0, #e5ffe5);
          border-left: 3px solid #4CAF50;
        }
        .edu-card h3 { color: #667eea; margin: 0 0 10px; font-size: 15px; }
        .edu-card h4 { color: #4CAF50; margin: 0 0 8px; font-size: 14px; }
        .edu-card p { color: #333; line-height: 1.6; font-size: 13px; margin: 0; white-space: pre-line; }
        .hint { color: #999; font-size: 12px; text-align: center; margin-top: 12px !important; }
        
        /* v67: 자세히 보기 버튼 */
        .more-btn {
          display: block;
          width: 100%;
          margin-top: 12px;
          padding: 10px;
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 8px;
          color: #667eea;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .more-btn:hover {
          background: rgba(102, 126, 234, 0.2);
        }
        .more-btn:active {
          transform: scale(0.98);
        }
        
        .preview { background: #f8f9fa; border-radius: 12px; overflow: hidden; margin: 16px 0; }
        .preview img { width: 100%; display: block; }
        .preview-info { 
          padding: 16px; 
          text-align: left;
          border-bottom: 2px solid #e0e0e0;
        }
        .preview-info.title-only {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60px;
        }
        .preview-info.title-only .preview-style {
          margin-bottom: 0;
        }
        .preview-style { 
          font-size: 1.35rem; 
          font-weight: 600; 
          color: #333; 
          margin-bottom: 6px;
          line-height: 1.3;
        }
        .preview-subtitle { 
          font-size: 1.05rem; 
          font-weight: 600; 
          color: #222;
        }
        
        .dots-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 16px;
        }
        .dots-nav .nav-btn {
          padding: 8px 14px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
        }
        .dots-nav .nav-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          border: none;
          background: #ddd;
          cursor: pointer;
          padding: 0;
        }
        .dot.done { background: #4CAF50; }
        .dot.active { transform: scale(1.4); box-shadow: 0 0 0 2px rgba(102,126,234,0.4); }
        .dot:disabled { opacity: 0.4; cursor: default; }
        .dot.edu {
          width: auto; padding: 4px 8px;
          border-radius: 10px;
          font-size: 12px;
          background: #667eea;
        }
        .count { font-size: 12px; color: #999; margin-left: 8px; }
      `}</style>
    </div>
  );
};

export default ProcessingScreen;
