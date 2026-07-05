# task-management

## ADDED Requirements

### Requirement: 업무 등록
사용자는 제목(필수), 본문, 우선순위, 파일 첨부와 함께 업무를 등록할 수 있어야 한다(SHALL). 등록 즉시 Dooray에 업무가 생성되며 자체 DB에는 저장하지 않는다(MUST NOT).

#### Scenario: 등록 성공
- **WHEN** 제목과 본문을 입력하고 등록하면
- **THEN** Dooray에 업무가 생성되고 성공 표시 후 보드/상세로 이동한다

#### Scenario: 필수값 누락
- **WHEN** 제목 없이 등록하면
- **THEN** 유효성 오류를 표시하고 API를 호출하지 않는다

#### Scenario: 등록 실패
- **WHEN** Dooray 업무 생성이 실패하면
- **THEN** 실패 메시지를 표시하고 입력값을 유지한다

### Requirement: 업무 상세 조회
상세 화면은 제목, 본문, 업무 번호, 현재 상태, 우선순위, 태그, 담당자, 마감일, 작성일/수정일을 표시해야 한다(SHALL). 댓글 목록과 첨부파일 목록도 함께 표시한다.

#### Scenario: 상세 진입
- **WHEN** 업무 상세에 진입하면
- **THEN** Dooray에서 업무·댓글·첨부를 실시간 조회해 표시한다

#### Scenario: 존재하지 않는 업무
- **WHEN** 없는 업무 ID 또는 타사 업무 ID로 진입하면
- **THEN** 접근 불가/없음 안내를 표시한다

### Requirement: 업무 상태 변경
사용자는 상세 화면과 보드에서 업무 상태를 Dooray 워크플로우 내 다른 상태로 변경할 수 있어야 한다(SHALL). 변경 후 즉시 최신 상태를 다시 조회해 화면을 갱신한다.

#### Scenario: 상태 변경 성공
- **WHEN** 다른 상태를 선택해 변경하면
- **THEN** Dooray 상태가 변경되고 화면에 새 상태가 표시된다

#### Scenario: 상태 변경 실패
- **WHEN** Dooray 상태 변경이 실패하면
- **THEN** 이전 상태를 유지하고 오류 메시지를 표시한다

### Requirement: 업무 데이터 무저장
업무 본문·메타데이터를 자체 DB에 저장해서는 안 된다(MUST NOT). 모든 조회는 Dooray API 실시간 호출로 처리한다.

#### Scenario: 저장소 검사
- **WHEN** Supabase 스키마를 검사하면
- **THEN** 업무 데이터 테이블이 존재하지 않는다
