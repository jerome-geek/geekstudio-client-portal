# trend-dashboard

## ADDED Requirements

### Requirement: 사이드바 메뉴
좌측 사이드바에 "트렌드" 메뉴를 추가해야 한다(SHALL). 클릭 시 `/trends`로 이동하며 활성 상태가 표시된다.

#### Scenario: 메뉴 진입
- **WHEN** 사이드바에서 트렌드 메뉴를 클릭하면
- **THEN** `/trends` 대시보드가 표시되고 메뉴가 활성 스타일이 된다

### Requirement: 급상승 카테고리 Spike Cards
대시보드 상단에 급상승 카테고리를 카드로 정렬 노출해야 한다(SHALL). 급상승도 = (최근 3일 평균 calibrated_score − 이전 7일 평균) ÷ 이전 7일 평균. 카드에는 카테고리명, 급상승률(%), 최근 점수를 표시한다.

#### Scenario: 급상승 정렬
- **WHEN** 대시보드에 진입하면
- **THEN** 급상승률 내림차순으로 카드가 정렬되어 표시된다

#### Scenario: 데이터 부족
- **WHEN** 특정 카테고리의 누적 데이터가 10일 미만이면
- **THEN** 해당 카테고리는 급상승 계산에서 제외하거나 "데이터 수집 중"으로 표시한다

### Requirement: 트렌드 차트
선택한 카테고리의 calibrated_score 추이를 7일/30일/90일 기간 전환으로 시각화해야 한다(SHALL).

#### Scenario: 기간 전환
- **WHEN** 30일 탭을 선택하면
- **THEN** 최근 30일 시계열이 영역 차트로 표시된다

#### Scenario: 카테고리 전환
- **WHEN** Spike Card를 클릭하면
- **THEN** 차트가 해당 카테고리 데이터로 갱신된다

### Requirement: 베스트셀러 그리드
카테고리 선택 시 당일(최신 수집일) 인기 상품 TOP 10을 썸네일·상품명·가격·스토어명과 함께 그리드로 표시해야 한다(SHALL). 상품 클릭 시 네이버 쇼핑 상품 페이지를 새 탭으로 연다.

#### Scenario: 상품 목록
- **WHEN** 카테고리를 선택하면
- **THEN** 최신 수집일 기준 1~10위 상품이 표시된다

#### Scenario: 크롤링 데이터 없음
- **WHEN** 해당 카테고리의 당일 크롤링 데이터가 없으면
- **THEN** 가장 최근 수집일 데이터를 대신 표시하고 수집일을 명시한다

### Requirement: 수집 대상 카테고리 관리
`/trends/settings` 화면에서 네이버 쇼핑 카테고리 트리를 탐색하며 수집 대상을 선택·해제할 수 있어야 한다(SHALL). 트리는 데이터랩 내부 엔드포인트를 서버 프록시로 조회해 노드별 지연 로딩한다. 선택 시 대표 키워드를 입력받아 `categories`에 `active=true`로 저장하고, 해제는 `active=false`로 처리해 기존 시계열을 보존한다(MUST NOT delete). 수집기는 `active=true` 카테고리만 수집한다.

#### Scenario: 카테고리 선택
- **WHEN** 트리에서 "스포츠/레저 > 수영"을 선택하고 대표 키워드를 입력해 저장하면
- **THEN** `categories`에 활성 상태로 등록되고 다음 수집부터 트렌드가 적재된다

#### Scenario: 트리 탐색
- **WHEN** 트리 노드를 펼치면
- **THEN** 해당 노드의 하위 카테고리가 서버 프록시를 통해 로드된다

#### Scenario: 카테고리 해제
- **WHEN** 활성 카테고리를 해제하면
- **THEN** `active=false`로 바뀌어 수집이 중단되고, 기존 시계열 데이터는 유지된다

### Requirement: 조회 API
대시보드 데이터는 서버 라우트(`/api/trends/**`)를 통해 조회해야 하며(SHALL), Supabase 조회는 서버에서 수행한다. 기존 포털과 동일하게 미인증 요청은 401 처리한다(Supabase 설정 시).

#### Scenario: 미인증 조회
- **WHEN** 세션 없이 트렌드 API를 호출하면 (Supabase 설정 상태)
- **THEN** 401을 반환한다
