import View from './View.js';
import PreviewView from './previewView.js';

class ResultView extends View {
  _data;
  _parentElement = document.querySelector('.results');
  _overlay = document.querySelector('.search-results__overlay');
  _menuButton = document.querySelector('.menu__btn');
  _btnClose = document.querySelector('.btn--close-search-results');
  _window = document.querySelector('.search-results');

  _errorMessage =
    'We could not find that search for this query. Please try another one!';
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  openWindow() {
    this._overlay?.classList.remove('hidden');
    this._window?.classList.remove('hidden');
  }

  toggleWindow() {
    this._overlay?.classList.toggle('hidden');
    this._window?.classList.toggle('hidden');
  }

  closeWindow() {
    if (!this._window.classList.contains('hidden'))
      this._window.classList.add('hidden');

    // To prevent the overlay from closing when the search bar is still open in mobile view
    if (
      window.innerWidth < 750 &&
      !document.querySelector('.search-results').classList.contains('hidden')
    )
      return;

    this._overlay.classList.add('hidden');
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.closeWindow.bind(this));
    this._overlay.addEventListener('click', this.closeWindow.bind(this));
  }
  _addHandlerShowWindow() {
    this._menuButton.addEventListener('click', this.toggleWindow.bind(this));
  }
  _generateMarkup() {
    return this._data.map(recipe => PreviewView.render(recipe, false)).join('');
  }
}

export default new ResultView();
