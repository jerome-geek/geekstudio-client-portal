# Dooray API Reference (업무/프로젝트)

> 출처: https://helpdesk.dooray.com/share/pages/9wWo-xwiR66BO5LGshgVTg/2939987647631384419 (헤드리스 렌더링 후 추출, 2026-07-04)
> 범위: 기본/인증/메시지 규약 + Common + Project(업무·워크플로우·태그·마일스톤·댓글·첨부·훅)

# 기본

## End Point

-
민간 클라우드

-
https://api.dooray.com
-
공공 클라우드

-
https://api.gov-dooray.com
-
공공 업무망 클라우드

-
https://api.gov-dooray.co.kr
-
금융 클라우드

-
https://api.dooray.co.kr
## 인증

### 개인 API 인증 토큰 발급 과정

-
개인설정 > API > 개인 인증 토큰 메뉴에서 생성합니다.
### 개인 API 인증 토큰 사용 방법

-
API 호출시 Authorization 헤더와 함께 사용합니다.
```
# 민간 클라우드
$ curl -H 'Authorization: dooray-api {TOKEN}' https://api.dooray.com/project/v1/projects/{project-id}

# 공공 클라우드
$ curl -H 'Authorization: dooray-api {TOKEN}' https://api.gov-dooray.com/project/v1/projects/{project-id}

# 공공 업무망 클라우드
$ curl -H 'Authorization: dooray-api {TOKEN}' https://api.gov-dooray.co.kr/project/v1/projects/{project-id}

# 금융 클라우드
$ curl -H 'Authorization: dooray-api {TOKEN}' https://api.dooray.co.kr/project/v1/projects/{project-id}
```

### 개인 API 인증 토큰 권한

-
토큰을 발급 받은 계정과 동일한 권한을 갖습니다.
-
API 로 작업한 내용은 해당 사용자가 로그인하여 Dooray 를 직접 사용하는 것과 차이가 없습니다.
-
ACL 도 해당 계정에 적용되는 것과 동일하게 적용됩니다. (IP ACL, User ACL)
## TLS 지원

보안 위험성으로 인해 TLS 1.0, TLS 1.1 버전은 더이상 지원하지 않습니다.
따라서, Dooray-API를 사용하실 때에는 TLS 1.2 이상 버전으로 요청해주셔야 정상 이용 가능합니다.
## 메시지

-
json 포맷을 사용합니다.
### 요청 메시지

-
모든 요청에 'Authorization' 헤더를 포함하여 요청합니다.
-
json body 를 포함하여 보내야 하는 메시지의 경우, Content-Type 헤더를 명시하여야 합니다.
```
    Content-Type: application/json
```

### 응답 메시지

-
응답결과 json에 스펙에 명시되지 않은 추가 필드가 응답될 수 있습니다.

-
클라이언트에서는 스펙에 명시되지 않은 추가 필드는 무시합니다.
#### 응답 결과 해석

-
HTTP Status 응답 코드와 Body 내의 header 블럭을 사용하여 기본 결과를 표시합니다.
-
사용하는 HTTP Status 응답코드는 다음과 같습니다.

-
200: 성공
-
301: 리소스의 위치가 다른 곳인 경우
-
302: 리소스의 위치가 다른 곳인 경우
-
303: 리소스의 위치가 다른 곳인 경우
-
307: 리소스의 위치가 다른 곳인 경우
-
400: 사용자 입력 오류
-
401: 인증되지 않은 요청인 경우 (예, Authorization 헤더가 없는 경우, 토큰이 폐기된 경우, 잘못된 토큰을 보낸 경우)
-
403: 권한이 없는 경우(예, 프로젝트 어드민만 할 수 있는 작업을 일반 멤버가 하는 경우)
-
404: 존재하지 않는 리소스를 요청하는 경우. (예외적으로 권한이 없는 리소스의 경우에도 404가 나오는 경우가 있음)
-
409: 중복되는 리소스 생성 요청의 경우
-
415: Content-Type 이 맞지 않는 경우
-
429: 너무 많은 요청을 보내는 경우
-
500: 서버에서 작업에 실패한 경우
-
그 외 상세한 정보가 필요한 경우 응답 body 내의 header.resultCode, header.resultMessage 를 사용합니다.

-
header.resultMessage 는 사람을 위해 제공되는 필드입니다.
-
header.resultMessage 는 이해하기 쉬운 형태로 예고 없이 변경될 수 있습니다.
-
header.resultMessage 는 적절한 응답인지 확인을 위해 프로그램 로직에서 사용하는 것을 지양해야합니다.
### 요청 제한(Rate limiter)

-
API 요청에는 요청 제한이 적용됩니다.
-
Token Bucket 알고리즘 기반으로 동작하며, 1초마다 토큰이 보충됩니다.
#### 응답 헤더

API 응답에는 다음의 Rate Limit 관련 헤더가 포함됩니다.

헤더 이름 |
설명 |

X-RateLimit-Remaining |
현재 남아있는 토큰 수 |

X-RateLimit-Requested-Tokens |
이번 요청에서 사용된 토큰 수 |

X-RateLimit-Burst-Capacity |
최대 토큰 용량 (버스트 허용량) |

X-RateLimit-Replenish-Rate |
1초당 보충되는 토큰 수 |

#### 토큰 보충

-
토큰은 1초마다 X-RateLimit-Replenish-Rate 값만큼 자동으로 보충됩니다.
-
보충된 토큰은 X-RateLimit-Burst-Capacity 를 초과할 수 없습니다.
-
X-RateLimit-Replenish-Rate 및 X-RateLimit-Burst-Capacity 설정 값은 사전 고지 없이 변경될 수 있습니다.

-
고정 값이 아닌 응답 헤더에서 받은 값을 사용하시기 바랍니다.
#### 요청 제한 초과 시

-
토큰이 부족한 경우 HTTP 429 (Too Many Requests) 응답이 반환됩니다.
-
429응답을 받으셨다면, 잠시 후 다시 요청해 주세요.
# API Spec

## Common > Members

### GET /common/v1/members

-
멤버 목록을 응답
#### Request

-
Parameters
```
    externalEmailAddresses={},{}    /* 멤버 검색 조건: 외부 이메일, 정확히 일치해야 응답 (like 검색 아님) */
    name={}                         /* 멤버 검색 조건: 사용자 이름 */
    userCode={}                     /* 멤버 검색 조건: 사용자 ID like */
    userCodeExact={}                /* 멤버 검색 조건: 사용자 ID exact match */
    idProviderUserId={}             /* 멤버 검색 조건: SSO 연결한 경우, SSO 가 제공하는 사용자 ID  (예. 사번) */
    page={}                         /* 시작: 0, 기본값: 0 */
    size={}                         /* 기본값: 20, 최댓값: 100 */
```

##### 요청 예제

```
GET /common/v1/members?externalEmailAddresses=hongildong01@xxx.dooray.com,rabbit33@xxx.dooray.com&page=0&size=20
* 사용자의 외부 메일주소와 일치하는 멤버 목록 응답
```

#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": [{
        "id": "{id}",                                           /* Dooray Member Id */
        "name": "{name}",                                       /* 사용자 이름 */
        "userCode": "",                                         /* 사용자 ID */
        "externalEmailAddress": "{extenralEmailAddress}"        /* 외부 이메일 주소 */

    }],
    "totalCount": 1                                             /* 필터 조건에 맞는 전체 아이템 수 */
}
```

-
HTTP 응답코드

-
200
-
400 요청에 externalEmailAddresses (필수 필드) 정보가 없는 경우
-
401
-
403
-
500
-
404 는 없음, 조건에 해당하는 것이 없는 경우 빈 배열 응답
-
externalEmailAddresses 는 필수 인자. 요청에 없는 경우 HTTP 응답코드 400 을 응답.
### GET /common/v1/members/{member-id}

-
멤버 상세 내용 응답
#### Request

-
없음
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": "",                           /* Dooray Member Id */
        "idProviderType": "",               /* sso, service */
        "idProviderUserId": "",
        "name": "",
        "userCode": "",
        "externalEmailAddress": "",
        "defaultOrganization": {
            "id": ""
        },
        "locale": "",
        "timezoneName": "",
        "englishName": "",
        "nativeName": "",
        "nickname": "",
        "displayMemberId": ""
    }
}
```

-
HTTP 응답코드

-
200
-
400 요청에 member-id (필수 필드) 정보가 없는 경우
-
401 권한 에러
-
403 권한 에러
-
404 member-id에 해당하는 멤버가 없는 경우
-
500
``
### GET /common/v1/members/me

-
헤더에 입력한 개인 인증 토큰에 대한 멤버의 정보를 응답합니다.
#### Request

-
없음
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": "",                           /* Dooray Member Id */
        "idProviderType": "",               /* sso, service */
        "idProviderUserId": "",
        "name": "",
        "userCode": "",
        "externalEmailAddress": "",
        "defaultOrganization": {
            "id": ""
        },
        "locale": "",
        "timezoneName": "",
        "englishName": "",
        "nativeName": "",
        "nickname": "",
        "displayMemberId": ""
    }
}
```

-
HTTP 응답코드

-
200 성공
-
401 개인 인증 토큰 에러
-
500 서버 에러
## Common > IncomingHooks

### POST /common/v1/incoming-hooks

-
incoming hook 생성 요청
#### Request

-
Body
```
{
    "name": "",                         /* Dooray 화면에 표시되는 Bot 이름 */
    "serviceType": "",                  /* 서비스타입 gitlab */
    "projectIds": [""]                  /* project-id */
}
```

-
사용가능한서비스 타입

-
github
-
jenkins
-
trello
-
newrelic
-
jira
-
bitbucket
-
ifttt
-
incoming
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": "",                       /* 생성된 incoming hook id */
        "url": ""                       /* 생성된 incoming hook url  예) https://hook.dooray.com/services/.... */
    }
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
500
### GET /common/v1/incoming-hooks/{incoming-hook-id}

-
incoming-hook 정보 하나를 확인
#### Request

-
없음
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": "1",                  /* incoming hook id */
        "name": "gitlab",           /* Dooray 화면에 표시되는 Bot 이름 */
        "serviceType": "gitlab",    /* 서비스타입 */
        "projects": [{
            "id": ""
        }],
        "url": ""                   /* incoming hook url */
    }
}
```

