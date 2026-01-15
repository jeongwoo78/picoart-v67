// PicoArt v60 - 교육 콘텐츠 통합
// 4개 파일로 분리:
// 1. movementsEducation.js - 서양 미술 10개 사조 (1차+2차 통합)
// 2. mastersEducation.js - 서양 거장 7명 (1차 교육 - 개요)
// 3. mastersEducation2nd.js - 서양 거장 35개 작품 (2차 교육 - 개별 작품) [향후 사용]
// 4. orientalEducation.js - 동양화 7개 장르

import movements from './movementsEducation';
import masters from './mastersEducation';
import oriental from './orientalEducation';

const { movementsPrimary, movementsSecondary, movementsStory } = movements;
const { mastersPrimary, mastersSecondary, mastersStory } = masters;
const { orientalPrimary, orientalSecondary, orientalStory } = oriental;

// 기존 구조 유지 (하위 호환성)
export const educationContent = {
  // 사조
  movementsPrimary,
  movementsSecondary,
  movementsStory,
  // 거장
  mastersPrimary,
  mastersSecondary,
  mastersStory,
  // 동양화
  orientalPrimary,
  orientalSecondary,
  orientalStory
};

// 개별 export
export { 
  movementsPrimary, movementsSecondary, movementsStory,
  mastersPrimary, mastersSecondary, mastersStory,
  orientalPrimary, orientalSecondary, orientalStory
};
