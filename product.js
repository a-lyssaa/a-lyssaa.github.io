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
    var sizeSelect   = document.getElementById('size');
    var sizeWarning  = document.getElementById('size-warning');
    var closeWarnBtn = document.getElementById('close-size-warning');

    // Find all "add to cart" buttons on the product page
    var addButtons = document.getElementsByClassName('add-to-cart');

    // Functions to show and hide size warning pop up
    function showSizeWarning() {
        sizeWarning.classList.add('active');
    }
    closeWarnBtn.addEventListener('click', function() {
        sizeWarning.classList.remove('active');
    });

    /* When "add to cart" button is clicked, if size is not selected, show size warning pop up.
       If not show "added to cart" pop-up, both pop ups disappear after 3 seconds */
    for (var i = 0; i < addButtons.length; i++) {
        addButtons[i].addEventListener('click', function(e) {
            if (!sizeSelect.value) {
                e.preventDefault();
                showSizeWarning();
                setTimeout(function() {
                    sizeWarning.classList.remove('active');
                }, 3000);
                return;
            }
            popUp.classList.add('active');
            setTimeout(function() {
                popUp.classList.remove('active');
            }, 3000);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            popUp.classList.remove('active');
        });
    }
});

// Open and closing cart
window.addEventListener('DOMContentLoaded', function() {
    var cartBtn = document.getElementById('cart-button');
    var addAndCheckout = document.getElementsByClassName('add-and-checkout');
    var overlay = document.getElementById('cart-overlay');
    var blur = document.getElementById('blur');
    var sideCart = document.getElementById('side-cart');
    var closeBtn = document.getElementById('close-cart');
    var sizeSelect = document.getElementById('size');
    var sizeWarning = document.getElementById('size-warning');
    var closeWarnBtn = document.getElementById('close-size-warning');

    // Functions to show and hide size warning pop up
    function showSizeWarning() {
        sizeWarning.classList.add('active');
    }
    closeWarnBtn.addEventListener('click', function() {
        sizeWarning.classList.remove('active');
    });
    
    // Functions to open/close the cart
    function openCart() {
        sideCart.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('no-scroll');
    }
    
    function closeCart() {
        sideCart.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
    
    // Show cart when cart button is clicked
    for (var i = 0; i < cartBtn.length; i++) {
        cartBtn[i].addEventListener('click', openCart);
    }

    // Also show cart when .add-to-checkout button is clicked, unless size is not selected
    for (var j = 0; j < addAndCheckout.length; j++) {
        addAndCheckout[j].addEventListener('click', function(e) {
            if (!sizeSelect.value) {
                e.preventDefault();
                showSizeWarning();
                setTimeout(function() {
                    sizeWarning.classList.remove('active');
                }, 3000);
                return;
            }
            openCart();
        });
    }
    
    // Close cart when X button is clicked
    closeBtn.addEventListener('click', closeCart);
    
    // Also close cart when anywhere on the blurred area is clicked
    blur.addEventListener('click', closeCart);
});