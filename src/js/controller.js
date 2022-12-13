import * as model from './model.js';
import recipeView from './views/recipeView.js';

// JavaScript library which provides tools for creating object-oriented and event-driven JavaScript code
import 'core-js/stable';
// The runtime support for compiled/transpiled async functions.
import 'regenerator-runtime/runtime'; 

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// The current API for course
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


const controlRecipes = async function() {
  try {
    recipeView.renderSpinner();

    const id = window.location.hash.slice(1);
    console.log(id)
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