import icons from '/public/img/icons.svg';
import View from './View.js';

class PreviewView extends View {
  _data;
  _generateMarkup() {
    return `
      <li class="preview">
        <a class="preview__link ${
          this._getActiveRecipeID() === this._data.id
            ? 'preview__link--active'
            : ''
        }" href="#${this._data.id}">
          <figure class="preview__fig">
            <img src="${this._data.imageUrl}" alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${this._data.title}</h4>
            <p class="preview__publisher">${this._data.publisher}</p>
            
            ${
              this._data.key
                ? `
                <div class="preview__user-generated">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                    </svg>
                    </div>`
                : ''
            }
          </div>
        </a>
      </li>`;
  }
}
export default new PreviewView();
