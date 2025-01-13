import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultView from './views/resultView';
import pagingView from './views/pagingView';
import addRecipeView from './views/addRecipeView';
import notificationView from './views/notificationView';
import bookmarksView from './views/bookmarksView';
import shoppingCartView from './views/shoppingCartView';

// https://forkify-api.herokuapp.com/v2

/**
 * @brief Controller function to handle fetching and rendering the recipe based on the current hash in the URL.
 *
 * This function is triggered by an event listener on hash change and page load.
 * It retrieves the recipe ID from the URL, loads the corresponding recipe data,
 * and updates the UI.
 */
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id || id === model.state.recipe.id) return;

    resultView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmarks);
    recipeView.renderSpinner();

    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(`💥 ${err}`);
  }
};

/**
 * @brief Controller function to handle updating the servings of the recipe.
 *
 * @param newServings The new number of servings to update.
 */
const controlServings = function (newServings) {
  model.updateServing(newServings);
  recipeView.update(model.state.recipe);
};

/**
 * @brief Controller function to handle pagination for search results.
 *
 * @param {number} [page=1] - The page number to display (defaults to 1).
 */
const controlPaging = function (page = 1) {
  // Render current page recipes
  resultView.render(model.getSearchResultPage(page));
  // Render page number and page navigation buttons
  pagingView.render(model.state.search);

  updateURL(undefined, undefined, page, undefined);
};

/**
 * @brief Controller function to handle searching for recipes based on user input.
 *
 * This function is triggered when the user submits a search query.
 */
const controlSearchResult = async function () {
  try {
    // Get the query from the search input
    const query = searchView.getQuery();

    // If there's no query from the input, check the URL
    const queryParams = new URLSearchParams(window.location.search);
    const urlQuery = queryParams.get('search'); // Get query from URL
    const page = queryParams.get('page'); // Get page from URL

    const finalQuery = query || urlQuery;
    const finalPage = page || 1; // Use provided page number or default to 1

    if (!finalQuery) return;
    resultView.renderSpinner();
    window.innerWidth < 900 && resultView.openWindow();

    model.state.search.query = finalQuery;
    model.state.search.page = +finalPage;

    await model.loadSearchResults(finalQuery);

    controlPaging(finalPage);
    updateURL(model.state.recipe.id, finalQuery, finalPage);
  } catch (err) {
    resultView.renderError();
    console.error(`💥 ${err}`);
  }
};

const updateURL = function (id, query, page) {
  // Default to existing hash if id is not provided
  id = id || window.location.hash.slice(1);

  // Get current query parameters if query or page is not provided
  const queryParams = new URLSearchParams(window.location.search);

  // Use existing values if not provided
  query = query || queryParams.get('search');
  page = page || queryParams.get('page');

  // Construct and update the URL
  window.history.pushState(
    null,
    '',
    `?search=${encodeURIComponent(query)}&page=${page || 1}${
      id ? `#${id}` : ''
    }`
  );
};

/**
 * @brief Controller function to toggle bookmarks for the current recipe.
 */
const controlAddRemoveBookmark = function () {
  // Toggle bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update Recipe view (bookmark icon)
  recipeView.update(model.state.recipe);
  // Update bookmarks list
  bookmarksView.render(model.state.bookmarks);

  // Show success message
  notificationView.render(
    model.state.recipe.bookmarked
      ? 'Recipe bookmarked successfully'
      : 'Recipe removed from bookmarks',
    model.state.recipe.bookmarked ? 'success' : 'message'
  );
};

/**
 * @brief Controller function to handle adding a new recipe.
 *
 * @param newRecipe The new recipe data to upload.
 */
const controlAddNewRecipe = async function (newRecipe) {
  try {
    // Render Spinner + Upload the new recipe data
    await addRecipeView.uploadWithSpinner(model.uploadRecipe(newRecipe));
    notificationView.render('Uploaded Successfully', 'success');

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    notificationView.render(err.message, 'error');
  }
};

const controlAddToCart = function () {
  const { recipe } = model.state;
  if (!recipe) return;

  model.generateIngsCart(recipe.ingredients);

  shoppingCartView.render(model.state.cartList);

  // Show success message
  notificationView.render('Added to cart', 'success');
};

const delIngFromCart = function (id) {
  model.delCartitem(id);
  shoppingCartView.deleteListItemUI(id);
  // Show success message
  notificationView.render('Item removed from cart', 'message');
};

const changeListQuantity = function (id, quantity) {
  model.updateCartElCount(id, quantity);
};

const clearCart = function () {
  if (model.state.cartList.length === 0) return;
  model.clearCart();
  shoppingCartView.renderMessage();
};

function printCart() {
  const { cartList } = model.state;

  // Start building the print content
  let printContent = `
    <div style="font-family: sans-serif; line-height: 1.6; margin: 2rem;">
      <h1 style="text-align: center; margin-bottom: 2rem; font-size: 2.5rem;">Shopping List</h1>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #000; font-size: 1.4rem;">
            <th style="padding: 0.5rem; width: 20%; text-align: start;">Count</th>
            <th style="padding: 0.5rem; width: 20%; text-align: start;">Unit</th>
            <th style="padding: 0.5rem; width: 60%; text-align: start;">Ingredient</th>
          </tr>
        </thead>
        <tbody>
  `;

  if (cartList.length === 0) {
    printContent += `
      <tr>
        <td colspan="3" style="padding: 0.5rem; font-size: 1rem; text-align: start;">
          Your shopping cart is empty.
        </td>
      </tr>
    `;
  } //handle empty cart
  else {
    printContent += cartList
      .map(
        item =>
          `<tr style="border-bottom: 1px solid #ccc;">
      <td style="padding: 0.5rem; font-size: 1rem; text-align: start;">${
        item.quantity ?? '-'
      }</td>
        <td style="padding: 0.5rem; font-size: 1rem; text-align: start;">${
          item.unit || '-'
        }</td>
          <td style="padding: 0.5rem; font-size: 1rem; text-align: start;">${
            item.description
          }</td>
            </tr>
            `
      )
      .join('');
  }

  // Create a new print window
  const printWindow = window.open('', '', 'height=600,width=800');

  // Dynamically copy styles from the current document's head
  const headContent = document.querySelector('head').innerHTML;
  printWindow.document.write(`
    <html>
      <head>${headContent}</head>
      <body>${printContent}</body>
    </html>
  `);

  // Close and print the document
  printWindow.document.close();
  printWindow.print();
}

/**
 * @brief Initialize the application.
 */
const init = function () {
  bookmarksView.render(model.state.bookmarks);
  if (model.state.cartList.length === 0) shoppingCartView.renderMessage();
  else shoppingCartView.render(model.state.cartList);

  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServing(controlServings);
  recipeView.addHandlerBookmark(controlAddRemoveBookmark);
  recipeView.addHandlerCart(controlAddToCart);

  searchView.addHandlerSearch(controlSearchResult);
  searchView.addHandlerLoad(controlSearchResult);
  pagingView.addClickHandler(controlPaging);
  shoppingCartView.addDeleteIngHandler(delIngFromCart);
  shoppingCartView.addQuantityChangeHandler(changeListQuantity);
  shoppingCartView.addClearHandler(clearCart);
  addRecipeView.addHandlerUpload(controlAddNewRecipe);

  ///////
  document
    .querySelector('.shopping--print-btn')
    .addEventListener('click', printCart);
};

init();
