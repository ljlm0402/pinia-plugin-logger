<h1 align="center">
  <br>
  <img src="https://github.com/ljlm0402/pinia-plugin-logger/raw/images/logo.png" alt="Project Logo" width="800" />
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

---

## 🧩 Features

- 🍍 Simple and flexible action logger for Pinia

- 🚦 Includes/excludes/filter actions to log

- 💡 Supports custom logger and log style

- 🏷 Store name and timestamp in log title

- 🛡 Error logging with clear visibility

- 🗂 Store-level logger configuration possible

## 🕹Guide

### Install

```js
$ npm install --save pinia-plugin-logger
```

### 📍 Plugin Usage

```js
import { createPinia } from "pinia";
import piniaPluginLogger from "pinia-plugin-logger";

const pinia = createPinia();
const logger = piniaPluginLogger({
  activate: true, // Activate the logger
  expanded: true, // Expand the console group
  store: true, // Show the store name in the console
  timestamp: true, // Show the time of the action in the console
  errors: true, // Show error the console
  include: [], // If defined, only the actions in this list will be logged
  exclude: [], // If defined, the work of this list is excluded
});

pinia.use(logger);

export default pinia;
```

### 💡 Store Level Usage

```js
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++;
    },
  },
  logger: {
    enabled: true,
    expanded: false,
    includeActions: ["increment"],
  },
});
```

## 🛠 Options

| Option         | Type      | Default    | Description                               |
| -------------- | --------- | ---------- | ----------------------------------------- |
| enabled        | boolean   | true       | Activate the logger plugin                |
| expanded       | boolean   | true       | Expand the console group                  |
| showStoreName  | boolean   | true       | Show the store name in the log title      |
| showTimestamp  | boolean   | true       | Show time of action in the log title      |
| showErrors     | boolean   | true       | Show error logs in the console            |
| includeActions | string\[] | \[]        | Only log actions in this list             |
| excludeActions | string\[] | \[]        | Exclude actions in this list              |
| filter         | function  | () => true | Custom filter function for action logging |
| logger         | object    | console    | Custom logger object (log/group support)  |

## 📦 Example Console Output

```sh
action 🍍 [counterStore] increment @15:42:13:123
  prev state    { count: 0 }
  action        { type: 'increment', args: undefined, store: 'counterStore' }
  next state    { count: 1 }
---------------------------------------------------
action 🍍 [userStore] fetchUser @15:43:22:212
  prev state    { loading: false }
  action        { type: 'fetchUser', args: { id: 1 }, store: 'userStore' }
  next state    { loading: true }
---------------------------------------------------
action 🍍 [userStore] fetchUser Failed @15:43:23:221
  prev state    { loading: true }
  action        { type: 'fetchUser', args: { id: 1 }, store: 'userStore', error: Error: Failed to fetch }
  next state    { loading: false }

```

## 📬 Recommended Commit Message

| When             | Commit Message      |
| :--------------- | :------------------ |
| Add Feature      | ✨ Add Feature      |
| Fix Bug          | 🐞 Fix Bug          |
| Refactoring Code | 🛠 Refactoring Code |
| Install Package  | 📦 Install Package  |
| Fix Readme       | 📚 Fix Readme       |
| Update Version   | 🌼 Update Version   |

## 💳 License

[MIT](LICENSE)
