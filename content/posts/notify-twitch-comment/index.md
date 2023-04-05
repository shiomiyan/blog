---
title: ソフトウェアのインストールなしで Twitch のコメントを通知する
date: 2022-04-23T22:37:56+09:00
description:
draft: false
author: shiomiya
categories: tech
tags:
  - twitch

---

Twitch でコメントが来た際に通知音を鳴らしたい。

Streamlabs のチャットボックスでカスタム JS を書けば実現できることが分かったのでやってみる。

## 設定

Streamlabs のダッシュボードから、チャットボックスの設定を開く。

https://streamlabs.com/dashboard#/chatbox

最下部の "Enable Custom HTML/CSS" を有効にして、以下を張り付ける。

```javascript
window.addEventListener('message', function(e) {
  const data = e.data || {};
  if (data.type !== 'item')
    return;
  const message = data.message || {};
  if (message.command === 'PRIVMSG') {
    const audio = new Audio("https://uploads.twitchalerts.com/sound-defaults/new-message.ogg");
    audio.volume = 0.1;
    audio.play();
  }
});
```

![](./2022-04-23%20224539.png)

最後に、OBS のブラウザソースからコメントボックスを設定して終わり。

自分の配信にコメントして通知が OBS から鳴っていることを確認できるはず。

#### 参考

読み上げまで行いたい場合、以下の記事を参考に設定できる。

- [棒読みちゃんなどのインストール無しで簡単にTwitchチャットの読み上げを行う](https://blog.misosi.ru/2019/01/28/twitch-read-out-only-web-browser/)