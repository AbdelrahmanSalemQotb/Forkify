class SearchView {
  _parentElement = document.querySelector('.search');

  addHandlerSearch(handler) {
    if (!handler) return console.error("wrong handler passed to 'SearchView'");

    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      // const query = this._getQuery();
      handler();
    });
  }

  addHandlerLoad(handler) {
    if (!handler) return console.error("wrong handler passed to 'SearchView'");
    window.addEventListener('load', function (e) {
      // const queryParams = new URLSearchParams(window.location.search);
      // const query = queryParams.get('search');
      // const page = queryParams.get('page');
      handler();
    });
  }
  getQuery() {
    const query = this._parentElement.querySelector('.search__field')?.value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
