export default class View {
    _data;

    render(data, render = true) {
      if (!data || ( Array.isArray(data) && data.length === 0)) 
        return this.renderError();

      this._data = data;
      const markup = this._generateMarkup();

      if (!render) return markup;
      
      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
      this._data = data;
      const newMarkup = this._generateMarkup();

      const newDOM = document.createRange().createContextualFragment(newMarkup);
      // * this method convert the string into real DOM Node object; 'newDom' like the Virtual DOM
      const newElements = Array.from(newDOM.querySelectorAll("*"));
      const currElements = Array.from(this._parentElement.querySelectorAll("*"));

      // * need to compare the arrays and change in DOM only the changed params
      newElements.forEach((newEl, i) => {
        const curEl = currElements[i];

        // * update changed Text
        if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
          curEl.textContent = newEl.textContent;
        }

        // * update changed attributes
        if (!newEl.isEqualNode(curEl)) {
          Array.from(newEl.attributes).forEach(attr => {
            curEl.setAttribute(attr.name, attr.value);
          });
        }
        
      }); 
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpinner() {
        //${icons}#icon-loader
        const markup = `
          <div class="spinner">
            <svg>
                <use href=""></use>
            </svg>
          </div>`;
    
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderError(message = this._errorMessage) {
        const markup = `
          <div class="error">
            <p>${message}</p>
          </div>`;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);  
    }

    // TODO: later for success messages
    renderMessage(message = this._message) {
        const markup = `
          <div class="message">
            <p>${message}</p>
          </div>`;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);  
    }

}