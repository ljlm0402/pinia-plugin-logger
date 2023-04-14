🍍 Logger Plugin for [Pinia](https://pinia.vuejs.org/)

<p align="center">
    <a href="http://npm.im/pinia-plugin-logger" target="_blank">
      <img src="https://img.shields.io/npm/v/pinia-plugin-logger.svg" alt="npm Version" />
    </a>
    <a href="http://npm.im/pinia-plugin-logger" target="_blank">
      <img src="https://img.shields.io/npm/l/pinia-plugin-logger.svg" alt="npm Package License" />
    </a>
    <a href="http://npm.im/pinia-plugin-logger" target="_blank">
      <img src="https://img.shields.io/github/v/release/ljlm0402/pinia-plugin-logger" alt="npm Release Version" />
    </a>
    <a href="http://npm.im/pinia-plugin-logger" target="_blank">
      <img src="https://img.shields.io/npm/dm/pinia-plugin-logger.svg" alt="npm Downloads" />
    </a>
</p>

<br />

## 🕹Guide

### Install

```js
$ npm install --save pinia-plugin-logger
```

### Usage

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

## 📬 Recommended Commit Message

| When             | Commit Message     |
| :--------------- | :----------------- |
| Add Feature      | ✨ Add Feature     |
| Fix Bug          | 🐞 Fix Bug         |
| Refactoring Code | 🛠 Refactoring Code |
| Install Package  | 📦 Install Package |
| Fix Readme       | 📚 Fix Readme      |
| Update Version   | 🌼 Update Version  |

## 💳 License

[MIT](LICENSE)
