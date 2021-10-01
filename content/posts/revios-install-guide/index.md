---
date: "2020-12-06 20:49:59 +0000 UTC"
draft: false
title: "超軽量版 Windows10 こと ReviOS インストールガイド"
author: "shiomiya"
tags: ["revios","windows10"]
categories: etc
hidden: true
---

> <span style="color:red">
> この記事はメンテナンスされていません。</br>
> 最新のインストール方法やイメージのダウンロードは[公式サイト](https://www.revi.cc/)を参照してください。
> </span>

海外の OS Tweaking Community (?) でぼちぼち話題っぽい RevisionOS (ReviOS) を使ってみたので導入手順とレビューをかんたんに書きます。

おそらく主にゲーマー向けで、Windows10 の不要な機能やプロセスを削ぎ落としているので、低遅延かつ高フレームレートが期待できます。

現在使用しているディスクへのインストールを行う場合はすべて初期化されるので、バックアップ等適宜取り導入は自己責任でお願いします。

## ReviOS とは

[Revision Official Website](https://www.revi.cc/)

> ReviOS aspires to re-create what Windows as an operating system should have been, with a particular emphasis on performance, stability and privacy.

とのことで、パフォーマンスやプライバシー保護に重点を置いて最適化された Windows10 ベースのカスタム OS らしい。

## ReviOS 導入ガイド

サブ PC 等あれば問題ありませんが、メイン PC へのインストールを考えているのであれば、プロダクトキーの移行作業を行うこと。新たに購入する予定なら不要。本筋からはそれるので移行方法は割愛。調べれば出てくる。

その先はとりあえず USB 一本あれば作業を進められるので USB だけ握りしめて読んでください。

一応 YouTube にインストールガイドがあるので見ながらやれば簡単。本記事もほとんど動画をなぞるだけです。

{{< youtube w4Wn25d02iY >}}

### ISO ダウンロード

公式サイトの [Download](https://www.revi.cc/revios/download) から好きなバージョンの ISO をダウンロードする。

ただ 2020/12/4 現在、ここからダウンロードできるものの中で日本語 IME (Google 日本語入力) が僕の PC で正常に動作したものは **20H2 S1.0**、 **2004S1.0** の 2 つのみだったので、この 2 つのどちらかになりそうです。

Changelog に

>FIXED: Input Method Editor for Asian languages

とは書いてあったけど Microsoft の IME は機能しなくて、結局 Google 日本語入力を入れる必要があったのはちょっと不満。Asian Languages とは一体。

https://www.revi.cc/revios/changelog

### Bootable USB の作成

動画でも使っている Rufus が一番ラクです。多分。
使い慣れているものがあればそれを使ってください。

[Rufus - The Official Website (Download, New Releases)](https://rufus.ie/)

ここからダウンロード。そんなに頻繁に使うものでもないので Portable 版で十分です。

![](image1.png)

画像のように設定。

#### パーティション構成について

- Win + R でファイル名を指定して実行から、`DISKMGMT.MSC` を実行。
- インストールを考えているドライブを右クリックしてプロパティを開く。
- ボリュームタブのパーティションのスタイルを参考に設定。

スタートを押して少し待てば完了。

### ディスクへの書き込み

スクリーンショットがないので割愛。

念の為書き込みを考えているドライブ以外をすべて外してから、パーティションをすべて削除。 (Unlocated Space 一つになるはず)

※ 後日追記予定

インストールが終わるといつものように Windows のユーザー名とパスワードを設定するように促されるので、特に困ることはないはず。

一度再起動がかかる場合がある (僕は入った) ので、焦らずゆっくり待ちます。

## インストール後にやること (やったこと)

ここからは僕が勝手にやったこと。

### 表示言語の変更

設定 > 時刻と言語 > 言語 > 言語の追加から日本語をインストール。

手書きと音声認識はいらなさそうだったので外してダウンロード。

優先する言語で日本語を最上位に。

### 日本語 IME 導入

やはり日本語 IME が使えなかったので、 Google 日本語入力をインストールします。

[Google 日本語入力 – Google](https://www.google.co.jp/ime/)

インストールウィザードにしたがってインストール後、 設定 > 時刻と言語 > 言語 > 日本語 > オプションから、キーボードの追加で Google 日本語入力を追加。

ここまでで日本語入力は問題なく行える (ハズ) 。

### Nvidia GPU ドライバのインストール

この辺から公式サイトの Post-Install とかぶることが多いので、詳しくはそちらで。

NVCleanInstall か NVSlimmer か、みたいな感じらしいですが、個人的に使いやすかった NVSlimmer を推します。

[NVIDIA driver slimming utility v0.10 Download](https://www.guru3d.com/files-get/nvidia-driver-slimming-utility,2.html)

[NVIDIA DRIVERS GeForce Game Ready Driver WHQL](https://www.nvidia.com/download/driverResults.aspx/158756/en-us)

上記サイトから NVSlimmer とドライバをインストール。ドライバのバージョンについては何でもいいのですが、442.74 が最もいいという話はここだけでされているわけでもないので 442.74 で。

ダウンロードした zip を解凍して出てきた NVSlimmer.exe を起動。

ドライバの選択を促されるので、インストールしたドライバ (ex. 442.74-desktop-win10-64bit-international-whql.exe) を選択。

ドライバのロードが終了するとチェック項目が出てくるので、特に必要なものがなければ画像のようにチェック。

![](image2.png)

もし Geforce Experience が必要であれば、 Geforce Experience ツリー下のチェック項目はすべてチェックしてください。多分しないとインストールでコケるので。加えて、インストール後に Geforce Experience 側の設定でドライバの自動アップデート設定を切ることをおすすめします。

問題なければ Apply > Install 。通常のドライバインストールと同様にウィザードが走ると思います。カスタムではなく推奨で通り向ければおそらく OK。

これでドライバのインストールは終了。

### Visual C++ Runtime のインストール

大体のゲームに必要なのでインストール。

[Revision - Post-Install](https://sites.google.com/view/meetrevision/revios/post-install#h.p_-aHIalM_nOwU)

Revision Post-Install を参考にインストール。 Method1 が楽なのでおすすめ。

---

大体ここまでやれば問題なく使用できるはずです。

あとは適宜 Discord なり Steam なり入れて快適なゲーム環境を楽しんでください。

再起動時やタスクマネージャーを開くとわかりますがバックグラウンドプロセスが少ないせいか起動にかかる時間とかは超爆速。

フレームレートも心做しか平均値が底上げされた気がする。とはいえ、この手のものでこれまで 100FPS 程度しか出せなかった PC が、急に 300FPS 出るようになることはないので、過度な期待はしないでください。

とはいえ、なんとなくいい環境でできているような気持ちになれる最高のプラシーボは得られます。

反響があればもう少し丁寧に書きます。以上。

責任は負えませんが、記事に不備や不明瞭な点があれば[サイトリポジトリ](https://github.com/shiomiyan/www.shiomiya.com/issues)へ issue を立ててくれると助かります。
