---
title: Windows の tig で global にある Vim の設定を適応する
date: 2021-12-11T01:51:45+09:00
description:
draft: false
author: shiomiya
categories: tech
tags:
  - windows
  - tig

---

Windows で tig を使うには、現状 Git for Windows にバンドルされているものを使うしかないです（自前ビルドとかそういうのは置いといて）。

自分の環境では `tig` が使えなかったため、`$profile` に以下のようにエイリアスを追加しています。

```powershell
Set-Alias -Name tig -Value "C:\Program Files\Git\usr\bin\tig.exe"
```

また、Git for Windows には Vim もバンドルされており、tig からはグローバルにある Vim を参照してくれません。

使えないわけではありませんが、プラグインを入れていたりするとエラーログを吐きまくるのでちょっと感覚的にいまいちです。

## 解決法

いくつか方法はありますが、自分の環境では Vim と Neovim の設定を共有しているので、以下のように Git のエディタを Neovim に変えて対応しました。

```shell
git config --global core.editor 'nvim'
```
