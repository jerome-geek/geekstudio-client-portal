# task-collaboration

## ADDED Requirements

### Requirement: 댓글 조회
상세 화면은 Dooray 업무 댓글(로그)을 실시간 조회해 작성자, 작성 시각, 본문을 시간순으로 표시해야 한다(SHALL). 운영팀이 Dooray에서 단 댓글도 그대로 노출된다.

#### Scenario: 댓글 목록
- **WHEN** 업무 상세에 진입하면
- **THEN** Dooray 댓글 목록이 시간순으로 표시된다

### Requirement: 댓글 등록
사용자는 업무에 댓글을 등록할 수 있어야 한다(SHALL). 댓글은 자체 DB 저장 없이 Dooray에 바로 등록한다(MUST NOT store).

#### Scenario: 댓글 등록 성공
- **WHEN** 댓글 내용을 입력하고 등록하면
- **THEN** Dooray에 댓글이 생성되고 목록이 갱신된다

#### Scenario: 빈 댓글
- **WHEN** 빈 내용으로 등록하면
- **THEN** 유효성 오류를 표시하고 API를 호출하지 않는다

#### Scenario: 댓글 등록 실패
- **WHEN** Dooray 댓글 등록이 실패하면
- **THEN** 오류 메시지를 표시하고 입력값을 유지한다

### Requirement: 첨부파일 조회 및 다운로드
상세 화면은 업무에 연결된 첨부파일 목록(파일명, 크기)을 표시하고 다운로드를 제공해야 한다(SHALL). 다운로드는 서버 프록시를 경유한다.

#### Scenario: 첨부 목록
- **WHEN** 첨부가 있는 업무 상세에 진입하면
- **THEN** 첨부파일 목록이 표시되고 각 파일을 다운로드할 수 있다

### Requirement: 첨부파일 업로드
사용자는 업무 등록 시 또는 상세 화면에서 첨부파일을 업로드할 수 있어야 한다(SHALL). 파일은 서버를 경유해 Dooray 첨부 흐름으로 등록하며 자체 저장소에 영구 저장하지 않는다(MUST NOT).

#### Scenario: 업로드 성공
- **WHEN** 파일을 선택해 업로드하면
- **THEN** Dooray 업무에 첨부가 등록되고 목록이 갱신된다

#### Scenario: 업로드 실패
- **WHEN** 업로드가 실패하면
- **THEN** 오류 메시지를 표시한다
