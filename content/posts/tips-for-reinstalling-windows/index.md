---
date: 2020-12-19T07:00:00Z
lastmod: 2020-12-19T07:00:00Z
title: "Windows の再インストール後にやることメモ"
tags: ["windows10"]
categories: etc
draft: false
hidden: false
---

OS クリーンインストールを定期的に行っているので、毎回やってることを書き留めておく。

PC は主に趣味での開発、ゲームに使っている。

## 前準備

エクスポートしたファイルやドライバはまとめてブータブル USB に入れておく。

### アプリケーション

アプリケーションの管理は winget と一部 chocolatey を使ってやっている。

**winget**

```
winget export --output winget-export.json
```

**chocolatey**

```
choco export
```

エクスポートしたファイルは GitHub あたりにアップロードして管理する。

サイズの大きいゲームは再インストールの手間や config の移動の手間を省くために別ドライブ、またはパーティションを分割して分離しておくといい。

### ドライバ

前もってダウンロードしておくのは以下 2 つ。マザーボードの型番や GPU の型番を調べて最適なものを探す。

- チップセットドライバ
- LAN ドライバ
- GPU ドライバ

GPU ドライバは NVSlimmer などを使って require なもの以外を省いておく。

### ランタイム

以下 2 つをダウンロード。

- https://www.microsoft.com/en-us/download/details.aspx?id=35
- https://www.techpowerup.com/download/visual-c-redistributable-runtime-package-all-in-one/
  - `install_all.bat` を実行

### 最適化ツール

[ReviOS WorkSpace](https://www.revi.cc/revios/workspace) から以下をダウンロード。

- `disable-windows-update.reg`
- `enable-windows-update.reg`
- `disable-uac.reg`
- `enable-uac.reg`

併せて、以下も必要に応じてダウンロード。

- [disable-plugandplay.reg](https://gist.githubusercontent.com/shiomiyan/4acf033967f225c6a40e488a1b3918c2/raw/14ffbf217a00f494ee078b4237b2e2b815e04e8f/disable-plugandplay.reg)
  - Razer などのデバイスによくある、接続したらドライバと一緒にソフトウェアがインストールされる機能を無効にする
- [caps2ctrl.reg](https://gist.githubusercontent.com/shiomiyan/554d01e4b1276a2d2d3009bcb0eddf94/raw/ccf2625c439b4958706e2a30f181989c564cd15c/caps2ctrl.reg)
  - <kbd>CapsLock</kbd> に <kbd>Ctrl</kbd> を割り当てる

Windows にプリインストールされたアプリケーション（BloatWare）をアンインストールには以下を使用。

{{< blogcard "https://github.com/Sycnex/Windows10Debloater" >}}

Windows Defender 無効化には以下を使用。

{{< blogcard "https://github.com/disable-windows-defender/disable-windows-defender.github.io" >}}

## インストール

LAN ケーブルを抜いた状態で、ブータブル USB から Windows をインストールする。

Microsoft アカウントでのサインインや、LAN ケーブルの接続を促されるがすべて無視する。

前準備でそろえたものを使って以下を行う。

- BloatWare アンインストール
- Windows Update、UAC、Windows Defender の無効化
- ドライバのインストール

これができたら LAN ケーブルを接続し、パッケージマネージャーから各種アプリケーションをインストールする。

{{< blogcard "https://github.com/microsoft/winget-cli" >}}

{{< blogcard "https://chocolatey.org/install" >}}

### その他

- 一部ゲームの config 移行
- NeoVim、OBS、SoundSwitch、REAL 等のセットアップ

## 参考にしているリンク

- https://docs.google.com/document/d/1c2-lUJq74wuYK1WrA_bIvgb89dUN0sj8-hO3vqmrau4/edit
- https://www.revi.cc/revios/post-install
- https://github.com/djdallmann/GamingPCSetup
- https://github.com/BoringBoredom/PC-Optimization-Hub
- https://www.techpowerup.com/forums/threads/how-to-reduce-stuttering-and-audio-distortion-in-windows-10.270051/