-
HTTP 응답코드

-
200
-
401
-
403
-
404
-
500
### DELETE /common/v1/incoming-hooks/{incoming-hook-id}

#### Request

-
없음
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": null
}
```

-
HTTP 응답코드

-
200
-
401
-
403
-
404
-
500
## Project > Category

프로젝트 카테고리 관련 API
### GET /project/v1/project-categories

프로젝트 카테고리 목록 조회
프로젝트 카테고리 생성은 admin 페이지에 접속하여 추가할 수 있습니다.

-
admin 페이지 > 테넌트 관리 > 프로젝트 > 카테고리 관리
#### Request

-
Parameters

-
없음
#### Response

-
Body
```
{
    "header": {
        "resultCode": 0,
        "resultMessage": "",
        "isSuccessful": true
    },
    "result": [
        {
            "id": "4148669017736732092",
            "parentProjectCategoryId": null,
            "name": "프로젝트 문의",
            "order": 0
        },
        {
            "id": "4148669060715012360",
            "parentProjectCategoryId": "4148669017736732092",
            "name": "CS",
            "order": 0
        }
    ]
}
```

-
HTTP 응답코드

-
200
-
401
-
500
## Project > Projects

-
프로젝트 관련 API
### POST /project/v1/projects

-
프로젝트 생성
#### Request

-
Body
```
{
    "projectCategoryId": "{projectCategoryId}", /* Optional 프로젝트 카테고리 설정시 사용*/
    "code": "",                         /* 화면에 보이는 프로젝트 명 */
    "description": "",
    "scope": "private"                  /* private | public */
}
```

-
요청자가 속한 organization 소속으로 project 를 생성
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": ""
    }
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
409
-
500
### GET /project/v1/projects

-
접근 가능한 프로젝트 목록
#### Request

-
Parameters:
```
  member=me
  page={}           /* 페이지번호(0 base), Default value : 0 */
  size={}           /* 페이지사이즈: 20, 최댓값: 100 */
  type={}           /* private, public (default public) */
  scope={}          /* type이 public인경우, private, public (default private) */
  state={}          /* active,archived */
```

#### Response

```
{
   "header":{
      "isSuccessful":true,
      "resultCode":0,
      "resultMessage":"Success"
   },
   "result":[
      {
         "id":"1",
         "code":"techcenter",
         "description":"기술센터 업무용 프로젝트 입니다.",
         "state": "",
         "scope":"public",
         "type" : "project", /* PUBLIC: 일반 프로젝트, PRIVATE: 개인간 프로젝트 */
         "organization":{
            "id":"1"
         },
         "drive":{
            "id":"1"
         },
         "wiki":{
            "id":"1"
         },
         "projectCategoryId": null  /* nullable 값이 있으면, 카테고리 있는 프로젝트 */
      }
   ],
   "totalCount":1
}
```

-
Parameters

-
member=me

-
내가 속한 프로젝트만 응답
-
state=active, archived

-
프로젝트 상태가 active 또는 archived 인 목록요청
-
state 종류는 다음과 같음: active|archived|deleted
-
scope=private,public

-
프로젝트 접근범위가 private 또는 public인 목록 요청
-
scope 종류는 다음과 같음: private|public

-
private: 프로젝트 멤버만 접근 가능한 프로젝트
-
public: guest가 아닌 org 멤버면 누구나 접근 가능한 프로젝트

-
권한 세부 설정이 필요함
-
type=private,pubilc

-
type=private 이 포함되면 개인 프로젝트를 응답
-
개인 프로젝트가 응답에 포함되는 경우, 항상 제일 처음에 응답됨
-
type 조건이 명시되지 않는 경우 type=public 으로 동작
-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### GET /project/v1/projects/{project-id}

-
프로젝트 한 개의 정보를 확인
#### Request

-
없음
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": "",
        "code": "",
        "description": "",
        "scope": "private",
        "organizationId": "",
        "projectCategoryId": null  /* nullable 값이 있으면, 카테고리 있는 프로젝트 */
    }
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### POST /project/v1/projects/is-creatable

-
프로젝트를 생성할 수 있는 지 확인합니다.
#### Request

```
{
    "code": ""
}
```

-
이미 존재하지 않는 프로젝트여야 합니다.
-
이름이 조건에 맞아야 합니다. (한중일영숫자 특수문자 일부)
#### Response

-
성공
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": null
}
```

-
실패
-
HTTP 응답코드

-
200
-
400 - 조건에 맞지 않는 이름
-
401
-
403
-
404
-
409 - 이미 존재하는 이름
## Project > Projects > Workflows

-
프로젝트 업무 상태 관련 API
### GET /project/v1/projects/{project-id}/workflows

-
{project-id}에 해당하는 프로젝트의 업무 상태를 조회합니다.
#### Request

-
없음
#### Response

```
{
  "header": {
    "resultCode": 0,
    "resultMessage": "",
    "isSuccessful": true
  },
  "result": [
    {
      "id": "1",
      "name": "대기",
      "order": 0,                                   /* 같은 workflow class 내에서의 순서 */
      "names": [
        { "locale": "ko_KR", "name": "대기" },
        { "locale": "en_US", "name": "대기" },
        { "locale": "ja_JP", "name": "대기" },
        { "locale": "zh_CN", "name": "대기" }
      ],
      "class": "backlog"
    },
    {
      "id": "2",
      "name": "등록",
      "order": 100,
      "names": [
        { "locale": "en_US", "name": "To Do" },
        { "locale": "ko_KR", "name": "할 일" },
        { "locale": "zh_CN", "name": "要做" },
        { "locale": "ja_JP", "name": "登録" }
      ],
      "class": "registered"
    },
    {
      "id": "3",
      "name": "진행",
      "order": 200,
      "names": [
        { "locale": "ko_KR", "name": "진행" },
        { "locale": "zh_CN", "name": "进行中" },
        { "locale": "en_US", "name": "Doing" },
        { "locale": "ja_JP", "name": "進行中" }
      ],
      "class": "working"
    },
    {
      "id": "4",
      "name": "완료",
      "order": 400,
      "names": [
        { "locale": "ko_KR", "name": "완료" },
        { "locale": "zh_CN", "name": "完成" },
        { "locale": "en_US", "name": "Done" },
        { "locale": "ja_JP", "name": "完了" }
      ],
      "class": "closed"
    }
  ],
  "totalCount": 4
}
```

-
workflow class 종류

-
backlog: 대기
-
registered: 등록 (= 할 일)
-
working: 진행 중
-
closed: 완료
-
구현 유의사항

-
project-api 응답에선 projectId 가 포함되어 있습니다.
-
projectId 가 응답에 나가지 않도록 해주세요.
-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### POST /project/v1/projects/{project-id}/workflows

-
업무 상태를 추가합니다.
#### Request

```
{
    "name": "완료",                              // 업무 상태 이름
    "order": 400,                                // 정렬 순서
    "names": [                                   // 다국어 설정
        { "locale": "ko_KR", "name": "완료" },
        { "locale": "zh_CN", "name": "完成" },
        { "locale": "en_US", "name": "Done" },
        { "locale": "ja_JP", "name": "完了" }
    ],
    "class": "closed"                            // 업무 상태 class - backlog: 대기, registered: 등록 (= 할 일), working: 진행 중, closed: 완료
}
```

#### Response

```
{
  "header": {
    "resultCode": 0,
    "resultMessage": "",
    "isSuccessful": true
  },
  "result": null
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### PUT /project/v1/projects/{project-id}/workflows/{workflow-id}

-
업무 상태를 수정합니다.
#### Request

```
{
    "name": "완료",                              // 업무 상태 이름
    "order": 400,                                // 정렬 순서
    "names": [                                   // 다국어 설정
        { "locale": "ko_KR", "name": "완료" },
        { "locale": "zh_CN", "name": "完成" },
        { "locale": "en_US", "name": "Done" },
        { "locale": "ja_JP", "name": "完了" }
    ],
    "class": "closed"                            // 업무 상태 class - backlog: 대기, registered: 등록 (= 할 일), working: 진행 중, closed: 완료
}
```

#### Response

```
{
  "header": {
    "resultCode": 0,
    "resultMessage": "",
    "isSuccessful": true
  },
  "result": null
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### POST /project/v1/projects/{project-id}/workflows/{workflow-id}/delete

-
업무 상태를 삭제합니다.
#### Request

```
{
    "toBeWorkflowId": "3629707640373969653"
}
```

-
삭제될 상태로 설정된 업무의 상태를 toBeWorkflowId로 변경합니다.
#### Response

```
{
  "header": {
    "resultCode": 0,
    "resultMessage": "",
    "isSuccessful": true
  },
  "result": null
}
```

-
HTTP 응답코드

-
200
-
401
-
403
-
404
-
500
## Project > Projects > EmailAddress

-
프로젝트 메일 관련 API
### POST /project/v1/projects/{project-id}/email-addresses

-
프로젝트 하위에 이메일 생성
#### Request

-
Body
```
{
    "emailAddress": "",
    "name": ""
}
```

-
emailAddress

-
해당 프로젝트에서 앞으로 수신에 사용할 메일 주소이므로 다음의 제약을 지켜서 생성 요청 해야 함

-
도메인 파트는 해당 테넌트에서 메일 수신 도메인으로 사용할 수 있는 것을 사용해야 함

-
{domain}.dooray.com 혹은 별도 등록한 사용자 메일 도메인
-
로컬 파트는 해당 테넌트에서 다른 곳(아래)에서 현재까지 사용되지 않는 것이어야 함

-
사용자 메일 주소 (alias 포함)
-
다른 프로젝트의 메일주소
-
메신저 대화방에 부여된 메일 주소
-
DL 에 부여된 메일 주소
-
제약사항에 위배되는 경우 HTTP 응답코드 400 응답을 함
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": ""
    }
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
409
-
500
### GET /project/v1/projects/{project-id}/email-addresses/{email-address-id}

-
프로젝트 메일 정보 확인
#### Request

