import { createElementWithClass } from "./createElement";
import { findProductById, extractQuantityFromText, getDiscountRate, isTuesDay, formatDiscountTag } from "./convenience";
import { $dom } from "../global/globalDom";
import { store } from "../global/store";
import { BULK_DISCOUNT_QTY, BULK_DISCOUNT_RATE, TUESDAY_SALE_RATE, PRODUCT_LIST } from "../global/constants"

// Refactoring: 총합, 수량, 할인률 계산 담당
function calculateCartTotals() {
    let subTotal = 0;
    store.totalAmount = 0;
    store.totalItemCount = 0;

    for (const $item of $dom.$cartContainer.children) {
        const currentItem = findProductById($item.id);
        const quantity = extractQuantityFromText(
            $item.querySelector('span').textContent
        );
        const itemTotal = currentItem.price * quantity;
        const discountRate = getDiscountRate(currentItem, quantity);

        store.totalItemCount += quantity;
        subTotal += itemTotal;
        store.totalAmount += itemTotal * (1 - discountRate);
    }
    // 대량 구매 할인
    let finalDiscountRate = (subTotal - store.totalAmount) / subTotal || 0;
    if (store.totalItemCount >= BULK_DISCOUNT_QTY) {
        const bulkDiscount = subTotal * BULK_DISCOUNT_RATE;
        if (bulkDiscount > subTotal - store.totalAmount) {
            store.totalAmount = subTotal * (1 - BULK_DISCOUNT_RATE);
            finalDiscountRate = BULK_DISCOUNT_RATE;
        }
    }
    // 화요일 추가 할인
    if (isTuesDay()) {
        store.totalAmount *= 1 - TUESDAY_SALE_RATE;
        finalDiscountRate = Math.max(finalDiscountRate, TUESDAY_SALE_RATE);
    }

    return { finalDiscountRate };
}

// 총액 표시 및 할인률 표시 담당
function renderCartSummary(finalDiscountRate) {
    // 총액 렌더링
    $dom.$totalDisplay.textContent = `총액: ${Math.round(store.totalAmount)}원`;
    if (finalDiscountRate > 0) {
        const $discountTag = formatDiscountTag(finalDiscountRate);
        $dom.$totalDisplay.appendChild($discountTag);
    }
}

// 포인트 렌더링
function renderBonusPoints() {
    store.bonusPoints = Math.floor(store.totalAmount / 1000);
    let $pointsTag = document.getElementById('loyalty-points');
    if (!$pointsTag) {
        $pointsTag = createElementWithClass('span', 'text-blue-500 ml-2');
        $pointsTag.id = 'loyalty-points';
        $dom.$totalDisplay.appendChild($pointsTag);
    }
    $pointsTag.textContent = `(포인트: ${store.bonusPoints})`;
}

// 재고 부족 상태 렌더링
function updateStockStatus() {
    $dom.$stockStatusDisplay.textContent = PRODUCT_LIST
        .filter((p) => p.quantity < 5)
        .map(
            (p) =>
                `${p.name}: ${p.quantity > 0 ? `재고 부족 (${p.quantity}개 남음)` : '품절'}`
        )
        .join('\n');
}

export const calculateCart = () => {
    const { finalDiscountRate } = calculateCartTotals();
    renderCartSummary(finalDiscountRate);
    updateStockStatus();
    renderBonusPoints();
}