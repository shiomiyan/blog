---
title: 素早く Hugo でブログを書くツールを Rust で書いてみた
date: 2021-01-07T16:46:20+09:00
description:
draft: false
author: shiomiya
categories: tech
tags:
  - rust
  - hugo

---

Hugo での記事作成とブランチ切りを同時にやってくれる CLI ツールを Rust で書いてみた。

[shiomiyan/rugo - GitHub](https://github.com/shiomiyan/rugo)

{{< blogcard "https://github.com/shiomiyan/rugo" >}}

## 背景とか

Hugo でブログを書く際、以下のようなワークフローで記事を書いていた。

1. プロジェクトルートから、 `hugo new content/posts/<article-name>/index.md`
2. Vim で編集
3. `master` へ Push

`new` の際にパスを間違えたり、reviewdog で校正するため記事ごとに PR を作成したいなんて事があって、その辺を楽にする CLI ツールが欲しかった。

## コマンドライン解析

Rust でコマンドライン解析する crate はいくつかあるが、機能的にリッチそうな [`clap`](https://github.com/clap-rs/clap) を採用してみた。

直線的にオプションやサブコマンドを設置できるので、慣れていなくても書きやすかった。

```rust
let matches = App::new("rugo")
    .version("0.1")
    .about("Make faster your blogging.")
    .author("Created by shiomiya.")
    .subcommand(
        App::new("new")
            .about("create new post with git branching")
            .arg(
                Arg::new("TITLE")
                    .about("input post title")
                    .takes_value(true)
                    .required(true),
            ),
    )
    .get_matches();

    // 引数に対する処理を記述していく
if let Some(ref matches) = matches.subcommand_matches("new") {
    let title = matches.value_of("TITLE").unwrap();
    git_checkout(title).unwrap_or_else(|e| panic!("Error: failed to checkout branch {}.", e));
    create_post(title).unwrap_or_else(|e| panic!("Error: failed to create new post {}.", e));
    ...
}
```

## Hugo を呼ぶ

Rust では [`std::process::Command`](https://doc.rust-lang.org/std/process/struct.Command.html) を使ってシェルコマンドを呼び出すプロセスを生成できる。

`hugo new` を叩いたときの標準出力が邪魔だったので `/dev/null` へ飛ばした。

```rust
Command::new("hugo")
        .arg("new")
        .arg(path)
        .stdout(Stdio::null())
        .spawn()
        .expect("Can't run command `hugo new`");
```

## ブランチのチェックアウト

Rust から Git リポジトリを操作するには [`git2`](https://github.com/rust-lang/git2-rs) が便利そう。

カレントディレクトリのリポジトリを読み取って `head` から記事名のブランチを作成している。

エラー処理はクソ適当です。

```rust
fn git_checkout(title: &str) -> Result<()> {
    let repo = match Repository::open(".") {
        Ok(repo) => repo,
        Err(e) => panic!("Error: failed to open site repository: {}", e),
    };

    let head = repo.head().unwrap();
    let oid = head.target().unwrap();
    let commit = repo.find_commit(oid).unwrap();

    repo.branch(title, &commit, false)
        .unwrap_or_else(|e| panic!("Error: failed to create branch: {}", e));

    let obj = repo
        .revparse_single(&("refs/heads/".to_owned() + title))
        .unwrap();

    repo.checkout_tree(&obj, None)
        .unwrap_or_else(|e| panic!("Error: failed to checkout branch to {}.\n {}", title, e));

    repo.set_head(&("refs/heads/".to_owned() + title))
        .unwrap_or_else(|e| panic!("Error: failed to set head to {}. \n {}", title, e));

    Ok(())
}
```

## 終わりに

シェルスクリプトで十分感は否めない。