-
없음
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": "",
        "emailAddress": "",
        "name": ""
    }
}
```

## Project > Projects > Tags

-
프로젝트 태그 관련 API
### POST /project/v1/projects/{project-id}/tags

-
프로젝트에 태그 생성
#### Request

-
Body
```
{
    "name": "",
    "color": "ffffff"
}
```

#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": ""
    }
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
409
-
500
### 참고

-
태그 생성

-
{group name}:{tag name}

-
group name 선택사항
-
group name 이 없으면 개별 태그 생성
#### 개별 태그

-
Request Body
```
{
    "name": "myTag",
    "color": "ffffff"
}
```

#### 그룹 태그

-
Request Body
```
{
    "name": "myGroup:myTag1",
    "color": "ffffff"
}
```

-
Request Body
```
{
    "name": "myGroup:myTag2",
    "color": "ffffff"
}
```

### GET /project/v1/projects/{project-id}/tags

#### Request

-
Parameters
```
    page={}       /* 기본값 0 */
    size={}       /* 기본값: 20, 최댓값: 100 */
```

#### Response

-
Body
```
{
    "header": {
        "resultCode": 0,
        "resultMessage": "",
        "isSuccessful": true
    },
    "result": [{
        "id": "1",
        "name": "Q1가입경로: 기타",
        "color": "c6eab3",
        "tagGroup": {
            "id": "",
            "name": "",
            "mandatory": true,
            "selectOne": false
        }
    },{
        "id": "2",
        "name": " 본사권유",
        "color": "c6eab3",
        "tagGroup": null
    }],
    "totalCount": 2
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
404
-
500
-
tagGroup

-
mandatory

-
true인 경우

-
업무등록시 해당 tag group에서 하나이상의 tag가 할당 되어야 함
-
selectOne

-
true인 경우

-
업무등록시 해당 그룹에서 하나의 tag를 할당 되어야 함
-
false인 경우

-
업무등록시 해당 그룹에서 하나 이상의 tag를 할당 되어야 함
### GET /project/v1/projects/{project-id}/tags/{tag-id}

-
프로젝트 태그 정보 확인
#### Request

-
없음
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": "",
        "name": "",
        "color": "ffffff",
        "tagGroup": {
            "id": "",
            "name": "",
            "mandatory": true,
            "selectOne": false
        }
    }
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
404
-
500
### PUT /project/v1/projects/{project-id}/tag-groups/{id}

-
태그 그룹 수정
#### Request

```
{
    "mandatory": true,                  /* 해당 tag 그룹 내의 태그를 필수 태그로 지정 */
    "selectOne": false                  /* 해당 tag 그룹 내의 태그는 하나만 선택 가능 */
}
```

#### Response

```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": null
}
```

## Project > Projects > Milestones

### POST /project/v1/projects/{project-id}/milestones

-
단계 생성
#### Request

```
{
    "name":"단계 1단계",
    "startedAt":"2015-06-22+09:00",
    "endedAt":"2015-08-22+09:00"
}
```

#### Response

```
{
    "header":{
        "isSuccessful":true,
        "resultCode":0,
        "resultMessage":""
    },
    "result":{
        "id":""
    }
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### GET /project/v1/projects/{project-id}/milestones

-
프로젝트 단계 목록 확인
#### Request

-
Parameters
```
    page={}             /* 기본값: 0 */
    size={}             /* 기본값: 20, 최댓값: 100 */
    status={}           /* open | closed */
```

#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": [{
        "id": "1",
        "name": "단계 1단계",
        "status": "open",                             /* open, closed */
        "startedAt": "2019-06-20+09:00",
        "endedAt": "2019-08-25+09:00",
        "closedAt": null,
        "createdAt": "2019-06-20T11:30:00+09:00",
        "updatedAt": "2019-08-20T11:30:00+09:00",
    }],
    "totalCount": "1"
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404 project-id 가 존재하지 않는 경우
-
500
### GET /project/v1/projects/{project-id}/milestones/{milestone-id}

-
단계 상세 조회
#### Request

-
없음
#### Response

```
{
    "header":{
        "isSuccessful":true,
        "resultCode":0,
        "resultMessage":""
    },
    "result":{
        "id":"1",
        "name":"단계 1단계",
        "status":"open",
        "startedAt":"2015-06-20+09:00",
        "endedAt":"2015-08-25+09:00",
        "closedAt":null,
        "createdAt":"2015-06-20T11:30:00+09:00",
        "updatedAt":"2015-08-20T11:30:00+09:00"

    }
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### PUT /project/v1/projects/{project-id}/milestones/{milestone-id}

-
단계 수정
#### Request

```
{
    "name":"단계 2단계",
    "status":"closed",
    "startedAt":"2015-07-22+09:00",
    "endedAt":"2015-08-22+09:00"
}
```

#### Response

```
{
    "header":{
        "isSuccessful":true,
        "resultCode":0,
        "resultMessage":""
    },
    "result":null
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### DELETE /project/v1/projects/{project-id}/milestones/{milestone-id}

-
단계 삭제
#### Request

-
없음
#### Response

```
{
    "header":{
        "isSuccessful":true,
        "resultCode":0,
        "resultMessage":""
    },
    "result":null
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
## Project > Projects > Hooks

-
프로젝트 Hook 에 관련한 API
### POST /project/v1/projects/{project-id}/hooks

-
프로젝트 Hook 생성
#### Request

-
Body
```
{
    "url": "",
    "type": "task",              /* task | project (default: task)*/
    "sendEvents": [ "postCreated", "postCommentCreated", "postTagChanged", "postDueDateChanged", "postWorkflowChanged" ],
    "option": { // Optional.  postCreated, postBodyChanged, postCommentCreated, postCommentUpdated event 에 사용가능
        "body" : {
            "include": false,
            "embedInlineImage": false
        }
    }
}
```

-
type 에 따라 sendEvents 설정할 수 있는 event가 다름

-
task - postCreated, postTagChanged, postWorkflowChanged, postDueDateChanged, postCommentCreated, postSubjectChanged, postBodyChanged, postUserChanged, postMilestoneChanged, postCommentCreated, postParentChanged, postMoved
-
project - stateChanged, codeChanged, memberChanged
-
sendEvents 에는 필요한 이벤트를 등록

-
1개 url 이 여러 이벤트를 모두 받는 것이 가능.
-
option은 postCreated, postBodyChanged, postCommentCreated, postCommentUpdated 이벤트에 사용 가능

-
body.include - true시 hook request body에 body 내용을 포함
-
body.embedInlineImage - true시 인라인 이미지 url을 base64 이미지 형태로 변경 응답
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": ""
    }
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
500
## Project > Projects > Members

-
프로젝트 멤버 관련 API
### POST /project/v1/projects/{project-id}/members

-
프로젝트에 멤버 추가
#### Request

-
Body
```
{
    "organizationMemberId": "",
    "role": "member"                                /* admin | member */
}
```

#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": ""
    }
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
409
-
500
### GET /project/v1/projects/{project-id}/members

-
프로젝트 멤버 확인
#### Request

-
Parameters
```
    page={}                         /* 기본값: 0 */
    size={}                         /* 기본값: 20, 최댓값: 100 */
    roles={project-role-list}       /* admin, member, 디폴트 모두 조회 */
```

#### Response

```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": [{
        "organizationMemberId": "1",
        "role": "admin"             /* admin | member */
    }],
    "totalCount": "1"
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### GET /project/v1/projects/{project-id}/members/{member-id}

-
프로젝트 멤버 확인
#### Request

-
없음
#### Response

```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "organizationMemberId": "1",
        "role": "admin"             /* admin | member | postuser | leaver */
    }
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
## Project > Projects > MemberGroups

-
프로젝트 멤버 그룹 관련 API
### GET /project/v1/projects/{project-id}/member-groups

-
프로젝트 멤버그룹목록 확인
#### Request

```
    page={}         /* 기본값: 0 */
    size={}         /* 기본값: 20, 최댓값: 100 */
```

#### Response

```
{
   "header":{
      "isSuccessful":true,
      "resultCode":0,
      "resultMessage":""
   },
   "result":[
      {
         "id":"1",
         "code":"mygroup",
         "project":{
            "id":"100",
            "code": "project-code"
         },
         "createdAt":"2021-11-25T15:09:31+09:00",
         "updatedAt":"2021-11-25T15:09:31+09:00"
      }
   ]
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### GET /project/v1/projects/{project-id}/member-groups/{member-group-id}

-
프로젝트 멤버그룹 확인
#### Request

*없음
#### Response

```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": "1",
        "code": "mygroup",
        "project": {
            "id": "100",
            "code": "project-code"
        },
        "createdAt": "2021-11-25T15:09:31+09:00",
        "updatedAt": "2021-11-25T15:09:31+09:00",
        "members": [
            {
                "organizationMember": {
                    "id": "1000",
                    "name": ""
                }
            }
        ]
    }
}
```

-
HTTP 응답코드

-
200
-
401
-
403
-
404
-
500
## Project > Projects > Template

### POST /project/v1/projects/{project-id}/templates

-
프로젝트에 업무 템플릿 등록
#### Request

-
Body
```
{
    "templateName": "요건 등록",                /* 필수 필드 */
    "users": {
        "to": [{
            "type": "member",
            "member": {
                "organizationMemberId": "1"
            }
        }, {
            "type": "member",
            "member": {
                "organizationMemberId": "2"
            }
        }, {
            "type": "emailUser",
            "emailUser": {
                "emailAddress": "",
                "name": ""
            }
        }],
        "cc": []
    },
    "body": {
        "mimeType": "text/x-markdown",          /* text/html text/x-markdown */
        "content": ""
    },
    "guide": {                                  /* 템플릿 쓰기 창에서 사용자에게 보여주는 가이드 내용 */
        "mimeType": "text/x-markdown",          /* text/html text/x-markdown */
        "content": ""
    },
    "subject": "템플릿 테스트",
    "dueDate": "2019-09-25T23:59:00+09:00",
    "dueDateFlag": true,
    "milestoneId": "1",                         /* 프로젝트에 속한 단계 중 선택, 단계ID */
    "tagIds": ["1"],                            /* 프로젝트에 속한 Tag 중 선택, TagID 목록 */
    "priority": "none",                         /* hightest, high, normal, low, lowest, none */
    "isDefault": false                          /* 템플릿을 해당 프로젝트의 기본 템플릿으로 할지 결정 */
                                                /* 기본 템플릿은 업무쓰기 창을 열때, 사용자의 별도 선택 없이 템플릿 내용이 바로 채워지는 형태 */
}
```

-
templateName 만 필수 필드, 나머지 필드는 모두 optional
-
dueDate, dueDateFlag 의미

-
일정없음

-
dueDateFlag:false
-
일정이 있으나, 날짜가 미정인 상태

-
dueDateFlag:true dueDate:null
-
일정이 있고, 날짜가 정해진 상태

-
dueDateFlag:true dueDate:2019-04-15T12:34:56+09:00
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": "1"
    }
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### GET /project/v1/projects/{project-id}/templates

-
템플릿 목록 응답 합니다

-
body, guide 등은 포함하지 않습니다.
#### Request

-
Parameters
```
    page={}            /* 기본값: 0 */
    size={}            /* 기본값: 20, 최댓값: 100 */
