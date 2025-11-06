# Security Scheme 스웨거 UI 비교

# security Scheme란

- API를 호출할 때 어떤 인증이나 권한이 필요한지 정의하는 부분

# OpenAPI Security Scheme 전체 요약표

| Security 타입 | 세부 옵션 / 규칙 | 설명 | 요청 예시 | 3.0.3 지원여부 | 3.1.0 지원여부 |
| --- | --- | --- | --- | --- | --- |
| **`apiKey`** | `in` | API 키를 전달하는 위치를 지정합니다. (`header`, `query`, `cookie`) | `GET /endpoint?api_key=1234` | **O** | **O** |
|  | `name` | 키의 이름(식별자)을 지정합니다. (예: `X-API-KEY`, `api_key`) | `Header: X-API-KEY: 1234` | **O** | **O** |
| **`http`** | `scheme` | 사용할 HTTP 인증 스킴을 지정합니다. |  | **O** | **O** |
|  | ➡️ `basic` | **Basic Authentication** (Base64 인코딩된 `ID:PW`) | `Authorization: Basic dXNlcjpwYXNz` | **O** | **O** |
|  | ➡️ `bearer` | **Bearer Token** 인증 (주로 JWT 사용) | `Authorization: Bearer <token>` | **O** | **O** |
|  | `bearerFormat` | Bearer 토큰의 형식을 명시하는 힌트입니다. (예: `JWT`, 문서용) | - | **O** | **O** |
|  | ➡️ `digest` 등 | 기타 IANA 표준 HTTP 인증 스킴 (Digest, HOBA 등) | `Authorization: Digest username="user", ...` | **O** | **O** |
| **`oauth2`** | `flows` | 사용할 OAuth2 플로우 객체를 정의합니다. | - | **O** | **O** |
|  | ➡️ `authorizationCode` | 인증 코드 그랜트 플로우 | `Authorization: Bearer <oauth_token>` | **O** | **O** |
|  | ➡️ `implicit` | 암시적 그랜트 플로우 (레거시) | `Authorization: Bearer <oauth_token>` | **O** | **O** |
|  | ➡️ `password` | 리소스 소유자 암호 자격증명 플로우 (비권장) | `Authorization: Bearer <oauth_token>` | **O** | **O** |
|  | ➡️ `clientCredentials` | 클라이언트 자격증명 플로우 | `Authorization: Bearer <oauth_token>` | **O** | **O** |
| **`openIdConnect`** | `openIdConnectUrl` | OpenID Provider의 Discovery 문서 URL을 지정합니다. | `Authorization: Bearer <id_token>` | **O** | **O** |
| **`mutualTLS`** | - | **상호 TLS 인증**. 클라이언트 인증서를 통해 인증합니다. | HTTPS 요청 + 클라이언트 인증서 필수<br>(예: `curl --cert c.crt --key c.key ...`) | **X**<br>(`http` 타입의<br>설명으로만<br>문서화 가능) | **O**<br>(공식 타입) |

# 3.0.3 security Scheme JSON 예시

```jsx
{
  "openapi": "3.0.3",
  "info": {
    "title": "Full Security Example API",
    "version": "1.0.0"
  },
  "security": [{ "BearerAuth": [] }],
  "paths": {
    "/example": {
      "get": {
        "summary": "Endpoint demonstrating all security schemes",
        "description": "Shows how to use apiKey, basic, bearer, oauth2, openIdConnect, mutualTLS",
        "security": [
          { "ApiKeyHeader": [] },
          { "ApiKeyQuery": [] },
          { "BasicAuth": [] },
          { "BearerAuth": [] },
          { "OAuth2Auth": ["read", "write"] },
          { "OpenIDAuth": [] }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "ApiKeyHeader": {
        "type": "apiKey",
        "in": "header",
        "name": "X-API-KEY"
      },
      "ApiKeyQuery": {
        "type": "apiKey",
        "in": "query",
        "name": "api_key"
      },
      "BasicAuth": {
        "type": "http",
        "scheme": "basic"
      },
      "BearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      },
      "OAuth2Auth": {
        "type": "oauth2",
        "flows": {
          "authorizationCode": {
            "authorizationUrl": "https://example.com/oauth/authorize",
            "tokenUrl": "https://example.com/oauth/token",
            "scopes": {
              "read": "Grants read access",
              "write": "Grants write access"
            }
          },
          "clientCredentials": {
            "tokenUrl": "https://example.com/oauth/token",
            "scopes": {
              "read": "Grants read access"
            }
          }
        }
      },
      "OpenIDAuth": {
        "type": "openIdConnect",
        "openIdConnectUrl": "https://example.com/.well-known/openid-configuration"
      }
    }
  }
}
```

