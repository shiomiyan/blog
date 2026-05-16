---
title: dotfiles (Nix + Home Manager)
description: "-"
created: 2026-05-02T19:01:25
draft: true
id: 5a2302f9-e5b1-4701-9532-293110befea8
categories:
  - scrap-notes
tags:
  - Nix
---
dotfilesをNix flakes + Home Manager中心の管理構成に移行した。

移行ログや、構成イメージをまとめておく。

## モチベーション

- このへん👇の手入れに疲れた（疲れることすらしなくなっていた）
	- インストールスクリプト
	- systemd servicesとかシンボリックリンクとか
- AIあるしいけるっしょ
	- 定期的にトライしていて「割に合わね～」となって辞めていた
	- シンボリックリンク→chezmoi→stowと渡り歩いたが、肌に合わず気持ちよく管理できていなかった

## 私の環境

とりあえずWSL Ubuntuで動くように設定している。ニッチなディストリビューションでもなければおそらく転用できる。

またすべてを宣言的に管理するモチベーションはそれほどないので、設定の完全移行は目指していない。（一部を管理しだすとそのうち寄せたくなってきそうな気はしますが）

といいつつ、一部NixOS向けの設定も入っている。

## Nixの周辺知識

いくつかの単語を整理しておく。

- Nix: ビルドシステムおよびパッケージ管理システム
- [Nix flakes](https://nixos.wiki/wiki/flakes): Nixの機能の1つで、lockの仕組みを提供する
- [Home Manager](https://github.com/nix-community/home-manager): ユーザホームディレクトリを構成する

## 構成

構成をスイッチしやすくする目的で、[numtide/blueprint](https://numtide.github.io/blueprint/main/)を採用した。

いくつか利点はあるが、`hosts/<hostname>/users/<username>/**/*.nix`のような形式でホストやユーザを増やせるのがよい。NixOSを採用したくなった場合や別の端末設定を管理したくなった場合の取り回しがよさそう。

[dotfiles管理に限界を感じたらNixOSとblueprintを試してほしい | zenn.dev](https://zenn.dev/sei40kr/articles/nix-dotfiles-blueprint)

依存を増やしてもなぁという気もするが、AIもあるのでどうとでもなるだろうと割り切った。

また、私はこれ系の構成決めがすこぶるできないので、こうした仕組みに可能な限り乗っかっておきたい意図もある。

## ディレクトリ構成

[blueprintのFolder Structure](https://numtide.github.io/blueprint/main/getting-started/folder_structure/)を参考に、`/nix`を切って`flake.nix`、`flake.lock`以外のnix実装はこのフォルダに集めている。

## 設定ファイルの配布

現状はNix管理とそうでないものを併用している。git、Neovimあたりは特にWindows側で必要になることがままあるので、Nixで管理していない。

## AI周り

### AI Agentの管理

同僚でおなじみのCodexは、特に気にせず`github:nixos/nixpkgs/nixos-unstable`から取得して使っていた。
ただ、考えていたよりも更新が遅かったので[`github:numtide/llm-agents.nix`](https://github.com/numtide/llm-agents.nix)を使うようにした。

こちらは日時で更新されるので、どんなに遅くても次の日には降ってくる。私の場合、今は仕事で使っているわけではないので、とりあえず十分。

なお、ビルドが結構時間かかるので、`extra-substituters`、`extra-trusted-public-keys`によるBinary Cacheも設定した。

### Skills

Skills自体、たいして使っていなので管理するほどでもないといえばそうなのですが、[agent-skills-nix](https://github.com/Kyure-A/agent-skills-nix)で管理している。

[Nix で Agent Skills を管理する | zenn.dev](https://zenn.dev/kyre/articles/46269c831775d9)

## 一応、non-Nixな環境向けに

Nixを使っていない・使えない環境向けに、Home Managerで生成済みのdotfilesをGitHub ActionsのArtifactに吐き出している。

https://github.com/shiomiyan/dotfiles/blob/5b95e04e54a4a8b613258d3fc7671a2870ee6279/.github/workflows/build.yml#L41-L75

使う機会はまぁない。
