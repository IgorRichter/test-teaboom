import { initProductCard } from "./product-card.js";

const productCard = document.querySelector("[data-product]");

if (productCard) {
  initProductCard(productCard);
}
