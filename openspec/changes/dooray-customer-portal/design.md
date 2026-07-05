# Design — Dooray 고객사 업무요청 포털

## Context

Dooray 손님 계정 정책 변경으로 고객사 직접 접속이 불가하다. 설계 문서(`docs/superpowers/specs/2026-05-30-dooray-customer-portal-design.md`)에 따라 Dooray를 유일한 원본으로 두고, 포털은 얇은 프록시 UI로 만든다.

현재 코드베이스에는 부분 구현이 이미 존재한다:

- `src/shared/lib/dooray.ts` — Dooray HTTP 클라이언트 (`Authorization: dooray-api {token}`)
- `src/app/api/tasks/**` — 업무/댓글/상태/첨부 프록시 라우트 골격
- `src/components/board/**`, `src/components/tasks/**` — 칸반 보드·업무 UI 골격
- `src/entities/**`, `src/hooks/**` — react-query 기반 데이터 계층
- `supabase/schema.sql` — `companies`, `company_members`, `company_dooray_projects` (RLS 미적용 상태)
- `src/middleware.ts`, `src/app/login`, `src/app/unauthorized` — 인증 흐름 골격

이 변경은 재작성이 아니라 기존 구조를 스펙 기준으로 검증·보완·완성하는 방향으로 진행한다.

## Goals / Non-Goals

**Goals:**

- 고객사 로그인 + 고객사별 프로젝트 격리 (서버 강제)
- 칸반 보드 전체 기능: 워크플로우 컬럼, 카드, 드래그 앤 드롭 상태 변경
- 업무 등록/상세/상태 변경/댓글/첨부 전체 동작
- Dooray API 토큰 서버 전용 보관
- Supabase RLS 적용

**Non-Goals:**

- 업무/댓글/첨부 자체 DB 저장, 캐시 계층, 검색 인덱스
- 고객사-프로젝트 매핑 관리 UI (SQL 수동 관리)
- 운영팀용 관리자 화면, 통계, 알림, 감사 로그
- 고객사 간 프로젝트 공유, 고객사당 다중 활성 프로젝트

## Dooray API 매핑

Base URL `https://api.dooray.com`, 헤더 `Authorization: dooray-api {DOORAY_API_TOKEN}`. 응답은 `{ header: { isSuccessful, resultCode, resultMessage }, result }` 구조. 목록은 `page`/`size`(최대 100) 페이지네이션과 `totalCount`를 사용한다.

| 포털 기능 | Dooray API |
|---|---|
| 워크플로우(상태) 목록 | `GET /project/v1/projects/{project-id}/workflows` |
| 업무 목록 | `GET /project/v1/projects/{project-id}/posts` (`page`, `size`(최대 100), `postWorkflowClasses`, `postWorkflowIds`, `order` 등) |
| 업무 상세 | `GET /project/v1/projects/{project-id}/posts/{post-id}` |
| 업무 생성 | `POST /project/v1/projects/{project-id}/posts` (`subject`, `body.mimeType/content`, `priority`, `users.to`, `dueDate`, `tagIds`, `milestoneId`) |
| 업무 수정 | `PUT /project/v1/projects/{project-id}/posts/{post-id}` |
| 상태 변경 | `POST /project/v1/projects/{project-id}/posts/{post-id}/set-workflow` (`{ workflowId }`) / 완료: `POST .../set-done` |
| 댓글 목록 | `GET /project/v1/projects/{project-id}/posts/{post-id}/logs` |
| 댓글 등록 | `POST /project/v1/projects/{project-id}/posts/{post-id}/logs` (`{ body: { content, mimeType }, attachFileIds? }`) |
| 댓글 수정/삭제 | `PUT`/`DELETE /project/v1/projects/{project-id}/posts/{post-id}/logs/{log-id}` |
| 첨부 업로드 | `POST /project/v1/projects/{project-id}/posts/{post-id}/files` (multipart) — 응답 file id를 댓글 `attachFileIds`에도 사용 가능 |
| 첨부 목록/메타 | `GET .../posts/{post-id}/files`, `GET .../files/{file-id}?media=meta` |
| 첨부 다운로드 | `GET /project/v1/projects/{project-id}/posts/{post-id}/files/{file-id}?media=raw` |
| 첨부 삭제 | `DELETE .../posts/{post-id}/files/{file-id}` |

전체 스펙은 `docs/dooray-api-reference.md` 참조 (공식 문서를 헤드리스 렌더링으로 수집, 2026-07-04). 공통 규약: base URL `https://api.dooray.com`, 응답 `{ header: { isSuccessful, resultCode, resultMessage }, result }`, rate limit 헤더 존재. PoC(태스크 1.1)는 테넌트 권한·토큰 스코프 검증 목적으로 유지한다.

## Decisions

