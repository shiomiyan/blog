---
title: dotfiles (Nix + Home Manager)
description: "-"
created: 2026-05-02T19:01:25
draft: true
id: 5a2302f9-e5b1-4701-9532-293110befea8
category: diary
tags:
  - Nix
  - random
---
一念発起してdotfilesをNix + Home Manager中心の管理構成に移行しました。

移行ログや、構成イメージをまとめます。


## モチベーション

- このへん👇の手入れに疲れた（疲れることすらしなくなっていた）
	- インストールスクリプト
	- systemd services、etc.
- dotfilesを変更した際のシンボリックリンク貼り替えが面倒くさい
- 最高の同僚がついている今、やれる気がした
	- 定期的にトライしていて「割に合わね～」となって辞めていた
	- シンボリックリンク→chezmoi→stowと渡り歩いたが、肌に合わず気持ちよく管理できていなかった

## 私の環境

目先ではWSL以外で使うことはなので、とりあえずWSLで動く形で設定しています。

またすべてを宣言的に管理するモチベーションはそれほどないので、設定の完全移行は目指していません。（一部を管理しだすとそのうち寄せたくなってきそうな気はしますが）

## Nixの周辺知識

整理もかねて、いくつかの単語を整理します。

- Nix: ビルドシステムおよびパッケージ管理システム
- Nix flakes: Nixの機能の1つで、lockの仕組みを提供する
- Home Manager: ユーザホームディレクトリを構成する

## 構成

構成をスイッチしやすくする目的で、[numtide/blueprint](https://numtide.github.io/blueprint/main/)を採用しています。

`hosts/<hostname>/users/<username>/**/*.nix`のような形式でホストやユーザを増やせるので、NixOSを採用したくなった場合や別の端末設定を管理したくなった場合の取り回しがよさそうな気がします。

[dotfiles管理に限界を感じたらNixOSとblueprintを試してほしい | zenn.dev](https://zenn.dev/sei40kr/articles/nix-dotfiles-blueprint)

依存を増やしてもなぁという気もするが、最高の同僚もついていることだし、どうとでもなるだろうと割り切りました。

やれていないですが、ホスト名とユーザ名が完全一致すれば[`home-manager switch --flake`で更新できて](https://numtide.github.io/blueprint/main/getting-started/folder_structure/#standalone-configurations)気持ちがいいです。

## AI周り

### AI Agentの管理

同僚でおなじみのCodexは、特に気にせず`github:nixos/nixpkgs/nixos-unstable`から取得して使っていましたが、やはり更新が遅かったので[`github:numtide/llm-agents.nix`](https://github.com/numtide/llm-agents.nix)を使って持ってくることにしました。

こちらは日時で更新されるので、どんなに遅くても次の日には降ってきます。私の場合、今は仕事で使っているわけではないので、十分かなと思います。

なお、ビルドが結構時間かかるので、`extra-substituters`、`extra-trusted-public-keys`によるBinary Cacheも設定しました。

### Skills

Skills自体、たいして使っていなので管理するほどでもないといえばそうなのですが、[agent-skills-nix](https://github.com/Kyure-A/agent-skills-nix)で管理しました。

[Nix で Agent Skills を管理する | zenn.dev](https://zenn.dev/kyre/articles/46269c831775d9)

## 一応、non-Nixな環境向けに

Nixを使っていない・使えない環境向けに、Home Managerで生成済みのdotfilesをGitHub ActionsのArtifactとして生成してます。

あってもなくても変わらない気がしますが。

https://github.com/shiomiyan/dotfiles/blob/5b95e04e54a4a8b613258d3fc7671a2870ee6279/.github/workflows/build.yml#L41-L75

## いろいろ参考にした

- https://zenn.dev/momeemt/articles/dotfiles2025
- https://github.com/takeokunn/nixos-configuration
- https://github.com/Kyure-A/nix-config
- https://github.com/ryoppippi/dotfiles
- https://github.com/i9wa4/dotfiles
- https://github.com/mitchellh/nixos-config
