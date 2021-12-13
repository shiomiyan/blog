---
title: WSL の Vim/Neovim でホストの Windows とクリップボードを共有する
date: 2021-05-31T00:40:44+09:00
description:
draft: false
author: shiomiya
categories: tech
tags:
  - wsl
  - vim

---

Archlinux on WSL でのセットアップです。Ubuntu でも大体同じでしょう。

## Vim のインストール

`+clipboard` な Vim が必要なので、Vim なら gvim、Neovim は普通に入れて `+clipboard` なので問題なし。

```sh
sudo pacman -S gvim neovim
```

## win32yank の導入

標準の clip.exe だとクリップボードから吐き出しができないので、Windows 側から win32yank をインストールします。

以下のような PowerShell コマンドで、すべて CLI で導入できます。

```powershell
Invoke-WebRequest `
    -Uri "https://github.com/equalsraf/win32yank/releases/latest/download/win32yank-x64.zip" `
    -OutFile C:\win32yank.zip

Expand-Archive C:\win32yank.zip -DestinationPath C:\Tools\win32yank

Remove-Item C:\win32yank.zip
```

CLI からでも使いたので、Archlinux 側で win32yank のパスを通します。

WSL2 では `uname -r` の値が `<version>-microsoft-standard-WSL2` となるので、以下のようにして WSL 環境の場合のみ適応するようにします。

```sh
if [ `uname -r | grep microsoft` ]; then
  alias win32yank="/mnt/c/Tools/win32yank/win32yank.exe"
  alias clip="win32yank -i"
fi
```

これでクリップボードを共有する体制が整いました。例えば CLI から使うなら `echo "hoge fuga" | clip` とすればコピーできます。

## vimrc に yank 用の keymap を入れる

そのために vimrc を編集するのですが、dotfiles で管理している手前他の環境に影響が出ると困るので、WSL 環境でのみ keymap を読み込むよう以下のように記載します。

{{< blogcard "https://superuser.com/a/1557751" >}}

```vim
if stridx(system('uname -r'), 'microsoft') " if is WSL
  let g:clipboard = {
          \   'name': 'win32yank',
          \   'copy': {
          \      '+': '/mnt/c/Tools/win32yank/win32yank.exe -i',
          \      '*': '/mnt/c/Tools/win32yank/win32yank.exe -i',
          \    },
          \   'paste': {
          \      '+': '/mnt/c/Tools/win32yank/win32yank.exe -o',
          \      '*': '/mnt/c/Tools/win32yank/win32yank.exe -o',
          \   },
          \   'cache_enabled': 0,
          \ }
endif
```

エイリアス貼っていてもフルパスで指定しないと動作せず、仕方なしにフルパスで書いてます。原因は何なんでしょう。ご存じの方がいたら教えていただきたい。
