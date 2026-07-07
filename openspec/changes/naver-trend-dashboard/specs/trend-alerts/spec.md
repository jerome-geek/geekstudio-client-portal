# trend-alerts

## ADDED Requirements

### Requirement: 급상승 Slack 알림
일일 수집 완료 후 급상승도가 30%를 초과한 카테고리가 있으면 Slack Incoming Webhook으로 알림을 발송해야 한다(SHALL). 메시지에는 카테고리명, 급상승률, 최근 점수, 대시보드 링크를 포함한다.

#### Scenario: 임계 돌파
- **WHEN** 수집 후 카테고리 급상승도가 30%를 넘으면
- **THEN** Slack 채널에 해당 카테고리 알림 메시지가 1회 발송된다

#### Scenario: 임계 미달
- **WHEN** 모든 카테고리가 30% 이하면
- **THEN** 알림을 발송하지 않는다

### Requirement: 알림 실패 격리
Slack 발송 실패가 수집 파이프라인을 실패시켜서는 안 된다(MUST NOT). 발송 오류는 로그로만 남긴다.

#### Scenario: 웹훅 오류
- **WHEN** Slack 웹훅이 4xx/5xx를 반환하면
- **THEN** 수집 워크플로우는 성공으로 종료되고 오류가 로그에 남는다

### Requirement: 웹훅 미설정 허용
`SLACK_WEBHOOK_URL`이 설정되지 않은 환경에서는 알림 단계를 조용히 건너뛴다(SHALL).

#### Scenario: 로컬 실행
- **WHEN** 웹훅 URL 없이 수집기를 실행하면
- **THEN** 알림 없이 수집·적재만 수행된다
