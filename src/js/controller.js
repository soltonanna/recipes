import * as model from './model.js';
import recipeView from './views/recipeView.js';

/** 
 * ? JavaScript library which provides tools for creating object-oriented and event-driven JavaScript code 
**/ 
import 'core-js/stable';
/** 
 * ? The runtime support for compiled/transpiled async functions.
**/ 
import 'regenerator-runtime/runtime'; 

const recipeContainer = document.querySelector('.recipe');



// The current API for course
// https://forkify-api.herokuapp.com/v2
// https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza

//////////////////////////////////////////////////////////////////////////////////////////

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
    alert(error)
  }
}

//["hashchange", "load"].forEach(ev => addEventListener(ev, controlRecipes));
window.addEventListener('load', controlRecipes);
window.addEventListener('hashchange', controlRecipes);