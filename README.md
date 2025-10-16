<h1 align="center">
  <br>
  <img src="https://github.com/ljlm0402/pinia-plugin-logger/raw/images/logo.png" alt="Project Logo" width="600" />
  <br>
  <br>
  pinia-plugin-logger
  <br>
</h1>

<h4 align="center">🍍 Logger Plugin for Pinia</h4>

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
  <strong>· English <a href="./README.ko.md">· Korean</a></strong>
</p>

---

## 🧩 Features

- 🍍 **Simple and flexible** action logger for Pinia

- 🚦 **Includes/excludes/filter** actions to log

- 💡 **Supports custom logger** and log style

- 🏷 **Store name and timestamp** in log title

- ⏱️ **Action duration tracking** for performance monitoring

- � **Deep clone support** for accurate nested object tracking

- �🛡 **Error logging** with clear visibility

- 🗂 **Store-level logger configuration** possible

- 🎨 **Visual state change indicators** (✅/⚪/❌)

- 🔧 **State transformer** for sensitive data masking

## 🕹Guide

### Install

```js
$ npm install --save pinia-plugin-logger
```

### 📍 Plugin Usage

```typescript
import { createPinia } from "pinia";
import piniaPluginLogger from "pinia-plugin-logger";

const pinia = createPinia();
const logger = piniaPluginLogger({
  enabled: true,          // Activate the logger
  expanded: true,         // Expand the console group
  showStoreName: true,    // Show the store name in the console
  showTimestamp: true,    // Show the timestamp in the console
  showDuration: true,     // Show action execution time
  showErrors: true,       // Show errors in the console
  deepClone: false,       // Use deep clone for state snapshots
  maxDepth: Infinity,     // Maximum depth for state logging
  includeActions: [],     // Only log these actions (if defined)
  excludeActions: [],     // Exclude these actions from logging
  filter: () => true,     // Custom filter function
  logger: console,        // Custom logger object
  stateTransformer: undefined, // Transform state before logging
});

pinia.use(logger);

export default pinia;
```

### 💡 Store Level Usage

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
      // Async action with duration tracking
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

## 🛠 Options

| Option           | Type                  | Default    | Description                                        |
| ---------------- | --------------------- | ---------- | -------------------------------------------------- |
| enabled          | boolean               | true       | Activate the logger plugin                         |
| expanded         | boolean               | true       | Expand the console group                           |
| showStoreName    | boolean               | true       | Show the store name in the log title               |
| showTimestamp    | boolean               | true       | Show time of action in the log title               |
| showDuration     | boolean               | false      | Show action execution time                         |
| showErrors       | boolean               | true       | Show error logs in the console                     |
| deepClone        | boolean               | false      | Use deep clone for state snapshots (performance impact) |
| maxDepth         | number                | Infinity   | Maximum depth for state logging                    |
| includeActions   | string[]              | []         | Only log actions in this list                      |
| excludeActions   | string[]              | []         | Exclude actions in this list                       |
| filter           | function              | () => true | Custom filter function for action logging          |
| logger           | object                | console    | Custom logger object (log/group support)           |
| stateTransformer | (state: any) => any   | undefined  | Transform state before logging (e.g., mask sensitive data) |
| logLevel         | 'debug' \| 'info' \| 'warn' \| 'error' | 'debug' | Log level (for future use) |

## 📦 Example Console Output

```javascript
// Basic action with state change
action 🍍 [counter] increment @15:42:13:123 (2ms) ✅
  prev state    { count: 0, history: [] }
  action        { type: 'increment', store: 'counter', duration: '2ms' }
  next state    { count: 1, history: [1] }

// Async action with duration tracking
action 🍍 [user] fetchUser @15:43:22:212 (1045ms) ✅
  prev state    { loading: false, data: null }
  action        { type: 'fetchUser', args: { id: 1 }, store: 'user', duration: '1045ms' }
  next state    { loading: false, data: { id: 1, name: 'John' } }

// Action with error
action 🍍 [user] fetchUser @15:43:23:221 (523ms) ❌
  prev state    { loading: true, data: null }
  action        { type: 'fetchUser', args: { id: 1 }, store: 'user', duration: '523ms', error: Error: Failed to fetch }
  next state    { loading: false, data: null }

// Action without state change
action 🍍 [settings] validateInput @15:44:10:456 (1ms) ⚪
  prev state    { valid: true }
  action        { type: 'validateInput', store: 'settings', duration: '1ms' }
  next state    { valid: true }
  ℹ️ No state changes
```

### Visual Indicators

- ✅ **Green**: State changed successfully
- ⚪ **Gray**: No state changes
- ❌ **Red**: Error occurred

## 🎯 Advanced Usage

### Deep Clone for Nested Objects

```typescript
const logger = piniaPluginLogger({
  deepClone: true,    // Enable deep cloning
  maxDepth: 5,        // Limit depth to 5 levels
});
```

**Benefits**: Accurately tracks changes in nested objects, arrays, Maps, and Sets.
**Trade-off**: Slightly slower performance (recommended for development only).

### State Transformer for Sensitive Data

```typescript
const logger = piniaPluginLogger({
  stateTransformer: (state) => {
    // Mask sensitive information
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

### Conditional Logging

```typescript
const logger = piniaPluginLogger({
  // Only in development
  enabled: import.meta.env.DEV,
  
  // Only log specific actions
  includeActions: ['increment', 'fetchUser'],
  
  // Or exclude specific actions
  excludeActions: ['debugAction'],
  
  // Custom filter
  filter: (action) => {
    // Only log when count > 10
    return action.store.$state.count > 10;
  }
});
```

### Performance Monitoring

```typescript
const logger = piniaPluginLogger({
  showDuration: true,
  filter: (action) => {
    // Log only slow actions (> 100ms)
    const startTime = Date.now();
    action.after(() => {
      const duration = Date.now() - startTime;
      return duration > 100;
    });
  }
});
```

## 📂 Examples

Check out the [example app](./examples/vue-app) for a complete demonstration of all features:

```bash
cd examples/vue-app
pnpm install
pnpm run dev
```

Features demonstrated:
- Basic counter with state tracking
- Async actions with duration measurement
- Nested object mutations (deep clone)
- Error handling
- History tracking

## ⚠️ Production Usage

**Important**: Disable the logger in production to avoid performance overhead.

```typescript
const logger = piniaPluginLogger({
  enabled: import.meta.env.DEV, // Only in development
});
```

Or use conditional plugin registration:

```typescript
const pinia = createPinia();

if (import.meta.env.DEV) {
  pinia.use(piniaPluginLogger());
}
```

## 🏗 TypeScript Support

This plugin comes with full TypeScript support:

```typescript
import type { PiniaLoggerOptions } from 'pinia-plugin-logger';

const loggerOptions: PiniaLoggerOptions = {
  enabled: true,
  deepClone: true,
  // ... with autocomplete and type checking
};
```

## 🤝 Contributing

Contributions are always welcome! Please feel free to open an issue or submit a pull request.

## 💳 License

[MIT](LICENSE)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ljlm0402">AGUMON</a> 🦖
</p>
