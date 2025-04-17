import { createElementWithClass } from './createElement';
import {
  PRODUCT_LIST,
  QYT_SEPARATOR,
  MIN_DISCOUNT_QTY,
  DISCOUNT_RATE,
} from '../global/constants';

export const findProductById = (productId) => {
  return PRODUCT_LIST.find((product) => product.id === productId);
};

export const extractQuantityFromText = (text) => {
  return parseInt(text.split(QYT_SEPARATOR)[1]);
};

export const replaceQuantityInText = (text, newQuantity) => {
  const baseText = text.split(QYT_SEPARATOR)[0];
  return `${baseText}${QYT_SEPARATOR}${newQuantity}`;
};

export const isTuesDay = () => {
  return new Date().getDay() === 2;
};

export const formatDiscountTag = (rate) => {
  const $tag = createElementWithClass('span', 'text-green-500 ml-2');
  $tag.textContent = `(${(rate * 100).toFixed(1)}% 할인 적용)`;
  return $tag;
};

export const getDiscountRate = (product, quantity) => {
  return quantity >= MIN_DISCOUNT_QTY ? DISCOUNT_RATE[product.id] || 0 : 0;
};
