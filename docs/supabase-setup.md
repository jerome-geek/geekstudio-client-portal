# Supabase 셋업 & 고객사 온보딩 가이드

포털 인증·고객사 매핑은 Supabase가 담당한다. 이 문서는 두 부분으로 나뉜다:

- **A. 최초 셋업** — 프로젝트 만들 때 1회만
- **B. 고객사 온보딩** — 신규 고객사 추가할 때마다 반복

관련 파일: `supabase/schema.sql`(테이블+RLS), `supabase/customer-onboarding.sql`(온보딩 템플릿)

---

## A. 최초 셋업 (1회)

### A-1. 프로젝트 생성

1. https://supabase.com/dashboard → **New Project**
2. 프로젝트명: `geekstudio-client-portal`, **Region: Northeast Asia (Seoul)**
3. DB 비밀번호 설정 후 안전한 곳에 보관 (SQL 콘솔만 쓰면 이후 거의 안 씀)

### A-2. 키 3개 → `.env.local`

**Project Settings(톱니) > API Keys**:

| 대시보드 항목 | env 변수 |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` / `publishable` 키 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` / `secret` 키 | `SUPABASE_SERVICE_ROLE_KEY` |

- secret 키는 절대 커밋·클라이언트 노출 금지 (`.env.local`은 gitignore 상태)
- 키 입력 후 **dev 서버 재시작** 필수

### A-3. 스키마 + RLS 적용

1. **SQL Editor > New query**
2. 로컬 `supabase/schema.sql` 내용 전체 붙여넣고 **Run**
3. 확인: **Table Editor**에 `companies`, `company_members`, `company_dooray_projects` 3개 테이블, 각각 RLS enabled 표시

> schema.sql은 멱등(idempotent) — 재실행해도 안전하다.

### A-4. Auth 설정

1. **Authentication > Sign In / Up > Auth Providers > Email**: Enabled 확인 (기본값)
2. **"Allow new users to sign up" OFF** — 자가 가입 차단. 계정은 관리자만 생성한다.

### A-5. 동작 확인

1. dev 서버 재시작 → `/board` 접근 시 `/login` 리다이렉트되면 인증 활성화된 것
2. 아직 계정이 없으므로 B로 진행

---

## B. 고객사 온보딩 (고객사마다 반복)

신규 고객사 = **두레이 3단계 + Supabase 3단계**.

### B-1. (두레이) 고객사 전용 프로젝트 준비

1. 두레이에서 고객사 전용 프로젝트 생성 (또는 기존 프로젝트 사용)
2. **API 토큰 계정을 해당 프로젝트 멤버로 추가** — 토큰 권한 = 계정 권한이라 멤버가 아니면 포털이 그 프로젝트에 접근 못 함
3. 프로젝트 ID 확보: 두레이에서 프로젝트 열었을 때 URL의 숫자

### B-2. (Supabase) 고객 계정 생성

**Authentication > Users > Add user > Create new user**

- 이메일 / 비밀번호 입력
- **Auto Confirm User 체크** (메일 인증 생략)
- **User Metadata**에 이름 추가 권장: `{"name": "홍길동"}`
  → 두레이 댓글 접두어가 `[홍길동 @ 고객사명]`으로 표시됨. 없으면 이메일로 표시
- 생성된 유저의 **UUID 복사**

한 고객사에 담당자가 여러 명이면 이 단계를 인원수만큼 반복.

### B-3. (Supabase) 매핑 등록

**SQL Editor**에서 아래 실행 (`supabase/customer-onboarding.sql` 템플릿과 동일):

```sql
-- 1) 고객사 생성 → 반환된 id 복사
insert into companies (name, status)
values ('고객사명', 'active')
returning id;

-- 2) 두레이 프로젝트 연결
insert into company_dooray_projects (company_id, dooray_project_id, dooray_project_name, active)
values ('<company-id>', '<두레이-프로젝트-ID>', '두레이 프로젝트명', true);

-- 3) 담당자 연결 (담당자 수만큼 반복)
insert into company_members (company_id, user_id, role)
values ('<company-id>', '<B-2에서 복사한 유저 UUID>', 'member');

-- 4) 검증
select c.name, cm.user_id, cdp.dooray_project_id, cdp.active
from companies c
join company_members cm on cm.company_id = c.id
join company_dooray_projects cdp on cdp.company_id = c.id
where c.name = '고객사명';
```

### B-4. 확인 체크리스트

- [ ] 해당 계정으로 포털 로그인 → 보드 진입, 자기 프로젝트 업무만 표시
- [ ] 업무 등록 → 두레이 해당 프로젝트에 생성, 본문에 `[이름 @ 고객사명]` 접두어
- [ ] 다른 고객사 업무 URL 직접 접근 시 차단 (404/403)

---

## 규칙 요약

- 고객사당 **활성 프로젝트 1개** (`active=true`). 프로젝트 교체 시 기존 행 `active=false` 후 새 행 추가
- 매핑 수정은 **SQL 콘솔/service role만** 가능 — RLS에 쓰기 정책이 없어서 anon 키로는 불가 (의도된 설계)
- 고객 비활성화: `company_members`에서 행 삭제 (또는 Auth에서 유저 삭제) → 즉시 `/unauthorized` 차단
- 고객사 해지: `companies.status='inactive'` + `company_dooray_projects.active=false`

## 트러블슈팅

| 증상 | 원인 | 조치 |
|---|---|---|
| 로그인 후 `/unauthorized` | `company_members` 매핑 없음 | B-3의 3) 실행, user_id가 Auth UUID와 일치하는지 확인 |
| 로그인 후 403 "고객사 매핑이 없는 계정" | 매핑은 있는데 `active=true` 프로젝트 없음 | `company_dooray_projects.active` 확인 |
| 보드는 뜨는데 업무 API 403/404 | 토큰 계정이 두레이 프로젝트 멤버 아님 | B-1의 2) 수행 |
| 로그인 화면에 "로컬 개발 모드" 표시 | `NEXT_PUBLIC_SUPABASE_*` env 누락 | A-2 확인 후 dev 서버 재시작 |
| 무료 플랜 프로젝트 일시정지 | 1주일 미사용 pause 정책 | 대시보드에서 Resume, 운영 전환 시 Pro 플랜 검토 |
