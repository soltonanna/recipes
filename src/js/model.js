import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from "./views/helper.js";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
};


export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}/${id}`);
        const { recipe } = data.data;

        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
        }
        
    } catch (error) {
        console.log(error);
        throw error;
    }
};


export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;

        const data = await getJSON(`${API_URL}/?search=${query}`);
        const { recipes } = data.data;
        
        state.search.results = recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
            }
        });

    } catch (error) {
        console.log(error);
        throw error
    }
};


export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page - 1 ) * state.search.resultsPerPage; // 0
    const end = page * state.search.resultsPerPage;  // 9
    
    return state.search.results.slice(start, end);
}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        // newQt = oldQt * newServings / oldServings 
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    });
    state.recipe.servings = newServings;
}