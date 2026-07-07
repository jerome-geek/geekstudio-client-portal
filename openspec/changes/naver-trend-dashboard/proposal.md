# 네이버 카테고리 트렌드 대시보드

## Why

네이버 데이터랩 쇼핑인사이트의 클릭 지표(`ratio`)는 조회 기간 내 최대값을 100으로 잡는 상대값이라, 매일 저장하면 기준점이 흔들려 시계열로 쓸 수 없다. 검색광고 API의 절대 검색량으로 보정(Calibration)한 점수를 매일 적재하고, 급상승 카테고리를 시각화하는 대시보드가 필요하다 (`naver-trend-dashboard-spec.md`). 별도 프로젝트가 아니라 기존 고객 포털의 사이드바 메뉴로 통합해 인프라(Next.js, Supabase, 배포)를 재사용한다.

## What Changes

- 좌측 사이드바에 **"트렌드"** 메뉴 추가 → `/trends` 대시보드 페이지
- Supabase에 시계열 테이블 3개 추가: `categories`, `category_trends`, `category_best_products`
- 일일 수집 파이프라인(GitHub Actions, KST 새벽 2시): 검색광고 API 절대 검색량 → 데이터랩 상대 비율 → 보정 점수 계산 → 적재, `insane-search`로 쇼핑 베스트 1~20위 크롤링
- 대시보드 화면: 급상승 카테고리 Spike Cards, 기간별(7/30/90일) 트렌드 차트, 카테고리 클릭 시 베스트셀러 그리드
- 급상승도 30% 돌파 시 Slack 웹훅 알림 (수집기 내 판정)

## Capabilities

### New Capabilities

- `trend-data-pipeline`: 네이버 API 수집·보정 알고리즘·DB 적재 스크립트와 GitHub Actions 스케줄, 시계열 스키마
- `trend-dashboard`: 사이드바 메뉴, `/trends` 화면(Spike Cards·트렌드 차트·베스트셀러 그리드), 조회 API
- `trend-alerts`: 급상승 임계(30%) 판정과 Slack 웹훅 발송

### Modified Capabilities

(없음 — 기존 스펙 요구사항 변경 없음. 사이드바 메뉴 추가는 레이아웃 구현 세부사항)

## Impact

- **코드**: `src/app/(protected)/trends/**`(신규), `src/components/trends/**`(신규), `src/components/layout/app-shell.tsx`(메뉴 1줄), `scripts/collect.ts`(신규), `.github/workflows/collect-trends.yml`(신규)
- **DB**: Supabase에 트렌드 테이블 3개 + 인덱스 + RLS (기존 고객사 매핑 테이블과 무관, 간섭 없음)
- **외부 의존성**: 네이버 데이터랩 API, 네이버 검색광고 API, `insane-search`(크롤링), Slack Incoming Webhook, 차트 라이브러리
- **환경 변수/시크릿**: `NAVER_DATALAB_CLIENT_ID/SECRET`, `NAVER_AD_API_*` 3종, `SLACK_WEBHOOK_URL` — GitHub Actions Secrets + 로컬 `.env.local`
- **리스크**: 크롤링은 네이버 WAF 정책 변경에 취약(파이프라인은 크롤링 실패해도 트렌드 적재는 계속되도록 격리), 검색광고 API 일일 쿼터
