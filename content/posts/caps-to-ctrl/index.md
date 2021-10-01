---
date: 2020-12-18T08:00:00Z
lastmod: 2020-12-18T08:00:00Z
author: "shiomiya"
title: "CapsLock を Ctrl として機能させる (Windows10)"
tags: ["windows10","memo"]
categories: etc
---

毎回毎回調べていて面倒だったのでメモ。

Windows10 で忌まわしい CapsLock を Ctrl に書き換えるスクリプト。

```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout]
"Scancode Map"=hex:00,00,00,00,00,00,00,00,02,00,00,00,1d,00,3a,00,00,00,00,00
```

- [caps2ctrl.reg](https://gist.githubusercontent.com/shiomiyan/554d01e4b1276a2d2d3009bcb0eddf94/raw/ccf2625c439b4958706e2a30f181989c564cd15c/caps2ctrl.reg) を右クリック > 保存
- ダブルクリックで実行してから PC を再起動して終わり。
