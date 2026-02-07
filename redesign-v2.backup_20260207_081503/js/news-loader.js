/**
 * news-loader.js
 * Google Sheets (via GAS) からお知らせデータを取得して表示するスクリプト
 */

// ユーザーが作成したGASウェブアプリのURLをここに設定します
// まだ設定されていない場合は、デモ用の配列または空の状態を表示します
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbzu2OFSMg91CUg_AkGVB3-YOcEgeQWJT5hK2Ai6rHUztjRP94xl6_bH2X4zUXyOmf7K9Q/exec';

// お知らせを表示するコンテナのID
const NEWS_CONTAINER_ID = 'news-list-container';

/**
 * お知らせデータを取得して表示するメイン関数
 */
async function loadNews() {
    const container = document.getElementById(NEWS_CONTAINER_ID);
    if (!container) return;

    // ローディング表示（必要であれば）
    // container.innerHTML = '<p class="loading-news">お知らせを読み込み中...</p>';

    try {
        let newsData = [];

        if (GAS_API_URL) {
            // GASからデータを取得
            const response = await fetch(GAS_API_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            newsData = await response.json();
        } else {
            // API未設定時のデモデータ（または空配列）
            // Google Sheetsの設定が完了するまでは、このデータが表示されます
            console.warn('GAS_API_URL is not set. Using demo data.');
            newsData = [
                {
                    date: '2024.08.01',
                    category: '法要',
                    title: 'お盆の大施餓鬼会について',
                    content: '今年のお盆法要は8月15日に執り行います。詳細は行事ページをご確認ください。',
                    link: ''
                },
                {
                    date: '2024.07.15',
                    category: '行事',
                    title: '夏祭り「蓮華祭」開催のお知らせ',
                    content: '恒例の夏祭りを開催いたします。境内での出店や盆踊りなど、皆様のお越しをお待ちしております。',
                    link: ''
                },
                {
                    date: '2024.06.30',
                    category: 'ご案内',
                    title: 'ホームページをリニューアルしました',
                    content: 'スマートフォン対応およびデザインを一新しました。今後ともよろしくお願いいたします。',
                    link: ''
                }
            ];
        }

        renderNews(newsData, container);

    } catch (error) {
        console.error('Failed to load news:', error);
        container.innerHTML = '<p class="error-news">お知らせの読み込みに失敗しました。</p>';
    }
}

/**
 * ニュースデータをHTMLにレンダリングする関数
 * @param {Array} data ニュースデータの配列
 * @param {HTMLElement} container 表示先のコンテナ要素
 */
function renderNews(data, container) {
    if (!data || data.length === 0) {
        container.innerHTML = '<p class="no-news">現在お知らせはありません。</p>';
        return;
    }

    const html = data.map(item => `
        <article class="news-item">
            <div class="news-date">${escapeHtml(item.date)}</div>
            <div class="news-tag">${escapeHtml(item.category)}</div>
            <div class="news-title">${escapeHtml(item.title)}</div>
            <p class="news-excerpt">${escapeHtml(item.content)}</p>
            ${item.link ? `<a href="${escapeHtml(item.link)}" class="news-link" target="_blank">詳細を見る <i class="fas fa-chevron-right"></i></a>` : ''}
        </article>
    `).join('');

    container.innerHTML = html;
}

/**
 * HTMLエスケープ処理（XSS対策）
 */
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function (m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}

// ドキュメント読み込み完了時に実行
document.addEventListener('DOMContentLoaded', loadNews);
