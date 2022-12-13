import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';


/** JavaScript library which provides tools for creating object-oriented and event-driven JavaScript code **/ 
import 'core-js/stable';
/** The runtime support for compiled/transpiled async functions. **/ 
import 'regenerator-runtime/runtime'; 
import { async } from 'regenerator-runtime';

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
    recipeView.renderSpinner();

    const id = window.location.hash.slice(1);
    if (!id) return;
    
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

    const query = searchView.getQuery();
    if (!query) return;

    // 1. Loading searched results from model
    await model.loadSearchResults(query);

    // 2. Rendering recipe to view
    resultsView.render(model.state.search.results);

  } catch (error) {
    resultsView.renderError();
  }
}


/** Show recipes after load or change the hash of URL */
const init = function(){
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerRender(controlSearchResults);
}
init();