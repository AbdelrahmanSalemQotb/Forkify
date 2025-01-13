import { API, RECIPES_PER_PAGE } from './config';
import { requestJSON } from './helper';
import shortid from 'shortid';

const API_KEY = process.env.API_KEY;

export const state = {
  recipe: {},
  search: {
    query: '',
    recipes: [],
    page: 1,
  },
  bookmarks: [],
  cartList: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    title: recipe.title,
    sourceUrl: recipe.source_url,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await requestJSON(`${API}${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(el => el.id === state.recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await requestJSON(`${API}?search=${query}&key=${API_KEY}`);

    const recipes = data.data.recipes;

    state.search.page = 1;

    state.search.recipes = recipes.map(recipe => {
      return {
        id: recipe.id,
        imageUrl: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  if (state.search.recipes.length < 1) return;

  state.search.page = page;

  const start = (page - 1) * RECIPES_PER_PAGE;
  const end = page * RECIPES_PER_PAGE;

  return state.search.recipes?.slice(start, end);
};

export const updateServing = function (newServing) {
  if (newServing < 1) return;
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });

  state.recipe.servings = newServing;
};

export const addBookmark = function (recipe) {
  if (!recipe) return;
  recipe.bookmarked = true;

  state.bookmarks.push(recipe);

  saveBookmarks();
};

export const deleteBookmark = function (id) {
  state.recipe.bookmarked = false;

  const index = state.bookmarks.findIndex(el => el.id === id);
  if (index === -1)
    return console.error('Delete Bookmark : Cannot find recipe in bookmarks');

  state.bookmarks.splice(index, 1);

  saveBookmarks();
};

const saveBookmarks = function () {
  window.localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const loadBookmarks = function () {
  const bookmarks = window.localStorage.getItem('bookmarks');
  if (bookmarks) state.bookmarks = JSON.parse(bookmarks);
};

const extractIngsFromObj = function (newRecipe) {
  const ingredients = [];

  Object.keys(newRecipe).forEach(key => {
    const match = key.match(/ing-(quantity|unit|description)-(\d+)/);
    if (!match) return;

    const index = match[2] - 1;
    if (!ingredients[index]) ingredients[index] = {};

    if (match[1] === 'quantity')
      ingredients[index][match[1]] = newRecipe[match[0]]
        ? +newRecipe[match[0]]
        : null;
    else ingredients[index][match[1]] = newRecipe[match[0]];
  });

  return ingredients;
};

const createRecipeObjectUpload = function (newRecipe, ingredients) {
  return {
    title: newRecipe['title'],
    cooking_time: +newRecipe['cookingTime'],
    image_url: newRecipe['imageUrl'],
    ingredients,
    publisher: newRecipe['publisher'],
    servings: +newRecipe['servings'],
    source_url: newRecipe['sourceUrl'],
  };
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = extractIngsFromObj(newRecipe);
    const UploadObject = createRecipeObjectUpload(newRecipe, ingredients);

    if (!UploadObject) return new Error(' Upload: Data Creation Failed');

    const data = await requestJSON(`${API}?key=${API_KEY}`, UploadObject);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
export const generateIngsCart = function (ingredients) {
  if (!ingredients) return;

  ingredients.forEach(ing => {
    //check if ingrident exist in list => add the quantity
    const existingIngredient = state.cartList.find(
      elm => elm.description.trim() === ing.description.trim()
    );
    if (existingIngredient?.quantity) {
      existingIngredient.quantity += ing.quantity;
      return;
    }

    //add new ingrident to list
    state.cartList.push({ ...ing, id: shortid.generate() });
  });
  saveCart();
};

export const delCartitem = function (id) {
  const index = state.cartList.findIndex(ing => ing.id === id);
  if (index !== -1) state.cartList.splice(index, 1);
  saveCart();
};

export const updateCartElCount = function (id, quantity) {
  const ing = state.cartList.find(ing => ing.id === id);
  ing.quantity = quantity;
  saveCart();
};

export const clearCart = function () {
  state.cartList = [];
  saveCart();
};

const saveCart = function () {
  window.localStorage.setItem('cart', JSON.stringify(state.cartList));
};

const loadCart = function () {
  const cart = window.localStorage.getItem('cart');
  if (cart) state.cartList = JSON.parse(cart);
};

const init = function () {
  loadBookmarks();
  loadCart();
};
init();
