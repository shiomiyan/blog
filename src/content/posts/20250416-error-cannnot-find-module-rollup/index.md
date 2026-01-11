---
title: "Error: Cannot find module '@rollup/rollup-linux-x64-gnu'"
date: 2025-04-16T02:16:06.432Z
description: ""
ulid: 01JRY63N115YK9A6XXV193SSS9
tags:
  - npm
  - rollup
category: Tech
---

npmの依存関係をアップデートしていたときに、ローカル（macbook pro 2019）ではビルドが通るのに、GitHub Actionsではビルドが通らないという問題が発生した。

> ```plaintext
> Error: Cannot find module @rollup/rollup-linux-x64-gnu. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.
> ...
> [cause]: Error: Cannot find module '@rollup/rollup-linux-x64-gnu'
> ...
> ```
> https://github.com/shiomiyan/blog/actions/runs/14482057130/job/40620848586

使用していたGitHub ActionsはLinux環境なので、`@rollup/rollup-linux-x64-gnu`が必要になる。対して（macOS上で生成した）`package-lock.json`には`@rollup/rollup-darwin-x64`が[記載されていた](https://github.com/shiomiyan/blog/blob/d23e9a3e0cc38a618b29b96f085dcdf1c0234588/package-lock.json#L782C19-L782C43)。
GitHub Actionsでは`npm ci`を使って依存関係を取得しているので、このあたりで依存解決に失敗したのかな、と思った。

## 解決策

rollupでプラットフォーム向けのネイティブバイナリを使っていると起きる問題らしい。クロスプラットフォームで使える`@rollup/wasm-node`があり、これを使うと解決する。

```json
{
  ...
  "overrides": {
    "rollup": "npm:@rollup/wasm-node@^4.40.0"
  }
  ...
}
```

とりあえずビルドが通るようになった。定期的に発生していた気もするので、これでしばらく様子を見る。

## 参考

- [Viteのビルド時に発生した「Cannot find module @rollup/rollup-linux-x64-gnu.」の対処方法 - ひよこまめ](https://blog.chick-p.work/til/resolve-vite-cannot-find-rollup)
- [Nuxt3のRollupのプラットフォーム依存問題](https://zenn.dev/apollo880/articles/solving-rollup-platform-dependency-with-wasm)
