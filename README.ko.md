<h1 align="center">
  <br>
  <img src="https://github.com/ljlm0402/pinia-plugin-logger/raw/images/logo.png" alt="Project Logo" width="600" />
  <br>
  <br>
  pinia-plugin-logger
  <br>
</h1>

<h4 align="center">🍍 Pinia를 위한 로거 플러그인</h4>

<p align ="center">
    <a href="https://nodei.co/npm/pinia-plugin-logger" target="_blank">
    <img src="https://nodei.co/npm/pinia-plugin-logger.png" alt="npm Info" />
</a>

</p>

<p align="center">
    <a href="http://npm.im/pinia-plugin-logger" target="_blank">
      <img src="https://img.shields.io/npm/v/pinia-plugin-logger.svg" alt="npm Version" />
    </a>
    <a href="http://npm.im/pinia-plugin-logger" target="_blank">
      <img src="https://img.shields.io/github/v/release/ljlm0402/pinia-plugin-logger" alt="npm Release Version" />
    </a>
    <a href="http://npm.im/pinia-plugin-logger" target="_blank">
      <img src="https://img.shields.io/npm/dm/pinia-plugin-logger.svg" alt="npm Downloads" />
    </a>
    <a href="http://npm.im/pinia-plugin-logger" target="_blank">
      <img src="https://img.shields.io/npm/l/pinia-plugin-logger.svg" alt="npm Package License" />
    </a>
</p>

<p align="center">
  <a href="https://github.com/ljlm0402/pinia-plugin-logger/stargazers" target="_blank">
    <img src="https://img.shields.io/github/stars/ljlm0402/pinia-plugin-logger" alt="github Stars" />
  </a>
  <a href="https://github.com/ljlm0402/pinia-plugin-logger/network/members" target="_blank">
    <img src="https://img.shields.io/github/forks/ljlm0402/pinia-plugin-logger" alt="github Forks" />
  </a>
  <a href="https://github.com/ljlm0402/pinia-plugin-logger/stargazers" target="_blank">
    <img src="https://img.shields.io/github/contributors/ljlm0402/pinia-plugin-logger" alt="github Contributors" />
  </a>
  <a href="https://github.com/ljlm0402/pinia-plugin-logger/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/ljlm0402/pinia-plugin-logger" alt="github Issues" />
  </a>
</p>

<p align="center">
    <strong><a href="./README.md">English</a> · 한국어</strong>
</p>

---

## 🧩 주요 기능

- 🍍 **간단하고 유연한** Pinia 액션 로거

- 🚦 액션 로깅을 위한 **포함/제외/필터** 기능

- 💡 **커스텀 로거** 및 로그 스타일 지원

- 🏷 로그 제목에 **스토어 이름과 타임스탬프** 표시

- ⏱️ 성능 모니터링을 위한 **액션 실행 시간 추적**

- 🔍 정확한 중첩 객체 추적을 위한 **깊은 복사 지원**

- 🛡 명확한 가시성을 가진 **에러 로깅**

- 🗂 **스토어별 로거 설정** 가능

- 🎨 **시각적 상태 변경 표시** (✅/⚪/❌)

- 🔧 민감한 데이터 마스킹을 위한 **상태 변환 함수**

## 🕹 가이드

### 설치

```bash
npm install --save pinia-plugin-logger
```

### 📍 플러그인 사용법

```typescript
import { createPinia } from "pinia";
import piniaPluginLogger from "pinia-plugin-logger";

const pinia = createPinia();
const logger = piniaPluginLogger({
  enabled: true,          // 로거 활성화
  expanded: true,         // 콘솔 그룹 펼치기
  showStoreName: true,    // 콘솔에 스토어 이름 표시
  showTimestamp: true,    // 콘솔에 타임스탬프 표시
  showDuration: true,     // 액션 실행 시간 표시
  showErrors: true,       // 콘솔에 에러 표시
  deepClone: false,       // 상태 스냅샷에 깊은 복사 사용
  maxDepth: Infinity,     // 상태 로깅 최대 깊이
  includeActions: [],     // 이 액션들만 로깅 (정의된 경우)
  excludeActions: [],     // 로깅에서 제외할 액션들
  filter: () => true,     // 커스텀 필터 함수
  logger: console,        // 커스텀 로거 객체
  stateTransformer: undefined, // 로깅 전 상태 변환
});

pinia.use(logger);

export default pinia;
```

### 💡 스토어 레벨 사용법

```typescript
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({ 
    count: 0,
    user: {
      name: "Guest",
      preferences: { theme: "light" }
    }
  }),
  actions: {
    increment() {
      this.count++;
    },
    async fetchData() {
      // 실행 시간 추적이 가능한 비동기 액션
      await fetch('/api/data');
    }
  },
  logger: {
    enabled: true,
    expanded: false,
    showDuration: true,
    deepClone: true,
    includeActions: ["increment", "fetchData"],
  },
});
```

## 🛠 옵션

