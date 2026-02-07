// ==========================================
// 蓮花院 お知らせ管理システム
// ==========================================

const ADMIN_PASSWORD = 'pass1234';
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbzu2OFSMg91CUg_AkGVB3-YOcEgeQWJT5hK2Ai6rHUztjRP94xl6_bH2X4zUXyOmf7K9Q/exec';

let newsData = [];
let editingIndex = null;

// ==========================================
// 初期化
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    checkAuth();
    setupEventListeners();
});

// 認証チェック（常にログイン画面を表示）
function checkAuth() {
    // 毎回パスワード認証を求める
    showLoginScreen();
}

// イベントリスナー設定
function setupEventListeners() {
    // ログインフォーム
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // ログアウトボタン
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // 新規追加ボタン
    document.getElementById('add-news-btn').addEventListener('click', () => openEditModal());

    // モーダル閉じる
    document.getElementById('close-modal').addEventListener('click', closeEditModal);
    document.getElementById('cancel-btn').addEventListener('click', closeEditModal);

    // 編集フォーム送信
    document.getElementById('edit-form').addEventListener('submit', handleSave);

    // モーダル背景クリックで閉じる
    document.getElementById('edit-modal').addEventListener('click', function (e) {
        if (e.target === this) closeEditModal();
    });
}

// ==========================================
// 認証
// ==========================================

function handleLogin(e) {
    e.preventDefault();

    const password = document.getElementById('password-input').value;
    const errorMsg = document.getElementById('error-message');

    if (password === ADMIN_PASSWORD) {
        // localStorage には保存せず、その場で管理画面を表示
        showAdminScreen();
        loadNews();
        errorMsg.textContent = '';
        document.getElementById('password-input').value = '';
    } else {
        errorMsg.textContent = 'パスワードが間違っています';
        document.getElementById('password-input').value = '';
    }
}

function handleLogout() {
    if (confirm('ログアウトしますか？')) {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-screen').style.display = 'none';
}

function showAdminScreen() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-screen').style.display = 'block';
}

// ==========================================
// お知らせ読み込み
// ==========================================

const CACHE_KEY = 'rengein_news_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24時間（念のため）

async function loadNews() {
    const newsList = document.getElementById('news-list');

    // 1. キャッシュがあれば先に表示（Stale-While-Revalidate）
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
        try {
            const parsed = JSON.parse(cachedData);
            console.log('📦 キャッシュからデータを読み込みました');
            newsData = parsed.data;
            renderNewsList();

            // バックグラウンド更新中であることを示す（オプション）
            // newsList.insertAdjacentHTML('afterbegin', '<p class="updating-msg"><i class="fas fa-sync fa-spin"></i> 最新情報を確認中...</p>');
        } catch (e) {
            console.error('キャッシュ読み込みエラー', e);
        }
    } else {
        newsList.innerHTML = '<p class="loading"><i class="fas fa-spinner fa-spin"></i> 読み込み中...</p>';
    }

    // 2. 最新データを非同期で取得
    try {
        const response = await fetch(GAS_API_URL);
        const data = await response.json();

        // データに変更があれば更新
        // （簡易的な比較：JSON文字列にして比較）
        if (JSON.stringify(data) !== JSON.stringify(newsData)) {
            console.log('✨ 新しいデータが見つかりました');
            newsData = data;
            renderNewsList();

            // 新しいデータをキャッシュに保存
            saveCache(data);

            if (cachedData) {
                // ユーザーに通知（邪魔にならない程度に）
                const toast = document.createElement('div');
                toast.className = 'toast-notification';
                toast.textContent = '最新情報に更新されました';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
            }
        } else {
            console.log('✅ データは最新です');
        }

    } catch (error) {
        console.error('お知らせ読み込みエラー:', error);
        if (!newsData.length) {
            newsList.innerHTML = '<p class="loading" style="color: #ff6b6b;">読み込みに失敗しました</p>';
        }
    }
}

function saveCache(data) {
    const cacheObj = {
        timestamp: new Date().getTime(),
        data: data
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));
}

