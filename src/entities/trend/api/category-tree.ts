import 'server-only';

export interface CategoryTreeNode {
  cid: string;
  name: string;
  parentId: string | null;
  level: number;
  fullPath: string;
  leaf: boolean;
}

interface DatalabCategoryRaw {
  cid: number;
  pid: number;
  name: string;
  level: number;
  leaf: boolean;
  fullPath?: string;
  parentPath?: string;
  childList?: DatalabCategoryRaw[];
}

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
  Referer: 'https://datalab.naver.com/shoppingInsight/sCategory.naver',
  Accept: 'application/json, text/plain, */*'
};

/**
 * 데이터랩 쇼핑인사이트 카테고리 트리를 노드 단위로 조회한다.
 * cid=0이면 최상위 분야 목록. 각 노드의 직계 자식만 반환한다.
 */
export async function fetchCategoryChildren(cid: string): Promise<CategoryTreeNode[]> {
  const url = `https://datalab.naver.com/shoppingInsight/getCategory.naver?cid=${encodeURIComponent(cid)}`;
  const response = await fetch(url, { headers: BROWSER_HEADERS, cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`카테고리 트리 조회 실패 (${response.status})`);
  }

  const data = (await response.json()) as DatalabCategoryRaw;
  const children = data.childList ?? [];

  return children.map((child) => ({
    cid: String(child.cid),
    name: child.name,
    parentId: String(data.cid),
    level: child.level,
    fullPath: child.fullPath ?? (data.name ? `${data.name} > ${child.name}` : child.name),
    leaf: child.leaf
  }));
}
