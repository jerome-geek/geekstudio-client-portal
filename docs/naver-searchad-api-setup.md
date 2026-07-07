# 네이버 검색광고 API 발급 가이드

트렌드 대시보드의 보정(Calibration)에 필요한 **절대 검색량**을 키워드 도구 API로 조회하기 위한 자격 증명 발급 절차. 개인(비사업자)도 가능하고, 광고비 집행 없이 무료로 쓸 수 있다.

## 1. 검색광고 계정 가입

1. https://searchad.naver.com 접속 → **신규가입**
2. 네이버 아이디로 가입 (사업자 등록 없이 "개인 광고주" 선택 가능)
3. 가입 완료 후 **광고시스템** 진입

## 2. API 키 발급

1. 광고시스템 우측 상단 **도구 > API 사용 관리**
2. **네이버 검색광고 API 서비스 신청** 동의
3. 발급되는 값 2개 확인:
   - **액세스라이선스** → `NAVER_AD_API_KEY`
   - **비밀키** (발급 시 1회만 표시 — 즉시 복사) → `NAVER_AD_API_SECRET`
4. **CUSTOMER_ID** 확인: 광고시스템 우측 상단 계정명 옆 숫자 (예: `1234567`) → `NAVER_AD_CUSTOMER_ID`

## 3. env 등록

`.env.local` (로컬) + GitHub Actions Secrets (자동 수집용):

```
NAVER_AD_API_KEY=발급받은_액세스라이선스
NAVER_AD_API_SECRET=발급받은_비밀키
NAVER_AD_CUSTOMER_ID=고객번호
```

비밀키는 커밋·채팅 공유 금지. 파일에 직접 입력.

## 4. 호출 방식 (구현 참고)

- Base URL: `https://api.searchad.naver.com`
- 키워드 도구: `GET /keywordstool?hintKeywords={키워드}&showDetail=1`
- 인증 헤더 4개 필수:
  - `X-Timestamp`: 밀리초 타임스탬프
  - `X-API-KEY`: 액세스라이선스
  - `X-Customer`: 고객번호
  - `X-Signature`: `HMAC-SHA256(timestamp + "." + method + "." + uri, SECRET)` base64
- 응답의 `monthlyPcQcCnt` + `monthlyMobileQcCnt` = 월간 절대 검색량 (PC+모바일 합산 사용)
- 검색량 10 미만은 `"< 10"` 문자열로 옴 — 파싱 주의

## 5. 데이터랩 API도 함께 (별도 발급)

보정 대상인 상대 비율은 **네이버 개발자센터** 쪽:

1. https://developers.naver.com → 애플리케이션 등록
2. 사용 API에 **데이터랩(쇼핑인사이트)** 추가
3. `Client ID` → `NAVER_DATALAB_CLIENT_ID`, `Client Secret` → `NAVER_DATALAB_CLIENT_SECRET`
4. 일 호출 한도 1,000회 (카테고리 수십 개 일 1회 수집엔 충분)

## 체크리스트

- [ ] 검색광고 계정 가입 (개인 가능)
- [ ] API 사용 관리에서 액세스라이선스·비밀키 발급
- [ ] CUSTOMER_ID 확인
- [ ] 개발자센터에서 데이터랩 앱 등록 (Client ID/Secret)
- [ ] `.env.local`에 5개 값 입력
