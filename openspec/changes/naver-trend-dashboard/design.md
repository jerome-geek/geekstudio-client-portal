# Design — 네이버 카테고리 트렌드 대시보드

## Context

원본 명세(`naver-trend-dashboard-spec.md`)는 독립형 프로젝트를 가정했지만, 이 변경은 **기존 고객 포털에 통합**한다. 재사용: Next.js App Router, Tailwind, TailAdmin 스타일 사이드바 레이아웃(`app-shell.tsx`), Supabase(이미 인증·매핑 운영 중), react-query 데이터 계층, 배포 파이프라인.

핵심 도메인 문제: 데이터랩 `ratio`는 기간 내 최대=100인 상대값 → 검색광고 API 절대 검색량으로 보정해 시계열 일관성 확보.

## Goals / Non-Goals

**Goals:**

- 사이드바 "트렌드" 메뉴 + `/trends` 대시보드 (Spike Cards, 기간별 차트, 베스트셀러 그리드)
- 매일 자동 수집·보정·적재 파이프라인 (GitHub Actions)
- 급상승 30% Slack 알림

**Non-Goals:**

- 카테고리 관리 UI (초기 카테고리는 SQL seed로 수동 등록)
- 고객사별 트렌드 분리 (전사 공용 데이터 — 고객사 매핑과 무관)
- 다크모드, 상품 상세 분석, 키워드 단위 트렌드 (후속)
- 크롤링 데이터의 상업적 재배포

## Decisions

1. **포털 통합, 별도 앱 아님** — `(protected)` 라우트 그룹에 `/trends` 추가. 인증·레이아웃·배포 재사용. 원본 명세의 "독립형" 구조는 배제 (인프라 이중화 비용).
2. **차트: Tremor 대신 recharts 직접 사용** — Tremor v3는 내부적으로 recharts 래퍼이고 React 19 호환이 불안정. `recharts` 단독 채택이 의존성 얕고 커스텀 자유로움. Shadcn UI도 도입하지 않음 — 기존 TailAdmin 스타일 컴포넌트로 충분.
3. **수집기는 저장소 내 `scripts/collect.ts`** — tsx로 실행, GitHub Actions cron(`0 17 * * *` UTC = KST 02:00). Vercel Cron 대안은 실행 시간 제한(크롤링 포함 시 초과 위험)으로 배제.
4. **적재는 service role 키로 upsert** — `onConflict: date,category_id`(트렌드), `date,category_id,rank`(상품). 재실행 멱등. RLS: 3개 테이블 `authenticated` SELECT만 허용(GRANT 포함 — 기존 포털에서 배운 함정), 쓰기는 service role 전용.
5. **보정 기준 키워드는 카테고리 마스터에 저장** — `categories.rep_keyword` 컬럼 추가(원본 DDL 확장). 카테고리마다 대표 키워드가 다를 수 있고, 하드코딩 방지.
6. **크롤링 단계 격리** — collect.ts에서 트렌드 적재와 베스트 상품 크롤링을 try/catch로 분리. 크롤링 실패는 경고 로그 + (웹훅 설정 시) Slack 통지, 워크플로우는 성공 종료.
7. **급상승도 계산은 조회 시점 SQL** — 최근 3일 평균 vs 이전 7일 평균을 Postgres 쿼리(또는 뷰)로 계산. 별도 집계 테이블 없음 — 카테고리 수십 개 규모에선 실시간 계산으로 충분.
8. **조회 API는 기존 프록시 패턴 준수** — `/api/trends/spikes`, `/api/trends/[categoryId]/series?days=30`, `/api/trends/[categoryId]/products`. 서버에서 Supabase 조회, `resolveProjectId` 같은 고객사 로직은 불필요(전사 공용).
9. **insane-search 통합 방식은 PoC 선행** — 도구의 실제 인터페이스(CLI/라이브러리)와 네이버 쇼핑 베스트 페이지 응답 구조를 먼저 검증하고 파서를 확정한다. 차단 시 폴백: 크롤링 생략 운영.
10. **수집 대상 카테고리는 관리 화면에서 선택** — 데이터랩 내부 트리 엔드포인트(`https://datalab.naver.com/shoppingInsight/getCategory.naver?cid={cid}`, JSON, 검증 완료 2026-07-07)를 서버 프록시(`GET /api/trends/categories/tree?cid=`)로 노출하고, `/trends/settings` 화면에서 트리를 펼쳐 카테고리를 선택·해제한다. 선택 시 `categories`에 upsert(`active=true`) + 대표 키워드 입력, 해제 시 `active=false`(시계열 보존). 수집기는 `active=true`만 수집. SQL seed 수동 등록 방식은 배제 — 코드 수정 없이 대상 변경 가능. 트리 호출에는 브라우저 UA·Referer 헤더 필요.

## Risks / Trade-offs

- [네이버 WAF 강화로 크롤링 지속 차단] → 결정 6의 격리로 트렌드 기능은 무영향. 베스트셀러 그리드는 "최근 수집일" 데이터로 동작
- [검색광고 API 쿼터/장애] → 보정 불가 시 해당 일자 스킵(스펙 요구). 결측일은 차트에서 선형 보간 없이 공백 처리
- [데이터랩 ratio 기준점이 조회 기간에 따라 달라짐] → 매일 "전일 1일치"가 아니라 "최근 30일 윈도우"로 조회해 대표 키워드 평균과 같은 기준점 유지 (구현 시 주의)
- [크롤링의 법적/약관 리스크] → 내부 시장조사 용도 한정, 수집 주기 1일 1회 최소화
- [GitHub Actions 무료 쿼터] → 일 1회 수 분 실행 수준, 무시 가능

## Migration Plan

1. Supabase에 트렌드 스키마 적용 (`supabase/trend-schema.sql`)
2. 네이버 API 자격 증명 발급 (데이터랩 앱 등록, 검색광고 API 키) → GitHub Secrets 등록
3. collect.ts 로컬 실행으로 최초 데이터 적재 → 대시보드 확인
4. Actions cron 활성화
5. 롤백: 메뉴 제거 + 테이블 drop, 기존 포털 기능과 독립적이라 안전

## Open Questions

- 트렌드 메뉴 접근 범위: 로그인 사용자 전체 vs 내부(admin role)만 — 1차는 전체, 운영 전환 시 결정
- ~~초기 대상 카테고리 목록 확정~~ → 해결: 관리 화면(`/trends/settings`)에서 트리 탐색으로 직접 선택 (결정 10). 대표 키워드도 같은 화면에서 입력
- ~~검색광고 API 계정 보유 여부~~ → 해결: 개인(비사업자)도 무료 발급 가능. 절차는 `docs/naver-searchad-api-setup.md`
