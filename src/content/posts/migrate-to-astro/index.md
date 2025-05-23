---
title: "ブログをHugoからAstroに移行した"
date: "2024-07-10"
description: ""
ulid: 01J2CZ1600DCRN6FTV3KZRW035
tags:
  - astro
  - site-updates
---

このブログで利用している静的サイトジェネレータをHugoから[Astro](https://astro.build/)に乗り換えた。

## モチベーション

- Hugoが採用しているテンプレートだとエディタ補完が効かず、気合いで拡張していくのが辛かった
  - 辛いので、なにかやろうと思っても諦めがち
    - 例えば、外部データをほんのチョット取り込んでブログに入れたいときなどでも、わざわざスクリプトを書いてCIで実行されるようにして...みたいになってつらい
      - 他プラットフォームで書いた記事をRSSから引っ張ってきて記事一覧に差し込む、など
- 既存のテーマをイジって運用していたが、CSS周りは特にスパゲッティ状態で手に負えなくなった
  - 自分のせい、移行したから解消するものではないが
- ~~暇だった~~他の技術領域に触れてみたかった

## Astroへの移行作業

JS系フレームワークを触るのも、CSSフレームワークを触るのも初めてなので、総じて雰囲気で調整している。

### 既存の記事

ブログを書く習慣がなく、ブログの記事数はたいしたことないので、手作業で拡張子を変更し、フロントマターもよしなに修正した。

### UI周り

既存のブログレイアウトは捨てた。
とはいえ、~~ゼロからUIを考えるほどのやる気はないので~~やはり先人たちの知恵を有効活用するべきなので、[Astro Micro](https://astro.build/themes/details/astro-micro/)というテーマをベースにパッチを当てて使用している。  

#### フォント

[Fontsource](https://fontsource.org/)からWebフォントをimportして使うつもりだった（というかしばらく使っていた）が、次のような問題が出てきた。

- わずかにレイアウトシフトが発生してしまう
- フォントの読み込みリクエストがあまりに多い

解決するのも面倒だったため、下手にこだわらずよくあるシステムデフォルトを使うような感じにした。

https://github.com/shiomiyan/blog/blob/master/tailwind.config.mjs#L8-L9

### 機能面の改善

#### サイト内検索

移行前のブログはサイト内検索を実装していなかったが、テーマに組み込まれていたこともあり、Pagefindを使うことにした。

Pagefindで日本語を検索できるようにするために`<html lang="ja">`する必要があるところだけハマった。

#### ほかサイトで書いた記事を一覧に差し込む

[別のブログプラットフォームで公開した記事を一覧に表示した](https://github.com/shiomiyan/blog/commit/7471d44b2de73cf437ca0c51b97a2ab78ad3808b)。  
RSSを読んで適当な時系列に差し込んでいるだけだが、こういうのがHugoだとしんどかった。

## 移行してみて

- データを好きにコネコネできていい
- AstroのContent Collectionsのおかげで、mdxのフロントマターを簡単にバリデーションできるのが気に入っている
- CSS周りに知見がなく相変わらず辛いのだが、Tailwind CSSがよしなにしてくれてる気がしており、なんかわかった気になって調整できている
- ~~View Transition APIを理解できていない（遷移時のアニメーションを消したいが、消すと遷移時にチラつく、タスケテ）~~
  - サイト内を歩き回ることはなさそうなので、SPA（View Transitions）をやめた
- PageSpeedInsightsの結果もとりあえず満点に近いスコアとなったので、とりあえずヨシ
- ブログを書こう
