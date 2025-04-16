const PRODUCT_LIST = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

const DISCOUNT_RATE = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

const MIN_DISCOUNT_QTY = 10;
const BULK_DISCOUNT_QTY = 30;
const BULK_DISCOUNT_RATE = 0.25;
const TUESDAY_SALE_RATE = 0.1;

const LUCKY_SALE_RATE = 0.8;
const SUGGESTION_SALE_RATE = 0.95;
const LUCKY_SALE_INTERVAL = 30000;
const SUGGESTION_SALE_INTERVAL = 60000;

const QYT_SEPARATOR = 'x ';

// 상품 목록
let productList;

// DOM 요소들
let $productSelect,
  $addToCartBtn,
  $cartContainer,
  $totalDisplay,
  $stockStatusDisplay;

// 상태 변수들
let lastSelectedProductId;
let bonusPoints = 0;
let totalAmount = 0;
let totalItemCount = 0;

// 유틸함수
function findProductById(productId) {
  return productList.find((product) => product.id === productId);
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

function main() {
  // 상품 데이터 초기화
  productList = [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
  ];

  // UI 요소 생성
  const $app = document.getElementById('app');
  const $container = document.createElement('div');
  const $wrapper = document.createElement('div');
  const $heading = document.createElement('h1');

  $cartContainer = document.createElement('div');
  $totalDisplay = document.createElement('div');
  $productSelect = document.createElement('select');
  $addToCartBtn = document.createElement('button');
  $stockStatusDisplay = document.createElement('div');

  // ID 부여
  $cartContainer.id = 'cart-items';
  $totalDisplay.id = 'cart-total';
  $productSelect.id = 'product-select';
  $addToCartBtn.id = 'add-to-cart';
  $stockStatusDisplay.id = 'stock-status';

  // 클래스명 세팅
  $container.className = 'bg-gray-100 p-8';
  $wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  $heading.className = 'text-2xl font-bold mb-4';
  $totalDisplay.className = 'text-xl font-bold my-4';
  $productSelect.className = 'border rounded p-2 mr-2';
  $addToCartBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $stockStatusDisplay.className = 'text-sm text-gray-500 mt-2';

  $heading.textContent = '장바구니';
  $addToCartBtn.textContent = '추가';

  updateProductSelectOptions();

  // DOM에 추가
  $wrapper.appendChild($heading);
  $wrapper.appendChild($cartContainer);
  $wrapper.appendChild($totalDisplay);
  $wrapper.appendChild($productSelect);
  $wrapper.appendChild($addToCartBtn);
  $wrapper.appendChild($stockStatusDisplay);
  $container.appendChild($wrapper);
  $app.appendChild($container);

  // 장바구니 초기 계산
  calculateCart();

  // 번개세일 타이머 설정
  setTimeout(() => {
    setInterval(() => {
      const luckyProduct =
        productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyProduct.quantity > 0) {
        luckyProduct.price = Math.round(luckyProduct.price * LUCKY_SALE_RATE);
        alert(`번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
        updateProductSelectOptions();
      }
    }, 30000);
  }, Math.random() * LUCKY_SALE_INTERVAL);

  // 추천 상품 할인 타이머
  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedProductId) {
        const suggestion = productList.find(
          (product) =>
            product.id !== lastSelectedProductId && product.quantity > 0
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
    }, 60000);
  }, Math.random() * SUGGESTION_SALE_INTERVAL);
}

// 상품 드롭다운 옵션 갱신
function updateProductSelectOptions() {
  $productSelect.innerHTML = '';
  productList.forEach((product) => {
    const $option = document.createElement('option');
    $option.value = product.id;
    $option.textContent = `${product.name} - ${product.price}원`;
    if (product.quantity === 0) $option.disabled = true;
    $productSelect.appendChild($option);
  });
}

// 장바구니 총합 계산 (Refactoring)
function calculateCart() {
  totalAmount = 0;
  totalItemCount = 0;
  const $cartItems = $cartContainer.children;
  let subTotal = 0;

  for (let i = 0; i < $cartItems.length; i++) {
    const $item = $cartItems[i];
    const currentItem = findProductById($item.id);
    const quantity = extractQuantityFromText($item.querySelector('span').textContent);
    const itemTotal = currentItem.price * quantity;

    let discountRate = 0;
    totalItemCount += quantity;
    subTotal += itemTotal;

    if (quantity >= MIN_DISCOUNT_QTY) {
      discountRate = DISCOUNT_RATE[currentItem.id] || 0;
    }

    totalAmount += itemTotal * (1 - discountRate);
  }

  // 대량 구매 할인 (Refactoring)
  let finalDiscountRate = (subTotal - totalAmount) / subTotal || 0;

  if (totalItemCount >= BULK_DISCOUNT_QTY) {
    const bulkDiscount = subTotal * BULK_DISCOUNT_RATE;
    if (bulkDiscount > subTotal - totalAmount) {
      totalAmount = subTotal * (1 - BULK_DISCOUNT_RATE);
      finalDiscountRate = BULK_DISCOUNT_RATE;
    }
  }

  // 화요일 추가 할인
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - TUESDAY_SALE_RATE;
    finalDiscountRate = Math.max(finalDiscountRate, TUESDAY_SALE_RATE);
  }

  // 총액 렌더링
  $totalDisplay.textContent = `총액: ${Math.round(totalAmount)}원`;

  if (finalDiscountRate > 0) {
    const $discountTag = createElementWithClass('span', 'text-green-500 ml-2');
    $discountTag.textContent = `(${(finalDiscountRate * 100).toFixed(1)}% 할인 적용)`;
    $totalDisplay.appendChild($discountTag);
  }

  updateStockStatus();
  renderBonusPoints();
}

// 포인트 렌더링
function renderBonusPoints() {
  bonusPoints = Math.floor(totalAmount / 1000);
  let $pointsTag = document.getElementById('loyalty-points');
  if (!$pointsTag) {
    $pointsTag = createElementWithClass('span', 'text-blue-500 ml-2');
    $pointsTag.id = 'loyalty-points';
    $totalDisplay.appendChild($pointsTag);
  }
  $pointsTag.textContent = `(포인트: ${bonusPoints})`;
}

// 재고 부족 상태 렌더링
function updateStockStatus() {
  let infoText = '';
  productList.forEach((product) => {
    if (product.quantity < 5) {
      infoText += `${product.name}: ${product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : '품절'
        }\n`;
    }
  });
  $stockStatusDisplay.textContent = infoText;
}

main();

// 상품 추가 버튼 이벤트
$addToCartBtn.addEventListener('click', () => {
  const selectedProductId = $productSelect.value;
  const selectedProduct = findProductById(selectedProductId);

  if (selectedProduct && selectedProduct.quantity > 0) {
    const $existingItem = document.getElementById(selectedProduct.id);
    if ($existingItem) {
      const $textSpan = $existingItem.querySelector('span');
      const currentQuantity = extractQuantityFromText($textSpan.textContent);
      const newQuantity = currentQuantity + 1;

      if (newQuantity <= selectedProduct.quantity) {
        $textSpan.textContent = replaceQuantityInText($textSpan.textContent, newQuantity);
        selectedProduct.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const $newItem = createElementWithClass('div', 'flex justify-between items-center mb-2');
      $newItem.id = selectedProduct.id;
      $newItem.innerHTML = `<span>${selectedProduct.name} - ${selectedProduct.price}원 x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${selectedProduct.id}">삭제</button>
        </div>`;
      $cartContainer.appendChild($newItem);
      selectedProduct.quantity--;
    }

    calculateCart();
    lastSelectedProductId = selectedProductId;
  }
});

// 장바구니 내 수량 변경 및 삭제
$cartContainer.addEventListener('click', (event) => {
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
        $textSpan.textContent = replaceQuantityInText($textSpan.textContent, newQty);
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
