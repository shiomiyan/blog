---
title: Astroで外部サイトのRSSから取得した記事を混ぜて表示するときのメモ
date: 2025-04-13T12:01:06.775Z
description: ""
ulid: 01JRQGCNPR70143HF9Y7KVNFY1
tags:
  - astro
  - typescript
category: Tech
---

Astroで外部サイトのRSSから記事を取得して、ブログに混ぜて表示するときのメモ。

## Details

Astro 5.0以降では[Content Loader API](https://docs.astro.build/en/reference/content-loader-reference/#object-loaders)が用意されており、任意のリソースからContentCollectionを生成できる。

たとえばこのブログでは、次のように定義することで、ZennとQiitaの記事をそれぞれRSSから取り込んでいる。

```ts
// Astro内部の記事
const posts = defineCollection({
	type: "content",
	schema: postSchema,
});

// ZennのRSSから取得した記事
const zenn = defineCollection({
	loader: rssLoader({ url: "https://zenn.dev/736b/feed", tag: "zenn" }),
});

// QiitaのRSSから取得した記事
const qiita = defineCollection({
	loader: rssLoader({ url: "https://qiita.com/736b/feed", tag: "qiita" }),
});

export const collections = { posts, zenn, qiita };
```

loaderは自前で[定義している](https://github.com/shiomiyan/blog/blob/master/src/loader.ts#L5-L41)。

これらを記事一覧に（時系列で）混ぜて表示するときは、1つの配列にまとめてから日付でソートしたくなる。

## 悩んだ

少なくとも私の実装では内部記事のスキーマと外部記事のスキーマが同じではないため、そのままでは混ぜることができない。ので、多分適当に抽象化するのがいいのだと思う。

```ts
type Post = {
  collection: string;
  id: string;
  data: {
    title: string;
    pubdate: Date;
    link: string;
		// ...
  };
};

const merged = async (): Promise<Post[]> => {
	const result: Post[] = [];
	const posts = (await getCollection("posts")) as Post[];
	const zenn = (await getCollection("zenn")) as Post[];
	const qiita = (await getCollection("qiita")) as Post[];
	result.push(...posts, ...zenn, ...qiita);

	// resultを日付でソートする処理（ここでは省略）

	return result;
};
```

みたいな。でもこれだと次の問題がある。

- 型情報はほぼ欠落してる
- ので、後々undefinedではないことが自明な値にまでハンドリングを強いられる

とにかく、せっかくのContentCollectionのメリットがないよなぁとなっていた。

## 解決した

そもそも組み込みの`getCollection`関数で任意のコレクション名から取得できてるんだから、Astroにいい感じの仕組みがあるだろ、と思ってたら、あった。
Astroでは、`getCollection`関数は次のように定義されていた。

> ```ts
> export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
> 	collection: C,
> 	filter?: (entry: CollectionEntry<C>) => entry is E,
> ): Promise<E[]>;
> export function getCollection<C extends keyof AnyEntryMap>(
> 	collection: C,
> 	filter?: (entry: CollectionEntry<C>) => unknown,
> ): Promise<CollectionEntry<C>[]>;
> ```
> https://github.com/withastro/astro/blob/main/packages/astro/templates/content/types.d.ts#L67-L74

正直細かいことはよくわかっていないが、`AnyEntryMap`と`CollectionEntry`あたりは使えそうだな。ということで書いてみたのがこれ。

```ts
export const getCollectionByCollectionKeys = async <
	C extends keyof AnyEntryMap,
>(
	...collections: C[]
): Promise<CollectionEntry<C>[]> => {
	const result: CollectionEntry<C>[] = [];
	for (const collection of collections) {
		const posts = await getCollection(collection);
		result.push(...posts);
	}
	result.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
	return result;
};
```

これで、次のように記事を取得できる。

```ts
const posts = await getCollectionByCollectionKeys("posts", "zenn", "qiita");
```

キーに指定できるのは`keyof AnyEntryMap`なので、私の場合は`"posts" | "zenn" | "qiita"`という感じになる。これら以外を指定するとエラーになるので、誤ったキーを指定する心配もない。

あとから組み込みたいリソース取得先が増えてもまぁなんとかなる。

## おわり

標準装備されていても良くないか。見落としてるのかな。

TypeScriptの型分かり手になりたい。
