import { $dom } from './global/globalDom';
import { style } from './styles/style';
import { calculateCart } from './utils/calculateCart';
import { registerEventListeners } from './utils/eventListeners';
import {
  initPromotionTimers,
  updateProductSelectOptions,
} from './utils/promotionTimers';

function main() {
  // UI 요소 생성
  const $root = document.getElementById('app');

  $root.innerHTML = `
    <div class="${style.container}">
      <div class="${style.wrapper}">
        <h1 class="${style.heading}">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="${style.totalDisplay}"></div>
        <select id="product-select" class="${style.productSelect}"></select>
        <button id="add-to-cart" class="${style.addToCartBtn}">추가</button>
        <div id="stock-status" class="${style.stockStatusDisplay}"></div>
      </div>
    </div>
  `;
  // 전역적으로 쓰이는 요소는 $dom객체에 저장해서 전역적으로 관리
  $dom.$cartContainer = document.getElementById('cart-items');
  $dom.$totalDisplay = document.getElementById('cart-total');
  $dom.$productSelect = document.getElementById('product-select');
  $dom.$addToCartBtn = document.getElementById('add-to-cart');
  $dom.$stockStatusDisplay = document.getElementById('stock-status');

  updateProductSelectOptions();
  // 장바구니 초기 계산
  calculateCart();
  // 프로모션 타이머 설정
  initPromotionTimers();
}

main();
initPromotionTimers();
registerEventListeners();
