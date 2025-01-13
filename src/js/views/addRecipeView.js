import icons from '/public/img/icons.svg';

class AddRecipeView {
  _errorMessage = 'We could not find that recipe. Please try another one!';

  _window = document.querySelector('.add-recipe-window');

  _overlayElement = document.querySelector('.overlay');
  _showWindowBtn = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.add-recipe-window>.btn--close-modal');

  _formELement = document.querySelector('.upload');
  _ingContainer = document.querySelector('.upload__column--ingredients');
  _addIngBtn = document.querySelector('.add-ingredient');

  _deleteIngBtn = this._createDeleteBtnWithHandler();

  constructor() {
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();

    this._addHandlerincrementIng();
  }

  async uploadWithSpinner(promise) {
    this._renderSpinner();

    try {
      await promise;
    } finally {
      this._deleteSpinner();
      this.closeWindow();
    }
  }

  _renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._formELement.style.display = 'none';
    this._window.insertAdjacentHTML('afterbegin', markup);
  }

  _deleteSpinner() {
    this._formELement.style = '';
    this._window.querySelector('.spinner').remove();
  }

  _clearForm() {
    this._formELement?.reset();
  }

  _addHandlerShowWindow() {
    this._showWindowBtn.addEventListener('click', this.openWindow.bind(this));
  }

  _addHandlerHideWindow() {
    [this._btnClose, this._overlayElement].forEach(el =>
      el.addEventListener('click', this.closeWindow.bind(this))
    );
  }

  _addHandlerincrementIng() {
    this._addIngBtn.addEventListener('click', () => {
      // get ingredients count
      const { count } = this._getCountAndLastIng();

      this._renderNewIng(count + 1);
    });
  }

  _getCountAndLastIng() {
    const elements = this._ingContainer.querySelectorAll('.upload__ingredient');

    const length = elements.length;

    return { count: length, lastIng: elements[length - 1] };
  }

  closeWindow() {
    this._overlayElement.classList.add('hidden');
    this._window.classList.add('hidden');

    this._clearForm();
  }

  openWindow() {
    this._overlayElement.classList.remove('hidden');
    this._window.classList.remove('hidden');
  }

  _generateIngEle(num) {
    const markup = `
          <div class="upload__ingredient">
            <label for="quantity-${num}">Ingredient ${num}</label>
            <div class="upload__ingredient--container">
              <input
                id="quantity-${num}"
                class="upload__ingredient--quantity"
                type="text"
                name="ing-quantity-${num}"
                placeholder="Quantity"
              />
              <input
                class="upload__ingredient--unit"
                type="text"
                name="ing-unit-${num}"
                placeholder="Unit"
              />
              <input
                type="text"
                name="ing-description-${num}"
                placeholder="Description"
                required
              />
            </div>
          </div>
`;
    const ele = document
      .createRange()
      .createContextualFragment(markup).firstElementChild;

    this._addDelIngBtn(ele);
    return ele;
  }

  _addDelIngBtn(el) {
    el.querySelector('.upload__ingredient--container').insertAdjacentElement(
      'beforeend',
      this._deleteIngBtn
    );
  }

  _renderNewIng(num) {
    const ele = this._generateIngEle(num);
    this._addIngBtn.insertAdjacentElement('beforebegin', ele);
  }

  _delIng(e) {
    const ing = e.target.closest('.upload__ingredient');
    if (!ing) return;

    ing.remove();

    const { count, lastIng } = this._getCountAndLastIng();

    if (count <= 2) return;

    this._addDelIngBtn(lastIng);
  }

  _createDeleteBtnWithHandler() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = `<svg><use href="${icons}#icon-del"></use></svg>`;
    btn.ariaLabel = 'Delete ingredient';
    btn.title = 'Delete this ingredient';
    btn.classList = 'delete-ing btn--inline';

    // const delBtn = `
    // `;

    btn.addEventListener('click', this._delIng.bind(this));

    return btn;
  }

  addHandlerUpload(handler) {
    if (!handler) return;

    this._formELement.addEventListener('submit', e => {
      e.preventDefault();
      const dataArr = [...new FormData(e.target)];

      let data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
}

export default new AddRecipeView();