```

#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": [{
        "id": "",
        "templateName": "템플릿 이름",
        "project": {
            "id": "",
            "code": ""
        },
        "users": {
            "to": [{
                "type": "member",
                "member": {
                    "organizationMemberId": "1",
                }
            },{
                "type": "emailuser",
                "emailuser": {
                    "emailAddress": "",
                    "name": ""
                }
            }],
            "cc": [],
        },
        "subject": "템플릿 테스트",
        "dueDate": "",
        "dueDateFlag": true,
        "milestone": {
            "id": "1",
            "name": ""
        },
        "tags": [{
            "id": "1"
        }],
        "isDefault": true,
        "priority": ""
    }],
    "totalCount": 1
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### GET /project/v1/projects/{project-id}/templates/{template-id}

#### Request

-
Parameters
```
interpolation={}            /* true false(default) */
```

-
interpolation=true 인 경우 ${year} 등의 템플릿 매크로를 치환하여 응답합니다.
#### Response

```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": "",
        "templateName": "템플릿 이름",
        "project": {
            "id": "",
            "code": ""
        },
        "users": {
            "to": [{
                "type": "member",
                "member": {
                    "organizationMemberId": "1",
                }
            },{
                "type": "emailuser",
                "emailuser": {
                    "emailAddress": "",
                    "name": ""
                }
            }],
            "cc": [],
        },
        "body": {
            "mimeType": "text/x-markdown",               /* text/html text/x-markdown */
            "content": ""
        },
        "guide": {
            "mimeType": "text/x-markdown",               /* text/html text/plain text/x-markdown */
            "content": ""
        },
        "subject": "템플릿 테스트",
        "dueDate": "",
        "dueDateFlag": true,
        "milestone": {
            "id": "1",
            "name": ""
        },
        "tags": [{
            "id": "1"
        }],
        "isDefault": true,
        "priority": ""
    }
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### PUT /project/v1/projects/{project-id}/templates/{template-id}

#### Request

-
Body
```
{
    "templateName": "요건 등록",                /* 필수 필드 */
    "users": {
        "to": [{
            "type": "member",
            "member": {
                "organizationMemberId": "1"
            }
        }, {
            "type": "member",
            "member": {
                "organizationMemberId": "2"
            }
        }, {
            "type": "emailUser",
            "emailUser": {
                "emailAddress": "",
                "name": ""
            }
        }],
        "cc": []
    },
    "body": {
        "mimeType": "text/x-markdown",          /* text/html text/x-markdown */
        "content": ""
    },
    "guide": {                                  /* 템플릿 쓰기 창에서 사용자에게 보여주는 가이드 내용 */
        "mimeType": "text/x-markdown",          /* text/html text/x-markdown */
        "content": ""
    },
    "subject": "템플릿 테스트",
    "dueDate": "2019-09-25T23:59:00+09:00",
    "dueDateFlag": true,
    "milestoneId": "1",                         /* 프로젝트에 속한 단계 중 선택, 단계ID */
    "tagIds": ["1"],                            /* 프로젝트에 속한 Tag 중 선택, TagID 목록 */
    "priority": "none",                         /* hightest, high, normal, low, lowest, none */
    "isDefault": false                          /* 템플릿을 해당 프로젝트의 기본 템플릿으로 할지 결정 */
                                                /* 기본 템플릿은 업무쓰기 창을 열때, 사용자의 별도 선택 없이 템플릿 내용이 바로 채워지는 형태 */
}
```

#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": null
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### DELETE /project/v1/projects/{project-id}/templates/{template-id}

#### Request

-
없음
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": null
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
## Project > Posts

-
업무 관리
### GET /project/v1/posts/{post-id}

-
{project-id} 없이 업무 조회
#### Request

-
Parameters

-
없음
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
       "id": "",                                   /* 업무 ID */
       "subject": "",                              /* 업무 제목 */
       "project": {                                /* 업무가 속한 프로젝트 */
           "id": "",                               /* 업무가 속한 프로젝트의 ID */
           "code": ""                              /* 업무가 속한 프로젝트의 명칭 */
       },
       "taskNumber": "",                           /* projectCode/number */
       "closed": false,                            /* 업무 완료 상태 */
       "createdAt": "",                            /* 업무 생성 날짜시간 ISO8601 포맷 */
       "dueDate": "",                              /* 업무 만기 날짜시간 ISO8601 포맷 */
       "dueDateFlag": "",
       "updatedAt": "",                            /* 업무 업데이트 날짜 시간 */
       "number": 1,                                /* 업무 번호. "#{프로젝트명}/{업무번호}" 포맷으로 쓸 때의 {업무번호}. 1 부터 시작 */
       "priority": "",
       "parent": {                                 /* 현재 업무의 상위 업무 */
           "id": "",                               /* 상위업무 ID */
           "number": "",                           /* 상위 업무 번호. 참고 상위-하위 업무 관계는 같은 프로젝트 내에서만 가능 */
           "subject": ""                           /* 상위 업무 제목 */
       },
       "workflowClass": "registered",              /* registered | working | closed  각각 등록 진행중 완료  */
       "workflow": {
           "id": "1",
           "name": "등록"
       },
       "milestone": {                              /*   단계 */
           "id": "1",                              /*   단계 ID */
           "name": "단계"                         /*   단계 이름 */
       },
       "tags": [{                                  /* 업무에 달린 태그의 목록 */
           "id": ""                                /* 태그 ID */
       }],
       "body": {
           "mimeType": "text/x-markdown",          /* 업무 본문의 content type, text/html, text/x-markdown */
           "content": "new body"                   /* 업무 본문 */
       },
       "users": {                                  /* 업무와 연관된 사용자들 */
           "from": {                               /* 업무를 생성한 사람 */
               "type": "member",                   /* (member | emailuser) 프로젝트 멤버가 생성할 수도 있고, 이메일로 생성할 수도 있음 */
               "member": {                         /* 멤버가 생성한 경우 */
                   "organizationmemberid": ""      /* 멤버ID */
               }
           },
           "to": [{                                /* 업무 담당자 목록 */
               "type": "member",                   /* member | emailUser | group */
                                                   /* 업무 담당자는 멤버(member) 또는 이메일주소(emailUser) 또는 프로젝트 그룹(group) 이 될 수 있음 */
               "member": {                         /* 업무 담당자가 멤버인 경우 */
                   "organizationMemberId": ""      /* 멤버 ID */
               },
               "workflow": {
                   "id": "1",
                   "name": "등록"
               }
           },{
               "type": "emailUser",                /* member | emailUser | group */
               "emailUser": {                      /* 업무 담당자에 이메일 주소가 있는 경우 */
                   "emailAddress": "",              /* 이메일 주소 */
                   "name": ""
               },
               "workflow": {
                   "id": "1",
                   "name": "등록"
               }
           }],
           "cc": [{                                /* 업무 참조자 목록 */
               "type": "group",
               "group": {                          /* "프로젝트 그룹(group)" 이 있는 경우 */
                   "projectMemberGroupId": "",     /* 그룹 ID */
                   "members": [{                   /* 그룹에 속한 멤버 목록 */
                       "organizationMemberId": ""  /* 멤버 ID */
                   }]
               }
           }]
       },
      "files": [{
        "id": "",
        "name": "",
        "size": ""
      }]
    }
}
```

-
HTTP 상태 코드

-
200
-
401
-
403
-
404 post-id 가 존재하지 않는 경우
-
500
### POST /project/v1/post-drafts

-
임시 업무 생성
-
생성된 임시 업무 ID 와 URL 을 응답합니다.

-
사용자 브라우저에서 임시 업무를 이어서 쓸 수 있는 쓰기창 URL 이 제공됩니다.
-
URL 에는 도메인은 제공되지 않습니다. 도메인을 붙여서 사용해야 합니다.
#### Request

-
Body
```
{
    "projectId": "3677278773994971294",             /* 프로젝트 id */
    "users": {
        "to": [{                                    /* 업무 담당자 목록 */
            "type": "member",
            "member": {
                "organizationMemberId": "3710916047251229765"
            }
        }, {
            "type": "emailUser",
            "emailUser": {
                "emailAddress": "alencion@alencion.com",
                "name": "123"
            }
        }],
        "cc": [{                                    /* 업무 참조자 목록 */
            "type": "member",
            "member": {
                "organizationMemberId": "2"
            }
        }]
    },
    "subject": "제목을 입력합니다.",                     /* 필수 필드 */
    "body": {
        "mimeType": "text/html",                    /* text/html text/x-markdown */
        "content": "본문을 입력합니다."                  /* 업무 본문 */
    },
    "dueDate": "2019-10-08T18:00:00+09:00",         /* 만기일, null 일 수 있음 */
    "dueDateFlag": true,                            /* 제거 예정 필드. true 로만 사용하기를 권장 */
    "milestoneId": "1",
    "tagIds": ["1", "2"],
    "priority": "none"                              /* highest, high, normal, low, lowest, none */
}
```

#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": "4097351331779866861",
        "url": "/task/write/draft/4097351331779866861"
    }
}
```

-
HTTP 응답코드

