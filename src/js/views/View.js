import icons from '/public/img/icons.svg';

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;

    const markup = this._generateMarkup();
    if (render === false) return markup;
    this._replace(markup);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return;
    this._data = data;

    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newNodes = Array.from(newDOM.querySelectorAll('*'));
    const curNodes = Array.from(this._parentElement.querySelectorAll('*'));

    newNodes.forEach(function (newNode, i) {
      const curNode = curNodes[i];

      if (newNode.isEqualNode(curNode)) return;

      if (curNode.firstChild?.nodeValue.trim()) {
        // curNode.firstChild.nodeValue = newNode.firstChild.nodeValue;

        curNode.textContent = newNode.textContent;
      }

      Array.from(newNode.attributes).forEach(attr => {
        curNode.setAttribute(attr.name, attr.value);
      });
    });
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;

    this._replace(markup);
  }

  renderError(msg = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${msg}</p>
      </div>
    `;
    this._replace(markup);
  }

  renderMessage() {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>
          ${this._message}
        </p>
      </div>`;
    this._replace(markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  _replace(markup) {
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _getActiveRecipeID() {
    return window.location.hash.slice(1);
  }
}
