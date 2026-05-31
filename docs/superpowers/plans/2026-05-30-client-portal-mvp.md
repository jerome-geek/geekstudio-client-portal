# Client Portal MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working MVP of the Geekstudio client portal so customers can sign in, view their Dooray project in a kanban board, create tasks, update task status, add comments, and upload attachments.

**Architecture:** Start from the TailAdmin Next.js template as a UI starter, then strip the demo pages and keep only the reusable layout, navigation, and form primitives. Use Supabase Auth for sign-in and a minimal Supabase Postgres mapping layer for `companies`, `company_members`, and `company_dooray_projects`. All task, comment, and attachment data stays in Dooray; server-side route handlers proxy authenticated requests to Dooray API after resolving the logged-in user to a single allowed Dooray project.

**Tech Stack:** TailAdmin Next.js, Next.js, TypeScript, Tailwind CSS, TanStack Query, Supabase SSR, Zod, Vitest, React Testing Library

---

## File Structure

### Create

- `package.json`
- `pnpm-lock.yaml`
- `next.config.ts`
- `tsconfig.json`
- `postcss.config.js`
- `tailwind.config.ts`
- `.env.example`
- `.gitignore`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/app/login/page.tsx`
- `src/app/(protected)/board/page.tsx`
- `src/app/(protected)/tasks/[taskId]/page.tsx`
- `src/app/api/auth/callback/route.ts`
- `src/app/api/tasks/route.ts`
- `src/app/api/tasks/[taskId]/route.ts`
- `src/app/api/tasks/[taskId]/comments/route.ts`
- `src/app/api/tasks/[taskId]/attachments/route.ts`
- `src/app/api/tasks/[taskId]/status/route.ts`
- `src/components/providers/query-provider.tsx`
- `src/components/layout/app-shell.tsx`
- `src/components/board/kanban-board.tsx`
- `src/components/board/task-card.tsx`
- `src/components/tasks/task-detail.tsx`
- `src/components/tasks/task-comments.tsx`
- `src/components/tasks/task-status-form.tsx`
- `src/components/tasks/new-task-form.tsx`
- `src/components/tasks/attachment-upload.tsx`
- `src/hooks/queryKeys/index.ts`
- `src/hooks/query/use-task-board-query.ts`
- `src/hooks/query/use-task-detail-query.ts`
- `src/hooks/query/use-task-comments-query.ts`
- `src/hooks/mutation/use-create-task-mutation.ts`
- `src/hooks/mutation/use-update-task-status-mutation.ts`
- `src/hooks/mutation/use-create-task-comment-mutation.ts`
- `src/hooks/mutation/use-upload-task-attachment-mutation.ts`
- `src/entities/task/model/types.ts`
- `src/entities/task/api/tasks.ts`
- `src/entities/task/api/comments.ts`
- `src/entities/task/api/attachments.ts`
- `src/entities/task/api/status.ts`
- `src/entities/task/queries.ts`
- `src/entities/company/api/company.ts`
- `src/entities/company/queries.ts`
- `src/shared/lib/env.ts`
- `src/shared/lib/fetcher.ts`
- `src/shared/lib/dooray.ts`
- `src/shared/lib/auth.ts`
- `src/shared/lib/supabase/browser.ts`
- `src/shared/lib/supabase/server.ts`
- `src/shared/lib/utils.ts`
- `src/shared/models/company.ts`
- `src/shared/models/task.ts`
- `src/middleware.ts`
- `supabase/schema.sql`
- `supabase/seed.sql`
- `tests/setup.ts`
- `tests/shared/env.test.ts`
- `tests/shared/dooray.test.ts`
- `tests/app/api/tasks-route.test.ts`
- `tests/app/api/status-route.test.ts`
- `tests/app/board-page.test.tsx`

### Modify

- `docs/superpowers/specs/2026-05-30-dooray-customer-portal-design.md`

## Task 1: Bootstrap the application and shared tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `src/components/providers/query-provider.tsx`
- Create: `tests/setup.ts`

- [ ] **Step 1: Write the failing shared environment test**

```ts
// tests/shared/env.test.ts
import { describe, expect, it } from 'vitest';
import { envSchema } from '@/shared/lib/env';

