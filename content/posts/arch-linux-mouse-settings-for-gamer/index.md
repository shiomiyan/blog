---
title: Arch Linux でゲームをするためのマウス設定
date: 2021-07-07T00:27:30+09:00
description:
draft: false
author: shiomiya
categories: tech
tags:
  - arch linux

---

Arch (Manjaro) Linux でゲームができる感じのマウス設定を行う。

具体的にやることは以下の２つ。

- 加速を切る
- 垂直感度を変更する

## 設定するデバイスの確認

`xinput list` で接続されているデバイス一覧の中からマウスを見つける。

```
~  $ xinput list
⎡ Virtual core pointer                    	id=2	[master pointer  (3)]
⎜   ↳ Virtual core XTEST pointer              	id=4	[slave  pointer  (2)]
⎜   ↳ BenQ ZOWIE BenQ ZOWIE Gaming Mouse      	id=8	[slave  pointer  (2)]
⎜   ↳ Keychron Keychron K2                    	id=10	[slave  pointer  (2)]
⎣ Virtual core keyboard                   	id=3	[master keyboard (2)]
    ↳ Virtual core XTEST keyboard             	id=5	[slave  keyboard (3)]
    ↳ Power Button                            	id=6	[slave  keyboard (3)]
    ↳ Power Button                            	id=7	[slave  keyboard (3)]
    ↳ Keychron Keychron K2                    	id=11	[slave  keyboard (3)]
    ↳ Keychron Keychron K2                    	id=9	[slave  keyboard (3)]
```

自分の場合、`BenQ ZOWIE BenQ ZOWIE Gaming Mouse id=8 [slave pointer (2)]` が今回設定するデバイス。

以下では id を使って設定をしていきますが、デバイス名でも設定できるようなのでよしなに。

デバイスの設定項目の一覧は `xinput list-props` で確認できる。

```
$ xinput list-props 8
Device 'BenQ ZOWIE BenQ ZOWIE Gaming Mouse':
	Device Enabled (153):	1
	Coordinate Transformation Matrix (155):	1.000000, 0.000000, 0.000000, 0.000000, 1.000000, 0.000000, 0.000000, 0.000000, 1.000000
	libinput Natural Scrolling Enabled (287):	0
	libinput Natural Scrolling Enabled Default (288):	0
	libinput Scroll Methods Available (289):	0, 0, 1
	libinput Scroll Method Enabled (290):	0, 0, 0
	libinput Scroll Method Enabled Default (291):	0, 0, 0
	libinput Button Scrolling Button (292):	2
	libinput Button Scrolling Button Default (293):	2
	libinput Button Scrolling Button Lock Enabled (294):	0
	libinput Button Scrolling Button Lock Enabled Default (295):	0
	libinput Middle Emulation Enabled (296):	0
	libinput Middle Emulation Enabled Default (297):	0
	libinput Accel Speed (298):	0.060498
	libinput Accel Speed Default (299):	0.000000
	libinput Accel Profiles Available (300):	1, 1
	libinput Accel Profile Enabled (301):	0, 1
	libinput Accel Profile Enabled Default (302):	1, 0
	libinput Left Handed Enabled (303):	0
...
```

今回設定するのは `Coordinate Transformation Matrix` と `libinput Accel Speed`。

ではやっていく。

## マウス加速の無効化

```
$ xinput set-prop 8 'libinput Accel Speed' 0
```

## 垂直感度を設定

Windows では RawAccel を使って垂直感度を設定していたので、同じようなことを Manjaro でもやりたい。

細かなパラメータの意味とかはあまり詳しくないので知りたい方は頑張ってください。

{{< blogcard "https://unix.stackexchange.com/a/177640" >}}

自分の場合は `x:y = 1:1.23` で設定したいので、以下のようにした。

```
$ xinput set-prop 8 "Coordinate Transformation Matrix" 1 0 0 0 1.23 0 0 0 1
```

## 感想

Arch Linux で起動時に `xrandr` や `xinput` の設定を自動で適応する方法を使うべきではない言葉なので修正してくださいので、毎回手動でスクリプトを実行しているんですが、最高に面倒なのでなんとかしたい。
