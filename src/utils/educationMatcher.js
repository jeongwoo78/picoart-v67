// ========================================
// 원클릭 2차 교육자료 매칭 유틸리티
// v68 - 2026-01-17 (masterData 통합)
// ========================================
//
// masterData.js의 함수를 사용하여 교육자료 키 생성
// 모든 화가/작품 데이터는 masterData.js에서 관리
// ========================================

import { 
  getEducationKey as masterGetEducationKey,
  findMasterByNameOrWork 
} from '../data/masterData';

// ========== 교육자료 키 생성 (masterData 위임) ==========
/**
 * API 응답값을 교육자료 키로 변환
 * @param {string} category - 'masters' | 'movements' | 'oriental'
 * @param {string} artist - 화가/스타일명
 * @param {string} work - 작품명 (거장만)
 * @returns {string|null} 교육자료 키
 */
export const getEducationKey = (category, artist, work) => {
  return masterGetEducationKey(category, artist, work);
};


// ========== 작품키 → 화가키 변환 (거장 원클릭용) ==========
// 거장 원클릭 교육자료는 화가별로 구성되어 있으므로
// "vangogh-starrynight" → "vangogh" 변환 필요
const extractArtistKey = (workKey) => {
  if (!workKey) return null;
  // vangogh-starrynight → vangogh
  const parts = workKey.split('-');
  if (parts.length >= 2) {
    return parts[0];
  }
  return workKey;
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
  if (!key || !educationData) {
    return null;
  }
  
  let data = null;
  
  if (category === 'masters') {
    // 거장: 작품키 → 화가키 변환 (원클릭 교육자료는 화가별로 구성)
    const lookupKey = extractArtistKey(key) || key;
    data = educationData.masters?.[lookupKey];
  } else if (category === 'movements') {
    data = educationData.movements?.[key];
  } else if (category === 'oriental') {
    data = educationData.oriental?.[key];
  }
  
  if (data?.content) {
    return data.content;
  }
  
  return null;
};


// ========== 테스트용 함수 ==========
export const testEducationMatcher = () => {
  const testCases = [
    // 거장 테스트
    { category: 'masters', artist: '반 고흐', work: null, expected: 'vangogh' },
    { category: 'masters', artist: 'Edvard Munch', work: null, expected: 'munch' },
    { category: 'masters', artist: '마티스', work: null, expected: 'matisse' },
    { category: 'masters', artist: 'Gustav Klimt', work: null, expected: 'klimt' },
    { category: 'masters', artist: '피카소', work: null, expected: 'picasso' },
    { category: 'masters', artist: 'Frida Kahlo', work: null, expected: 'frida' },
    { category: 'masters', artist: 'Van Gogh', work: 'The Starry Night', expected: 'vangogh-starrynight' },
    
    // 미술사조 테스트
    { category: 'movements', artist: 'Claude Monet', work: null, expected: 'monet' },
    { category: 'movements', artist: 'Vincent van Gogh', work: null, expected: 'vangogh' },
    { category: 'movements', artist: 'Edvard Munch', work: null, expected: 'munch' },
    { category: 'movements', artist: 'Henri Matisse', work: null, expected: 'matisse' },
    { category: 'movements', artist: 'Leonardo da Vinci', work: null, expected: 'leonardo' },
    
    // 동양화 테스트
    { category: 'oriental', artist: 'Korean Minhwa', work: null, expected: 'korean-minhwa' },
    { category: 'oriental', artist: 'Chinese Gongbi', work: null, expected: 'chinese-gongbi' },
    { category: 'oriental', artist: '민화', work: null, expected: 'korean-minhwa' },
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const tc of testCases) {
    const result = getEducationKey(tc.category, tc.artist, tc.work);
    const success = result === tc.expected;
    
    if (success) {
      passed++;
      console.log(`✅ PASS: ${tc.category}/${tc.artist} → ${result}`);
    } else {
      failed++;
      console.log(`❌ FAIL: ${tc.category}/${tc.artist} → ${result} (expected: ${tc.expected})`);
    }
  }
  
  console.log(`\nResult: ${passed}/${testCases.length} passed, ${failed} failed`);
  
  return { passed, failed, total: testCases.length };
};
