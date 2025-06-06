// ----- Function for adding product to cart, removing, related pop ups/warnings, etc. -----
window.addEventListener('DOMContentLoaded', function() {
    // Product page elements
    var sizeWarning = document.getElementById('size-warning');
    var closeWarnBtn = document.getElementById('close-size-warning');
    var addedPopUp = document.getElementById('added-pop-up');
    var closeAddedBtn = document.getElementById('close-pop-up');
    var addToCartBtns = document.getElementsByClassName('add-to-cart');
    var addAndCheckoutBtns = document.getElementsByClassName('add-and-checkout');
  
    // Side cart elements
    var cartBtns = document.getElementById('cart-button');
    var overlay = document.getElementById('cart-overlay');
    var blurLayer = document.getElementById('blur');
    var sideCart = document.getElementById('side-cart');
    var closeCartBtn = document.getElementById('close-cart');
    var cartProds = document.getElementById('cart-prods');

    // Helper functions
    function showSizeWarning() {
        if (sizeWarning) sizeWarning.classList.add('active');
    }

    function hideSizeWarning() {
        if (sizeWarning) sizeWarning.classList.remove('active');
    }

    function showAddedPopUp() {
        if (!addedPopUp) return;
        addedPopUp.classList.add('active');
        setTimeout(function() {
            addedPopUp.classList.remove('active');
        }, 3000);
    }

    function openCart() {
        if (!sideCart || !overlay) return;
        sideCart.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    function closeCart() {
        if (!sideCart || !overlay) return;
        sideCart.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    // Local storage for cart
    function saveCartToStorage(items) {
        localStorage.setItem('cartItems', JSON.stringify(items));
    }
    function loadCartFromStorage() {
        var raw = localStorage.getItem('cartItems');
        if (!raw) return [];
        try {
            return JSON.parse(raw);
        } catch {
            return [];
        }
    }

    function calcSubtotal() {
        var subtotal = 0;
        var allItems = loadCartFromStorage();
        allItems.forEach(function(item) {
            var tmp = document.createElement('div');
            tmp.innerHTML = item.descHTML;
            var priceParagraph = tmp.querySelectorAll('p')[1];
            if (!priceParagraph) return;
            var priceText = priceParagraph.textContent;
            var n = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
            subtotal += n * item.quantity;
        });
        return subtotal;
    }
  
    // --- Building the cart ---
    function buildCart(items) {
        // Clear existing children of #cart-prods
        cartProds.innerHTML = '';
        
        // If no items in cart, show the “empty” placeholder
        if (items.length === 0) {
            var p = document.createElement('p');
            p.id = 'empty';
            p.textContent = 'No products in cart at the moment.';
            cartProds.appendChild(p);

            // Set subtotal to $0.00
            var subt = document.getElementById('subtotal');
            if (subt) {
                subt.innerHTML = `
                    <p>Subtotal:</p>
                    <p>$0.00</p>
                `;
            }
            return;
        }
    
        // For each item, create .cart-indiv-prods
        items.forEach(function(item) {
            var cartItem = document.createElement('div');
            cartItem.className = 'cart-indiv-prods';
            cartItem.setAttribute('data-product-id', item.prodId);
            cartItem.setAttribute('data-product-size', item.size);
    
            cartItem.innerHTML = `
                <img src="${item.imgSrc}" alt="" width="74" height="113">
                <div class="cart-prod-desc">
                    <div class="desc1">
                    ${item.descHTML}
                    </div>
                    <div class="desc2">
                    <div>
                        <p>${item.size}</p>
                        <button class="qty-decrease">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-increase">+</button>
                        <button class="remove-item">✕</button>
                    </div>
                    <div class="move-to-wishlist">
                        <p>Move to</p>
                        <img src="img/heart_icon.png" alt="Wishlist Icon">
                        <p>Wishlist</p>
                    </div>
                    </div>
                </div>
                `;
    
            cartProds.appendChild(cartItem);
        });

        // Output subtotal
        var subtElem = document.getElementById('subtotal');
        if (subtElem) {
            var currentSubtotal = calcSubtotal(); 
            subtElem.innerHTML = `
            <p>Subtotal:</p>
            <p>$${currentSubtotal.toFixed(2)}</p>
            `;
        }
    }
  
    // Retrieve from localStorage, then build the cart
    var storedItems = loadCartFromStorage();
    buildCart(storedItems);


    // --- Function to add product ---
    function addCurrentProductToCart() {
        // Find the current product being displayed
        var activeProd = document.querySelector('.indiv-prods.active');
        if (!activeProd) return;
    
        var prodId = activeProd.getAttribute('data-product-id');
        if (!prodId) return;
    
        // Find that product’s first image
        var imgElem = activeProd.querySelector('.images img');
        var imgSrc  = imgElem.getAttribute('src');
    
        // Find its name and price
        var descElem = activeProd.querySelector('.prod-desc');
        var descHTML = descElem.innerHTML;
    
        // Find the selected size
        var sizeSelector = activeProd.querySelector('.size-select');
        var chosenSize   = sizeSelector ? sizeSelector.value : '';
        if (!chosenSize) return;
    
        // Load existing items from localStorage
        var items = loadCartFromStorage();
    
        // See if this product + size is already in the cart, if it is then imcrement quantity
        var found = false;
        for (var i = 0; i < items.length; i++) {
            if (items[i].prodId === prodId && items[i].size === chosenSize) {
                items[i].quantity += 1;
                found = true;
                break;
            }
        }
    
        if (!found) {
            // If not already in cart, add it
            items.push({
            prodId: prodId,
            size: chosenSize,
            quantity: 1,
            imgSrc: imgSrc,
            descHTML: descHTML
            });
        }
    
        // Update localStorage
        saveCartToStorage(items);
    
        // Rebuild the cart
        buildCart(items);
    }


    // Close size warning if OK button is clicked
    if (closeWarnBtn) {
        closeWarnBtn.addEventListener('click', hideSizeWarning);
    }
  
    // When "Add to cart" button is clicked
    for (var a = 0; a < addToCartBtns.length; a++) {
        addToCartBtns[a].addEventListener('click', function(e) {
            var prodSection = this.closest('.indiv-prods');
            var sizeSelector = prodSection ? prodSection.querySelector('.size-select') : null;
    
            if (!sizeSelector || !sizeSelector.value) {
                e.preventDefault();
                showSizeWarning();
                // Pop up disappears after 3 seconds
                setTimeout(hideSizeWarning, 3000);
                return;
            }
    
            // Show “Added to Cart” pop up and add product to cart
            showAddedPopUp();
            addCurrentProductToCart();
        });
    }
  
    if (closeAddedBtn) {
        closeAddedBtn.addEventListener('click', function() {
            addedPopUp.classList.remove('active');
        });
    }
  
    // When "Add and checkout" button is clicked
    for (var b = 0; b < addAndCheckoutBtns.length; b++) {
        addAndCheckoutBtns[b].addEventListener('click', function(e) {
            var prodSection = this.closest('.indiv-prods');
            var sizeSelector = prodSection ? prodSection.querySelector('.size-select') : null;
    
            if (!sizeSelector || !sizeSelector.value) {
                e.preventDefault();
                showSizeWarning();
                setTimeout(hideSizeWarning, 3000);
                return;
            }
    
            // Add product to cart and open side-cart
            addCurrentProductToCart();
            openCart();
        });
    }


    // --- Function to keep track of product quantity and removal ---
    function adjustQuantity(e) {
        var target = e.target;
      
        // Remove product button
        if (target.classList.contains('remove-item')) {
            // Find the .cart-indiv-prods container
            var cartItemDiv = target.closest('.cart-indiv-prods');
            if (!cartItemDiv) return;
        
            var prodId = cartItemDiv.getAttribute('data-product-id');
            var size   = cartItemDiv.getAttribute('data-product-size');
        
            // Update localStorage
            var items = loadCartFromStorage();
            items = items.filter(function(item) {
                return !(item.prodId === prodId && item.size === size);
            });
            saveCartToStorage(items);
            cartItemDiv.remove();

            // Update subtotal
            var currentSubtotal = calcSubtotal(); 
            var subtElem = document.getElementById('subtotal');
            if (subtElem) {
                var currentSubtotal = calcSubtotal(); 
                subtElem.innerHTML = `
                <p>Subtotal:</p>
                <p>$${currentSubtotal.toFixed(2)}</p>
                `;
            }
        
            // If empty now, put “No products in cart at the moment.” back and set subtotal to $0.00 again
            if (items.length === 0) {
                var p = document.createElement('p');
                p.id = 'empty';
                p.textContent = 'No products in cart at the moment.';
                cartProds.appendChild(p);

                var subt = document.getElementById('subtotal');
                if (subt) {
                    subt.innerHTML = `
                        <p>Subtotal:</p>
                        <p>$0.00</p>
                    `;
                }
            }
        
            return;
        }
      
        // Quantity change
        if (target.classList.contains('qty-decrease') || target.classList.contains('qty-increase')) {
            var cartItemDiv = target.closest('.cart-indiv-prods');
            if (!cartItemDiv) return;
        
            var prodId = cartItemDiv.getAttribute('data-product-id');
            var size = cartItemDiv.getAttribute('data-product-size');
            var qtyElem = cartItemDiv.querySelector('.quantity');
            var current = parseInt(qtyElem.textContent, 10) || 1;
            var newQty = current;
            
            if (target.classList.contains('qty-decrease')) {
                if (current > 1) {
                    newQty = current - 1;
                }
            } else {
                newQty = current + 1;
            }
        
            // Uodate quantity
            qtyElem.textContent = newQty;
        
            // Update localStorage
            var items = loadCartFromStorage();
            for (var i = 0; i < items.length; i++) {
                if (items[i].prodId === prodId && items[i].size === size) {
                items[i].quantity = newQty;
                break;
                }
            }
            saveCartToStorage(items);

            // Update subtotal
            var currentSubtotal = calcSubtotal(); 
            var subtElem = document.getElementById('subtotal');
            if (subtElem) {
                var currentSubtotal = calcSubtotal(); 
                subtElem.innerHTML = `
                <p>Subtotal:</p>
                <p>$${currentSubtotal.toFixed(2)}</p>
                `;
            }
        }
    }
    
    if (cartProds) {
        cartProds.addEventListener('click', adjustQuantity);
    }
  
    // Open side-cart when cart button is clicked
    cartBtns.addEventListener('click', function(e) {
        e.preventDefault();
        openCart();
    });
  
    // Close cart when X button or anywhere on the blurred area is clicked
    closeCartBtn.addEventListener('click', closeCart);
    blurLayer.addEventListener('click', closeCart);
});


// ----- Empty warning when trying to checkout without any products added to cart -----
window.addEventListener('DOMContentLoaded', function() {
    var checkoutBtn = document.getElementById('checkout-button');
    var emptyWarning = document.getElementById('empty-warning');
    var closeWarnBtn = document.getElementById('close-empty-warning');
  
    // Get cart from storage
    function loadCartFromStorage() {
        var raw = localStorage.getItem('cartItems');
        if (!raw) return [];
        try {
            return JSON.parse(raw);
        } catch {
            return [];
        }
    }
  
    // Show or hide warning
    function showEmptyWarning() {
        if (!emptyWarning) return;
        emptyWarning.classList.add('active');
    
        // pop up disappears after 3 seconds:
        setTimeout(function() {
            emptyWarning.classList.remove('active');
        }, 3000);
    }
  
    // Close pop up if OK button is clicked
    if (closeWarnBtn) {
        closeWarnBtn.addEventListener('click', function() {
            emptyWarning.classList.remove('active');
        });
    }
  
    // Prevent the user from going to the purchasing page and show warning pop up
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            var items = loadCartFromStorage();
            if (items.length === 0) {
                e.preventDefault();
                showEmptyWarning();
            }
        });
    }
});