# 3.1.0 security Scheme JSON 예시

```jsx
{
  "openapi": "3.1.0",
  "info": {
    "title": "Full Security Example API",
    "version": "1.0.0"
  },
  "security": [{ "BearerAuth": [] }],
  "paths": {
    "/example": {
      "get": {
        "summary": "Endpoint demonstrating OR security schemes",
        "description": "Shows how to use any one of the available security schemes.",
        "security": [
          { "ApiKeyHeader": [] },
          { "ApiKeyQuery": [] },
          { "ApiCookieAuth": [] },
          { "BasicAuth": [] },
          { "BearerAuth": [] },
          { "OAuth2Auth": ["read", "write"] },
          { "OpenIDAuth": [] },
          { "MutualTLSAuth": [] }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/and-example": {
      "get": {
        "summary": "Endpoint demonstrating AND security",
        "description": "Shows how to require multiple security schemes at once (OAuth2 AND ApiKey).",
        "security": [
          {
            "OAuth2Auth": ["write"],
            "ApiKeyHeader": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "ApiKeyHeader": {
        "type": "apiKey",
        "in": "header",
        "name": "X-API-KEY"
      },
      "ApiKeyQuery": {
        "type": "apiKey",
        "in": "query",
        "name": "api_key"
      },
      "ApiCookieAuth": {
        "type": "apiKey",
        "in": "cookie",
        "name": "session_id"
      },
      "BasicAuth": {
        "type": "http",
        "scheme": "basic"
      },
      "BearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      },
      "OAuth2Auth": {
        "type": "oauth2",
        "flows": {
          "authorizationCode": {
            "authorizationUrl": "https://example.com/oauth/authorize",
            "tokenUrl": "https://example.com/oauth/token",
            "scopes": {
              "read": "Grants read access",
              "write": "Grants write access"
            }
          },
          "clientCredentials": {
            "tokenUrl": "https://example.com/oauth/token",
            "scopes": {
              "read": "Grants read access"
            }
          },
          "implicit": {
            "authorizationUrl": "https://example.com/oauth/authorize",
            "scopes": {
              "read": "Grants read access",
              "write": "Grants write access"
            }
          },
          "password": {
            "tokenUrl": "https://example.com/oauth/token",
            "scopes": {
              "read": "Grants read access",
              "write": "Grants write access"
            }
          }
        }
      },
      "OpenIDAuth": {
        "type": "openIdConnect",
        "openIdConnectUrl": "https://example.com/.well-known/openid-configuration"
      },
      "MutualTLSAuth": {
        "type": "mutualTLS"
      }
    }
  }
}
```

### **특징**

- security는 엔드포인트 하나당 넣을 수 도 있지만 global로도 넣을 수 있다

# UI적인 특징

1. components안에 securitySchemes안에 정의된 것을 기준으로 Authorize에 정의가 된다
- **apiKey** → 내부 API, 간단한 인증
- **Bearer(JWT)** → 현대적인 REST API 인증 표준
- **OAuth2** → 외부 서비스 연동, 사용자 위임 권한
- **OpenID Connect** → 로그인/프로필 연동
- **Mutual TLS** → 금융/정부 등 고보안 환경

# 스웨거에서 security

![image.png](Security%20Scheme%20%EC%8A%A4%EC%9B%A8%EA%B1%B0%20UI%20%EB%B9%84%EA%B5%90%2025a3bf1cfda180fba18ecba4abe7c2d1/image.png)

- 이런식으로 하나씩의 scurity마다 input값이 있다

![image.png](Security%20Scheme%20%EC%8A%A4%EC%9B%A8%EA%B1%B0%20UI%20%EB%B9%84%EA%B5%90%2025a3bf1cfda180fba18ecba4abe7c2d1/image%201.png)

- OAuth의 경우에는 조금 더 다른 모습으로 정의가 되어있다

![image.png](Security%20Scheme%20%EC%8A%A4%EC%9B%A8%EA%B1%B0%20UI%20%EB%B9%84%EA%B5%90%2025a3bf1cfda180fba18ecba4abe7c2d1/image%202.png)

- 따로 api에는 인증 관련 ui변환는 없다

# api 헤더

## **1️⃣apiKey**

- 보통 Header, Query, Cookie 중 한 곳에 들어감 (OpenAPI 정의에 따라 다름).
- 예: in: header, name: X-API-KEY 라면:

```jsx
GET /endpoint HTTP/1.1
Host: api.example.com
X-API-KEY: 1234
```