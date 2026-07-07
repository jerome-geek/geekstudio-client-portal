-- 네이버 카테고리 트렌드 대시보드 스키마
-- 기존 고객 포털 테이블과 독립적. 재실행 안전(idempotent).

create extension if not exists pgcrypto;

-- 1. 카테고리 마스터 (수집 대상 관리)
create table if not exists trend_categories (
  category_id varchar(20) primary key,          -- 네이버 카테고리 코드 (예: '50000164')
  category_name varchar(100) not null,
  parent_category_id varchar(20),
  full_path text,                               -- '스포츠/레저 > 수영'
  rep_keyword varchar(100),                     -- 보정 기준 대표 키워드
  active boolean not null default true,         -- 수집 대상 여부 (해제 시 false, 시계열 보존)
  created_at timestamptz not null default now()
);

-- 2. 일일 카테고리 트렌드 (보정 점수 시계열)
create table if not exists trend_category_daily (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  category_id varchar(20) references trend_categories(category_id) on delete cascade,
  raw_ratio numeric(6, 2) not null,             -- 데이터랩 오리지널 ratio
  calibrated_score numeric(14, 2) not null,     -- 절대 검색량 기준 보정 점수
  created_at timestamptz not null default now(),
  unique (date, category_id)
);

create index if not exists idx_trend_daily_date_category
  on trend_category_daily(date, category_id);

-- 3. 일일 카테고리별 인기 상품 (크롤링 결과)
create table if not exists trend_best_products (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  category_id varchar(20) references trend_categories(category_id) on delete cascade,
  rank int not null,                            -- 1 ~ 20
  product_name varchar(255) not null,
  price int,
  product_url text not null,
  image_url text,
  store_name varchar(100),
  created_at timestamptz not null default now(),
  unique (date, category_id, rank)
);

create index if not exists idx_trend_products_date_category
  on trend_best_products(date, category_id);

-- ---------------------------------------------------------------------------
-- RLS: 로그인 사용자는 조회만. 쓰기(수집 적재)는 service role 전용(정책 없음).
-- RLS 정책만으로는 부족 — authenticated 롤에 SELECT GRANT를 명시해야 403이 안 난다.
-- ---------------------------------------------------------------------------

alter table trend_categories enable row level security;
alter table trend_category_daily enable row level security;
alter table trend_best_products enable row level security;

drop policy if exists "trend categories readable" on trend_categories;
create policy "trend categories readable" on trend_categories for select using (true);

drop policy if exists "trend daily readable" on trend_category_daily;
create policy "trend daily readable" on trend_category_daily for select using (true);

drop policy if exists "trend products readable" on trend_best_products;
create policy "trend products readable" on trend_best_products for select using (true);

grant select on trend_categories to authenticated;
grant select on trend_category_daily to authenticated;
grant select on trend_best_products to authenticated;
