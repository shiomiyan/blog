---
title: "Cargo Alternate Registryを使ってオレオレツールを誰かに使ってもらいやすくする"
created: 2023-04-16T11:19:04.000Z
draft: false
description: "Cargo Alternate Registryで自作ツールを配布しやすくするメモ。"
id: external-qiita-1706810
category: tech
tags:
  - random
---

CargoないしRustのパッケージレジストリといえばcrates.io。
ここにpublishしておけば`cargo install ...`でインストール可能になる。
しかしRustで書いたオレオレツールやClosedな環境でのみ使うツールを公開するわけにはいかない。
なにかいい方法はないかな〜と探してみて、一番楽そうだった方法のメモ。

> あくまで「Closedな環境」が前提。
> Publicにしたらやばい。

## 準備

「Cargo Alternate Registryを使って」とまるで自作したかのようないい振りだけど感謝しながら既成ツールを使う。

Cargoは使える状態だとして、[CargoリポジトリのWiki](https://github.com/rust-lang/cargo/wiki/Third-party-registries)に記載されていたcargo-http-registryを使う。

https://github.com/d-e-s-o/cargo-http-registry

```plaintext
cargo install cargo-http-registry
```

## やる

レジストリとして使うディレクトリへのパスを渡すだけ。

お試しで`/tmp`あたり作っておけば良さそう。パスが存在しなければ勝手に作ってくれる。

```plaintext
cargo-http-registry /tmp/registry
```

これでレジストリの準備はおわり。

### レジストリを使うための設定

このレジストリを`cargo`コマンドが認識できるように`~/.cargo/config.toml`に次を追記しておく。

ポートは環境によって変わりそう。
`cargo-http-registry`が生成した`config.json`に記載されたポートへ合わせる。

```toml
# ~/.cargo/config.toml
[registries]
my-registry = { index = "http://127.0.0.1:62159/git" }
```

fileプロトコルでも使えるみたいなので、ファイルサーバーにレジストリを設置しておくみたいな場合はそっちでも良さそう。

### クレート公開側の設定

`cargo publish`で公開したいので、そのためのアレコレ。

### 自前レジストリにログインする

ログインする。

```
> cargo login --registry=my-registry
please paste the token found on http://127.0.0.1:62159/me below
<何でもいいので適当に入れておく>
       Login already logged in
```

トークンはこの際何でもいいので適当に入れる。`Login already logged in`になればOK。

### 適当なクレートを公開してみる

ハローワールドを公開してハローワールドしてみる。

```plaintext
cargo new my_crate_bin && cd my_crate_bin
cargo publish --registry=my-registry --allow-dirty
```

正しく公開できると`cargo-http-registry`で指定したディレクトリ直下に`my_crate_bin-0.1.0.crate`が爆誕しているはず。

公開方法としてはコレで良い。
公開するであろうパッケージの`Cargo.toml`に次を追記しておく。
これで、crates.ioに万が一にでも上がってしなうことはなくなる。
そもそもログインしていなければ上がることはないが。

```toml
publish = ["my-registry"]
```

cargo-http-registryのREADMEで初めて知った。

## オレオレクレートを使ってみる

自分以外の誰かが使うことを想定して。

もちろん利用者も`~/.cargo/config.toml`に自前レジストリを使うための設定が必要になる。

また、（環境変数でもコントロール可能なので必須ではないが）HTTPプロトコルでアクセスするなら[`net.git-fetch-with-cli`](https://doc.rust-lang.org/cargo/reference/config.html#netgit-fetch-with-cli)を`true`にしておく。

```toml
# ~/.cargo/config.toml
[registries]
my-registry = { index = "http://127.0.0.1:62159/git" }

[net]
git-fetch-with-cli = true
```

これで利用者側の準備おわり。インストールしてみる。

```plaintext
cargo install my_crate_bin --registry=my-registry

# net.git-fetch-with-cliの設定を書かないままHTTPでやり取りするならこっち
CARGO_NET_GIT_FETCH_WITH_CLI=true cargo install my_crate_bin --registry=my-registry
```

インストールできたはず。

```
> my_crate_bin
Hello, world!
```

OK。もういらんので消す。

```
> cargo uninstall my_crate_bin
    Removing /Users/sk/.cargo/bin/my_crate_bin
```

## おわりに

Cargo Wikiに記載されている代替ツールはいくつか検討してみたが、（自作するモチベーションはなくて）コレが一番自分のユースケースにあってそうだった。

（Crate？Package？わからん）
