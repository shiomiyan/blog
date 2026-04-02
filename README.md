## blog.736b.moe

ブログです。

## External feed snapshots

- 通常の `pnpm run build` は `src/content/external/*.json` を読み込み、ビルド中にRSSを取りに行きません。
- 外部フィードを更新したいときは `pnpm run fetch-feeds` を実行します。
- GitHub Actions の cron job でも同じスクリプトを日次実行し、更新があれば snapshot JSON を自動コミットします。
