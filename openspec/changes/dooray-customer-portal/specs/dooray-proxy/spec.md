# dooray-proxy

## ADDED Requirements

### Requirement: 서버 전용 Dooray API 호출
Dooray API 호출은 반드시 Next.js Route Handler(서버)에서만 수행해야 한다(MUST). `DOORAY_API_TOKEN`은 서버 환경 변수로만 보관하고 클라이언트에 노출해서는 안 된다(MUST NOT). 인증 헤더는 `Authorization: dooray-api {token}` 형식을 사용한다.

#### Scenario: 클라이언트 번들 검사
- **WHEN** 클라이언트 번들을 검사하면
- **THEN** Dooray API 토큰과 base URL 직접 호출 코드가 포함되지 않는다

### Requirement: 프록시 엔드포인트
서버는 아래 프록시 엔드포인트를 제공해야 한다(SHALL). 모든 엔드포인트는 인증 확인 → 고객사 프로젝트 결정 → Dooray API 호출 순서로 동작한다.

- `GET /api/workflows` — 프로젝트 워크플로우(상태) 목록: Dooray `GET /project/v1/projects/{projectId}/workflows`
- `GET /api/tasks` — 업무 목록: `GET /project/v1/projects/{projectId}/posts`
- `POST /api/tasks` — 업무 생성: `POST /project/v1/projects/{projectId}/posts`
- `GET /api/tasks/{taskId}` — 업무 상세: `GET /project/v1/projects/{projectId}/posts/{postId}`
- `PUT /api/tasks/{taskId}/status` — 업무 상태 변경: `POST /project/v1/projects/{projectId}/posts/{postId}/set-workflow` (완료 처리는 `POST .../set-done`)
- `GET /api/tasks/{taskId}/comments` — 댓글 목록: `GET /project/v1/projects/{projectId}/posts/{postId}/logs`
- `POST /api/tasks/{taskId}/comments` — 댓글 등록: `POST /project/v1/projects/{projectId}/posts/{postId}/logs`
- `POST /api/tasks/{taskId}/attachments` — 첨부 업로드: `POST /project/v1/projects/{projectId}/posts/{postId}/files` (multipart)
- `GET /api/tasks/{taskId}/attachments/{fileId}` — 첨부 다운로드 프록시: `GET .../posts/{postId}/files/{fileId}?media=raw`

#### Scenario: 프록시 호출 흐름
- **WHEN** 인증된 사용자가 프록시 엔드포인트를 호출하면
- **THEN** 서버는 세션 검증 후 매핑된 프로젝트 ID로 Dooray API를 호출하고 정규화된 응답을 반환한다

### Requirement: 업무 소속 검증
업무 단위 엔드포인트(상세/상태/댓글/첨부)는 대상 업무가 사용자 고객사 프로젝트에 속하는지 검증해야 한다(SHALL).

#### Scenario: 타사 업무 접근
- **WHEN** 다른 고객사 프로젝트의 업무 ID로 요청하면
- **THEN** 404 또는 403을 반환하고 Dooray 쓰기 요청을 수행하지 않는다

### Requirement: 오류 전파
Dooray API 실패 시 서버는 오류를 삼키지 않고(MUST NOT) 적절한 HTTP 상태 코드와 사용자에게 보여줄 메시지를 반환해야 한다(SHALL).

#### Scenario: Dooray 장애
- **WHEN** Dooray API가 오류를 반환하면
- **THEN** 프록시는 5xx/4xx 상태와 오류 메시지를 반환하고 화면은 이를 즉시 표시한다

### Requirement: 응답 정규화
프록시는 Dooray 응답(`{ header, result }` 구조)을 화면에서 쓰기 좋은 형태로 정규화해 반환해야 한다(SHALL). 페이지네이션(`page`, `size`, `totalCount`)을 지원한다.

#### Scenario: 목록 페이지네이션
- **WHEN** 업무가 Dooray 페이지 크기(최대 100)를 초과하면
- **THEN** 프록시는 전체 업무를 수집하거나 페이지 파라미터를 전달해 누락 없이 반환한다
