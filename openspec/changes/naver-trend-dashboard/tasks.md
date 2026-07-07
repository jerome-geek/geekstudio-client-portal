# Tasks — 네이버 카테고리 트렌드 대시보드

구현 순서: PoC(API·크롤링 검증) → 스키마 → 수집기 → 대시보드 → 알림 → 자동화.

## 1. PoC 및 자격 증명

- [ ] 1.1 네이버 데이터랩 API 앱 등록, 쇼핑인사이트 카테고리 API 1회 실호출로 응답 구조 확인
- [ ] 1.2 네이버 검색광고 API 키 발급(광고주 계정), 키워드 도구로 대표 키워드 30일 절대 검색량 1회 조회
- [ ] 1.3 `insane-search` 인터페이스 검증: 네이버 쇼핑 베스트 페이지 1개 카테고리 크롤링 성공 여부 + 파싱 필드(상품명/가격/스토어/썸네일/링크) 확인 — 실패 시 크롤링 생략 운영으로 결정
- [x] 1.4 카테고리 트리 확보 방식 검증: 데이터랩 `getCategory.naver?cid=` JSON 엔드포인트 확인 (2026-07-07) — 관리 화면에서 선택하는 방식으로 확정, seed 수동 등록 배제
- [ ] 1.5 `.env` 정리: `NAVER_DATALAB_CLIENT_ID/SECRET`, `NAVER_AD_API_KEY/SECRET/CUSTOMER_ID`, `SLACK_WEBHOOK_URL`

## 2. 스키마 (trend-data-pipeline)

- [ ] 2.1 `supabase/trend-schema.sql`: categories(+`rep_keyword`), category_trends, category_best_products + 복합 인덱스 + UNIQUE 제약
- [ ] 2.2 RLS: 3개 테이블 authenticated SELECT 정책 + GRANT (쓰기는 service role 전용), Supabase 적용
- [ ] 2.3 `categories`에 `active`(boolean, default true)·`rep_keyword` 컬럼 포함 — 수집기는 active=true만 대상

## 3. 수집기 (trend-data-pipeline)

- [ ] 3.1 `scripts/collect/naver-ad-api.ts`: 검색광고 API 서명 인증 + 대표 키워드 30일 절대 검색량 조회
- [ ] 3.2 `scripts/collect/datalab.ts`: 데이터랩 쇼핑인사이트 카테고리별 30일 윈도우 ratio 조회 (기준점 일관성 주의 — design 리스크 참조)
- [ ] 3.3 `scripts/collect/calibrate.ts`: 보정 공식 구현 + 단위 테스트 (결측 시 스킵 포함)
- [ ] 3.4 `scripts/collect/best-products.ts`: insane-search 크롤링 + 파서 (트렌드 적재와 try/catch 격리)
- [ ] 3.5 `scripts/collect.ts` 엔트리: 수집 → 보정 → service role upsert(멱등) → 크롤링 적재, 로컬 1회 실행으로 실데이터 적재 확인

## 4. 카테고리 관리 (trend-dashboard)

- [ ] 4.1 `GET /api/trends/categories/tree?cid=`: 데이터랩 트리 프록시 (UA·Referer 헤더, 응답 정규화)
- [ ] 4.2 `GET/POST/PATCH /api/trends/categories`: 활성 카테고리 목록·등록(대표 키워드 포함)·해제(active=false)
- [ ] 4.3 `/trends/settings` 화면: 트리 지연 로딩 탐색 + 체크 선택 + 대표 키워드 입력 + 활성 목록 관리

## 5. 조회 API (trend-dashboard)

- [ ] 5.1 `GET /api/trends/spikes`: 급상승도(최근 3일 vs 이전 7일) 계산 쿼리 + 데이터 10일 미만 카테고리 제외/표시 처리
- [ ] 5.2 `GET /api/trends/[categoryId]/series?days=7|30|90`: 시계열 조회
- [ ] 5.3 `GET /api/trends/[categoryId]/products`: 최신 수집일 TOP 10 (당일 없으면 최근 수집일 + 날짜 명시)
- [ ] 5.4 인증 가드 적용 (Supabase 설정 시 401) + 오류 정규화 공통 핸들러 재사용

## 6. 대시보드 UI (trend-dashboard)

- [ ] 6.1 `recharts` 설치, 사이드바에 "트렌드" 메뉴 추가 (`app-shell.tsx`)
- [ ] 6.2 `/trends` 페이지 레이아웃: Spike Cards(급상승률 내림차순) + 차트 + 베스트셀러 그리드 3단 구성
- [ ] 6.3 트렌드 영역 차트: 7/30/90일 기간 전환, 카테고리 선택 연동, 결측일 공백 처리
- [ ] 6.4 베스트셀러 그리드: 썸네일/상품명/가격/스토어, 새 탭 링크, 수집일 표시
- [ ] 6.5 로딩·빈 데이터·오류 상태 처리 (기존 포털 스타일 준수)

## 7. Slack 알림 (trend-alerts)

- [ ] 7.1 `scripts/collect/alert.ts`: 급상승 30% 초과 카테고리 판정 + Slack 메시지 발송 (카테고리명·급상승률·점수·대시보드 링크)
- [ ] 7.2 발송 실패 격리 + 웹훅 미설정 시 스킵, 단위 테스트

## 8. 자동화 및 검증

- [ ] 8.1 `.github/workflows/collect-trends.yml`: cron `0 17 * * *`(KST 02:00), Secrets 연결, 수동 트리거(workflow_dispatch) 포함
- [ ] 8.2 워크플로우 수동 실행 1회 성공 확인 (Actions 로그 + DB 적재 검증)
- [ ] 8.3 E2E: 설정에서 카테고리 등록 → 수집 실행 → 대시보드 진입 → Spike Cards → 카테고리 선택 → 차트 기간 전환 → 상품 그리드 → 상품 새 탭
- [ ] 8.4 `pnpm lint && pnpm test && pnpm build` 통과
