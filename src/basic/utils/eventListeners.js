import { $dom } from '../global/globalDom';
import { calculateCart } from './calculateCart';
import {
  findProductById,
  extractQuantityFromText,
  replaceQuantityInText,
} from './convenience';
import { createElementWithClass } from './createElement';
import { store } from '../global/store';

export const registerEventListeners = () => {
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
};
