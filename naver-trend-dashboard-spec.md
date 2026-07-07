# 네이버 스마트스토어 카테고리 급상승 대시보드 개발 명세서
> 이 문서는 네이버 쇼핑 데이터랩 API와 크롤링 차단 우회 도구(`insane-search`)를 결합하여 특정 도메인(수영/스포츠 레저 등)의 카테고리 트렌드를 누적하고 시각화하는 독립형 대시보드 프로젝트의 설계 및 구현 가이드라인이다. 다른 AI 에이전트가 이어서 즉시 구현할 수 있도록 상세 기술 스펙과 DB 스키마, 파이프라인 시나리오를 정의한다.

---

## 1. 프로젝트 개요 & 핵심 아키텍처

### 1.1 핵심 문제 정의: 네이버 데이터랩 API의 한계
네이버 데이터랩 쇼핑인사이트 API가 주는 클릭 수치(`ratio`)는 절대값이 아니라 **조회 기간 내 최대 클릭일을 100으로 잡은 상대적인 비율**이다. 
* 매일 API를 호출하여 그대로 저장하면 날마다 기준점이 달라져 시계열 데이터로서의 가치가 훼손된다.
* 따라서 **절대 검색량 데이터(네이버 검색광고 API)**를 결합하여 상대적 비율을 절대적 추정 트래픽 지수로 보정(Calibration)한 뒤 DB에 적재하는 파이프라인이 필수적이다.

### 1.2 전체 시스템 구조
```
[Vercel (Frontend Hosting)]
   └── [Next.js App (Tailwind CSS + Shadcn UI + Tremor 차트)]
            │ (DB Query)
            ▼
[Supabase (PostgreSQL DB)] 
            ▲
            │ (Data Ingest - 매일 자정)
[GitHub Actions (수집기 실행 환경)] 
   ├── 네이버 검색광고 API (절대 검색량 확보)
   ├── 네이버 데이터랩 API (상대 비율 확보)
   └── `insane-search` (네이버 쇼핑 베스트 1~20위 상품 정보 크롤링 - 봇 차단 우회)
```

---

## 2. 세부 기술 스택 스펙 (Tech Stack)

| 구분 | 기술 / 도구 | 역할 |
| :--- | :--- | :--- |
| **Frontend** | **Next.js (App Router)** | 단독 대시보드 웹 애플리케이션 프레임워크 (TypeScript 지원) |
| | **Tailwind CSS** | 반응형 레이아웃 및 스타일링 |
| | **Shadcn UI** | 테이블, 버튼, 다크모드 카드 등 고품질 UI 컴포넌트 뼈대 |
| | **Tremor** | 대시보드에 최적화된 AreaChart, LineChart, Sparkline 등 차트 시각화 |
| **Database** | **Supabase (PostgreSQL)** | 시계열 데이터 저장소, 트렌드 연산 쿼리 처리, REST API 자동화 |
| **Pipeline** | **GitHub Actions** | 매일 자정 크롤러/수집 엔진을 무상으로 구동할 스케줄러 환경 |
| | **insane-search** | 봇 차단(Cloudflare, TLS Fingerprinting)을 우회하여 네이버 쇼핑 상품 수집 |
| | **Axios + Cheerio** | API 연동 및 정적 HTML 구조 파싱 |

---

## 3. 데이터베이스 스키마 설계 (Supabase SQL)

시계열 데이터의 신속한 조회 및 카테고리 매핑을 위한 PostgreSQL DDL 정의.

