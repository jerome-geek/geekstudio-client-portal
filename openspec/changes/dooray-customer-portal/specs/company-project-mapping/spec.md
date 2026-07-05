# company-project-mapping

## ADDED Requirements

### Requirement: 매핑 스키마
시스템은 Supabase Postgres에 `companies`, `company_members`, `company_dooray_projects` 3개 테이블만 두어야 한다(SHALL). 업무/댓글/첨부 데이터 테이블은 만들지 않는다(MUST NOT).

#### Scenario: 스키마 적용
- **WHEN** `supabase/schema.sql`을 적용하면
- **THEN** 3개 테이블이 생성되고 업무 관련 테이블은 존재하지 않는다

### Requirement: 서버 측 프로젝트 결정
서버는 클라이언트가 보낸 프로젝트 ID를 신뢰하지 않고(MUST NOT), 로그인 사용자의 `auth.uid()` → `company_members` → `company_dooray_projects` 순으로 활성 Dooray 프로젝트 ID를 조회해야 한다(SHALL). 고객사당 활성 프로젝트는 1개다.

#### Scenario: 정상 매핑 조회
- **WHEN** 매핑된 사용자가 업무 API를 호출하면
- **THEN** 서버가 해당 고객사의 활성 `dooray_project_id`를 조회해 Dooray API 호출에 사용한다

#### Scenario: 타사 프로젝트 접근 시도
- **WHEN** 사용자가 다른 고객사의 프로젝트 ID나 업무 ID를 지정해 요청하면
- **THEN** 서버는 자기 고객사 프로젝트 기준으로만 처리하거나 403/404로 거부한다

### Requirement: RLS 정책
3개 테이블 모두 RLS를 활성화해야 하며(SHALL), 로그인 사용자는 자기 고객사의 행만 조회할 수 있어야 한다(SHALL). 매핑 수정은 서버(service role) 또는 관리자만 수행한다.

#### Scenario: 자기 회사 조회
- **WHEN** 로그인 사용자가 anon 키로 자기 회사 매핑을 조회하면
- **THEN** 자기 고객사 행만 반환된다

#### Scenario: 타사 데이터 조회
- **WHEN** 로그인 사용자가 다른 고객사 행을 조회하면
- **THEN** 결과가 반환되지 않는다

### Requirement: 수동 온보딩
1차 버전에서 고객사·멤버·프로젝트 매핑은 SQL 스크립트로 수동 등록한다(SHALL). 관리 UI는 만들지 않는다.

#### Scenario: 신규 고객사 등록
- **WHEN** 운영자가 온보딩 SQL로 고객사·멤버·프로젝트 매핑을 삽입하면
- **THEN** 해당 사용자는 코드 수정 없이 포털을 사용할 수 있다