1. **API 프록시 패턴 유지** — 모든 Dooray 호출은 Next.js Route Handler에서 수행. 대안(클라이언트 직접 호출, Edge Function)은 토큰 노출·권한 강제 문제로 배제.
2. **프로젝트 ID는 요청마다 서버에서 재계산** — 단일 함수 `resolveProjectId()`로 통일. 클라이언트 파라미터의 프로젝트 ID는 받지 않는다. **단계적 구현**: Phase 1(칸반보드 우선, 로컬 개발 전용)은 env `DOORAY_PROJECT_ID` 반환, Phase 2에서 세션 사용자 → `company_members` → `company_dooray_projects`(active=true) 조회로 교체. 교체 지점은 이 함수 하나. Phase 1은 로그인 없이 로컬에서만 사용하고 배포하지 않는다.
3. **업무 소속 검증** — 업무 단위 요청은 Dooray 상세 조회로 해당 프로젝트 소속임을 확인(경로 자체가 `projects/{projectId}/posts/{postId}`라 타 프로젝트 업무는 Dooray가 404 반환 — 이를 그대로 신뢰). 별도 검증 테이블 불필요.
4. **칸반 컬럼 = Dooray 워크플로우** — 보드 로딩 시 workflows API로 컬럼을 동적 구성. 하드코딩 금지. 워크플로우 class(`registered`/`working`/`closed`)로 완료 처리 분기.
5. **드래그 앤 드롭: `@dnd-kit/core` 추가** — React 19 호환, 경량. 대안 `react-beautiful-dnd`는 유지보수 중단으로 배제. 낙관적 업데이트 후 실패 시 롤백 (react-query `onMutate`/`onError`).
6. **첨부 업로드는 서버 경유 스트리밍** — 클라이언트 → Route Handler(multipart) → Dooray. 임시 저장 없이 FormData 전달. 업무 생성과 파일 API가 분리되어 있으므로 "업무 생성 → `POST .../posts/{post-id}/files`" 2단계 처리. **주의(PoC 검증됨)**: 파일 업/다운로드는 `file-api.dooray.com`으로 307 리다이렉트됨 — fetch가 크로스 호스트 리다이렉트에서 Authorization을 제거하므로 `redirect: 'manual'`로 받아 location에 Authorization·body를 포함해 재요청해야 함 (`docs/dooray-api-reference.md` 파일 API 섹션 참조).
7. **RLS 적용** — 현행 `schema.sql`에 RLS 없음. 3개 테이블에 enable RLS + 자기 회사 조회 정책 추가. 서버는 세션 기반 클라이언트(`@supabase/ssr`)로 조회하므로 RLS가 이중 방어선 역할.
8. **mock-dooray 유지** — `DOORAY_BASE_URL` 미설정 로컬 개발·테스트용 목 클라이언트(`src/shared/lib/mock-dooray.ts`)를 계속 사용. 실서비스는 환경 변수로 전환.
9. **UI 스타일 가이드: `docs/apple-design.md`** — Apple HIG를 이 프로젝트에 맞게 정리한 가이드. 타이포 스케일, 시맨틱 컬러, 8pt 그리드, 카드/보드/폼 컴포넌트 규칙을 UI 작업(태스크 그룹 3~4) 전반에 적용.

## Risks / Trade-offs

- [Dooray API 경로/필드가 문서와 다름] → 착수 전 PoC 스크립트로 실호출 검증, 매핑 표 갱신
- [Dooray 응답 지연·rate limit] → 1차는 그대로 노출(스피너·오류 표시), 캐시 계층은 후속
- [워크플로우 변경 시 보드 컬럼 변동] → 의도된 동작. 컬럼을 동적 로딩하므로 코드 수정 불필요
- [작성자가 모두 API 토큰 계정으로 표시됨] → 1차 허용. 댓글/업무 본문에 고객사·작성자 표기를 접두어로 추가하는 방안 검토
- [첨부 업로드 API 구조 복잡] → 필요 시 1차에서 임시 파일 저장 허용(설계 문서 예외 조항), 메타데이터 DB는 금지

## Migration Plan

1. `supabase/schema.sql`에 RLS 추가 → Supabase에 적용
2. Dooray PoC 검증 (생성/상태/댓글/첨부/조회 각 1회)
3. 프록시 라우트 완성 → UI 완성 → 테스트
4. 롤백: DB 스키마는 추가만 하므로 코드 롤백만으로 충분

## Open Questions

- ~~Dooray 첨부 업로드가 업무 생성 요청에 인라인 포함 가능한지~~ → 해결: 별도 파일 API. 업무 생성 후 `POST .../posts/{post-id}/files`로 등록하는 2단계 처리. 댓글 첨부는 file id를 `attachFileIds`로 전달
- ~~댓글 작성자를 고객사 사용자로 구분 표시할 방법~~ → 해결: 본문 접두어 방식. 서버(`src/shared/lib/author.ts`)가 업무 본문·댓글 앞에 `[라벨]` 삽입. Phase 1은 env `PORTAL_AUTHOR_LABEL`(기본 "고객포털"), Phase 2에서 로그인 사용자명+고객사명으로 교체. 운영 시 토큰도 전용 계정으로 발급 권장
