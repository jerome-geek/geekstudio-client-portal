# Tasks — Dooray 고객사 업무요청 포털

구현 순서: **Phase 1 칸반보드 우선** (프로젝트 ID는 env `DOORAY_PROJECT_ID`, 로컬 개발 전용) → **Phase 2 고객사/인증** (env를 Supabase 매핑 조회로 교체).

## 1. 기반 (Phase 1)

- [x] 1.1 Dooray PoC 스크립트 작성·실행: 업무 생성 1건, 상태 변경(set-workflow) 1회, 댓글 1건, 첨부 1건, 업무/댓글/첨부 조회 — 전 항목 성공 (2026-07-04). 파일 업/다운로드는 `file-api.dooray.com` 307 수동 처리 필요 확인
- [x] 1.2 `.env` 정리: `DOORAY_BASE_URL`, `DOORAY_API_TOKEN`, `DOORAY_PROJECT_ID` — `src/shared/lib/env.ts` 검증 로직 반영
- [x] 1.3 프로젝트 ID 결정 함수 단일화: `resolveProjectId()` 서버 함수 — Phase 1은 env 반환, Phase 2에서 Supabase 조회로 교체할 유일한 지점. 클라이언트가 프로젝트 ID를 보내는 API 계약 금지

## 2. Dooray 프록시 (Phase 1)

- [x] 2.1 `GET /api/workflows` 라우트 추가: 워크플로우 목록 프록시
- [x] 2.2 `GET/POST /api/tasks` 완성: 목록(페이지네이션, size 최대 100)·생성
- [x] 2.3 `GET /api/tasks/[taskId]` 상세 + 미존재 업무 404 처리
- [x] 2.4 `PUT /api/tasks/[taskId]/status` 상태 변경: `POST .../set-workflow` (완료는 set-done 분기)
- [x] 2.5 `GET/POST /api/tasks/[taskId]/comments` 댓글 목록·등록
- [x] 2.6 `POST /api/tasks/[taskId]/attachments` 업로드(multipart) + `GET .../attachments/[fileId]` 다운로드 프록시(`?media=raw`) — 307 → `file-api.dooray.com` 수동 리다이렉트 처리 필수
- [x] 2.7 Dooray 오류 → HTTP 상태·메시지 정규화 공통 핸들러 적용

## 3. 칸반 보드 (Phase 1)

- [x] 3.1 `@dnd-kit/core` 추가, 워크플로우 기반 동적 컬럼 렌더링 (`kanban-board.tsx`)
- [x] 3.2 업무 카드 표시 항목 완성: 제목, 번호, 작성일, 수정일, 우선순위, 태그 (`task-card.tsx`)
- [x] 3.3 드래그 앤 드롭 상태 변경: 낙관적 업데이트 + 실패 롤백 (`use-update-task-status-mutation`)
- [x] 3.4 보드 툴바: 새 업무 버튼, 새로고침 (`board-toolbar.tsx`)

## 4. 업무 화면 (Phase 1)

- [x] 4.1 업무 등록 폼 완성: 제목 필수 검증, 본문, 우선순위, 파일 첨부(생성 후 files 등록 2단계), 실패 시 입력 유지 (`new-task-form.tsx`)
- [x] 4.2 업무 상세 화면 완성: 메타데이터 전체 표시 + 상태 변경 UI (`task-detail.tsx`, `task-status-form.tsx`)
- [x] 4.3 댓글 목록·등록 UI: 시간순 표시, 빈 댓글 검증, 실패 시 입력 유지 (`task-comments.tsx`)
- [x] 4.4 첨부 목록·다운로드·업로드 UI (`attachment-upload.tsx`)
- [x] 4.5 공통 오류·로딩 표시: Dooray 실패 메시지 즉시 노출, 성공 여부 명확 표시

## 5. Phase 1 검증

- [x] 5.1 단위 테스트: 프록시 라우트(mock-dooray), 유효성 검증, `resolveProjectId()` env 경로
- [ ] 5.2 E2E 수동 검증: 보드 → 업무 생성 → 드래그 상태 변경 → 상세 → 댓글 → 첨부
- [x] 5.3 `npm run lint && npm run test && npm run build` 통과

## 6. 고객사·인증 (Phase 2)

- [x] 6.1 RLS + GRANT 적용 완료 (Supabase 프로젝트 실연동, 2026-07-07) — RLS 정책만으로는 403 발생, `grant select ... to authenticated` 3줄 추가 필요했음 (schema.sql에 반영, docs/supabase-setup.md 트러블슈팅에 기록)
- [x] 6.2 온보딩 절차 실계정으로 검증: 고객사 생성 → 두레이 프로젝트 매핑 → 계정 연결 → 로그인 성공 확인
- [x] 6.3 로그인 화면·`login-form` 완성: 이메일/비밀번호, 실패 메시지 (Supabase 미설정 시 로컬 모드 안내)
- [x] 6.4 `middleware.ts` 보호 경로 + API 401(resolveProjectId) + 401 응답 시 클라이언트 `/login` 리다이렉트(fetcher)
- [x] 6.5 고객사 미매핑 계정 차단: 미들웨어 `/unauthorized` 리다이렉트 + API 403
- [x] 6.6 로그아웃 버튼 (`logout-button.tsx`, Supabase 설정 시에만 노출)
- [x] 6.7 `resolveProjectId()` Supabase 분기 구현: 세션 → 매핑 조회, 미인증 401/미매핑 403, Supabase 미설정 시 env 폴백
- [x] 6.9 `resolveAuthorLabel()` 로그인 사용자명+고객사명 분기 구현 (`[홍길동 @ ACME]`) — Dooray 전용 운영 계정 토큰 교체는 운영 전환 시
- [x] 6.8 격리 테스트: 단위 테스트(401/403/매핑) + 실계정 통합 검증 — 미매핑 계정 로그인 시 `/unauthorized` 리다이렉트 확인. 타 고객사 업무 접근 차단은 고객사 2개 이상 확보 후 재검증 권장

## 7. Phase 2 검증

- [x] 7.1 E2E 검증(playwright): 로그인 → 보드(실 두레이 데이터 로딩) → 로그아웃 → 재접근 시 `/login` 리다이렉트, 미매핑 계정 `/unauthorized` 확인
- [x] 7.2 `npm run lint && npm run test && npm run build` 통과 (18 tests)