-
200
-
401
-
403
-
404
-
500
### POST /project/v1/post-drafts/{post-draft-id}/files

-
임시 업무에 첨부파일 추가
-
파일 관련 API는 다른 API와 동작과정이 다릅니다. 아래 가이드를 참고하시기 바랍니다.

-
참고 가이드
#### Request

-
Header

-
Content-Type: multipart/form-data
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": "4097351331779866861"
    }
}
```

-
HTTP 응답코드

-
200
-
307
-
401
-
403
-
404
-
500
## Project > Projects > Posts

-
프로젝트 업무를 관리
### POST /project/v1/projects/{project-id}/posts

-
프로젝트 내에 업무를 생성
#### Request

-
Body
```
{
    "parentPostId": "1",                            /* 하위업무로 만드는 경우 상위업무의 Id 를 지정 */
    "users": {
        "to": [{                                    /* 업무 담당자 목록 */
            "type": "member",
            "member": {
                "organizationMemberId": "1"
            }
        }, {
            "type": "emailUser",
            "emailUser": {
                "emailAddress": "",
                "name": ""
            }
        }],
        "cc": [{                                    /* 업무 참조자 목록 */
            "type": "member",
            "member": {
                "organizationMemberId": "2"
            }
        }]
    },
    "subject": "제목을 입력합니다.",
    "body": {
        "mimeType": "text/html",                    /* text/html text/x-markdown */
        "content": "본문을 입력합니다."             /* 업무 본문 */
    },
    "dueDate": "2019-10-08T18:00:00+09:00",         /* 만기일, null 일 수 있음 */
    "dueDateFlag": true,                            /* 제거 예정 필드. true 로만 사용하기를 권장 */
    "milestoneId": "1",
    "tagIds": ["1", "2"],
    "priority": "none"                              /* highest, high, normal, low, lowest, none */
}
```

#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": ""
    }
}
```

-
HTTP 응답코드

-
200
-
401
-
403
-
404
-
500
### GET /project/v1/projects/{project-id}/posts

-
업무 목록을 응답합니다.
#### Request

-
Parameters
```
# 페이징 조건
    page={}                                 /* 기본값 0 */
    size={}                                 /* 기본값 20, 최댓값 100 */

# 필터 조건
    fromEmailAddress={}                     /* From 이메일 주소로 업무 필터링 */
    fromMemberIds={organizationMemberId}    /* 특정 멤버가 작성한 업무 목록 */
    toMemberSize=0,1                                      /* 업무 담당자 수 - 아래 설명 참고 */
    toMemberIds={organizationMemberId}      /* 특정 멤버가 담당자인 업무 목록 */
    ccMemberIds={organizationMemberId}      /* 특정 멤버가 참조자인 업무 목록 */
    tagIds={tagId}                          /* 특정 태그가 붙은 업무 목록 */
    parentPostId={postId}                   /* 특정 업무의 하위 업무 목록 */
    postNumber={업무번호}                   /* 특정 업무의 번호 */
    postWorkflowClasses={},{}               /* backlog registered working closed */
    postWorkflowIds={},{}                   /* 해당 프로젝트에 정의된 workflowId 로 필터 */
    milestoneIds={milestoneId},{}           /* 단계 ID 기준 필터 */
    subjects={}                             /* 업무 제목으로 필터 */

    createdAt={DATE_PATTERN}                /* 생성시간 기준 필터 */
    updatedAt={DATE_PATTERN}                /* 업데이트 기준 필터 */
    dueAt={DATE_PATTERN}                    /* 만기시간 기준 필터 */

    {DATE_PATTERN}
        * today                             /* 오늘 */
        * thisweek                          /* 이번 주*/
        * prev-{N}d                         /* 이전 N 일(day) */
        * next-{N}d                         /* 이후 N 일(day) */
        * 2021-01-01T00:00:00+09:00~2021-01-10T00:00:00+09:00

    참고: 시간표현은 ISO8601 을 따릅니다. 한 주의 시작은 월요일로 정합니다.

# 정렬 조건
    order={}                                /* postDueAt        만기일 기준 정렬, 역순 정렬은 `-` 를 앞에 붙임 */
                                            /* postUpdatedAt    업데이트 기준 정렬 */
                                            /* createdAt        업무 생성일 기준 정렬 */
                                            /* 역순 정렬은 조건 앞에 `-` 를 붙임, 예) order=-createdAt */
```

toMemberSize (업무 담당자 수)

-
available values: 0, 1, null

-
0 - 담당자가 없는 업무만 조회
-
1 - toMemberIds와 같이 사용. toMemberIds[0]의 해당 하는 멤버가 혼자 담당인 업무
-
Body

-
없음
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": [{
       "id": "",                                   /* 업무 ID */
       "subject": "",                              /* 업무 제목 */
       "project": {                                /* 업무가 속한 프로젝트 */
           "id": "",                                 /* 업무가 속한 프로젝트의 ID */
           "code": ""                                /* 업무가 속한 프로젝트의 명칭 */
       },
       "taskNumber": "",                           /* projectCode/number */
       "closed": false,                            /* 업무 완료 상태 */
       "createdAt": "",                            /* 업무 생성 날짜시간 ISO8601 포맷 */
       "dueDate": "",                              /* 업무 만기 날짜시간 ISO8601 포맷 */
       "dueDateFlag": "",
       "updatedAt": "",                            /* 업무 업데이트 날짜 시간 */
       "number": 1,                                /* 업무 번호. "#{프로젝트명}/{업무번호}" 포맷으로 쓸 때의 {업무번호}. 1 부터 시작 */
       "priority": "",
       "parent": {                                 /* 현재 업무의 상위 업무 */
           "id": "",                               /* 상위업무 ID */
           "number": "",                           /* 상위 업무 번호. 참고 상위-하위 업무 관계는 같은 프로젝트 내에서만 가능 */
           "subject": ""                           /* 상위 업무 제목 */
       },
       "workflowClass": "working",                 /* registered | working | closed  각각 등록 진행중 완료  */
       "milestone": {                              /* 단계 */
           "id": "",                               /*   단계 ID */
           "name": ""                              /*   단계 이름 */
       },
       "tags": [{                                  /* 업무에 달린 태그의 목록 */
           "id": ""                                /* 태그 ID */
       }],
       "users": {                                  /* 업무와 연관된 사용자들 */
           "from": {                               /* 업무를 생성한 사람 */
               "type": "member",                   /* (member | emailuser) 프로젝트 멤버가 생성할 수도 있고, 이메일로 생성할 수도 있음 */
               "member": {                         /* 멤버가 생성한 경우 */
                   "organizationmemberid": ""      /* 멤버ID */
               }
           },
           "to": [{                                /* 업무 담당자 목록 */
               "type": "member",                   /* member | emailUser | group */
                                                   /* 업무 담당자는 멤버(member) 또는 이메일주소(emailUser) 또는 프로젝트 그룹(group) 이 될 수 있음 */
               "member": {                         /* 업무 담당자가 멤버인 경우 */
                   "organizationMemberId": ""      /* 멤버 ID */
               },
               "workflow": {
                 "id": "1",
                 "name": "등록"
               }
           },{
               "type": "emailUser",                /* member | emailUser | group */
               "emailUser": {                      /* 업무 담당자에 이메일 주소가 있는 경우 */
                   "emailAddress": "",              /* 이메일 주소 */
                   "name": ""
               },
               "workflow": {
                 "id": "1",
                 "name": "등록"
               }
           }],
           "cc": [{                                /* 업무 참조자 목록 */
               "type": "group",
               "group": {                          /* "프로젝트 그룹(group)" 이 있는 경우 */
                   "projectMemberGroupId": "",     /* 그룹 ID */
                   "members": [{                   /* 그룹에 속한 멤버 목록 */
                       "organizationMemberId": ""  /* 멤버 ID */
                   }]
               }
           }]
       },
      "workflow": {
        "id": "",
        "name": ""
      }
    }],
    "totalCount": 10
}
```

-
HTTP 응답코드

-
200
-
401
-
403
-
404
-
500
### GET /project/v1/projects/{project-id}/posts/{post-id}

-
업무 상세 응답.
#### Request

-
Parameters

-
없음
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
       "id": "",                                   /* 업무 ID */
       "subject": "",                              /* 업무 제목 */
       "project": {                                /* 업무가 속한 프로젝트 */
           "id": "",                               /* 업무가 속한 프로젝트의 ID */
           "code": ""                              /* 업무가 속한 프로젝트의 명칭 */
       },
       "taskNumber": "",                           /* projectCode/number */
       "closed": false,                            /* 업무 완료 상태 */
       "createdAt": "",                            /* 업무 생성 날짜시간 ISO8601 포맷 */
       "dueDate": "",                              /* 업무 만기 날짜시간 ISO8601 포맷 */
       "dueDateFlag": "",
       "updatedAt": "",                            /* 업무 업데이트 날짜 시간 */
       "number": 1,                                /* 업무 번호. "#{프로젝트명}/{업무번호}" 포맷으로 쓸 때의 {업무번호}. 1 부터 시작 */
       "priority": "",
       "parent": {                                 /* 현재 업무의 상위 업무 */
           "id": "",                               /* 상위업무 ID */
           "number": "",                           /* 상위 업무 번호. 참고 상위-하위 업무 관계는 같은 프로젝트 내에서만 가능 */
           "subject": ""                           /* 상위 업무 제목 */
       },
       "workflowClass": "registered",              /* registered | working | closed  각각 등록 진행중 완료  */
       "workflow": {
           "id": "1",
           "name": "등록"
       },
       "milestone": {                              /*   단계 */
           "id": "1",                              /*   단계 ID */
           "name": "단계"                         /*   단계 이름 */
       },
       "tags": [{                                  /* 업무에 달린 태그의 목록 */
           "id": ""                                /* 태그 ID */
       }],
       "body": {
           "mimeType": "text/x-markdown",          /* 업무 본문의 content type, text/html, text/x-markdown */
           "content": "new body"                   /* 업무 본문 */
       },
       "users": {                                  /* 업무와 연관된 사용자들 */
           "from": {                               /* 업무를 생성한 사람 */
               "type": "member",                   /* (member | emailuser) 프로젝트 멤버가 생성할 수도 있고, 이메일로 생성할 수도 있음 */
               "member": {                         /* 멤버가 생성한 경우 */
                   "organizationmemberid": ""      /* 멤버ID */
               }
           },
           "to": [{                                /* 업무 담당자 목록 */
               "type": "member",                   /* member | emailUser | group */
                                                   /* 업무 담당자는 멤버(member) 또는 이메일주소(emailUser) 또는 프로젝트 그룹(group) 이 될 수 있음 */
               "member": {                         /* 업무 담당자가 멤버인 경우 */
                   "organizationMemberId": ""      /* 멤버 ID */
               },
               "workflow": {
                   "id": "1",
                   "name": "등록"
               }
           },{
               "type": "emailUser",                /* member | emailUser | group */
               "emailUser": {                      /* 업무 담당자에 이메일 주소가 있는 경우 */
                   "emailAddress": "",              /* 이메일 주소 */
                   "name": ""
               },
               "workflow": {
                   "id": "1",
                   "name": "등록"
               }
           }],
           "cc": [{                                /* 업무 참조자 목록 */
               "type": "group",
               "group": {                          /* "프로젝트 그룹(group)" 이 있는 경우 */
                   "projectMemberGroupId": "",     /* 그룹 ID */
                   "members": [{                   /* 그룹에 속한 멤버 목록 */
                       "organizationMemberId": ""  /* 멤버 ID */
                   }]
               }
           }]
       },
      "files": [{
        "id": "",
        "name": "",
        "size": ""
      }]
    }
}
```

