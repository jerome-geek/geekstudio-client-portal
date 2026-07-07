create extension if not exists pgcrypto;

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists company_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique (company_id, user_id)
);

create table if not exists company_dooray_projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  dooray_project_id text not null,
  dooray_project_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS: 로그인 사용자는 자기 고객사의 행만 조회할 수 있다.
-- 쓰기(온보딩)는 service role 또는 SQL 콘솔에서만 수행한다 (정책 없음 = 차단).
-- ---------------------------------------------------------------------------

alter table companies enable row level security;
alter table company_members enable row level security;
alter table company_dooray_projects enable row level security;

-- 자기 멤버십 행 조회
drop policy if exists "members can read own membership" on company_members;
create policy "members can read own membership"
  on company_members for select
  using (user_id = auth.uid());

-- 자기 고객사 조회
drop policy if exists "members can read own company" on companies;
create policy "members can read own company"
  on companies for select
  using (
    id in (
      select company_id from company_members
      where user_id = auth.uid()
    )
  );

-- 자기 고객사의 Dooray 프로젝트 매핑 조회
drop policy if exists "members can read own project mapping" on company_dooray_projects;
create policy "members can read own project mapping"
  on company_dooray_projects for select
  using (
    company_id in (
      select company_id from company_members
      where user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 권한: RLS 정책만으로는 부족하다. authenticated 롤에 테이블 SELECT 권한을
-- 명시적으로 부여해야 PostgREST가 조회를 허용한다 (없으면 403).
-- ---------------------------------------------------------------------------

grant select on companies to authenticated;
grant select on company_members to authenticated;
grant select on company_dooray_projects to authenticated;
