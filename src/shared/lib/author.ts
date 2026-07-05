import 'server-only';

/**
 * 포털 경유 작성물(업무 본문·댓글)에 붙는 작성자 라벨.
 * Dooray 개인 API 토큰은 발급 계정 명의로만 기록되므로,
 * 실제 요청자를 구분하기 위해 서버가 본문 앞에 접두어를 삽입한다.
 *
 * Phase 1: env(PORTAL_AUTHOR_LABEL) 고정 라벨.
 * Phase 2: 로그인 사용자 이름 + 고객사명으로 교체 (예: "홍길동 @ ACME").
 */
export async function resolveAuthorLabel(): Promise<string> {
  return process.env.PORTAL_AUTHOR_LABEL || '고객포털';
}

export function prefixAuthor(label: string, content: string): string {
  return `[${label}] ${content}`;
}
