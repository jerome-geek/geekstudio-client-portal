# Apple Design Guidelines — 고객 포털 적용판

> Apple Human Interface Guidelines(HIG) 핵심 원칙을 이 프로젝트(Next.js + Tailwind, 칸반보드 포털)에 맞게 정리.
> 원문: https://developer.apple.com/design/human-interface-guidelines/

## 3대 원칙

1. **Clarity(명료함)** — 텍스트는 읽기 쉽게, 아이콘은 정확하게, 장식은 절제. 기능이 디자인을 이끈다.
2. **Deference(콘텐츠 우선)** — UI는 콘텐츠(업무 카드, 본문)를 돋보이게 하는 배경. 과한 그림자·테두리·색 금지.
3. **Depth(깊이)** — 레이어와 은은한 그림자로 계층 표현. 모달·팝오버는 배경 블러로 맥락 유지.

## 타이포그래피

시스템 폰트 스택 사용 (SF Pro 대응):

```css
font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo",
  "Pretendard Variable", Pretendard, "Segoe UI", "Malgun Gothic", sans-serif;
```

HIG 텍스트 스타일 → Tailwind 매핑:

| 용도 | HIG 스타일 | 크기/굵기 | Tailwind |
|---|---|---|---|
| 페이지 제목 | Title 1 | 28px / 700 | `text-[28px] font-bold` |
| 섹션 제목 | Title 3 | 20px / 600 | `text-xl font-semibold` |
| 카드 제목·강조 | Headline | 17px / 600 | `text-[17px] font-semibold` |
| 본문 | Body | 17px / 400 | `text-[17px]` (데스크톱 보드 밀도상 15px 허용) |
| 보조 텍스트 | Subheadline | 15px / 400 | `text-[15px]` |
| 메타데이터(날짜 등) | Footnote | 13px / 400 | `text-[13px]` |
| 라벨·배지 | Caption | 12px / 500 | `text-xs font-medium` |

- 행간: 본문 1.5, 제목 1.2~1.3
- 한 화면에 굵기 3단계 이상 섞지 않기 (400/500/600 정도)

## 색상

시맨틱 컬러 체계 — 역할 기반 네이밍, 라이트 모드 우선:

| 역할 | 값 | 용도 |
|---|---|---|
| Background | `#F5F5F7` | 앱 배경 (Apple 특유의 웜 그레이) |
| Surface | `#FFFFFF` | 카드, 패널 |
| Label | `#1D1D1F` | 주 텍스트 |
| Secondary Label | `#6E6E73` | 보조 텍스트, 메타데이터 |
| Separator | `rgba(0,0,0,0.08)` | 구분선, 카드 테두리 |
| Accent (Blue) | `#0071E3` | 주 액션 버튼, 링크, 포커스 |
| Green | `#34C759` | 성공, 완료 상태 |
| Orange | `#FF9500` | 경고, 높은 우선순위 |
| Red | `#FF3B30` | 오류, 최고 우선순위, 파괴적 액션 |

- 액센트 색은 **한 화면에 한 가지 역할**로만 (파랑 = 액션). 상태·우선순위 색과 섞이지 않게.
- 회색조로 위계 먼저 잡고, 색은 의미 있는 곳에만.
- 텍스트 대비 최소 4.5:1 (WCAG AA).

## 레이아웃·간격

- **8pt 그리드**: 모든 간격은 4의 배수, 기본 단위 8 (`gap-2`=8, `p-4`=16, `p-6`=24)
- 카드 내부 패딩: 16px (`p-4`), 섹션 간격: 24px (`space-y-6`)
- 터치/클릭 타깃 최소 44×44px (버튼 `h-11` 이상)
- 콘텐츠 최대 폭 제한: 상세 화면 본문 `max-w-2xl`, 보드는 가로 스크롤 허용

## 모서리·그림자

- 모서리 반경: 카드 12px (`rounded-xl`), 버튼 8~10px (`rounded-lg`), 입력 필드 10px, 모달 16px (`rounded-2xl`)
- 그림자는 은은하게 1~2단계만:
  - 카드: `shadow-sm` (`0 1px 3px rgba(0,0,0,0.06)`)
  - 드래그 중 카드: `shadow-lg` + 살짝 확대(`scale-[1.02]`)
  - 모달: `shadow-xl`
- 테두리와 그림자 동시 사용 시 둘 다 약하게 — Separator 색 테두리 + `shadow-sm`

## 컴포넌트 규칙

### 버튼
- Primary: Accent 배경 + 흰 텍스트, `rounded-lg`, 44px 높이
- Secondary: 회색 배경(`#F5F5F7`) + Label 텍스트
- Destructive: Red 텍스트 또는 배경
- 텍스트만 있는 버튼은 Accent 색 텍스트

### 칸반 보드
- 컬럼 배경은 앱 배경보다 약간 어두운 회색, 카드가 흰색으로 떠 보이게
- 카드: 흰 Surface, `rounded-xl`, `shadow-sm`, hover 시 `shadow-md`
- 우선순위는 작은 컬러 닷 또는 배지 (Red/Orange/회색), 카드 전체에 색 입히지 않기
- 드래그 중: 원위치에 placeholder(점선 또는 옅은 배경), 드래그 카드는 그림자 강화

### 폼·입력
- 입력 필드: 흰 배경 + Separator 테두리, 포커스 시 Accent 링 (`ring-2 ring-[#0071E3]/30`)
- 라벨은 필드 위, Subheadline 크기
- 오류는 필드 아래 Red Footnote + 테두리 Red
- 필수 표시는 라벨에 간결하게

### 피드백
- 로딩: 스피너 또는 스켈레톤 (콘텐츠 형태 유지)
- 성공/실패 토스트: 상단 중앙 또는 하단, 자동 소멸, 아이콘 + 짧은 문장
- 파괴적 액션(삭제)은 확인 다이얼로그

## 모션

- 지속시간: 마이크로 인터랙션 150~200ms, 화면 전환 300ms
- 이징: `ease-out` 기본 (감속 곡선)
- 목적 있는 모션만 — 상태 변화 전달용. 장식용 애니메이션 금지
- `prefers-reduced-motion` 존중

## 안티패턴 (하지 말 것)

- 무거운 테두리 + 진한 그림자 동시 사용
- 원색 배경의 큰 면적 (색은 포인트로만)
- 5가지 이상 폰트 크기 한 화면에
- 텍스트를 회색 배경 위 회색으로 (대비 부족)
- 모든 요소에 애니메이션
