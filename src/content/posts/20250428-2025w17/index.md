---
title: 2025W17 ウィークリーレポート
date: 2025-04-28T08:45:57.566Z
description: ""
ulid: 01JSXS63XYYBW2EF3H5HGV6B7P
tags:
  - weekly-report
---

## 🌐 ウェブプラットフォーム

- [2025-04-27のJS: Node v22.15.0、Reactの実験的な機能、Node.jsとV8 GC](https://jser.info/2025/04/27/node-v22.15.0-react-node.jsv8-gc/)
- [3PCA 31 日目: 3rd Party Cookie 廃止の廃止](https://blog.jxck.io/entries/2025-04-25/end-of-effort.html)
- [Intent to Ship: Document-Isolation-Policy](https://groups.google.com/a/chromium.org/g/blink-dev/c/cFuPRXcpc84)
- [Intent to Prototype: Policy-controlled feature `autofill`](https://groups.google.com/a/chromium.org/g/blink-dev/c/xT5ZVuSo4HY)
- [オリジン トライアル: Chrome のデバイスにバインドされたセッション認証情報](https://developer.chrome.com/blog/dbsc-origin-trial?hl=ja)
  - https://blog.jxck.io/entries/2025-01-16/device-bound-session-credentials.html
  - デバイスのTPMで秘密鍵を生成し、秘密鍵を知らなければCookieを使用できなくする仕組み
  - 既存のCookieの仕組みと互換性がある
- [State of HTML 2024](https://2024.stateofhtml.comundefined/)
- [Intent to Implement and Ship: Integrity Policy for scripts](https://groups.google.com/a/chromium.org/g/blink-dev/c/Q304_OkDAZA)

## 🛡️ セキュリティ

- [FBI Releases Annual Internet Crime Report](https://www.fbi.gov/news/press-releases/fbi-releases-annual-internet-crime-report)
  - 報告された被害総額は 160億ドル超（前年比 33％増）
  - 投資詐欺（暗号資産関連）：被害額 65億ドル超
  - 60歳以上の被害が目立ち、被害額は約50億ドル、苦情件数も最多
- [ブラウザのレガシー・独自機能を愛でる-Firefoxの脆弱性4選-](https://speakerdeck.com/masatokinugawa/browser-crash-club-number-1)
  - Firefoxの独自機能にまつわる脆弱性について解説
  - Facebook SDKのshimを利用したCSP strict-dynamicバイパス
  - multipart/x-mixed-replaceを使ったContent-Dispositionバイパス
- [CVE-2025-22234: Spring Security BCryptPasswordEncoder maximum password length breaks timing attack mitigation](https://spring.io/security/cve-2025-22234)
- [診断後の修正確認：脆弱な暗号スイートが無効化されたことを確認する3つの方法比較](https://devblog.lac.co.jp/entry/20250331)
- [IIJセキュアMXサービスにおけるお客様情報の漏えいについてのお詫びとご報告](https://www.iij.ad.jp/news/pressrelease/2025/0422-2.html)
  - [Active! Mail RCE flaw exploited in attacks on Japanese orgs](https://www.bleepingcomputer.com/news/security/active-mail-rce-flaw-exploited-in-attacks-on-japanese-orgs/)
- [Zero Day Quest 2025: $1.6 million awarded for vulnerability research](https://msrc.microsoft.com/blog/2025/04/zero-day-quest-2025-1.6-million-awarded-for-vulnerability-research/)
- [\[react-router\] React Router allows pre-render data spoofing on React-Router framework mode](https://github.com/advisories/GHSA-cpj6-fhp6-mr6j)
  - 細工したヘッダを用いて、プリレンダリングされるHTMLを任意に改ざんできる脆弱性
  - キャッシュポイズニングによって、エンドユーザーに任意のコンテンツが配信できる可能性がある、みたいな路線

## 🤖 AI関連

- [LLM / 生成AIを活用するアプリケーション開発におけるセキュリティリスクと対策](https://blog.flatt.tech/entry/llm_application_security)
- [AI-hallucinated code dependencies become new supply chain risk](https://www.bleepingcomputer.com/news/security/ai-hallucinated-code-dependencies-become-new-supply-chain-risk/)
  - AIによって生成されたコードに含まれる、実在しないパッケージやバージョンを参照するコードが生成される
  - 攻撃者は偽のパッケージを公開して悪用する可能性があり、サプライチェーンリスクがある
- [慶応大学のAI対策が面白い PDFに透明度100で見えない文書を埋め込みAIに読み込ませると誤回答する仕組みに](https://togetter.com/li/2541260)
  - PDFに人間には見えない透明な文書を埋め込むことでAIモデルの推論を妨害する
- [AI エージェントによるセキュリティレビューことはじめ](https://tech.plaid.co.jp/security-review-by-ai-agent-101)
  - [脆弱性診断 with AIエージェント、はじめました。](https://developers.freee.co.jp/entry/we-have-started-AI-agent-security-test)
  - セキュリティを専門とする企業以外でも、AIをセキュリティに活用するケースが増えつつある
- [harishsg993010/damn-vulnerable-MCP-server: Damn Vulnerable MCP Server](https://github.com/harishsg993010/damn-vulnerable-MCP-server)

## その他

- [This blog is hosted on a Nintendo Wii](https://blog.infected.systems/posts/2025-04-21-this-blog-is-hosted-on-a-nintendo-wii/)
- [A New Form of Verification on Bluesky](https://bsky.social/about/blog/04-21-2025-verification)
- [チームを異動で環境が変わった後の立ち上がりについて](https://future-architect.github.io/articles/20250423a/)
- [脆弱性診断員が予備自衛官補に応募してみた](https://securesky-plus.com/aboutus/3299/)
