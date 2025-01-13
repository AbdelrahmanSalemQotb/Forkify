import icons from '/public/img/icons.svg';
import View from './View.js';
import { RECIPES_PER_PAGE } from '../config.js';

class PagingView extends View {
  _parentElement = document.querySelector('.pagination');

  addClickHandler(handler) {
    if (!handler) return console.error("wrong handler passed to 'RecipeView'");

    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      handler(+btn.dataset.goto);
    });
  }

  _generateMarkup() {
    const currPage = Number(this._data.page);
    const numOfPages = Math.ceil(this._data.recipes.length / RECIPES_PER_PAGE);
    let markup = '';

    if (numOfPages < 2) return ''; //check if is one page
    if (currPage === 1) {
      markup = `
        <button class="btn--inline pagination__btn--next" data-goto="${
          currPage + 1
        }">
          <span>Page ${currPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button> 
        <p class="pagination__page">${currPage} of ${numOfPages}</p>
`;
    }
    if (currPage === numOfPages) {
      markup = `
        <button class="btn--inline pagination__btn--prev" data-goto="${
          currPage - 1
        }">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currPage - 1}</span>
        </button> 
        <p class="pagination__page">${currPage} of ${numOfPages}</p>`;
    }
    if (currPage > 1 && currPage < numOfPages) {
      markup = `
    <button class="btn--inline pagination__btn--prev" data-goto="${
      currPage - 1
    }">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currPage - 1}</span>
    </button> 
    <p class="pagination__page">${currPage} of ${numOfPages}</p>
    <button class="btn--inline pagination__btn--next" data-goto="${
      currPage + 1
    }">
          <span>Page ${currPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button> `;
    }

    return markup;
  }
}

export default new PagingView();
