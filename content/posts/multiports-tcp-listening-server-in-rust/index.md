---
title: マルチポートな待ち受けサーバーを Rust で書く
date: 2021-12-20T22:55:19+09:00
description:
draft: false
author: shiomiya
categories: tech
tags:
  - rust

---

とある理由で「複数ポートで待ち受けて、ポートによってそれぞれ別の処理をするサーバー」を書きたくなったので書く。

**要件**

- 3 ポートで待ち受ける
- レスポンスはいらない（遮断して OK）

以上。すべて標準ライブラリでやる。というか多分いらない。

## 単一ポートの普通のやつを書く

```rust
use std::net::{TcpListener, TcpStream};
use std::time::Duration;
use std::thread;

fn handle_client(stream: TcpStream, secs: u64) {
    let peer_addr = stream.peer_addr().unwrap();
    let local_addr = stream.local_addr().unwrap();

    println!("new connection from {} to {}", peer_addr, local_addr);

    // sleep and close connection
    thread::sleep(Duration::from_secs(secs));
    stream.shutdown(Shutdown::Both).unwrap();
    println!("connection closed");
}

fn main() -> std::io::Result<()> {
    for stream in TcpListener::bind("127.0.0.1:8081").unwrap().incoming() {
        match stream {
            Ok(stream) => handle_client(stream, 5),
            Err(e) => println!("connection failed: {:?}", e),
        };
    }
    Ok(())
}
```

ほぼサンプルコード通り。

## マルチポートにする


```rust
use std::{
    net::{Shutdown, TcpListener, TcpStream},
    thread,
    time::Duration,
};


fn handle_client(stream: TcpStream, secs: u64) {
    let peer_addr = stream.peer_addr().unwrap();
    let local_addr = stream.local_addr().unwrap();

    println!("new connection from {} to {}", peer_addr, local_addr);

    // sleep and close connection
    thread::sleep(Duration::from_secs(secs));
    stream.shutdown(Shutdown::Both).unwrap();
    println!("connection closed");
}

fn main() -> std::io::Result<()> {
    thread::spawn(|| {
        for stream in TcpListener::bind("127.0.0.1:8081").unwrap().incoming() {
            match stream {
                Ok(stream) => handle_client(stream, 5),
                Err(e) => println!("connection failed: {:?}", e),
            };
        }
    });

    thread::spawn(|| {
        for stream in TcpListener::bind("127.0.0.1:8082").unwrap().incoming() {
            match stream {
                Ok(stream) => handle_client(stream, 10),
                Err(e) => println!("connection failed: {:?}", e),
            };
        }
    });

    for stream in TcpListener::bind("127.0.0.1:8083").unwrap().incoming() {
        match stream {
            Ok(stream) => handle_client(stream, 15),
            Err(e) => println!("connection failed: {:?}", e),
        };
    }
    Ok(())
}
```

スレッドを n 個まとめて生成する方法がわからず、こんな残念そうな実装になってる。

`thread::spawn` してスレッドを生成し、並列でポートをバインドしていくだけ。

8083 ポートにバインドしているところが処理を継続し続けてくれているので、`.join().unwrap()` みたいなのはしなくても動いてくれる。たぶん。

大量にリクエストが来た時にどうなるのかは試してないのでわかりません。
