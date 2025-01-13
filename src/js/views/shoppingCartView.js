import icons from '/public/img/icons.svg';
import View from './View.js';

class ShoppingCartView extends View {
  _parentElement = document.querySelector('.shopping-cart__list');
  _message = 'No items yet. Find a nice recipe and add it :)';
  _errorMessage = 'No items yet. Find a nice recipe and add it :)';
  _btnDelAll = document.querySelector('.shopping--del-all-btn');

  addDeleteIngHandler(handler) {
    if (!handler)
      return console.error(
        "wrong handler passed to 'ShoppingCartView -- delete ingredient'"
      );

    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.delete-item-btn');
      if (!btn) return;

      const ing = btn.closest('.shopping-cart__list-item');
      if (!ing) return;

      handler(ing.dataset.id);
    });
  }

  addClearHandler(handler) {
    if (!handler)
      return console.error(
        "wrong handler passed to 'ShoppingCartView -- delete all'"
      );

    this._btnDelAll.addEventListener('click', e => {
      if (!handler) return;
      handler();
    });
  }

  addQuantityChangeHandler(handler) {
    if (!handler)
      return console.error(
        "wrong handler passed to 'ShoppingCartView -- delete ingredient'"
      );

    this._parentElement.addEventListener('input', e => {
      const quantity = e.target.value;
      const id = e.target.closest('.shopping-cart__list-item')?.dataset.id;
      handler(id, +quantity);
    });
  }

  deleteListItemUI(id) {
    const cartItem = this._parentElement.querySelector(
      `[data-id="${CSS.escape(id)}"]`
    );
    if (!cartItem) return;

    const hr = cartItem.nextElementSibling;
    cartItem.remove();
    if (hr && hr.tagName === 'HR') {
      hr.remove();
    }
  }

  _generateMarkup() {
    return this._data.map(ing => this._generateIngmarkup(ing)).join('');
  }

  _generateIngmarkup(ing) {
    return `
        <li class="shopping-cart__list-item" data-id="${ing.id}">
      <input
        type="number"
        class="shopping-cart__list-item--input"
        min = 0
        ${ing.quantity ? '' : 'disabled'}
        value="${ing.quantity || ''}"
      />
      <p class="shopping-cart__list-item--unit">${ing.unit || ''}</p>
      <p class="shopping-cart__list-item--description">${ing.description}</p>
      <button
        type="button"
        aria-label="Delete item"
        title="Delete this item"
        class="delete-item-btn btn--inline">
        <svg>
          <use href="${icons}#icon-del"></use>
        </svg>
      </button>
    </li>
    <hr class="seperate-line" />
    `;
  }
}

export default new ShoppingCartView();
