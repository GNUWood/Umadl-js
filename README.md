# ウマ娘立ち絵一括ダウンローダー

[ウマ娘プロジェクト公式ポータルサイト](https://umamusume.jp)で使われているウマ娘の立ち絵を一括ダウンロードします。

[以前作ったスクリプト](https://github.com/GNUWood/umamusume_bulk_picture_downloader)のJavascript版です。

## 機能

- スクリプト実行ごとに分単位で差分を作成
- 制服、勝負服、原案、Starting Future、トレセン学園関係者別にフォルダ分け
- キャラクター情報をjson形式で保存
- IDとキャラクター名を紐付けたtxtドキュメントを保存


## 使用方法

確認済環境

- macOS Sonoma 14.5
- Node.js v20.13.1
  ```javascript
  node main.js
  ```
