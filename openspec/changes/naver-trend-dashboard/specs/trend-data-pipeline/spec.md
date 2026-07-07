# trend-data-pipeline

## ADDED Requirements

### Requirement: 시계열 스키마
Supabase에 `categories`(카테고리 마스터), `category_trends`(일일 보정 점수, `UNIQUE(date, category_id)`), `category_best_products`(일일 베스트 상품, `UNIQUE(date, category_id, rank)`) 테이블을 두어야 한다(SHALL). `category_trends`는 `(date, category_id)` 복합 인덱스를 가진다.

#### Scenario: 스키마 적용
- **WHEN** 트렌드 스키마 SQL을 적용하면
- **THEN** 3개 테이블과 인덱스가 생성되고, 같은 날짜·카테고리 중복 적재는 UNIQUE 제약으로 거부된다

### Requirement: 절대 검색량 기반 보정
수집기는 데이터랩 상대 비율(`raw_ratio`)을 그대로 저장하지 말고(MUST NOT raw만 저장), 대표 키워드의 30일 절대 검색량(검색광고 API)으로 보정한 `calibrated_score`를 함께 저장해야 한다(SHALL).

보정 공식: `calibrated_score = raw_ratio × (대표 키워드 30일 절대 검색량 ÷ 대표 키워드 30일 평균 raw_ratio)`

#### Scenario: 보정 계산
- **WHEN** raw_ratio=50, 대표 키워드 30일 절대 검색량=90,000, 대표 키워드 30일 평균 raw_ratio=60 이면
- **THEN** calibrated_score = 50 × (90000 ÷ 60) = 75,000 으로 저장된다

#### Scenario: 기준 데이터 결측
- **WHEN** 검색광고 API 호출이 실패하면
- **THEN** 해당 일자 적재를 건너뛰고 오류를 로그로 남긴다 (raw만 저장하지 않는다)

### Requirement: 일일 수집 스케줄
GitHub Actions가 매일 KST 새벽 2시에 수집기를 실행해야 한다(SHALL). 순서: ① 검색광고 API 절대 검색량 → ② 데이터랩 API 전일 상대 비율 → ③ 보정 점수 계산·적재 → ④ 베스트 상품 크롤링·적재.

#### Scenario: 정상 수집
- **WHEN** 스케줄이 실행되면
- **THEN** 대상 카테고리 전체의 전일 `category_trends` 행과 `category_best_products` 1~20위 행이 생성된다

#### Scenario: 재실행 멱등성
- **WHEN** 같은 날짜에 수집기가 두 번 실행되면
- **THEN** upsert로 처리되어 중복 행이 생기지 않는다

### Requirement: 크롤링 실패 격리
베스트 상품 크롤링(`insane-search`)이 차단·실패해도 트렌드 점수 적재는 성공해야 한다(SHALL). 두 단계는 독립적으로 실행·실패한다.

#### Scenario: 크롤링 차단
- **WHEN** 네이버 쇼핑 페이지가 크롤러를 차단하면
- **THEN** `category_trends` 적재는 완료되고, 크롤링 실패만 로그·알림으로 남는다

### Requirement: 시크릿 관리
네이버 API 키와 Slack 웹훅 URL은 GitHub Actions Secrets와 서버 env로만 관리해야 하며(MUST) 코드·클라이언트에 노출해서는 안 된다(MUST NOT).

#### Scenario: 저장소 검사
- **WHEN** 저장소 코드를 검사하면
- **THEN** API 키·웹훅 URL 하드코딩이 없다
