import View from "./View.js";

class PreviewView extends View {
    _parentElement = '';

    _generateMarkup(result) { 
        const id = window.location.hash.slice(1);
        
        return `
        <li class="preview">
          <a class="preview__link ${this._data.id === id ? 'preview__link--active' : ''}" 
            href="#${this._data.id}">
            <figure class="fig">
                <img src="${this._data.image}" alt="${this._data.title}" />
            </figure>

            <div class="data">
                <h4 class="data__title">${this._data.title}</h4>
                <p class="data__publisher">${this._data.publisher}</p>  
            </div>

            <div class="user-generated ${this._data.key ? '' : 'hidden'}">
              <i class="fa-solid fa-user"></i>
            </div>
          </a>
        </li>`;
    }
}

export default new PreviewView();