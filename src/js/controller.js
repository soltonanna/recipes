import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import PaginationView from './views/paginationView';


/** JavaScript library which provides tools for creating object-oriented and event-driven JavaScript code **/ 
import 'core-js/stable';
/** The runtime support for compiled/transpiled async functions. **/ 
import 'regenerator-runtime/runtime'; 
import { async } from 'regenerator-runtime';
import paginationView from './views/paginationView';

// The current API for course
// https://forkify-api.herokuapp.com/v2

// https://forkify-api.herokuapp.com/api/v2/recipes/:id
// https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza&key=<insert your key>

//////////////////////////////////////////////////////////////////////////////////////////
// Parcel config
if (module.hot) {
  module.hot.accept();
}

/** Load and render recipes */
const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0. Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1. Loading recipe from model
    await model.loadRecipe(id);

    // 2. Rendering recipe to view
    recipeView.render(model.state.recipe);
  } 
  catch (error) {
    recipeView.renderError();
  }
}

/** Load and render results after searching */
const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Loading searched results from model
    await model.loadSearchResults(query);

    // 3. Rendering searched results to view
    resultsView.render(model.getSearchResultsPage());

    // 4. Rendering initial pagination buttons
    paginationView.render(model.state.search);

  } catch (error) {
    resultsView.renderError();
  }
}

/** Load and render results on pagination */
const controlPagination = function(goToPage) {
  // 1. Rendering the NEW results to view
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. Rendering the NEW pagination buttons
  paginationView.render(model.state.search);
}

const controlServings = function(newServings) {
  // 1. Update the recipe servings (in state)
  model.updateServings(newServings);

  // 2. Update the recipe view
  recipeView.update(model.state.recipe);
  // *update method only update texts and attributes in the DOM, not re-render entire view.
} 


/** Show recipes after load or change the hash of URL */
const init = function(){
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
}
init();