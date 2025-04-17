import { $dom } from "./global/globalDom";
import { store } from "./global/store";
import { style } from "./styles/style";
import { calculateCart } from "./utils/calculateCart";
import { PRODUCT_LIST } from "./global/constants";

const LUCKY_SALE_RATE = 0.8;
const SUGGESTION_SALE_RATE = 0.95;
const LUCKY_SALE_INTERVAL = 30000;
const SUGGESTION_SALE_INTERVAL = 60000;

const QYT_SEPARATOR = 'x ';

// -----유틸함수-----
function findProductById(productId) {
  return PRODUCT_LIST.find((product) => product.id === productId);
}

function extractQuantityFromText(text) {
  return parseInt(text.split(QYT_SEPARATOR)[1]);
}

function replaceQuantityInText(text, newQuantity) {
  const baseText = text.split(QYT_SEPARATOR)[0];
  return `${baseText}${QYT_SEPARATOR}${newQuantity}`;
}

function createElementWithClass(tag, className) {
  const el = document.createElement(tag);
  el.className = className;
  return el;
}

function createProductOption(product) {
  const $option = document.createElement('option');
  $option.value = product.id;
  $option.textContent = `${product.name} - ${product.price}원`;
  if (product.quantity === 0) $option.disabled = true;
  return $option;
}


// -----유틸함수-----

function initPromotionTimers() {
  // 번개세일 타이머 설정
  setTimeout(() => {
    setInterval(() => {
      const luckyProduct =
        PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];
      if (Math.random() < 0.3 && luckyProduct.quantity > 0) {
        luckyProduct.price = Math.round(luckyProduct.price * LUCKY_SALE_RATE);
        alert(`번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
        updateProductSelectOptions();
      }
    }, LUCKY_SALE_INTERVAL);
  }, Math.random() * LUCKY_SALE_INTERVAL);

  // 추천 상품 할인 타이머
  setTimeout(() => {
    setInterval(() => {
      if (store.lastSelectedProductId) {
        const suggestion = PRODUCT_LIST.find(
          (product) =>
            product.id !== store.lastSelectedProductId && product.quantity > 0
        );
        if (suggestion) {
          alert(
            `${suggestion.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
          );
          suggestion.price = Math.round(
            suggestion.price * SUGGESTION_SALE_RATE
          );
          updateProductSelectOptions();
        }
      }
    }, SUGGESTION_SALE_INTERVAL);
  }, Math.random() * SUGGESTION_SALE_INTERVAL);
}

// 상품 드롭다운 옵션 갱신
function updateProductSelectOptions() {
  $dom.$productSelect.innerHTML = '';
  PRODUCT_LIST.forEach((product) => {
    $dom.$productSelect.appendChild(createProductOption(product));
  });
}

// -----렌더링-----
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
  `
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

// 상품 추가 버튼 이벤트
$dom.$addToCartBtn.addEventListener('click', () => {
  const selectedProductId = $dom.$productSelect.value;
  const selectedProduct = findProductById(selectedProductId);

  if (selectedProduct && selectedProduct.quantity > 0) {
    const $existingItem = document.getElementById(selectedProduct.id);
    if ($existingItem) {
      const $textSpan = $existingItem.querySelector('span');
      const currentQuantity = extractQuantityFromText($textSpan.textContent);
      const newQuantity = currentQuantity + 1;

      if (newQuantity <= selectedProduct.quantity) {
        $textSpan.textContent = replaceQuantityInText(
          $textSpan.textContent,
          newQuantity
        );
        selectedProduct.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const $newItem = createElementWithClass(
        'div',
        'flex justify-between items-center mb-2'
      );
      $newItem.id = selectedProduct.id;
      $newItem.innerHTML = `<span>${selectedProduct.name} - ${selectedProduct.price}원 x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${selectedProduct.id}">삭제</button>
        </div>`;
      $dom.$cartContainer.appendChild($newItem);
      selectedProduct.quantity--;
    }

    calculateCart();
    store.lastSelectedProductId = selectedProductId;
  }
});

// 장바구니 내 수량 변경 및 삭제
$dom.$cartContainer.addEventListener('click', (event) => {
  const $target = event.target;
  if (
    $target.classList.contains('quantity-change') ||
    $target.classList.contains('remove-item')
  ) {
    const productId = $target.dataset.productId;
    const $itemElement = document.getElementById(productId);
    const product = findProductById(productId);
    const $textSpan = $itemElement.querySelector('span');
    const currentQty = extractQuantityFromText($textSpan.textContent);

    if ($target.classList.contains('quantity-change')) {
      const changeAmount = parseInt($target.dataset.change);
      const newQty = currentQty + changeAmount;

      if (newQty > 0 && newQty <= product.quantity + currentQty) {
        $textSpan.textContent = replaceQuantityInText(
          $textSpan.textContent,
          newQty
        );
        product.quantity -= changeAmount;
      } else if (newQty <= 0) {
        $itemElement.remove();
        product.quantity -= changeAmount;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if ($target.classList.contains('remove-item')) {
      product.quantity += currentQty;
      $itemElement.remove();
    }

    calculateCart();
  }
});
