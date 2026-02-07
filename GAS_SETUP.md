# Google Sheets & GAS セットアップ手順

このシステムでは、Googleスプレッドシートを「管理画面兼データベース」として利用します。

## 手順 1: スプレッドシートの準備

1. Googleスプレッドシートを新規作成します。
2. 1行目に以下の見出しを入力してください（A列〜D列）。
   - **A1**: `Date` (例: 2026.02.05)
   - **B1**: `Category` (例: 法要, 行事, その他)
   - **C1**: `Title` (例: お盆法要のお知らせ)
   - **D1**: `Content` (例: 本文...)
   - **E1**: `Link` (任意: 詳細ページのURLなど)

## 手順 2: GAS (スクリプト) の設定

1. スプレッドシートのメニューから **「拡張機能」 > 「Apps Script」** を開きます。
2. エディタが開くので、既存のコードを消して、以下のコードを貼り付けてください。

```javascript
// シート名（変更した場合はここも合わせてください）
const SHEET_NAME = 'シート1';

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const rows = sheet.getDataRange().getValues();
  
  // 1行目はヘッダーなので削除
  const header = rows.shift();
  
  // データ形式を変換
  const data = rows.map(row => {
    return {
      date: formatDate(row[0]), // 日付フォーマット変換
      category: row[1],
      title: row[2],
      content: row[3],
      link: row[4]
    };
  }).filter(item => item.title && item.date); // タイトルと日付があるものだけ抽出
  
  // JSONとして返す
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// 日付を YYYY.MM.DD 形式にする関数
function formatDate(date) {
  if (!date) return "";
  if (typeof date === 'string') return date;
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy.MM.dd");
}
```

## 手順 3: デプロイ（公開）

1. 画面右上の **「デプロイ」** ボタン > **「新しいデプロイ」** を選択。
2. 「種類の選択」の歯車アイコンから **「ウェブアプリ」** を選択。
3. 以下の設定にします：
   - **説明**: `News API` （なんでもOK）
   - **次のユーザーとして実行**: `自分`
   - **アクセスできるユーザー**: `全員` (**重要！**)
4. **「デプロイ」** をクリック。
5. **「ウェブアプリのURL」** が表示されるので、**コピー** してください。

## 手順 4: サイトへの反映

1. コピーしたURLを、`js/news-loader.js` の以下の部分に貼り付けてください。

```javascript
const GAS_API_URL = 'ここにコピーしたURLを貼り付け';
```

これで完了です！
スプレッドシートに行を追加すると、ウェブサイトのお知らせも更新されるようになります。
