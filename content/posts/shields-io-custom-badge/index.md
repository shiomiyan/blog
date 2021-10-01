---
title: shields.io でブログのシェアバッジを作ってみた
date: 2021-01-15T11:14:30+09:00
description:
draft: false
author: shiomiya
categories: etc
tags:
  - hugo
  - shields.io
---

Hugo で生成したこのブログには、もともと下のような公式で公開されているシェアボタンを配置していたが、なんとなく統一感に欠けているような気がしていた。

![](2021-01-15_11-21_firefox.png)

せっかくなので、 [Shields.io](https://shields.io/) の Dynamic で生成したバッジに変更してみた。

できたものは最下部にある ↓ 。

## Twitter

Shields.io で Twitter をサポートしているのでやるだけ。

```html
<a href="http://twitter.com/intent/tweet?url={{ .Permalink }}&text={{ .Title }}%20%7C" target="blank">
  <img alt="Twitter" src="https://img.shields.io/twitter/url?style=social&url={{ .Permalink }}">
</a>
```

## はてなブックマーク

はてなブックマーク件数取得 API を利用する。

- http://developer.hatena.ne.jp/ja/documents/bookmark/apis/getcount

複数 URL 版を利用しないと Json ではなく text/plain を返してしまうので注意。

```html
<a href="http://b.hatena.ne.jp/add?mode=confirm&url={{ .Permalink }}&title={{ .Title }}" target='blank'>
  <img alt="Hatena" src="https://img.shields.io/badge/dynamic/json?&style=social&label=hatena&logo=hatena-bookmark&query=$.*&url=https://bookmark.hatenaapis.com/count/entries?url={{ .Permalink }}">
</a>
```

## Feedly

Feeds API を利用する。

- https://developer.feedly.com/v3/feeds/#get-the-metadata-about-a-specific-feed

Hugo の `.Site.RSSLink` を使いたかったけど URL エンコードの関係か、うまくいかなかった。

```html
<a href='https://feedly.com/i/subscription/feed/https://www.shiomiya.com/index.xml'  target='blank'>
  <img alt="Feedly" src="https://img.shields.io/badge/dynamic/json?&style=social&logo=feedly&label=feedly&query=%24.subscribers&url=https%3A%2F%2Fcloud.feedly.com%2Fv3%2Ffeeds%2Ffeed%252Fhttps%253A%252F%252Fwww.shiomiya.com%252Findex.xml">
</a>
```

## アイコン

[simpleicons.org](https://simpleicons.org/) から探して使う。失礼ながらまさかはてながあるとは思っていなかった。

## 参考

- [Shields.ioと各種APIで独自のバッジを作って遊ぶ - Qiita](https://qiita.com/ota-meshi/items/4799f490ecc8c8cf642)
