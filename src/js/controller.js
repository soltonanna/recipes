import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// "start": "live-server --open=src/index.html",
/**
 * ? The current API for course:  https://forkify-api.herokuapp.com/v2
**/

/** 
 * !Load and render recipes 
**/
const controlRecipes = async function() {
    try {
        const id = window.location.hash.slice(1);

        if (!id) return;
        recipeView.renderSpinner();

        // 1. Update results view to mark selected search result
        resultsView.update(model.getSearchResultsPage());

        // 2. Update bookmarks view
        bookmarksView.update(model.state.bookmarks);

        // 3. Loading recipe from model
        await model.loadRecipe(id);

        // 4. Rendering recipe to view
        recipeView.render(model.state.recipe);
    } 
    catch (error) {
        recipeView.renderError();
    }
}


/** 
 * ! Load and render results after searching 
**/
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


/** 
 * ! Load and render results on pagination 
**/
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
} 

/** 
 * ! Bookmarks functionality 
**/
const controlAddBookmark = function() {
    // 1. Add / delete bookmark
    if (!model.state.recipe.bookmarked) {
        model.addBookmark(model.state.recipe);
    } else {
        model.deleteBookmark(model.state.recipe.id);
    }

    // 2. Update recipe view
    recipeView.update(model.state.recipe);

    // 3. Render bookmarks
    bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
    bookmarksView.render(model.state.bookmarks)
}


/** 
 * ! Add new recipes 
**/
const controlAddRecipe = async function (newRecipe) {
    try {
        // 1. Show loading
        addRecipeView.renderSpinner();

        // 2. Upload the new recipe data
        await model.uploadRecipe(newRecipe);

        // 3. Render the new recipe in view
        recipeView.render(model.state.recipe);

        // 4. Show success message
        addRecipeView.renderMessage();

        // 5. Render bookmark view
        bookmarksView.render(model.state.bookmarks);
        
        // 6. Change ID in URL
        window.history.pushState(null, '', `#${model.state.recipe.id}`)

        // 7. Close form  
        setTimeout( function () {
            addRecipeView.toggleWindow()
        }, MODAL_CLOSE_SEC * 1000);

    } catch (error) {
        addRecipeView.renderError(error.message)
    }
}


/** 
 * ! Show recipes after load or change the hash of URL 
**/
const init = function() {
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView._addHandlerUpload(controlAddRecipe);
}
init();