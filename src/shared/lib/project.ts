import 'server-only';

/**
 * 현재 요청이 사용할 Dooray 프로젝트 ID를 서버에서 결정한다.
 * 클라이언트가 보낸 프로젝트 ID는 절대 신뢰하지 않는다.
 *
 * Phase 1: env(DOORAY_PROJECT_ID) 고정 — 로컬 개발 전용.
 * Phase 2: 세션 사용자 → company_members → company_dooray_projects 조회로 교체.
 */
export async function resolveProjectId(): Promise<string> {
  const projectId = process.env.DOORAY_PROJECT_ID;

  if (!projectId) {
    throw new Error('DOORAY_PROJECT_ID is not configured');
  }

  return projectId;
}
