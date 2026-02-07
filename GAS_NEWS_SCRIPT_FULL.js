// ==========================================
// 蓮花院 お知らせ管理 GASスクリプト（完全版）
// ==========================================

// スプレッドシートIDを設定（現在のスプレッドシートを使用）
const SHEET_NAME = 'シート1'; // または実際のシート名

/**
 * GET リクエスト - お知らせ一覧を取得
 */
function doGet(e) {
    try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
        const data = sheet.getDataRange().getValues();

        // ヘッダー行を除外
        const headers = data[0];
        const rows = data.slice(1);

        // JSON形式に変換
        const newsArray = rows.map(row => ({
            date: row[0],
            category: row[1],
            title: row[2],
            content: row[3],
            link: row[4] || ''
        }));

        return ContentService
            .createTextOutput(JSON.stringify(newsArray))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({ error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * POST リクエスト - お知らせの追加・編集・削除
 */
function doPost(e) {
    try {
        const params = JSON.parse(e.postData.contents);
        const action = params.action; // 'add', 'edit', 'delete'

        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

        let result;

        switch (action) {
            case 'add':
                result = addNews(sheet, params.data);
                break;
            case 'edit':
                result = editNews(sheet, params.index, params.data);
                break;
            case 'delete':
                result = deleteNews(sheet, params.index);
                break;
            default:
                throw new Error('無効なアクション: ' + action);
        }

        return ContentService
            .createTextOutput(JSON.stringify({ success: true, result: result }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * お知らせ追加
 */
function addNews(sheet, data) {
    // 2行目（ヘッダーの次）に挿入
    sheet.insertRowBefore(2);

    sheet.getRange(2, 1).setValue(data.date);
    sheet.getRange(2, 2).setValue(data.category);
    sheet.getRange(2, 3).setValue(data.title);
    sheet.getRange(2, 4).setValue(data.content);
    sheet.getRange(2, 5).setValue(data.link || '');

    return 'お知らせを追加しました';
}

/**
 * お知らせ編集
 */
function editNews(sheet, index, data) {
    // index は0始まり、実際の行は index + 2（ヘッダー分）
    const row = index + 2;

    sheet.getRange(row, 1).setValue(data.date);
    sheet.getRange(row, 2).setValue(data.category);
    sheet.getRange(row, 3).setValue(data.title);
    sheet.getRange(row, 4).setValue(data.content);
    sheet.getRange(row, 5).setValue(data.link || '');

    return 'お知らせを更新しました';
}

/**
 * お知らせ削除
 */
function deleteNews(sheet, index) {
    // index は0始まり、実際の行は index + 2（ヘッダー分）
    const row = index + 2;

    sheet.deleteRow(row);

    return 'お知らせを削除しました';
}

/**
 * テスト用関数
 */
function testGet() {
    const result = doGet();
    Logger.log(result.getContent());
}

function testAdd() {
    const e = {
        postData: {
            contents: JSON.stringify({
                action: 'add',
                data: {
                    date: '2026.02.07',
                    category: 'テスト',
                    title: 'テスト投稿',
                    content: 'これはテストです',
                    link: ''
                }
            })
        }
    };
    const result = doPost(e);
    Logger.log(result.getContent());
}