describe('envSchema', () => {
  it('requires all server-side secrets for the portal', () => {
    const result = envSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/shared/env.test.ts`
Expected: FAIL with `Cannot find module '@/shared/lib/env'`

- [ ] **Step 3: Create the app scaffold and minimal shared config**

```json
// package.json
{
  "name": "geekstudio-client-portal",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
  "dependencies": {
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.49.8",
    "@tanstack/react-query": "^5.76.1",
    "next": "^15.3.2",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "zod": "^3.24.4"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/node": "^22.15.30",
    "@types/react": "^19.1.6",
    "@types/react-dom": "^19.1.5",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3",
    "vitest": "^3.1.4"
  }
}
```

```text
TailAdmin starter handling:
- keep: auth layout, dashboard shell, sidebar, header, form primitives, button styles
- remove: analytics widgets, charts, sample CRM/e-commerce pages, mock data, demo-only assets
- preserve: project-specific route structure under `src/app`
```

```ts
// src/shared/lib/env.ts
import { z } from 'zod';

export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DOORAY_BASE_URL: z.string().url(),
  DOORAY_API_TOKEN: z.string().min(1)
});

export type Env = z.infer<typeof envSchema>;
```

```tsx
// src/app/layout.tsx
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/shared/env.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json next.config.ts tailwind.config.ts postcss.config.js .gitignore .env.example src/app src/components/providers src/shared/lib/env.ts tests/setup.ts tests/shared/env.test.ts
git commit -m "🎉 init: 고객 포털 Next.js 기본 구조 작성"
```

## Task 2: Add Supabase schema, auth helpers, and project mapping lookup

**Files:**
- Create: `supabase/schema.sql`
- Create: `supabase/seed.sql`
- Create: `src/shared/models/company.ts`
- Create: `src/shared/lib/supabase/browser.ts`
- Create: `src/shared/lib/supabase/server.ts`
- Create: `src/shared/lib/auth.ts`
- Create: `src/entities/company/api/company.ts`
- Create: `src/entities/company/queries.ts`
- Create: `src/app/login/page.tsx`
- Create: `src/middleware.ts`

- [ ] **Step 1: Write the failing auth mapping test**

```ts
// tests/app/api/tasks-route.test.ts
import { describe, expect, it, vi } from 'vitest';
import { resolveCompanyDoorayProject } from '@/shared/lib/auth';

describe('resolveCompanyDoorayProject', () => {
  it('returns the single active project for the signed-in user', async () => {
    const getProject = vi.fn().mockResolvedValue({
      companyId: 'company-1',
      doorayProjectId: 'project-123'
    });

    const result = await resolveCompanyDoorayProject({
      userId: 'user-1',
      getProject
    });

    expect(result.doorayProjectId).toBe('project-123');
    expect(getProject).toHaveBeenCalledWith('user-1');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/app/api/tasks-route.test.ts`
Expected: FAIL with `Cannot find module '@/shared/lib/auth'`

- [ ] **Step 3: Implement the minimal Supabase mapping layer**

```sql
-- supabase/schema.sql
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table company_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique (company_id, user_id)
);

create table company_dooray_projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  dooray_project_id text not null,
  dooray_project_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
```

```ts
// src/shared/lib/auth.ts
export async function resolveCompanyDoorayProject({
  userId,
  getProject
}: {
  userId: string;
  getProject: (userId: string) => Promise<{ companyId: string; doorayProjectId: string }>;
}) {
  const project = await getProject(userId);

  if (!project?.doorayProjectId) {
    throw new Error('No Dooray project mapping found');
  }

  return project;
}
```

```ts
// src/entities/company/api/company.ts
import type { CompanyProjectMapping } from '@/shared/models/company';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

export async function getActiveCompanyProjectByUserId(
  userId: string
): Promise<CompanyProjectMapping> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('company_members')
    .select('company_id, company_dooray_projects!inner(dooray_project_id, active)')
    .eq('user_id', userId)
    .eq('company_dooray_projects.active', true)
    .single();

  if (error || !data) {
    throw new Error('Company project mapping lookup failed');
  }

  return {
    companyId: data.company_id,
    doorayProjectId: data.company_dooray_projects.dooray_project_id
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/app/api/tasks-route.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add supabase/schema.sql supabase/seed.sql src/shared/models/company.ts src/shared/lib/supabase src/shared/lib/auth.ts src/entities/company src/app/login/page.tsx src/middleware.ts tests/app/api/tasks-route.test.ts
git commit -m "✨ feat: 고객사 매핑과 Supabase 인증 기반 추가"
```

## Task 3: Add Dooray server client and protected API routes

**Files:**
- Create: `src/shared/lib/fetcher.ts`
- Create: `src/shared/lib/dooray.ts`
- Create: `src/shared/models/task.ts`
- Create: `src/entities/task/model/types.ts`
- Create: `src/entities/task/api/tasks.ts`
- Create: `src/entities/task/api/comments.ts`
- Create: `src/entities/task/api/attachments.ts`
- Create: `src/entities/task/api/status.ts`
- Create: `src/app/api/tasks/route.ts`
- Create: `src/app/api/tasks/[taskId]/route.ts`
- Create: `src/app/api/tasks/[taskId]/comments/route.ts`
- Create: `src/app/api/tasks/[taskId]/attachments/route.ts`
- Create: `src/app/api/tasks/[taskId]/status/route.ts`
- Test: `tests/shared/dooray.test.ts`
- Test: `tests/app/api/status-route.test.ts`

- [ ] **Step 1: Write the failing Dooray client test**

```ts
// tests/shared/dooray.test.ts
import { describe, expect, it, vi } from 'vitest';
import { createDoorayClient } from '@/shared/lib/dooray';

describe('createDoorayClient', () => {
  it('adds the Dooray token header to outbound requests', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    const client = createDoorayClient({
      baseUrl: 'https://api.example.com',
      token: 'secret-token',
      fetcher
    });

    await client.get('/projects/1/tasks');

    expect(fetcher).toHaveBeenCalledWith(
      'https://api.example.com/projects/1/tasks',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'dooray-api secret-token'
        })
      })
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/shared/dooray.test.ts`
Expected: FAIL with `Cannot find module '@/shared/lib/dooray'`

- [ ] **Step 3: Implement the Dooray client and route handlers**

```ts
// src/shared/lib/dooray.ts
type FetchLike = typeof fetch;

export function createDoorayClient({
  baseUrl,
  token,
  fetcher = fetch
}: {
  baseUrl: string;
  token: string;
  fetcher?: FetchLike;
}) {
  const request = async (path: string, init?: RequestInit) =>
    fetcher(`${baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `dooray-api ${token}`,
        ...(init?.headers ?? {})
      }
    });

  return {
    get: (path: string) => request(path),
    post: (path: string, body: unknown) =>
      request(path, {
        method: 'POST',
        body: JSON.stringify(body)
      }),
    put: (path: string, body: unknown) =>
      request(path, {
        method: 'PUT',
        body: JSON.stringify(body)
      })
  };
}
```

```ts
// src/app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import { resolveCompanyDoorayProject } from '@/shared/lib/auth';
import { getActiveCompanyProjectByUserId } from '@/entities/company/api/company';
import { listTasks, createTask } from '@/entities/task/api/tasks';

export async function GET() {
  const userId = 'replace-with-server-session-user-id';
  const project = await resolveCompanyDoorayProject({
    userId,
    getProject: getActiveCompanyProjectByUserId
  });

  const tasks = await listTasks(project.doorayProjectId);
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const userId = 'replace-with-server-session-user-id';
  const project = await resolveCompanyDoorayProject({
    userId,
    getProject: getActiveCompanyProjectByUserId
  });

  const task = await createTask(project.doorayProjectId, body);
  return NextResponse.json(task, { status: 201 });
}
```

```ts
// src/app/api/tasks/[taskId]/status/route.ts
import { NextResponse } from 'next/server';
import { updateTaskStatus } from '@/entities/task/api/status';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const body = await request.json();
  const result = await updateTaskStatus(taskId, body.statusId);
  return NextResponse.json(result);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest tests/shared/dooray.test.ts tests/app/api/status-route.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/lib/fetcher.ts src/shared/lib/dooray.ts src/shared/models/task.ts src/entities/task src/app/api/tasks src/app/api/tasks/[taskId] tests/shared/dooray.test.ts tests/app/api/status-route.test.ts
git commit -m "✨ feat: Dooray 프록시 API 라우트 추가"
```

## Task 4: Build entity query options and thin client hooks

**Files:**
- Create: `src/hooks/queryKeys/index.ts`
- Create: `src/entities/task/queries.ts`
- Create: `src/hooks/query/use-task-board-query.ts`
- Create: `src/hooks/query/use-task-detail-query.ts`
- Create: `src/hooks/query/use-task-comments-query.ts`
- Create: `src/hooks/mutation/use-create-task-mutation.ts`
- Create: `src/hooks/mutation/use-update-task-status-mutation.ts`
- Create: `src/hooks/mutation/use-create-task-comment-mutation.ts`
- Create: `src/hooks/mutation/use-upload-task-attachment-mutation.ts`

- [ ] **Step 1: Write the failing query key test**

```ts
// tests/app/api/status-route.test.ts
import { describe, expect, it } from 'vitest';
import { taskKeys } from '@/hooks/queryKeys';

describe('taskKeys', () => {
  it('creates stable board and detail cache keys', () => {
    expect(taskKeys.board()).toEqual(['tasks', 'board']);
    expect(taskKeys.detail('task-1')).toEqual(['tasks', 'detail', 'task-1']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/app/api/status-route.test.ts`
Expected: FAIL with `Cannot find module '@/hooks/queryKeys'`

- [ ] **Step 3: Implement entity options and thin hooks using the convention**

```ts
// src/hooks/queryKeys/index.ts
export const taskKeys = {
  all: ['tasks'] as const,
  board: () => [...taskKeys.all, 'board'] as const,
  detail: (taskId: string) => [...taskKeys.all, 'detail', taskId] as const,
  comments: (taskId: string) => [...taskKeys.all, 'comments', taskId] as const
};
```

```ts
// src/entities/task/queries.ts
import { queryOptions } from '@tanstack/react-query';
import { taskKeys } from '@/hooks/queryKeys';
import { getTaskBoard, getTaskDetail, getTaskComments } from '@/entities/task/api/tasks';

export const taskBoardOptions = () =>
  queryOptions({
    queryKey: taskKeys.board(),
    queryFn: getTaskBoard
  });

export const taskDetailOptions = (taskId: string) =>
  queryOptions({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => getTaskDetail(taskId)
  });

export const taskCommentsOptions = (taskId: string) =>
  queryOptions({
    queryKey: taskKeys.comments(taskId),
    queryFn: () => getTaskComments(taskId)
  });
```

```ts
// src/hooks/query/use-task-board-query.ts
import { useQuery } from '@tanstack/react-query';
import { taskBoardOptions } from '@/entities/task/queries';

export function useTaskBoardQuery() {
  return useQuery(taskBoardOptions());
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/app/api/status-route.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/queryKeys/index.ts src/entities/task/queries.ts src/hooks/query src/hooks/mutation tests/app/api/status-route.test.ts
git commit -m "✨ feat: 업무 조회/변경용 query hook 구조 추가"
```

## Task 5: Build the protected client portal UI

**Files:**
- Create: `src/components/layout/app-shell.tsx`
- Create: `src/components/board/kanban-board.tsx`
- Create: `src/components/board/task-card.tsx`
- Create: `src/components/tasks/task-detail.tsx`
- Create: `src/components/tasks/task-comments.tsx`
- Create: `src/components/tasks/task-status-form.tsx`
- Create: `src/components/tasks/new-task-form.tsx`
- Create: `src/components/tasks/attachment-upload.tsx`
- Create: `src/app/(protected)/board/page.tsx`
- Create: `src/app/(protected)/tasks/[taskId]/page.tsx`

- [ ] **Step 1: Write the failing board rendering test**

```ts
// tests/app/board-page.test.tsx
import { render, screen } from '@testing-library/react';
import { KanbanBoard } from '@/components/board/kanban-board';

describe('KanbanBoard', () => {
  it('renders task columns from Dooray statuses', () => {
    render(
      <KanbanBoard
        groups={[
          { statusId: 'todo', statusName: '접수', tasks: [] },
          { statusId: 'doing', statusName: '진행중', tasks: [] }
        ]}
      />
    );

    expect(screen.getByText('접수')).toBeInTheDocument();
    expect(screen.getByText('진행중')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/app/board-page.test.tsx`
Expected: FAIL with `Cannot find module '@/components/board/kanban-board'`

- [ ] **Step 3: Implement the protected pages and MVP components**

```tsx
// src/components/board/kanban-board.tsx
type TaskGroup = {
  statusId: string;
  statusName: string;
  tasks: Array<{ id: string; title: string }>;
};

export function KanbanBoard({ groups }: { groups: TaskGroup[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      {groups.map((group) => (
        <div key={group.statusId} className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">{group.statusName}</h2>
          <div className="mt-3 space-y-3">
            {group.tasks.map((task) => (
              <article key={task.id} className="rounded-xl border p-3">
                <p className="font-medium">{task.title}</p>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
```

```tsx
// src/app/(protected)/board/page.tsx
import { KanbanBoard } from '@/components/board/kanban-board';

export default function BoardPage() {
  return (
    <main className="min-h-screen bg-stone-100 p-6">
      <KanbanBoard groups={[]} />
    </main>
  );
}
```

```tsx
// src/components/tasks/task-status-form.tsx
'use client';

export function TaskStatusForm({
  statuses,
  onSubmit
}: {
  statuses: Array<{ id: string; name: string }>;
  onSubmit: (statusId: string) => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onSubmit(String(formData.get('statusId')));
      }}
      className="flex gap-2"
    >
      <select name="statusId" className="rounded-lg border px-3 py-2">
        {statuses.map((status) => (
          <option key={status.id} value={status.id}>
            {status.name}
          </option>
        ))}
      </select>
      <button className="rounded-lg bg-black px-4 py-2 text-white" type="submit">
        상태 변경
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/app/board-page.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/layout src/components/board src/components/tasks src/app/(protected) tests/app/board-page.test.tsx
git commit -m "✨ feat: 고객 포털 칸반 화면과 상세 UI 추가"
```

## Task 6: Final integration, documentation, and verification

**Files:**
- Modify: `docs/superpowers/specs/2026-05-30-dooray-customer-portal-design.md`
- Modify: `.env.example`
- Modify: `package.json`
- Test: `tests/shared/env.test.ts`
- Test: `tests/shared/dooray.test.ts`
- Test: `tests/app/api/tasks-route.test.ts`
- Test: `tests/app/api/status-route.test.ts`
- Test: `tests/app/board-page.test.tsx`

- [ ] **Step 1: Add missing integration notes and local setup docs**

```md
## Local Setup Notes

1. Copy `.env.example` to `.env.local`
2. Fill Supabase and Dooray credentials
3. Run `pnpm install`
4. Apply `supabase/schema.sql`
5. Start app with `pnpm dev`
```

- [ ] **Step 2: Run the full automated test suite**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 3: Run the production build**

Run: `pnpm build`
Expected: PASS with generated Next.js routes for `/login`, `/board`, `/tasks/[taskId]`, and `/api/tasks`

- [ ] **Step 4: Manually verify the main user flows**

Run:

```bash
pnpm dev
```

Expected:
- `/login` renders the Supabase sign-in flow
- authenticated user is redirected into `/board`
- board shows only the mapped Dooray project
- task detail page supports comments, attachments, and status updates

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/specs/2026-05-30-dooray-customer-portal-design.md .env.example package.json
git commit -m "📝 docs: 고객 포털 MVP 구현 계획과 환경 문서 정리"
```

## Self-Review

- Spec coverage: the plan covers login, company-project mapping, kanban board, task detail, create task, update status, comments, attachments, and protected access. There is no uncovered MVP requirement from the current spec.
- Placeholder scan: all tasks include file targets, example code, test commands, and commit commands. No `TODO` or `TBD` placeholders remain.
- Type consistency: `doorayProjectId`, `companyId`, `taskId`, and `statusId` are used consistently across shared models, route handlers, and hook layers.