-
HTTP 상태 코드

-
200
-
401
-
403
-
404 project-id, post-id 가 존재하지 않는 경우
-
500
### PUT /project/v1/projects/{project-id}/posts/{post-id}

-
업무 수정.
#### Request

-
Body
```
{
    "users": {
        "to": [{                                    /* 업무 담당자 목록 */
            "type": "member",
            "member": {
                "organizationMemberId": "1"
            }
        }, {
            "type": "emailUser",
            "emailUser": {
                "emailAddress": "",
                "name": ""
            }
        }],
        "cc": [{                                    /* 업무 참조자 목록 */
            "type": "member",
            "member": {
                "organizationMemberId": "2"
            }
        }]
    },
    "subject": "제목을 입력합니다.",
    "body": {
        "mimeType": "text/html",                    /* text/html text/x-markdown */
        "content": "본문을 입력합니다."             /* 업무 본문 */
    },
    "version": 5,                                   /* null인경우 최신 버전으로 적용, version이 명시된 경우 수정하려는 버전과 다른경우 conflict 409 응답 */
    "dueDate": "2019-10-08T18:00:00+09:00",         /* 만기일, null 일 수 있음 */
    "dueDateFlag": true,                            /* 제거 예정 필드. true 로만 사용하기를 권장 */
    "milestoneId": "1",
    "tagIds": ["1", "2"],
    "priority": "none"                              /* hightest, high, normal, low, lowest, none */
}
```

#### Response

-
Body
```
{
    "header": {
        "resultCode": 0,
        "resultMessage": "",
        "isSuccessful": true
    },
    "result": null
}
```

-
HTTP 상태 코드

-
200
-
401
-
403
-
404 project-id, post-id 가 존재하지 않는 경우
-
500
### PUT /project/v1/projects/{project-id}/posts/{post-id}/to/{organization-member-id}

-
담당자(organization-member-id) 1명의 상태를 변경함

-
organization-member-id외에 편의상 "me"를 허용 (요청자)
#### Request

-
Body
```
{
  "workflowId": ""
}
```

#### Response

-
Body
```
{
    "header": {
        "resultCode": 0,
        "resultMessage": "",
        "isSuccessful": true
    },
    "result": null
}
```

-
HTTP 상태 코드

-
200
-
401
-
403
-
404 project-id, post-id 가 존재하지 않는 경우
-
500
### POST /project/v1/projects/{project-id}/posts/{post-id}/set-workflow

-
업무 전체의 상태를 변경
#### Request

-
Body
```
{
  "workflowId": ""
}
```

#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": null
}
```

-
HTTP 상태 코드

-
200
-
401
-
403
-
404 project-id, post-id 가 존재하지 않는 경우
-
500
### POST /project/v1/projects/{project-id}/posts/{post-id}/set-done

-
업무 상태를 완료로 변경

-
업무 완료 클래스내에 workflow 가 여러가지인 경우, 대표 상태로 변경
-
완료 이전으로 되어 있던 담당자들의 상태가 모두 변경됨
#### Request

-
없음
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": null
}
```

-
HTTP 상태 코드

-
200
-
401
-
403
-
404 project-id, post-id 가 존재하지 않는 경우
-
500
### POST /project/v1/projects/{project-id}/posts/{post-id}/set-parent-post

-
{post-id} 업무의 상위 업무 설정
-
계층 구조 설정은 할 수 없습니다. 즉, 상위업무를 가진 하위업무를 상위 업무로 설정할 수 없습니다.
#### Request

-
Body
```
{
    "parentPostId": "1" // 상위 업무로 설정할 업무의 id
}
```

#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "post": {
            "id": ""
        },
        "project": {                                /* 업무가 속한 프로젝트 */
           "id": "",                               /* 업무가 속한 프로젝트의 ID */
        },

    }
}
```

-
HTTP 응답 코드

-
200
-
400
-
401
-
403
-
404
-
500
### POST /project/v1/projects/{project-id}/posts/{post-id}/move

-
다른 프로젝트로 이동

-
단계 및 태그는 정보가 사라짐.
#### Request

-
Body
```
{
    "targetProjectId": "1",         /* 선택필드, 대상 프로젝트, 지정되지 않은경우 동일 프로젝트로 간주 */
    "includeSubPosts": true         /* default: true */
}
```

#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "post": {
            "id": ""
        },
        "project": {                                /* 업무가 속한 프로젝트 */
           "id": "",                               /* 업무가 속한 프로젝트의 ID */
        },

    }
}
```

-
HTTP 응답 코드

-
200
-
400
-
401
-
403
-
404
-
500
### POST /project/v1/projects/{project-id}/posts/{post-id}/files

-
업무 파일 등록
-
파일 관련 API는 다른 API와 동작과정이 다릅니다. 아래 가이드를 참고하시기 바랍니다.

-
참고 가이드
#### Request

-
Header

-
Content-Type: multipart/form-data
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },

    "result": {
       "id": ""
    }
}
```

-
HTTP 상태 코드

-
200
-
307
-
401
-
403
-
404 project-id, post-id 가 존재하지 않는 경우
-
500
### GET /project/v1/projects/{project-id}/posts/{post-id}/files

-
general 타입만 응답
#### Request

-
Parameters

-
없음
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "totalCount": "1",
    "result": [
        {
        "id": "",
        "name": "",
        "size": "",
        "mimeType":"",
        "createdAt": "2014-10-08T19:20:23+09:00",
        "creator": {
            "type": "member",   /* member, emailUser */
            "member": {
                "organizationMemberId": 1
            }
        }
      }
    ]
}
```

-
HTTP 상태 코드

-
200
-
401
-
403
-
404 project-id, post-id 가 존재하지 않는 경우
-
500
-
생성자가 내부 멤버인 경우
```
{
    "creator": {
        "type": "member",
        "member": {
            "organizationMemberId": 1
        }
    }
}
```

-
생성자가 이메일 유저인 경우 (이메일 수신이 댓글로 달리는 경우)
```
{
    "creator": {
        "type": "emailUser",
        "emailUser": {
            "emailAddress": "",
            "name": ""
        }
    }
}
```

### GET /project/v1/projects/{project-id}/posts/{post-id}/files/{file-id}?media=meta

-
파일 상세정보
#### Request

-
Parameters
```
  media=meta        /* 파일의 메타 정보 응답 */
```

#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": "",
        "name": "",
        "size": "",
        "mimeType":"",
        "createdAt": "2014-10-08T19:20:23+09:00",
        "creator": {
            "type": "member",   /* member, emailUser */
            "member": {
                "organizationMemberId": 1
            }
        }
    }
}
```

-
HTTP 상태 코드

-
200
-
401
-
403
-
404 project-id, post-id 가 존재하지 않는 경우
-
500
### GET /project/v1/projects/{project-id}/posts/{post-id}/files/{file-id}?media=raw

-
업무 첨부파일 다운로드
-
파일 관련 API는 다른 API와 동작과정이 다릅니다. 아래 가이드를 참고하시기 바랍니다.

-
참고 가이드
#### Request

-
Parameters
```
  media=raw
