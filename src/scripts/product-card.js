import { formatPrice, getDiscountPercent } from "./format-price.js";

const SELECTORS = {
  packingItem: "[data-packing-item]",
  sku: "[data-js-sku]",
  price: "[data-js-price]",
  oldPrice: "[data-js-old-price]",
  discount: "[data-js-discount]",
  cart: "[data-cart]",
  notice: "[data-notice]",
  noticeText: "[data-notice-text]",
};

export function initProductCard(root) {
  const packingItems = [...root.querySelectorAll(SELECTORS.packingItem)];
  const skuNode = root.querySelector(SELECTORS.sku);
  const priceNode = root.querySelector(SELECTORS.price);
  const oldPriceNode = root.querySelector(SELECTORS.oldPrice);
  const discountNode = root.querySelector(SELECTORS.discount);
  const cartButton = root.querySelector(SELECTORS.cart);
  const notice = document.querySelector(SELECTORS.notice);
  const noticeText = notice?.querySelector(SELECTORS.noticeText);

  let noticeTimerId = 0;
  let currentWeight = packingItems.find((item) => item.classList.contains("packing__item--current"))
    ?.dataset.weight;

  const applyPacking = (item) => {
    const price = Number(item.dataset.price);
    const oldPrice = Number(item.dataset.oldPrice);
    const discount = getDiscountPercent(price, oldPrice);

    packingItems.forEach((button) => {
      const isCurrent = button === item;
      button.classList.toggle("packing__item--current", isCurrent);
      button.setAttribute("aria-checked", String(isCurrent));
      button.tabIndex = isCurrent ? 0 : -1;
    });

    skuNode.textContent = item.dataset.sku;
    priceNode.textContent = formatPrice(price);
    priceNode.setAttribute("content", item.dataset.price);
    currentWeight = item.dataset.weight;

    if (discount > 0) {
      oldPriceNode.hidden = false;
      const oldPriceLabel = oldPriceNode.querySelector("s");

      if (oldPriceLabel) {
        oldPriceLabel.textContent = formatPrice(oldPrice);
      }

      discountNode.hidden = false;
      const badgeValue = discountNode.querySelector(".product__badge-value");

      if (badgeValue) {
        badgeValue.textContent = `−${discount}%`;
      }
    } else {
      oldPriceNode.hidden = true;
      discountNode.hidden = true;
    }
  };

  const showNotice = (message) => {
    if (!notice || !noticeText) {
      return;
    }

    noticeText.textContent = message;
    notice.hidden = false;
    window.clearTimeout(noticeTimerId);
    noticeTimerId = window.setTimeout(() => {
      notice.hidden = true;
    }, 2200);
  };

  packingItems.forEach((item) => {
    item.addEventListener("click", () => {
      applyPacking(item);
    });
  });

  const packingList = root.querySelector(".packing__list");

  packingList?.addEventListener("keydown", (event) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];

    if (!keys.includes(event.key)) {
      return;
    }

    event.preventDefault();

    const currentIndex = packingItems.findIndex(
      (item) => item.getAttribute("aria-checked") === "true",
    );
    const offset = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (currentIndex + offset + packingItems.length) % packingItems.length;
    const nextItem = packingItems[nextIndex];

    applyPacking(nextItem);
    nextItem.focus();
  });

  cartButton?.addEventListener("click", () => {
    showNotice(`Ананасовый улун, ${currentWeight} — добавлен в корзину`);
  });

  const current = packingItems.find((item) => item.getAttribute("aria-checked") === "true");

  if (current) {
    applyPacking(current);
  }
}
