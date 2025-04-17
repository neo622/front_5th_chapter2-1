import { $dom } from '../global/globalDom';
import {
  PRODUCT_LIST,
  LUCKY_SALE_INTERVAL,
  LUCKY_SALE_RATE,
  SUGGESTION_SALE_INTERVAL,
  SUGGESTION_SALE_RATE,
} from '../global/constants';

function createProductOption(product) {
  const $option = document.createElement('option');
  $option.value = product.id;
  $option.textContent = `${product.name} - ${product.price}원`;
  if (product.quantity === 0) $option.disabled = true;
  return $option;
}

// 상품 드롭다운 옵션 갱신
export const updateProductSelectOptions = () => {
  $dom.$productSelect.innerHTML = '';
  PRODUCT_LIST.forEach((product) => {
    $dom.$productSelect.appendChild(createProductOption(product));
  });
};

export const initPromotionTimers = () => {
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
};
