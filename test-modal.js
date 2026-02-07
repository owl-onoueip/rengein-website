console.log('=== 分院モーダル診断テスト ===');

// 1. モーダル要素の存在確認
const modal = document.getElementById('taishido-modal');
console.log('1. モーダル要素:', modal ? 'あり' : 'なし');
if (modal) {
    console.log('   - クラス:', modal.className);
}

// 2. 関数の存在確認
console.log('2. openTaishidoModal関数:', typeof window.openTaishidoModal);

// 3. CSS確認
if (modal) {
    const styles = window.getComputedStyle(modal);
    console.log('3. モーダルCSS:');
    console.log('   - display:', styles.display);
    console.log('   - position:', styles.position);
    console.log('   - z-index:', styles.zIndex);
}

// 4. 強制的にモーダルを表示してテスト
console.log('4. 強制表示テスト開始...');
if (modal && typeof window.openTaishidoModal === 'function') {
    window.openTaishidoModal({ preventDefault: () => { }, stopPropagation: () => { } });
    setTimeout(() => {
        console.log('5. active追加後のdisplay:', window.getComputedStyle(modal).display);
    }, 100);
}
