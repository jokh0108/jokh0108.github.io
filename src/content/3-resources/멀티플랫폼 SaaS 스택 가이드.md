# 멀티플랫폼 SaaS 스택 가이드 (웹 + 모바일)

## 🔐 인증/권한

### 서비스 선택: **Supabase Auth + Clerk**
- **Supabase Auth**: 백엔드 인증
- **Clerk**: 프론트엔드 UI + 소셜 로그인
- **이유**: Clerk은 React Native와 웹에서 동일한 API 사용 가능

### 구현 방법:
```typescript
// 웹/앱 공통
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react'
import { ClerkProvider as ClerkNativeProvider } from '@clerk/clerk-expo'

// 소셜 로그인
const providers = ['google', 'apple', 'github']
```

### 권한 관리: **CASL.js**
- 프론트엔드에서 조건부 렌더링
- 백엔드 권한 검증과 동기화

---

## 👥 사용자 관리

### 서비스 선택: **Supabase + Custom Profile API**
- **Supabase**: 기본 사용자 테이블
- **Custom API**: 비즈니스 로직

### 구현:
```sql
-- Supabase 스키마
create table profiles (
  id uuid references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  organization_id uuid,
  role text default 'member'
);
```

---

## 💳 결제/구독

### 서비스 선택: **Stripe + RevenueCat (앱스토어)**
- **Stripe**: 웹 결제 + 구독
- **RevenueCat**: iOS/Android 인앱결제 통합
- **이유**: RevenueCat이 앱스토어별 복잡성을 추상화

### 구현:
```typescript
// 웹
import { loadStripe } from '@stripe/stripe-js'

// 모바일  
import Purchases from 'react-native-purchases'

// 플랜 통합 관리
const subscriptionPlans = {
  free: { stripe: null, revenuecat: null },
  pro: { stripe: 'price_xxx', revenuecat: 'pro_monthly' }
}
```

---

## 🔔 알림 시스템

### 서비스 선택: **Novu + Expo Notifications**
- **Novu**: 통합 알림 플랫폼 (이메일, 푸시, 인앱)
- **Expo Notifications**: React Native 푸시
- **이유**: 하나의 API로 모든 채널 관리

### 구현:
```typescript
// 웹/앱 공통
import { Novu } from '@novu/node'

const novu = new Novu(process.env.NOVU_API_KEY)

// 푸시 전송
await novu.trigger('user-welcome', {
  to: { subscriberId: userId },
  payload: { userName: 'John' }
})
```

---

## 📁 파일 관리

### 서비스 선택: **Supabase Storage + Cloudinary**
- **Supabase Storage**: 기본 파일 저장
- **Cloudinary**: 이미지 최적화/변환
- **이유**: Supabase는 저렴, Cloudinary는 이미지 처리 강력

### 구현:
```typescript
// 업로드 (웹/앱 공통)
const { data, error } = await supabase.storage
  .from('uploads')
  .upload(`${userId}/${fileName}`, file)

// 이미지 최적화 URL
const optimizedUrl = cloudinary.url(publicId, {
  width: 300,
  height: 200,
  crop: 'fill',
  format: 'webp'
})
```

---

## 📧 커뮤니케이션

### 서비스 선택: **Resend + Twilio**
- **Resend**: 이메일 (개발자 친화적)
- **Twilio**: SMS
- **이유**: Resend는 설정 간단, 높은 전달률

### 구현:
```typescript
import { Resend } from 'resend'
import twilio from 'twilio'

// 이메일
const resend = new Resend(process.env.RESEND_API_KEY)
await resend.emails.send({
  from: 'noreply@yourapp.com',
  to: userEmail,
  subject: 'Welcome!',
  react: WelcomeEmail({ userName })
})

// SMS  
const client = twilio(accountSid, authToken)
await client.messages.create({
  body: 'Verification code: 123456',
  from: '+1234567890',
  to: userPhone
})
```

---

## 📊 분석/추적

### 서비스 선택: **PostHog + Sentry**
- **PostHog**: 사용자 행동 분석 + A/B 테스트
- **Sentry**: 오류 추적
- **이유**: PostHog는 오픈소스로 셀프호스팅 가능

### 구현:
```typescript
import posthog from 'posthog-js'
import * as Sentry from '@sentry/react-native'

// 이벤트 추적
posthog.capture('button_clicked', {
  button_name: 'signup',
  page: 'landing'
})

// 오류 추적
Sentry.captureException(new Error('Something went wrong'))
```

---

## 🛡️ 보안/규정준수

### 서비스 선택: **Upstash Redis + Custom GDPR API**
- **Upstash Redis**: 서버리스 레이트 리미팅
- **Custom GDPR**: Supabase 기반 데이터 관리

### 구현:
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s')
})

// API 레이트 리미팅
const { success } = await ratelimit.limit(userEmail)
if (!success) throw new Error('Rate limited')
```

---

## ⚙️ 개발자 경험

### 도구 선택: **Expo + Turborepo + Vercel**
- **Expo**: React Native 개발/배포
- **Turborepo**: 모노레포 관리
- **Vercel**: 웹 배포
- **이유**: 설정 최소화, 빠른 배포

### 프로젝트 구조:
```
my-saas/
├── apps/
│   ├── web/          # Next.js 웹앱
│   ├── mobile/       # Expo 앱
│   └── api/          # 백엔드 API
├── packages/
│   ├── ui/           # 공통 컴포넌트
│   ├── database/     # DB 스키마
│   └── shared/       # 공통 로직
```

---

## 🎨 UI/UX 공통 요소

### 도구 선택: **Tamagui + React Native**
- **Tamagui**: 웹/앱 통합 디자인 시스템
- **React Native Web**: 컴포넌트 재사용
- **이유**: 하나의 컴포넌트로 웹/앱 동시 지원

### 구현:
```typescript
import { Button, YStack } from '@tamagui/core'

// 웹/앱에서 동일하게 동작
export const LoginForm = () => (
  <YStack space="$4" padding="$4">
    <Button onPress={handleLogin}>
      Login
    </Button>
  </YStack>
)
```

---

## 🌍 국제화

### 도구 선택: **i18next + expo-localization**
- **i18next**: 번역 관리
- **expo-localization**: 기기 언어 감지
- **이유**: 웹/앱 동일한 번역 파일 사용

---

## 🚀 마케팅/성장

### 도구 선택: **Next.js + App Store Connect**
- **Next.js**: SEO 최적화 랜딩 페이지
- **App Store Connect**: 앱스토어 최적화
- **Branch.io**: 딥링크 + 추천 추적

---

## 📱 모바일 앱 배포 자동화

### 도구 선택: **EAS Build + Fastlane**
- **EAS Build**: Expo 앱 빌드 서비스
- **Fastlane**: 앱스토어 자동 업로드
- **GitHub Actions**: CI/CD

### 배포 파이프라인:
```yaml
# .github/workflows/mobile-deploy.yml
- name: Build and Submit iOS
  run: |
    eas build --platform ios --auto-submit
    
- name: Build and Submit Android  
  run: |
    eas build --platform android --auto-submit
```

---

## 🎯 권장 개발 순서

1. **Turborepo 설정** + 기본 프로젝트 구조
2. **Supabase** DB 설계 + Auth 설정  
3. **Tamagui** 디자인 시스템 구축
4. **Core 기능** 웹에서 먼저 구현
5. **모바일 앱** 컴포넌트 재사용해서 구축
6. **Stripe/RevenueCat** 결제 연동
7. **배포 자동화** 설정

이 스택으로 **2-3주 안에** 웹/iOS/Android 동시 출시 가능합니다!