function renderNewsList() {
    const newsList = document.getElementById('news-list');

    if (newsData.length === 0) {
        newsList.innerHTML = '<p class="loading">お知らせはありません</p>';
        return;
    }

    newsList.innerHTML = newsData.map((news, index) => `
        <div class="news-card">
            <div class="news-card-header">
                <div class="news-meta">
                    <span class="news-date">
                        <i class="fas fa-calendar"></i> ${news.date}
                    </span>
                    <span class="news-category">
                        <i class="fas fa-tag"></i> ${news.category}
                    </span>
                </div>
                <div class="news-actions">
                    <button class="btn btn-primary" onclick="openEditModal(${index})">
                        <i class="fas fa-edit"></i> 編集
                    </button>
                    <button class="btn btn-danger" onclick="handleDelete(${index})">
                        <i class="fas fa-trash"></i> 削除
                    </button>
                </div>
            </div>
            <h3 class="news-title">${news.title}</h3>
            <p class="news-content">${news.content}</p>
            ${news.link ? `<a href="${news.link}" class="news-link" target="_blank"><i class="fas fa-link"></i> リンクを開く</a>` : ''}
        </div>
    `).join('');
}

// ==========================================
// 編集モーダル
// ==========================================

function openEditModal(index = null) {
    editingIndex = index;
    const modal = document.getElementById('edit-modal');
    const title = document.getElementById('modal-title');

    if (index !== null) {
        // 編集モード
        title.textContent = 'お知らせを編集';
        const news = newsData[index];

        document.getElementById('edit-id').value = index;
        document.getElementById('edit-date').value = formatDateForInput(news.date);
        document.getElementById('edit-category').value = news.category;
        document.getElementById('edit-title').value = news.title;
        document.getElementById('edit-content').value = news.content;
        document.getElementById('edit-link').value = news.link || '';
    } else {
        // 新規追加モード
        title.textContent = 'お知らせを追加';
        document.getElementById('edit-form').reset();
        document.getElementById('edit-date').value = new Date().toISOString().split('T')[0];
    }

    modal.classList.add('active');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('active');
    document.getElementById('edit-form').reset();
    editingIndex = null;
}

function formatDateForInput(dateStr) {
    // "2026.02.05" → "2026-02-05"
    return dateStr.replace(/\./g, '-');
}

function formatDateForDisplay(dateStr) {
    // "2026-02-05" → "2026.02.05"
    return dateStr.replace(/-/g, '.');
}

// ==========================================
// 保存
// ==========================================

async function handleSave(e) {
    e.preventDefault();

    const date = formatDateForDisplay(document.getElementById('edit-date').value);
    const category = document.getElementById('edit-category').value;
    const title = document.getElementById('edit-title').value;
    const content = document.getElementById('edit-content').value;
    const link = document.getElementById('edit-link').value;

    const newsItem = { date, category, title, content, link };

    try {
        if (editingIndex !== null) {
            // 編集
            await saveToGAS('edit', editingIndex, newsItem);
            newsData[editingIndex] = newsItem;
            alert('✅ お知らせを更新しました！');
        } else {
            // 新規追加
            await saveToGAS('add', null, newsItem);
            newsData.unshift(newsItem);
            alert('✅ お知らせを追加しました！');
        }

        renderNewsList();
        closeEditModal();
    } catch (error) {
        console.error('保存エラー:', error);
        alert('❌ 保存に失敗しました。\n\nエラー: ' + error.message + '\n\nGASスクリプトが更新されているか確認してください。');
    }
}

// ==========================================
// 削除
// ==========================================

async function handleDelete(index) {
    const news = newsData[index];

    if (confirm(`「${news.title}」を削除しますか？`)) {
        try {
            await saveToGAS('delete', index, null);
            newsData.splice(index, 1);
            renderNewsList();
            alert('✅ お知らせを削除しました！');
        } catch (error) {
            console.error('削除エラー:', error);
            alert('❌ 削除に失敗しました。\n\nエラー: ' + error.message + '\n\nGASスクリプトが更新されているか確認してください。');
        }
    }
}

// ==========================================
// GAS API通信
// ==========================================

async function saveToGAS(action, index, data) {
    const payload = {
        action: action,  // 'add', 'edit', 'delete'
        index: index,
        data: data
    };

    const response = await fetch(GAS_API_URL, {
        method: 'POST',
        mode: 'no-cors',  // CORS対応
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    // no-corsモードでは response.json() が使えないため、
    // エラーがなければ成功と見なす
    if (!response.ok && response.status !== 0) {
        throw new Error('GASへの送信に失敗しました');
    }

    // 保存後、最新データを再読み込み（GASからの返却を待つより、ローカルを更新した方が速いが、整合性のためloadNewsを呼ぶ）
    // ただし、loadNews内でもキャッシュ更新が行われる
    await loadNews();
}

console.log('蓮花院 お知らせ管理システムを読み込みました');
console.log('✅ 本番モード: 保存・削除はGoogle Sheetsに反映されます');