```sql
-- 1. 카테고리 마스터 테이블
CREATE TABLE categories (
    category_id VARCHAR(20) PRIMARY KEY, -- 네이버 카테고리 코드 (예: '50001402')
    category_name VARCHAR(100) NOT NULL,
    parent_category_id VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. 일일 카테고리 트렌드 비율 및 보정 수치 테이블 (시계열)
CREATE TABLE category_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    category_id VARCHAR(20) REFERENCES categories(category_id) ON DELETE CASCADE,
    raw_ratio NUMERIC(5, 2) NOT NULL, -- 네이버 API 오리지널 ratio
    calibrated_score NUMERIC(12, 2) NOT NULL, -- 절대 검색수 기준 보정 점수
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (date, category_id)
);

-- date와 category_id에 복합 인덱스를 걸어 시계열 범위 조회 최적화
CREATE INDEX idx_trends_date_category ON category_trends(date, category_id);

-- 3. 일일 카테고리별 인기 상품 리스트 (insane-search 크롤링 결과 적재)
CREATE TABLE category_best_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    category_id VARCHAR(20) REFERENCES categories(category_id) ON DELETE CASCADE,
    rank INT NOT NULL, -- 1 ~ 20위
    product_name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    product_url TEXT NOT NULL,
    image_url TEXT,
    store_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (date, category_id, rank)
);
```

---

## 4. 데이터 수집 & 보정 파이프라인 시나리오

매일 KST 새벽 2시 GitHub Actions Workflow가 실행되어 다음 순서로 연산을 처리한다.

### 4.1 수집 시나리오
1. **절대 검색량 수집**: 네이버 검색광고 API를 찔러 수영복 대표 키워드('실내수영복')의 지난 30일간 실제 절대 검색량을 가져온다.
2. **트렌드 비율 수집**: 네이버 데이터랩 API에 수영복 하위 카테고리(여성수영복, 남성수영복 등)와 상기 대표 키워드를 묶어 전날 하루치 상대 비율(`raw_ratio`)을 가져온다.
3. **인기 상품 수집 (`insane-search` 활용)**:
   * 네이버 쇼핑 베스트 카테고리 페이지(`https://search.shopping.naver.com/best/home?categoryCategoryId=[카테고리ID]`)로 `insane-search` 스크립트를 실행한다.
   * WAF 차단을 우회하여 1위부터 20위까지의 상품명, 스토어 이름, 가격, 썸네일, 링크를 스크랩한다.

### 4.2 보정 알고리즘 공식 (Calibration Formula)
$$\text{Calibrated Score} = \text{Raw Ratio} \times \left( \frac{\text{대표 키워드 30일간 절대 검색량}}{\text{대표 키워드의 30일간 평균 Raw Ratio}} \right)$$
* 이 연산을 통해 상대값 `ratio`를 실제 시장의 **추정 트래픽/클릭 볼륨 점수**로 치환하여 데이터 일관성을 유지하며 DB에 삽입한다.

---

## 5. 프론트엔드 대시보드 화면 구성 기획

* **메인 화면 (Dashboard)**
  * **Spike Cards (급상승 카테고리 뷰)**: 최근 3일 평균 보정 점수가 이전 7일 평균 대비 급격히 증가한 카테고리를 정렬하여 노출.
  * **Trend Line Chart (Tremor AreaChart)**: 선택한 카테고리의 7일/30일/90일 누적 보정 점수 추이 시각화.
  * **Best Sellers Grid**: 특정 급상승 카테고리를 클릭했을 때, `insane-search`로 당일 수집한 인기 상품 TOP 10 목록을 가격/스토어정보와 함께 노출.
  * **Slack Alert Trigger**: 급상승도가 30%를 돌파하는 시점에 슬랙 채널에 알림 메시지를 발송하는 간이 웹훅 연동.

---

## 6. 다음 에이전트를 위한 구현 태스크 (Next Action Items)

다음 작업을 수행하는 개발 에이전트는 아래 순서로 구현을 시작하라.
1. **GitHub Actions 스크립트 작성**: `scripts/collect.ts`에 네이버 데이터랩/검색광고 API 연동 코드 작성.
2. **insane-search 크롤링 모듈 작성**: 네이버 쇼핑 랭킹 스크래핑 스크립트 빌드 및 로컬 테스트.
3. **Supabase 테이블 셋업**: 위의 DDL 스키마를 Supabase SQL Editor에 실행하여 테이블과 인덱스 빌드.
4. **Next.js 대시보드 화면 마크업**: Tremor와 Shadcn UI 기반으로 3단 레이아웃(급상승 순위, 메인 차트, 베스트 상품 그리드) UI 빌드.
