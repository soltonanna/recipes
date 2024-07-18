import View from './View.js';

import { numberToFraction } from '../helper.js';

/* Note: Private methods called with # sign */

class RecipeView extends View {
    _parentElement = document.querySelector('.recipe');
    _errorMessage = `We couldn't find that recipe. Please try another one!`;
    _message = '';

    addHandlerRender(handler) {
        ["hashchange", "load"].forEach(ev => addEventListener(ev, handler));
    }

    addHandlerUpdateServings(handler) {
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--update-servings');
            
            if (!btn) return;

            const { updateTo } = btn.dataset;  // data-update-to
            
            if (+updateTo > 0) handler(+updateTo);
        });
    }

    addHandlerAddBookmark(handler) {
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--bookmark');

            if (!btn) return;
            
            handler();
        })
    }

    _generateMarkup() {
        return `
        <div class="row-top">
            <h2 class="single-title">${this._data.title}</h2>
            <figure class="single-fig">
                <img src="${this._data.image}" alt="${this._data.title}" />
            </figure>
        </div>

        <div class="row-bottom">

            <div class="single-details">
                
                <div class="single-details__info">
                    <i class="fa-solid fa-clock single-details__info-icon"></i>
                    <span class="single-details__info-data single-details__info-data--minutes">${this._data.cookingTime}</span>
                    <span class="single-details__info-text">minutes</span>
                </div>

                <div class="single-details__info">
                    <i class="fa-solid fa-users single-details__info-icon"></i>
                    <span class="single-details__info-data single-details__info-data--people">${this._data.servings}</span>
                    <span class="single-details__info-text">servings</span>

                    <div class="single-details__info-buttons">
                        <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1}">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>

                <div class="single-details__user-generated ${this._data.key ? '' : 'hidden'}">
                    <i class="fa-solid fa-user"></i>   
                </div>

                <button class="btn--round btn--bookmark">
                    ${this._data.bookmarked 
                        ? "<i class='fa-solid fa-bookmark icon-fill'></i>" 
                        : "<i class='fa-regular fa-bookmark'></i>"
                    }
                </button>
            </div>

            <div class="outer-group">
                <div class="single-ingredients">
                    <h2 class="heading--2">Recipe ingredients</h2>
                    <ul class="single-ingredients-list">
                        ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
                    </ul>
                </div>

                <div class="single-directions">
                    <h2 class="heading--2">How to cook it</h2>
                    <p class="single-directions__text">
                        This recipe was carefully designed and tested by
                        <span class="publisher">${this._data.publisher}</span>. Please check out directions at their website.
                    </p>
                    <a class="btn--small single-directions__btn" href="${this._data.sourceUrl}" target="_blank" >
                        <span>Directions</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>     
        </div>`;
    }

    _generateMarkupIngredient(ing) {
        return `
        <li class="ingredient">
            <i class="fa-solid fa-check ingredient__icon"></i>
            <div class="ingredient__quantity">
                ${ing.quantity ? numberToFraction(ing.quantity).toString() : ''}
            </div>
            <div class="ingredient__description">
                <span class="unit">${ing.unit}</span>
                ${ing.description}
            </div>
        </li>`;
    }
}

export default new RecipeView();