window.onload = function() {
    // results page
    var grid = document.getElementById('products');
    if (grid) {
        var cards = grid.getElementsByClassName('results-indiv-prods');
        for (var i = 0; i < cards.length; i++) {
            cards[i].onclick = function() {
                var prodId = this.getAttribute('data-product-id');
                if (!prodId) return;        
                window.location.href = 'product.html?prod=' + encodeURIComponent(prodId);
            };
        }
      return;
    }

    // product page
    var container = document.getElementById('all-prods');
    if (!container) return;
  
    var params = new URLSearchParams(window.location.search);
    var key    = params.get('prod');
  
    // hide all, then only show the clicked one
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
  