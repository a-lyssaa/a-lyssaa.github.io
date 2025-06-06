// ----- Loading the different products from the search results page -----
window.onload = function() {
    // Results page
    var grid = document.getElementById('products');
    if (grid) {
        var cards = grid.getElementsByClassName('results-indiv-prods');
        for (var i = 0; i < cards.length; i++) {
            cards[i].onclick = function() {
                var prodId = this.getAttribute('data-product-id');
                if (!prodId) return;        
                window.location.href = 'product&cart.html?prod=' + encodeURIComponent(prodId);
            };
        }
      return;
    }

    // Product page
    var container = document.getElementById('all-prods');
    if (!container) return;
  
    var params = new URLSearchParams(window.location.search);
    var key = params.get('prod');
  
    // Hide all, then only show the clicked one
    var items = container.getElementsByClassName('indiv-prods');
    var found = false;
    for (var j = 0; j < items.length; j++) {
        if (items[j].getAttribute('data-product-id') === key) {
            items[j].classList.add('active');
            found = true;
        } else {
        items[j].classList.remove('active');
        }
    }
};



// ----- Creating size select for the different products' pages -----
window.addEventListener('DOMContentLoaded', function() {
    // List of sizes
    var sizes = ['', 'XXS', 'XS', 'S', 'M', 'L', 'XL'];
  
    // Find every size <select>
    var selects = document.querySelectorAll('select.size-select');
  
    // Creating the options
    selects.forEach(function(sel) {
        var placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Size';
        sel.appendChild(placeholder);
    
        sizes.slice(1).forEach(function(sz) {
            var opt = document.createElement('option');
            opt.value = sz;
            opt.textContent = sz;
            sel.appendChild(opt);
        });
    });
});