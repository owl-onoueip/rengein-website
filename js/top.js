document.getElementById('current-year').textContent = new Date().getFullYear();

// モーダルウィンドウの制御
document.addEventListener('DOMContentLoaded', function () {
	// 太子堂のモーダル
	const taishidoModal = document.getElementById('taishido-modal');
	const taishidoBtn = document.getElementById('taishido-btn');
	const closeModals = document.querySelectorAll('.close-modal');

	// 密蔵院のモーダル
	const mitsuzoinModal = document.getElementById('mitsuzoin-modal');
	const mitsuzoinBtn = document.getElementById('mitsuzoin-btn');

	// 三入寮のモーダル
	const sannyuryoModal = document.getElementById('sannyuryo-modal');
	const sannyuryoBtn = document.getElementById('sannyuryo-btn');

	if (taishidoBtn) {
		taishidoBtn.addEventListener('click', function (e) {
			e.preventDefault();
			taishidoModal.style.display = 'block';
			document.body.style.overflow = 'hidden'; // スクロール防止

			// モーダルが表示されたときに地図を初期化
			initTaishidoMap();
		});
	}

	if (mitsuzoinBtn) {
		mitsuzoinBtn.addEventListener('click', function (e) {
			e.preventDefault();
			mitsuzoinModal.style.display = 'block';
			document.body.style.overflow = 'hidden'; // スクロール防止

			// モーダルが表示されたときに地図を初期化
			initMitsuzoinMap();
		});
	}

	if (sannyuryoBtn) {
		sannyuryoBtn.addEventListener('click', function (e) {
			e.preventDefault();
			sannyuryoModal.style.display = 'block';
			document.body.style.overflow = 'hidden'; // スクロール防止

			// モーダルが表示されたときに地図を初期化
			initSannyuryoMap();
		});
	}

	// すべての閉じるボタンに対してイベントリスナーを設定
	closeModals.forEach(function (closeBtn) {
		closeBtn.addEventListener('click', function () {
			if (taishidoModal) taishidoModal.style.display = 'none';
			if (mitsuzoinModal) mitsuzoinModal.style.display = 'none';
			if (sannyuryoModal) sannyuryoModal.style.display = 'none';
			document.body.style.overflow = 'auto'; // スクロール再開
		});
	});

	window.addEventListener('click', function (e) {
		if (e.target == taishidoModal) {
			taishidoModal.style.display = 'none';
			document.body.style.overflow = 'auto'; // スクロール再開
		}
		if (e.target == mitsuzoinModal) {
			mitsuzoinModal.style.display = 'none';
			document.body.style.overflow = 'auto'; // スクロール再開
		}
		if (e.target == sannyuryoModal) {
			sannyuryoModal.style.display = 'none';
			document.body.style.overflow = 'auto'; // スクロール再開
		}
	});
});

// OpenStreetMapの初期化
let taishidoMap = null;
let mitsuzoinMap = null;
let sannyuryoMap = null;

function initTaishidoMap() {
	// 地図が既に初期化されている場合は何もしない
	if (taishidoMap !== null) return;

	// 太子堂の位置（久喜市下早見の座標）
	const lat = 36.0621;
	const lng = 139.6673;

	// 地図の初期化
	taishidoMap = L.map('taishido-map').setView([lat, lng], 15);

	// OpenStreetMapのタイルレイヤーを追加
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(taishidoMap);

	// マーカーを追加
	L.marker([lat, lng]).addTo(taishidoMap)
		.bindPopup('太子堂')
		.openPopup();
}

function initMitsuzoinMap() {
	// 地図が既に初期化されている場合は何もしない
	if (mitsuzoinMap !== null) return;

	// 密蔵院の位置（久喜市下早見85の座標）
	const lat = 36.0635;
	const lng = 139.6690;

	// 地図の初期化
	mitsuzoinMap = L.map('mitsuzoin-map').setView([lat, lng], 15);

	// OpenStreetMapのタイルレイヤーを追加
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(mitsuzoinMap);

	// マーカーを追加
	L.marker([lat, lng]).addTo(mitsuzoinMap)
		.bindPopup('密蔵院')
		.openPopup();
}

function initSannyuryoMap() {
	// 地図が既に初期化されている場合は何もしない
	if (sannyuryoMap !== null) return;

	// 三入寮の位置（久喜市下早見1783の座標）
	const lat = 36.0650;
	const lng = 139.6710;

	// 地図の初期化
	sannyuryoMap = L.map('sannyuryo-map').setView([lat, lng], 15);

	// OpenStreetMapのタイルレイヤーを追加
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(sannyuryoMap);

	// マーカーを追加
	L.marker([lat, lng]).addTo(sannyuryoMap)
		.bindPopup('三入寮')
		.openPopup();
}

function submitForm() {
	// 入力値をhiddenで新しいformにセットしてPOST
	const form = document.createElement('form');
	form.method = 'POST';
	form.action = 'sendmail.php';

	// 必要な値をhiddenで追加
	['name', 'email', 'phone', 'subject', 'message'].forEach(id => {
		const input = document.createElement('input');
		input.type = 'hidden';
		input.name = id;
		const el = document.getElementById(id);
		if (el) {
			input.value = el.value;
		}
		form.appendChild(input);
	});

	document.body.appendChild(form);
	form.submit();
}
