---
title: "逆向工程：AArch64 (ARM64) 汇编指令集与反调试绕过备忘录"
date: "2026-02-18"
category: "逆向工程"
tags: ["ARM64", "Assembly", "Reverse", "Anti-Debug", "Frida"]
summary: "整理 ARM64 寄存器体系、常用寻址与跳转指令，并总结基于 ptrace 与 /proc/self/status 痕迹检测的反调试绕过策略。"
---

在移动端安全评估与二进制逆向分析中，熟练阅读 ARM64 (AArch64) 汇编指令是破解加固壳与分析核心算法的必修课。

## 1. 核心通用寄存器布局

- `X0` - `X7`：参数传递与返回值（`X0` 通常承载函数返回值）；
- `X8`：间接结果位置寄存器（返回大结构体时使用）；
- `X9` - `X15`：临时寄存器（调用者保存 Caller-saved）；
- `X19` - `X28`：被调用者保存寄存器（Callee-saved）；
- `X29` (FP)：栈帧基址指针；
- `X30` (LR)：函数返回链接寄存器；
- `SP`：栈顶指针；
- `XZR` / `WZR`：零寄存器（读永远为 0，写被丢弃）。

## 2. 常见反调试机制与 Frida 绕过代码

在 Linux / Android 平台下，应用通常调用 `ptrace(PTRACE_TRACEME, ...)` 阻止附加调试。可通过 Frida 脚本对 libc 函数进行 Hook 拦截：

```javascript
// Frida 绕过 ptrace 自身调试检测
Interceptor.attach(Module.findExportByName(null, "ptrace"), {
  onEnter: function (args) {
    const request = args[0].toInt32();
    if (request === 0) { // PTRACE_TRACEME
      console.log("[+] Intercepted ptrace(PTRACE_TRACEME), bypassing...");
      this.isTraceMe = true;
    }
  },
  onLeave: function (retval) {
    if (this.isTraceMe) {
      retval.replace(0); // 伪造返回成功 0
    }
  }
});
```
