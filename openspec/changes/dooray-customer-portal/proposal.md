# Dooray 고객사 업무요청 포털

## Why

Dooray 손님 계정 정책 변경으로 고객사가 Dooray에 직접 접속할 수 없게 되었다. 고객사가 Dooray 계정 없이 업무 요청·진행 상태 확인·댓글·첨부파일 등록을 할 수 있는 별도 고객 포털이 필요하다. 기존 코드베이스에 부분 구현이 있으나, 설계 문서(`docs/superpowers/specs/2026-05-30-dooray-customer-portal-design.md`) 기준으로 요구사항을 정식 스펙화하고 미완성 기능을 완성한다.

## What Changes

- 고객사 사용자 로그인 (Supabase Auth) 및 미매핑 계정 접근 차단
- 고객사별 Dooray 프로젝트 매핑 (Supabase Postgres, 수동 관리, RLS 적용)
- 서버 측 Dooray API 프록시: API 토큰은 서버에만 보관, 프론트가 보낸 프로젝트 ID를 신뢰하지 않고 로그인 사용자 기준으로 재계산
- 칸반 보드 화면: Dooray 워크플로우(상태) 컬럼 기반 업무 목록, 카드 드래그로 상태 변경
- 업무 기능 전체: 등록, 상세 조회, 상태 변경, 댓글 등록/조회, 첨부파일 등록/조회/다운로드
- 업무/댓글/첨부는 자체 DB에 저장하지 않음 — Dooray가 유일한 원본

## Capabilities

### New Capabilities

- `customer-auth`: Supabase Auth 기반 고객 로그인, 세션 관리, 고객사 미매핑 계정 차단
- `company-project-mapping`: 고객사·멤버·Dooray 프로젝트 매핑 스키마와 RLS, 서버 측 프로젝트 결정 로직
- `dooray-proxy`: 인증 확인 후 Dooray API를 대행 호출하는 서버 API 계층 (권한 강제 포함)
- `kanban-board`: 상태 컬럼 기반 업무 보드 조회와 드래그 앤 드롭 상태 변경 UI
- `task-management`: 업무 등록, 상세 조회, 상태 변경
- `task-collaboration`: 댓글 등록/조회, 첨부파일 업로드/조회/다운로드

### Modified Capabilities

(없음 — `openspec/specs/`가 비어 있어 전부 신규)

## Impact

- **코드**: `src/app/(protected)/**`, `src/app/api/**`, `src/components/**`, `src/entities/**`, `src/hooks/**`, `src/shared/lib/**` — 기존 부분 구현을 스펙에 맞춰 보완/완성
- **DB**: `supabase/schema.sql`의 `companies`, `company_members`, `company_dooray_projects` 3개 테이블 + RLS 정책 (업무 데이터 테이블 없음)
- **외부 의존성**: Dooray REST API (`https://api.dooray.com`, `Authorization: dooray-api {token}`), Supabase Auth/Postgres
- **환경 변수**: `DOORAY_BASE_URL`, `DOORAY_API_TOKEN`, Supabase URL/키 — 서버 전용 보관
- **제약**: Dooray API 응답 속도·rate limit이 UX에 직접 영향, Dooray 워크플로우 변경 시 보드 컬럼도 변동
