// 상품 목록
let productList;

// DOM 요소들
let $productSelect, $addToCartBtn, $cartContainer, $totalDisplay, $stockStatusDisplay;

// 상태 변수들
let lastSelectedProductId;
let bonusPoints = 0;
let totalAmount = 0;
let totalItemCount = 0;

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
        luckyProduct.price = Math.round(luckyProduct.price * 0.8);
        alert(`번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
        updateProductSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

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
          suggestion.price = Math.round(suggestion.price * 0.95);
          updateProductSelectOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
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

// 장바구니 총합 계산
function calculateCart() {
  totalAmount = 0;
  totalItemCount = 0;
  const $cartItems = $cartContainer.children;
  let subTotal = 0;

  for (let i = 0; i < $cartItems.length; i++) {
    (function () {
      let currentProduct = null;

      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === $cartItems[i].id) {
          currentProduct = productList[j];
          break;
        }
      }

      const quantity = parseInt(
        $cartItems[i].querySelector('span').textContent.split('x ')[1]
      );
      const itemTotal = currentProduct.price * quantity;
      let discountRate = 0;

      totalItemCount += quantity;
      subTotal += itemTotal;

      if (quantity >= 10) {
        if (currentProduct.id === 'p1') discountRate = 0.1;
        else if (currentProduct.id === 'p2') discountRate = 0.15;
        else if (currentProduct.id === 'p3') discountRate = 0.2;
        else if (currentProduct.id === 'p4') discountRate = 0.05;
        else if (currentProduct.id === 'p5') discountRate = 0.25;
      }

      totalAmount += itemTotal * (1 - discountRate);
    })();
  }

  // 대량 구매 할인
  let finalDiscountRate = 0;
  if (totalItemCount >= 30) {
    const bulkDiscount = totalAmount * 0.25;
    const itemDiscount = subTotal - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * 0.75;
      finalDiscountRate = 0.25;
    } else {
      finalDiscountRate = itemDiscount / subTotal;
    }
  } else {
    finalDiscountRate = (subTotal - totalAmount) / subTotal;
  }

  // 화요일 추가 할인
  if (new Date().getDay() === 2) {
    totalAmount *= 0.9;
    finalDiscountRate = Math.max(finalDiscountRate, 0.1);
  }

  // 총액 렌더링
  $totalDisplay.textContent = `총액: ${Math.round(totalAmount)}원`;

  if (finalDiscountRate > 0) {
    const $discountTag = document.createElement('span');
    $discountTag.className = 'text-green-500 ml-2';
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
    $pointsTag = document.createElement('span');
    $pointsTag.id = 'loyalty-points';
    $pointsTag.className = 'text-blue-500 ml-2';
    $totalDisplay.appendChild($pointsTag);
  }
  $pointsTag.textContent = `(포인트: ${bonusPoints})`;
}

// 재고 부족 상태 렌더링
function updateStockStatus() {
  let infoText = '';
  productList.forEach((product) => {
    if (product.quantity < 5) {
      infoText += `${product.name}: ${product.quantity > 0
          ? `재고 부족 (${product.quantity}개 남음)`
          : '품절'
        }\n`;
    }
  });
  $stockStatusDisplay.textContent = infoText;
}

main();

// 상품 추가 버튼 이벤트
$addToCartBtn.addEventListener('click', () => {
  const selectedProductId = $productSelect.value;
  const selectedProduct = productList.find(
    (product) => product.id === selectedProductId
  );

  if (selectedProduct && selectedProduct.quantity > 0) {
    const $existingItem = document.getElementById(selectedProduct.id);
    if ($existingItem) {
      const newQuantity =
        parseInt(
          $existingItem.querySelector('span').textContent.split('x ')[1]
        ) + 1;
      if (newQuantity <= selectedProduct.quantity) {
        $existingItem.querySelector('span').textContent =
          `${selectedProduct.name} - ${selectedProduct.price}원 x ${newQuantity}`;
        selectedProduct.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const $newItem = document.createElement('div');
      $newItem.id = selectedProduct.id;
      $newItem.className = 'flex justify-between items-center mb-2';
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
    const product = productList.find((p) => p.id === productId);

    if ($target.classList.contains('quantity-change')) {
      const changeAmount = parseInt($target.dataset.change);
      const currentQty = parseInt(
        $itemElement.querySelector('span').textContent.split('x ')[1]
      );
      const newQty = currentQty + changeAmount;

      if (newQty > 0 && newQty <= product.quantity + currentQty) {
        $itemElement.querySelector('span').textContent =
          $itemElement.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQty;
        product.quantity -= changeAmount;
      } else if (newQty <= 0) {
        $itemElement.remove();
        product.quantity -= changeAmount;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if ($target.classList.contains('remove-item')) {
      const removedQty = parseInt(
        $itemElement.querySelector('span').textContent.split('x ')[1]
      );
      product.quantity += removedQty;
      $itemElement.remove();
    }

    calculateCart();
  }
});
