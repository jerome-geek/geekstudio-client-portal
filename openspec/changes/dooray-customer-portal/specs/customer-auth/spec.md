# customer-auth

## ADDED Requirements

### Requirement: 고객 로그인
시스템은 Supabase Auth 이메일/비밀번호 로그인을 제공해야 한다(SHALL). 계정은 관리자가 생성하며 자가 가입은 제공하지 않는다.

#### Scenario: 로그인 성공
- **WHEN** 유효한 이메일/비밀번호로 로그인하면
- **THEN** 세션이 생성되고 칸반 보드 화면으로 이동한다

#### Scenario: 로그인 실패
- **WHEN** 잘못된 자격 증명으로 로그인하면
- **THEN** 오류 메시지를 표시하고 로그인 화면에 머무른다

### Requirement: 보호된 경로 접근 제어
시스템은 미인증 사용자의 보호된 화면·API 접근을 차단해야 한다(SHALL).

#### Scenario: 미인증 접근
- **WHEN** 로그인하지 않은 사용자가 보드나 업무 화면에 접근하면
- **THEN** 로그인 화면으로 리다이렉트된다

#### Scenario: 미인증 API 호출
- **WHEN** 세션 없이 `/api/tasks` 계열 API를 호출하면
- **THEN** 401 응답을 반환한다

### Requirement: 고객사 미매핑 계정 차단
시스템은 로그인했지만 `company_members`에 매핑이 없는 계정의 포털 사용을 차단해야 한다(SHALL).

#### Scenario: 매핑 없는 계정
- **WHEN** 고객사 매핑이 없는 사용자가 로그인하면
- **THEN** 안내 문구가 있는 접근 불가 화면을 표시하고 업무 데이터에 접근할 수 없다

### Requirement: 세션 만료 처리
시스템은 세션이 만료되면 재로그인을 유도해야 한다(SHALL).

#### Scenario: 만료된 세션
- **WHEN** 만료된 세션으로 화면 또는 API를 사용하면
- **THEN** 로그인 화면으로 유도한다

### Requirement: 로그아웃
시스템은 로그아웃 기능을 제공해야 한다(SHALL).

#### Scenario: 로그아웃
- **WHEN** 사용자가 로그아웃하면
- **THEN** 세션이 종료되고 로그인 화면으로 이동한다
