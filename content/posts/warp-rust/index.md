---
title: 'warpでJsonを返すHTTPサーバーを作るやつ'
date: 2021-10-27T20:38:12.000+09:00
description:
author: shiomiya
categories: tech
tags:
- rust
- scraping

---
## やりたいこと

クエリ文字列から URL を受け取って、Open Graph 関連の meta タグを json で返す API サーバー的なものを作る。

使う crate は以下。

```
tokio = { version = "1", features = ["full"] }
warp = "0.3"
reqwest = { version = "0.11", features = ["json", "blocking"] }
scraper = "0.12.0"
select = "0.5.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

## とりあえず warp 使ってみる

クエリ文字列で渡された URL を GET したレスポンスをまずは丸ごと返してみる。

- https://github.com/seanmonstar/warp/blob/master/examples/futures.rs

warp の examples に Future を扱う場合のものがあるので、参考にしながらやっていく。

```rust
use std::{collections::HashMap, convert::Infallible};

use warp::{Filter, Reply};

#[tokio::main]
async fn main() {
    let api = warp::get()
        .and(warp::path("api"))
        .and(warp::query::<HashMap<String, String>>())
        .map(|p: HashMap<String, String>| p.get("url").unwrap().to_string())
        .and_then(fetch_meta);

    warp::serve(api).run(([127, 0, 0, 1], 3030)).await;
}

async fn fetch_meta(url: String) -> Result<impl Reply, Infallible> {
    let resp = reqwest::get(url).await.unwrap();
    let text = resp.text().await.unwrap();
    Ok(format!("{}", text))
}
```

httpbin 辺りを叩いて、動いてるか確認してみる。

```
PS C:\Users\sk\dev\ogp-parser> curl -v http://localhost:3030/api?url=https://httpbin.org/ip
*   Trying ::1...
* TCP_NODELAY set
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 3030 (#0)
> GET /api?url=https://httpbin.org/ip HTTP/1.1
> Host: localhost:3030
> User-Agent: curl/7.55.1
> Accept: */*
>
< HTTP/1.1 200 OK
< content-type: text/plain; charset=utf-8
< content-length: 33
< date: Sat, 23 Oct 2021 17:39:38 GMT
<
{
  "origin": "116.82.127.225"
}
* Connection #0 to host localhost left intact
```

OK。

## 対象サイトの meta を取得する

HTML のパースは [select.rs](https://github.com/utkarshkukreti/select.rs) というスクレイピングライブラリがあったので、それを使ってみる（[html5ever](https://github.com/servo/html5ever) のほうがよかったかな...）。

`fetch_meta` をいじっていく。

```rust
#[derive(Debug, Clone, PartialEq, Serialize)]
struct MetaInfo {
    og_title: String,
    og_image: String,
    og_description: String,
    og_type: String,
    og_url: String,
    og_sitename: String,
}

async fn fetch_meta(url: String) -> Result<impl Reply, Infallible> {
    let resp = reqwest::get(url).await.unwrap();
    let body = resp.text().await.unwrap();
    let document = Document::from_read(body.as_bytes()).unwrap();
    let mut map: HashMap<String, String> = HashMap::new();
    let _result = document
        .find(Name("meta"))
        .filter(|v| v.attrs().collect::<Vec<_>>().len() == 2)
        .for_each(|v| {
            let attrs = v.attrs().collect::<Vec<_>>();
            if attrs[0].0 == "property" && attrs[1].0 == "content" {
                map.insert(attrs[0].1.to_string(), attrs[1].1.to_string());
            } else {
                ()
            }
        });

    let meta = MetaInfo {
        og_title: map.get("og:title").unwrap_or(&String::from("")).to_string(),
        og_image: map.get("og:image").unwrap_or(&String::from("")).to_string(),
        og_description: map
            .get("og:description")
            .unwrap_or(&String::from(""))
            .to_string(),
        og_type: map.get("og:type").unwrap_or(&String::from("")).to_string(),
        og_url: map.get("og:url").unwrap_or(&String::from("")).to_string(),
        og_sitename: map
            .get("og:site_name")
            .unwrap_or(&String::from(""))
            .to_string(),
    };

    Ok(warp::reply::json(&meta))
}
```

ちょっと冗長な感じはするけど、とりあえずこれで。

ゆくゆくはこのブログで使いたいので、適当な記事の meta を取れるか確認。

```
PS C:\Users\sk> curl -v http://localhost:3030/api?url=https://www.rhpav7.com/posts/xenics-titan-gx-air-wireless-review/
*   Trying ::1...
* TCP_NODELAY set
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 3030 (#0)
> GET /api?url=https://www.rhpav7.com/posts/xenics-titan-gx-air-wireless-review/ HTTP/1.1
> Host: localhost:3030
> User-Agent: curl/7.55.1
> Accept: */*
>
< HTTP/1.1 200 OK
< content-type: application/json
< content-length: 440
< date: Wed, 27 Oct 2021 13:03:27 GMT
<
{"og_title":"XENICS TITAN GX AIR WIRELESS レビュー - .umirc","og_image":"","og_description":"買いました。 qoo10 で注文して、だいたい 1 週間ちょいくらいで届いた。 2 年近く ZOWIE S2 を使っていて、形も好きだったので S2 クローンでワイヤレスを使ってみた","og_type":"article","og_url":"https://www.rhpav7.com/posts/xenics-titan-gx-air-wireless-review/","og_sitename":".umirc"}* Connection #0 to host localhost left intact
```

いい感じ！

## おわりに

Rust 書くの楽しい。雰囲気で書いてるのでちゃんと Rust できるようになりたいです。