| 옵션             | 타입                  | 기본값     | 설명                                               |
| ---------------- | --------------------- | ---------- | -------------------------------------------------- |
| enabled          | boolean               | true       | 로거 플러그인 활성화                               |
| expanded         | boolean               | true       | 콘솔 그룹 펼치기                                   |
| showStoreName    | boolean               | true       | 로그 제목에 스토어 이름 표시                       |
| showTimestamp    | boolean               | true       | 로그 제목에 액션 시간 표시                         |
| showDuration     | boolean               | false      | 액션 실행 시간 표시                                |
| showErrors       | boolean               | true       | 콘솔에 에러 로그 표시                              |
| deepClone        | boolean               | false      | 상태 스냅샷에 깊은 복사 사용 (성능 영향 있음)     |
| maxDepth         | number                | Infinity   | 상태 로깅 최대 깊이                                |
| includeActions   | string[]              | []         | 이 목록의 액션만 로깅                              |
| excludeActions   | string[]              | []         | 이 목록의 액션 제외                                |
| filter           | function              | () => true | 액션 로깅을 위한 커스텀 필터 함수                  |
| logger           | object                | console    | 커스텀 로거 객체 (log/group 지원)                  |
| stateTransformer | (state: any) => any   | undefined  | 로깅 전 상태 변환 (예: 민감한 데이터 마스킹)       |
| logLevel         | 'debug' \| 'info' \| 'warn' \| 'error' | 'debug' | 로그 레벨 (향후 사용) |

## 📦 콘솔 출력 예시

```javascript
// 상태 변경이 있는 기본 액션
action 🍍 [counter] increment @15:42:13:123 (2ms) ✅
  prev state    { count: 0, history: [] }
  action        { type: 'increment', store: 'counter', duration: '2ms' }
  next state    { count: 1, history: [1] }

// 실행 시간 추적이 있는 비동기 액션
action 🍍 [user] fetchUser @15:43:22:212 (1045ms) ✅
  prev state    { loading: false, data: null }
  action        { type: 'fetchUser', args: { id: 1 }, store: 'user', duration: '1045ms' }
  next state    { loading: false, data: { id: 1, name: 'John' } }

// 에러가 있는 액션
action 🍍 [user] fetchUser @15:43:23:221 (523ms) ❌
  prev state    { loading: true, data: null }
  action        { type: 'fetchUser', args: { id: 1 }, store: 'user', duration: '523ms', error: Error: Failed to fetch }
  next state    { loading: false, data: null }

// 상태 변경이 없는 액션
action 🍍 [settings] validateInput @15:44:10:456 (1ms) ⚪
  prev state    { valid: true }
  action        { type: 'validateInput', store: 'settings', duration: '1ms' }
  next state    { valid: true }
  ℹ️ No state changes
```

### 시각적 표시

- ✅ **녹색**: 상태가 성공적으로 변경됨
- ⚪ **회색**: 상태 변경 없음
- ❌ **빨간색**: 에러 발생

## 🎯 고급 사용법

### 중첩 객체를 위한 깊은 복사

```typescript
const logger = piniaPluginLogger({
  deepClone: true,    // 깊은 복사 활성화
  maxDepth: 5,        // 깊이를 5단계로 제한
});
```

**장점**: 중첩된 객체, 배열, Map, Set의 변경 사항을 정확하게 추적합니다.
**트레이드오프**: 약간 느린 성능 (개발 환경에서만 사용 권장).

### 민감한 데이터를 위한 상태 변환

```typescript
const logger = piniaPluginLogger({
  stateTransformer: (state) => {
    // 민감한 정보 마스킹
    if (state.user?.password) {
      return {
        ...state,
        user: { ...state.user, password: '***' }
      };
    }
    return state;
  }
});
```

### 조건부 로깅

```typescript
const logger = piniaPluginLogger({
  // 개발 환경에서만
  enabled: import.meta.env.DEV,
  
  // 특정 액션만 로깅
  includeActions: ['increment', 'fetchUser'],
  
  // 또는 특정 액션 제외
  excludeActions: ['debugAction'],
  
  // 커스텀 필터
  filter: (action) => {
    // count가 10보다 클 때만 로깅
    return action.store.$state.count > 10;
  }
});
```

### 성능 모니터링

```typescript
const logger = piniaPluginLogger({
  showDuration: true,
  filter: (action) => {
    // 느린 액션만 로깅 (> 100ms)
    const startTime = Date.now();
    action.after(() => {
      const duration = Date.now() - startTime;
      return duration > 100;
    });
  }
});
```

## 📂 예제

모든 기능의 완전한 데모는 [예제 앱](./examples/vue-app)을 확인하세요:

```bash
cd examples/vue-app
pnpm install
pnpm run dev
```

데모 기능:
- 상태 추적이 있는 기본 카운터
- 실행 시간 측정이 있는 비동기 액션
- 중첩 객체 변경 (깊은 복사)
- 에러 처리
- 히스토리 추적

## ⚠️ 프로덕션 사용

**중요**: 성능 오버헤드를 피하기 위해 프로덕션에서는 로거를 비활성화하세요.

```typescript
const logger = piniaPluginLogger({
  enabled: import.meta.env.DEV, // 개발 환경에서만
});
```

또는 조건부 플러그인 등록 사용:

```typescript
const pinia = createPinia();

if (import.meta.env.DEV) {
  pinia.use(piniaPluginLogger());
}
```

## 🏗 TypeScript 지원

이 플러그인은 완전한 TypeScript 지원과 함께 제공됩니다:

```typescript
import type { PiniaLoggerOptions } from 'pinia-plugin-logger';

const loggerOptions: PiniaLoggerOptions = {
  enabled: true,
  deepClone: true,
  // ... 자동 완성과 타입 체크
};
```

## 🤝 기여하기

기여는 언제나 환영합니다! 이슈를 열거나 풀 리퀘스트를 제출해 주세요.

## 💳 라이선스

[MIT](LICENSE)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ljlm0402">AGUMON</a> 🦖
</p>
