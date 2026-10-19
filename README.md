# 二葉4丁目・ゴミ出しコンシェルジュ

品川区二葉4丁目向けの個人用PWAです。HTML/CSS/JavaScriptのみで動作し、サーバーやデータベースは不要です。

## ファイル構成

- `index.html`：画面の構造
- `styles.css`：スマートフォン向けデザイン
- `data.js`：収集曜日、品目、公式リンクなどのデータ
- `app.js`：日付計算、カレンダー、検索などの動作
- `manifest.json`：ホーム画面追加用のPWA設定
- `service-worker.js`：基本ファイルをキャッシュしてオフライン利用を支援
- `icons/`：アプリアイコン

## 通常収集曜日

- 燃やすごみ：毎週水曜日・土曜日
- 資源：毎週木曜日
- 陶器・ガラス・金属ごみ：第2・第4月曜日

曜日は品川区公式の二葉4丁目の収集曜日一覧を確認して設定しています。通常予定のカレンダーであり、祝日・年末年始の特別日程を自動取得する機能はありません。

## GitHub Pagesで公開する

1. GitHubにログインし、右上の `+` → `New repository` を選びます。
2. Repository name に `futaba-gomi` などを入力します。個人利用なら `Public` で作成してください。
3. `Add file` → `Upload files` を選び、このフォルダ内のファイルと `icons` フォルダをアップロードします。フォルダ構成を維持してください。
4. `Commit changes` を押します。
5. リポジトリの `Settings` → `Pages` を開きます。
6. `Build and deployment` の `Deploy from a branch` を選び、Branch は `main`、folder は `/(root)` にして `Save`。
7. 数分待つと `https://ユーザー名.github.io/futaba-gomi/` のようなURLが表示されます。実際に表示されたURLを開いて動作確認してください。

## スマートフォンのホーム画面に追加

- iPhone（Safari）：公開URLを開く → 共有ボタン →「ホーム画面に追加」
- Android（Chrome）：公開URLを開く → メニュー →「ホーム画面に追加」または「アプリをインストール」

PWAのインストールやオフラインキャッシュはHTTPS環境で利用できます。GitHub PagesはHTTPSに対応しています。

## データを変更する

`data.js` を開きます。

- `schedule`：通常収集曜日
- `items`：検索できる品目、別名、分類、注意事項
- `shortcuts`：検索画面のショートカット
- `specialDates`：特定の日の収集内容を設定する場所

品目の `category` は `burn`（燃やすごみ）、`resource`（資源）、`other`（陶器・ガラス・金属ごみ）、`special`（粗大ごみ等）、`unknown`（要確認）を使用します。新しい品目は品川区公式情報を確認してから追加してください。

### 特別収集日を設定する場合

`specialDates` は `YYYY-MM-DD` をキーにして、その日に収集されるカテゴリIDの配列を設定します。例：

```js
specialDates: {
  "2026-12-30": ["burn"],
  "2027-01-04": []
},
```

これは記法の例であり、実際の年末年始日程を示すものではありません。公式発表を確認してから入力してください。キーが存在する日は、通常曜日よりこの設定が優先されます。

## 注意点

- 品目データは公式品目一覧から確認できた一部のみです。未登録の品目は「公式情報で確認できません」と案内します。
- 特別収集日をオンラインから自動取得する機能はありません。
- オフラインでは保存済みデータを参照できますが、最新情報は取得できません。
- このアプリは公式アプリではありません。判断に迷う場合は品川区公式サイトや清掃事務所へ確認してください。

## 公式情報

- 収集曜日一覧：https://www.city.shinagawa.tokyo.jp/PC/kankyo/kankyo-gomi/gomi-kateigomi/wastedayslist/list_ha.html
- 資源・ごみ品目一覧：https://www.city.shinagawa.tokyo.jp/PC/kankyo/kankyo-gomi/20191127174730.html
- 分け方・出し方：https://www.city.shinagawa.tokyo.jp/PC/kankyo/kankyo-gomi/gomi-kateigomi/gomi-kateigomi-dashikata/hpg000005617.html
- Q&A：https://www.city.shinagawa.tokyo.jp/PC/kankyo/kankyo-gomi/20200929091450.html