```

#### Response

-
파일 다운로드
-
HTTP 상태 코드

-
200
-
307
-
401
-
403
-
404 project-id, post-id 가 존재하지 않는 경우
-
500
### DELETE /project/v1/projects/{project-id}/posts/{post-id}/files/{file-id}

#### Request

-
없음
#### Response

```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": null
}
```

-
HTTP 상태 코드

-
200
-
401
-
403
-
404 project-id, post-id 가 존재하지 않는 경우
-
500
## Project > Projects > Posts > Logs

-
업무 댓글 관련 API
-
mimetype

-
text/x-markdown | text/html 지원
### POST /project/v1/projects/{project-id}/posts/{post-id}/logs

-
업무에 댓글을 생성
#### Request

-
Body
```
{
    "attachFileIds": ["{attach-file-id}"],
    "body": {
        "content": "",
        "mimeType": "text/x-markdown"           /* text/x-markdown | text/html */
    }
}
```

attachFileIds 필드는 업무에 파일 등록 API 요청하시고 응답으로 받은 id 값을 넣어주실 수 있습니다.
#### Response

-
Body
```
{
    "header": {
        "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
    },
    "result": {
        "id": ""
    }
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### GET /project/v1/projects/{project-id}/posts/{post-id}/logs

-
업무 댓글 목록 확인
#### Request

-
Parameters:
```
    page={}             /* 기본값 0 */
    size={}             /* 기본값 20, 최댓값 100 */
    order={}            /* createdAt   기본값,오래된것부터
                          -createdAt  최근것부터
                          존재하지 않을 시 log-id 기준으로 오래된 순 반환
                          */
```

#### Response

```
{
    "header":{
        "isSuccessful":true,
        "resultCode":0,
        "resultMessage":""
    },
    "totalCount":"1",
    "result":[
        {
            "id":"1",
            "post": {
                "id": ""
            },
            "type":"comment",                           /* comment | event */
            "subtype":"general",                        /* general | from_email | sent_email */
            "createdAt":"2014-10-08T19:23:32+09:00",
            "modifiedAt":"2014-10-08T19:23:32+09:00",
            "creator":{
                "type":"member",
                "member":{
                    "organizationMemberId":1
                }
            },
            "mailUsers":{
                "from":{
                    "name":"",
                    "emailAddress":""
                },
                "to":[
                    {
                        "name":"",
                        "emailAddress":""
                    }
                ],
                "cc":[
                    {
                        "name":"",
                        "emailAddress":""
                    }
                ]
            },
            "body":{
                "mimeType":"",
                "content":"최종 기획 확인 바랍니다."
            }
        }
    ]
}
```

-
이벤트 생성자가 내부 멤버인 경우
```
{
    "creator": {
        "type": "member",
        "member": {
            "organizationMemberId": 1
        }
    }
}
```

-
이벤트 생성자가 이메일 유저인 경우 (이메일 수신이 댓글로 달리는 경우)
```
{
    "creator": {
        "type": "emailUser",
        "emailUser": {
            "emailAddress": "",
            "name": ""
        }
    }
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### GET /project/v1/projects/{project-id}/posts/{post-id}/logs/{log-id}

-
업무 댓글 내용을 확인
#### Request

-
없음
#### Response

-
Body
```
{
   "header":{
      "isSuccessful":true,
      "resultCode":0,
      "resultMessage":""
   },
   "result":{
      "id":"",
      "post":{
         "id":""
      },
      "type":"",
      "subtype":"",
      "createdAt":"",
      "creator":{
         "type":"member",
         "member":{
            "organizationMemberId":""
         }
      },
      "mailUsers":{
         "from":{
            "name":"",
            "emailAddress":""
         },
         "to":[
            {
               "name":"",
               "emailAddress":""
            }
         ],
         "cc":[
            {
               "name":"",
               "emailAddress":""
            }
         ]
      },
      "body":{
         "mimeType":"text/html",
         "content":""
      },
      "files": [
        {
          "id": "",
          "name": "",
          "size": 0
        }
      ]
   }
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### PUT /project/v1/projects/{project-id}/posts/{post-id}/logs/{log-id}

-
업무 댓글 수정

-
이메일로 발송된 메일은 수정이 불가능함
#### Request

```
{
    "attachFileIds": ["{attach-file-id}"],
    "body":{
        "mimeType":"",
        "content":"최종 기획 확인 바랍니다."
    }
}
```

attachFileIds 필드는 업무에 파일 등록 API 요청하시고 응답으로 받은 id 값을 넣어주실 수 있습니다.
#### Response

```
{
    "header":{
        "isSuccessful":true,
        "resultCode":0,
        "resultMessage":""
    },
    "result":null
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
### DELETE /project/v1/projects/{project-id}/posts/{post-id}/logs/{log-id}

-
업무 댓글 삭제
#### Request

-
없음
#### Response

```
{
    "header":{
        "isSuccessful":true,
        "resultCode":0,
        "resultMessage":""
    },
    "result":null
}
```

-
HTTP 응답코드

-
200
-
400
-
401
-
403
-
404
-
500
## Project > 업무 Hook 형태

-
업무 변경시 발송되는 훅 형태

-
업무 등록, 댓글 등록, 태그 변경
### 업무 등록

```
{
    "hookEventType": "postCreated",                 /* 업무 생성시 */
    "hookVersion": 2,                               /* hook message format version */
    "post": {
        "id": "",                                   /* 업무 ID */
        "subject": "",                              /* 업무 제목 */
        "createdAt": "",                            /* 업무 생성 날짜시간 ISO8601 포맷 */
        "dueDate": "",                              /* 업무 만기 날짜시간 ISO8601 포맷 */
        "dueDateFlag": "",
        "updatedAt": "",                            /* 업무 업데이트 날짜 시간 */
        "number": 1,                                /* 업무 번호. "#{프로젝트명}/{업무번호}" 포맷으로 쓸 때의 {업무번호}. 1 부터 시작 */
        "priority": "",
        "parent": {                                 /* 현재 업무의 상위 업무 */
            "id": "",                               /* 상위업무 ID */
            "number": "",                           /* 상위 업무 번호. 참고 상위-하위 업무 관계는 같은 프로젝트 내에서만 가능 */
            "subject": ""                           /* 상위 업무 제목 */
        },
        "tags": [{                                  /* 업무에 달린 태그의 목록 */
            "id": "",                               /* 태그 ID */
            "name": "",                             /* 태그 이름 */
        }],
        "body": {
            "mimeType": "text/x-markdown",          /* 업무 본문의 content type, text/html, text/x-markdown */
            "content": "new body"                   /* 업무 본문 */
        },
        "users": {                                  /* 업무와 연관된 사용자들 */
            "from": {                               /* 업무를 생성한 사람 */
                "type": "member",                   /* (member | emailuser) 프로젝트 멤버가 생성할 수도 있고, 이메일로 생성할 수도 있음 */
                "member": {                         /* 멤버가 생성한 경우 */
                    "organizationmemberid": "",     /* 멤버ID */
                    "name": ""                      /* 멤버 이름 */
                }
            },
            "to": [{                                /* 업무 담당자 목록 */
                "type": "member",                   /* member | emailUser | group */
                                                    /* 업무 담당자는 멤버(member) 또는 이메일주소(emailUser) 또는 프로젝트 그룹(group) 이 될 수 있음 */
                "member": {                         /* 업무 담당자가 멤버인 경우 */
                    "organizationMemberId": "",     /* 멤버 ID */
                    "name": ""                      /* 멤버 이름 */
                }
            },{
                "type": "emailUser",                /* member | emailUser | group */
                "emailUser": {                      /* 업무 담당자에 이메일 주소가 있는 경우 */
                    "emailAddress": "",             /* 이메일 주소 */
                    "name": ""                      /* 이름 */
                }
            }],
            "cc": [{                                /* 업무 참조자 목록 */
                "type": "group",
                "group": {                          /* "프로젝트 그룹(group)" 이 있는 경우 */
                    "projectMemberGroupId": "",     /* 그룹 ID */
                    "members": [{                   /* 그룹에 속한 멤버 목록 */
                        "organizationMemberId": "", /* 멤버 ID */
                        "name": ""                  /* 멤버 이름 */
                    }]
                }
            }]
        }
    },
    "tenant": {                                     /* 업무가 속한 테넌트 */
        "id": "",                                   /* 테넌트 ID */
    },
    "project": {                                    /* 업무가 속한 프로젝트 */
        "id": "",                                   /* 업무가 속한 프로젝트의 ID */
        "code": ""                                  /* 업무가 속한 프로젝트의 명칭 */
    },
    "source": {                                     /* 이벤트 생성자 정보 */
        "type": "member",                            /* memeber emailUser 두 가지 타입이 가능 */
        "member": {
            "id": "",
            "name": "",
            "userCode": "",
            "emailAddress": ""
        }
    }
}
```

### 업무 태그 변경

```
{
    "hookEventType": "postTagChanged",              /* 태그 변경시 */
    "hookVersion": 2,                               /* hook message format version */
    "addedTags": [{                                 /* 추가된 태그의 목록 */
        "id": "",                                   /* 태그 ID */
        "name": "",                                 /* 태그 이름 */
    }],
    "removedtags": [{                               /* 삭제된 태그 목록 */
        "id": "",                                   /* 태그 ID */
        "name": "",                                 /* 태그 이름 */
    }],
    "tags": [{                                      /* 태그 변경의 결과로 현재 태그의 목록 */
        "id": "",                                   /* 태그 ID */
        "name": "",                                 /* 태그 이름 */
    }],
    "post": {                                       /* 업무 간략 정보 */
        "id": "",
        "subject": "",
        "number": 1
    },
    "project": {                                    /* 프로젝트 간략 정보 */
        "id": "",
        "code": ""
    },
    "organization": {                               /* 조직 간략 정보 */
        "id": ""
    },
    "tenant": {                                     /* 태넌트 간략 정보 */
        "id": ""
    },
    "source": {                                     /* 이벤트 생성자 정보 */
        "type": "member",
        "member": {
            "id": "",
            "name": "",
            "userCode": "",
            "emailAddress": ""
        }
    }
}
```

### 업무 상태 변경

```
{
    "hookEventType": "postWorkflowChanged",         /* 업무 상태 변경시 */
    "hookVersion": 2,
    "workflow": {                                   /* 변경 후 업무 상태 */
        "id": "",
        "names": [{
            "locale": "",                           /* workflow locale   "ko_KR", "en_US" 등 가능 */
            "name": "",                             /* workflow locale에 맞는 이름  */
        }],
        "class": ""                                 /* backlog, registered, working, closed  순서대로 백로그, 할일, 진행중, 완료 */
    },
    "post": {                                       /* 업무 간략 정보 */
        "id": "",
        "subject": "",
        "number": 1
    },
    "project": {                                    /* 프로젝트 간략 정보 */
        "id": "",
        "code": "",
    },
    "tenant": {                                     /* 테넌트 간략 정보 */
        "id": "",
    },
    "source": {                                     /* 이벤트 생성자 정보 */
        "type": "member",
        "member": {
            "id": "",
            "name": "",
            "userCode": "",
            "emailAddress": ""
        }
    }
}
```

### 업무 만기일 변경

```
{
    "hookEventType": "postDueDateChanged",
    "hookVersion": 2,
    "dueDate": "",                                  /* 변경 후 만기일 일정 */
    "dueDateFlag": "",                              /* 변경 후 만기일 관련 flag */
    "post": {                                       /* 업무 간략 정보 */
        "id": "",
        "subject": "",
        "number": 1
    },
    "project": {                                    /* 프로젝트 간략 정보 */
        "id": "",
        "code": ""
    },
    "tenant": {                                     /* 태넌트 간략 정보 */
        "id": ""
    },
    "source": {                                     /* 이벤트 생성자 정보 */
        "type": "member",
        "member": {
            "id": "",
            "name": "",
            "userCode": "",
            "emailAddress": ""
        }
    }
}
```

-
참고

-
일정없음 - 일정 관리를 하지 않는 업무

-
dueDateFlag: false
-
일정있으나 아직 미정

-
dueDateFlag: true, dueDate: null
-
일정 정해진 경우

-
dueDateFlag: true, dueDate: "2019-04-15T12:34:56+09:00"
### 업무 제목 변경

```
{
    "hookEventType": "postSubjectChanged",
    "hookVersion": 2,
    "subject": "업무 제목",
    "post": {
        "id": "",
        "subject": "",
        "number": 1
    },
    "project": {
        "id": "",
        "code": ""

    },
    "tenant": {
        "id": ""
    },
    "source": {
        "type": "member",
        "member": {
            "id": "",
            "name": "",
            "userCode": "",
            "emailAddress": ""
        }
    }
}
```

### 업무 본문 변경

```
{
    "hookEventType": "postBodyChanged",
    "hookVersion": 2,
    "body": {                               /* 변경 후 본문 */
        "content": "본문",
        "mimeType": "text/plain"
    },
    "post": {
        "id": "",
        "subject": "",
        "number": 1
    },
    "project": {
        "id": "",
        "code": ""
    },
    "tenant": {
        "id": ""
    },
    "source": {
        "type": "member",
        "member": {
            "id": "",
            "name": "",
            "userCode": "",
            "emailAddress": ""
        }
    }
}
```

### 업무 담당자(to), 참조자(cc) 변경

```
{
    "hookEventType": "postUserChanged",
    "hookVersion": 2,
    "users": {                              /* 변경된 후의 최종 상태 */
        "to": [
        ],
        "cc": [
        ]
    },
    "post": {
        "id": "",
        "subject": "",
        "number": 1
    },
    "project": {
        "id": "",
        "code": ""
    },
    "tenant": {
        "id": ""
    },
    "source": {
        "type": "member",
        "member": {
            "id": "",
            "name": "",
            "userCode": "",
            "emailAddress": ""
        }
    }
}
```

### 업무 단계 변경

```
{
    "hookEventType": "postMilestoneChanged",
    "hookVersion": 2,
    "milestone": {                         /* 변경된 후의 단계*/
        "name": "",
        "id": "",
        "status": "open",                  /* open closed */
        "projectId": "",
        "createdAt": "",
        "updatedAt": "",
        "startedAt": "",
        "endedAt": "",
    },
    "post": {
        "id": "",
        "subject": "",
        "number": 1
    },
    "project": {
        "id": "",
        "code": ""
    },
    "tenant": {
        "id": ""
    },
    "source": {
        "type": "member",
        "member": {
            "id": "",
            "name": "",
            "userCode": "",
            "emailAddress": ""
        }
    }
}
```

### 댓글 생성

```
{
    "hookEventType": "postCommentCreated",          /* 업무 댓글 생성시 */
    "hookVersion": 2,                               /* hook message format version */
    "comment": {                                    /* 댓글 */
        "id": "",                                   /* 댓글 ID */
        "subtype": "general",                       /* 댓글 종류 genenal | from_email | sent_email */
        "createdAt": "",                            /* ISO8601 */
        "body": {
            "mimeType": "text/x-markdown",          /* 댓글 내용 mediatype */
            "content": "new comment",               /* 댓글 내용 */
        },
        "creator": {                                /* 댓글 생성자 */
            "type": "member",
            "member": {
                "organizationMemberId": "",
                "name": ""
            }
        },
    },
    "post": {                                       /* 업무 간략 정보 */
        "id": "",
        "subject": "",
        "number": 1
    },
    "project": {                                    /* 프로젝트 간략 정보 */
        "id": "",
        "code": ""
    },
    "organization": {                               /* 조직 간략 정보 */
        "id": ""
    },
    "tenant": {                                     /* 태넌트 간략 정보 */
        "id": ""
    },
    "source": {                                     /* 이벤트 생성자 정보 */
        "type": "emailUser",                         /* memeber emailUser 두 가지 타입이 가능 */
        "emailUser": {
            "name": "",
            "emailAddress": ""
        }
    }

}
```


---

# 파일 업/다운로드 API 동작 과정 (중요)

> 출처: https://helpdesk.dooray.com/share/pages/9wWo-xwiR66BO5LGshgVTg/3817617091196252578
> PoC 검증 완료 (2026-07-04): 업로드/다운로드 모두 307 수동 처리로 성공

## 파일 업/다운로드 API

-
Project > Projects > Posts

-
POST /project/v1/projects/{project-id}/posts/{post-id}/files - 업무에 첨부파일 업로드
-
GET /project/v1/projects/{project-id}/posts/{post-id}/files - 업무의 첨부파일 목록 조회
-
GET /project/v1/projects/{project-id}/posts/{post-id}/files/{file-id}?media=raw - 업무의 첨부파일 다운로드
-
Drive > Drives > Files

-
POST /drive/v1/drives/{drive-id}/files?parentId={} - 드라이브에 파일 업로드
-
GET /drive/v1/drives/{drive-id}/files/{file-id}?media=raw - 드라이브의 파일 다운로드
-
PUT /drive/v1/drives/{drive-id}/files/{file-id}?media=raw - 드라이브의 파일 수정
-
Wiki > Files

-
POST /wiki/v1/wikis/{wiki-id}/pages/{pageId}/files - 위키 페이지에 파일 업로드
-
POST /wiki/v1/wikis/{wikiId}/files - 위키에 파일 업로드
각 API의 상세 사용 방법은 서비스 API 문서를 참고해 주시기 바랍니다.
## 동작 과정

-
서비스 API 문서에 명시된 API 주소로 요청
-
307 응답과 location 헤더의 value(URL)를 확인
-
전달받은 location(URL)로 Authorization, 파일 정보를 포함하여 재요청
### 업로드 예제

1. 서비스 API 문서에 명시된 API 주소로 요청
```
$ curl -X POST 'https://api.dooray.com/project/v1/projects/3718869279517138805/posts/3817609631288388768/files' \
--header 'Authorization: dooray-api {서비스 API token}' \
--form 'file=@"/Users/nhn/image.gif"' \
--include
```

2. 307 응답과 location 헤더의 value(URL)를 확인
```
HTTP/2 307
...
location: https://file-api.dooray.com/uploads/project/v1/projects/3718869279517138805/posts/3817609631288388768/files
```

3. 전달받은 location(URL)로 Authorization, 파일 정보를 포함하여 재요청
```
$ curl -X POST 'https://file-api.dooray.com/uploads/project/v1/projects/3718869279517138805/posts/3817609631288388768/files' \
--header 'Authorization: dooray-api {서비스 API token}' \
--form 'file=@"/Users/nhn/image.gif"'

{"header":{"resultCode":0,"resultMessage":"","isSuccessful":true},"result":{"id":"3817615263301153584"}}
```

-
응답의 result.id 가 업로드된 파일의 ID 입니다.
4. 업무에 첨부파일이 정상 업로드되었는지 확인

### 다운로드 예제

업로드와 마찬가지로 raw 파일 다운로드는 307 리다이렉트를 거칩니다. 위 업로드 예제에서 업로드한 파일을 다시 다운로드하는 경우입니다.
1. 첨부파일 목록을 조회하여 file-id를 확인
```
$ curl -X GET 'https://api.dooray.com/project/v1/projects/3718869279517138805/posts/3817609631288388768/files' \
--header 'Authorization: dooray-api {서비스 API token}'

{"header":{"resultCode":0,"resultMessage":"","isSuccessful":true},"result":[{"id":"3817615263301153584","name":"image.gif","size":12345,"mimeType":"image/gif"}],"totalCount":1}
```

-
result[].id 가 다운로드에 사용할 file-id 입니다. (목록 조회는 리다이렉트 없이 바로 응답)
2. 서비스 API 문서에 명시된 API 주소로 요청
```
$ curl -X GET 'https://api.dooray.com/project/v1/projects/3718869279517138805/posts/3817609631288388768/files/3817615263301153584?media=raw' \
--header 'Authorization: dooray-api {서비스 API token}' \
--include
```

3. 307 응답과 location 헤더의 value(URL)를 확인
```
HTTP/2 307
...
location: https://file-api.dooray.com/downloads/project/v1/projects/3718869279517138805/posts/3817609631288388768/files/3817615263301153584?media=raw
```

4. 전달받은 location(URL)로 Authorization을 포함하여 재요청, 응답 본문을 파일로 저장
```
$ curl -X GET 'https://file-api.dooray.com/downloads/project/v1/projects/3718869279517138805/posts/3817609631288388768/files/3817615263301153584?media=raw' \
--header 'Authorization: dooray-api {서비스 API token}' \
--output image.gif
```

-
--output {파일명} 으로 응답 본문을 파일로 저장합니다.
5. 파일이 정상 다운로드되었는지 확인
## FAQ

1. Authorization 헤더 정보를 포함해서 요청했는데, 401 응답을 받았어요.
-> 자동 리다이렉트 기능이 켜져 있는 경우, 동작 과정 1번 요청 시 자동으로 location 헤더 정보로 재요청을 보내게 됩니다. 이때, Authorization 헤더와 request body를 누락한 채 요청하여 401 응답을 받을 수 있습니다.
예) Postman 자동 리다이렉트 설정 off
2. 매번 location URL로 다시 요청하는 게 번거로워요. (curl)
-> curl에서는 --location-trusted 옵션으로 리다이렉트를 자동으로 따라가면서 Authorization 헤더를 다음 호스트(file-api.dooray.com)까지 유지하여, 한 번의 명령으로 처리할 수 있습니다.
```
$ curl -X GET --location-trusted 'https://api.dooray.com/project/v1/projects/{project-id}/posts/{post-id}/files/{file-id}?media=raw' \
--header 'Authorization: dooray-api {서비스 API token}' \
--output image.gif
```

-
-L / --location 만 사용하면 호스트가 바뀔 때 Authorization 헤더가 제거되어 401 응답을 받습니다. 반드시 --location-trusted 를 사용해야 합니다.
-
