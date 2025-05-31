// Loading the different products from the search results page
window.onload = function() {
    // Results page
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

    // Product page
    var container = document.getElementById('all-prods');
    if (!container) return;
  
    var params = new URLSearchParams(window.location.search);
    var key    = params.get('prod');
  
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

// "Added to cart" pop up
window.addEventListener('DOMContentLoaded', function() {
    // Grab the pop-up element
    var popUp = document.getElementById('added-pop-up');
    var closeBtn = document.getElementById('close-pop-up');

    // Find all "add to cart" buttons on the product page
    var addButtons = document.getElementsByClassName('add-to-cart');

    // Show pop-up when "add to cart" button is clicked
    for (var i = 0; i < addButtons.length; i++) {
      addButtons[i].addEventListener('click', function() {
        popUp.classList.add('active');
      });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            popUp.classList.remove('active');
        });
    }
});

// Cart functions
window.addEventListener('DOMContentLoaded', function() {
    var cartBtn = document.getElementById('cart-button');
    var overlay = document.getElementById('cart-overlay');
    var blur = document.getElementById('blur');
    var sideCart = document.getElementById('side-cart');
    var closeBtn = document.getElementById('close-cart');
    
    // Functions to open/close the cart
    function openCart() {
        sideCart.classList.add('active');
        overlay.classList.add('active');
    }
    
    function closeCart() {
        sideCart.classList.remove('active');
        overlay.classList.remove('active');
    }
    
    // Show cart when cart button is clicked
    cartBtn.addEventListener('click', openCart);
    
    // Close cart when X button is clicked
    closeBtn.addEventListener('click', closeCart);
    
    // Also close cart when anywhere on the blurred area is clicked
    blur.addEventListener('click', closeCart);
});