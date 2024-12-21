// 注意: このスクリプトは現在表示されている商品の価格のみを集計します
// スクロールして新たに読み込まれた商品は、読み込み後に自動的に反映されます

// 合計金額の表示場所を取得
const itemView = document.getElementById('wl-item-view');

// 合計金額の表示部分を作成
const priceElement = document.createElement('div');
priceElement.style.fontSize = '32px';
priceElement.style.fontWeight = 'bold';
priceElement.style.margin = '18px 0';
// 一番上に追加
itemView.insertBefore(priceElement, itemView.firstChild);

function updateTotalPrice() {
		// 各商品の価格要素を取得
		// 注意: ほしいものリストのHTML構造が変更された場合、以下のIDやクラス名では取得できなくなる可能性があります
		const priceList = document.querySelectorAll('#wishlist-page .a-offscreen');

		let totalPrice = 0;
		Array.from(priceList).forEach((priceStr) => {
				// ￥記号やカンマを除去して数字に変換
				const priceNum = Number(priceStr.textContent.replace(/[￥,]/g, ''));
				if (!isNaN(priceNum)) {
						totalPrice += priceNum;
				}
		});

		// 合計金額を日本円形式に変換
		const formattedTotalPrice = new Intl.NumberFormat(
				'ja-JP',
				{
						style: 'currency',
						currency: 'JPY'
				}
		).format(totalPrice);

		// 表示を更新
		priceElement.textContent = '合計: ' + formattedTotalPrice;
}

// 初回表示
updateTotalPrice();

// 新しく読み込まれた商品にも対応するために監視
// スクロールで新しい商品が読み込まれたら自動的に再計算
const observer = new MutationObserver((mutations) => {
		// priceElementへの変更は無視（無限ループ防止）
		const shouldUpdate = mutations.some(mutation => {
			return !priceElement.contains(mutation.target) && mutation.target !== priceElement;
		});

		if (shouldUpdate) {
				updateTotalPrice();
		}
});

observer.observe(itemView, { childList: true, subtree: true });
