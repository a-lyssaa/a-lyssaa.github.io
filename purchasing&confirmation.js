// ----- Displaying products under order summary for purchasing page and confirmation page -----
window.addEventListener('DOMContentLoaded', function() {
    // Find the checkout-prods div on purchasing and confirmation page 
    var container = document.getElementById('checkout-prods');
    if (!container) return;
  
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
  
    // Append each added product
    var items = loadCartFromStorage();
    items.forEach(function(item) {
        // Creating a <div> of class="checkout-item"
        var row = document.createElement('div');
        row.className = 'checkout-indiv-prod';
        row.setAttribute('data-product-id', item.prodId);
        row.setAttribute('data-product-size', item.size);
    
        row.innerHTML = `
            <img src="${item.imgSrc}" alt="" width="74" height="113">
            <div class="checkout-desc">
            <div class="desc1">
                ${item.descHTML}
            </div>
            <div class="desc2">
                <span>${item.size}<br></span>
                <span class="quantity">${item.quantity}</span>
            </div>
            </div>
        `;
        container.appendChild(row);
    });

    
    // Calculate and output subtotal and total
    function parsePrice(text) {
        // remove any non‐digit or non‐dot characters
        var n = parseFloat(text.replace(/[^0-9.]/g, ''));
        return isNaN(n) ? 0 : n;
    }

    var allItems = loadCartFromStorage();

    // Calculate price × quantity for each item
    var subtotal = 0;
    allItems.forEach(function(item) {

        var tmp = document.createElement('div');
        tmp.innerHTML = item.descHTML;
        // Find price
        var priceParagraph = tmp.querySelectorAll('p')[1];
        if (!priceParagraph) return;
        var priceText = priceParagraph.textContent;
        var unitPrice = parsePrice(priceText);
        subtotal += unitPrice * Number(item.quantity);
    });

    // Fix shipping at $7.00
    var shipping = 7.00;
    var total = subtotal + shipping;

    // Outputting subtotal to cart
    var subt = document.getElementById('subtotal');
    if (subt) {
        subt.innerHTML = `
        <p>Subtotal:</p>
        <p>$${subtotal.toFixed(2)}</p>
        `;
    }

    // Outputting subtotal and total to purchasing and confirmation pages
    var costDiv = document.getElementById('cost');
    if (costDiv) {
        costDiv.innerHTML = `
        <div class="cost-labels">
            <p>Subtotal:<br>Shipping:</p>
        </div>
        <div class="cost-values">
            <p>$${subtotal.toFixed(2)}<br>$${shipping.toFixed(2)}</p>
        </div>
        `;
    }

    // Build the “total” div
    var totalDiv = document.getElementById('total');
    if (totalDiv) {
        totalDiv.innerHTML = `
        <p>Total:</p>
        <p>$${total.toFixed(2)}</p>
        `;
    }
});



// ----- Input requirements check before confirmation -----
document.addEventListener('DOMContentLoaded', function () {
    var checkoutLink = document.getElementById('order');

    checkoutLink.addEventListener('click', function (e) {
        var emailInput = document.getElementById('email');
        var firstNameInput = document.getElementById('first-name');
        var lastNameInput = document.getElementById('last-name');
        var addressInput = document.getElementById('address');
        var cityInput = document.getElementById('city');
        var stateSelect = document.getElementById('state');
        var postcodeInput = document.getElementById('postcode');
        var cardNumberInput = document.getElementById('card-number');
        var expDateInput = document.getElementById('exp-date');
        var cvvInput = document.getElementById('cvv');
        var cardNameInput = document.getElementById('card-name');

        var allFields = [
            emailInput,
            firstNameInput,
            lastNameInput,
            addressInput,
            cityInput,
            stateSelect,
            postcodeInput,
            cardNumberInput,
            expDateInput,
            cvvInput,
            cardNameInput,
        ];

        // Show an alert if there are invalid inputs
        function isFieldValid(field) {
            if (field.tagName.toLowerCase() === 'select') {
                return field.value.trim() !== '';
            }
            return field.checkValidity();
        }

        var invalidFields = allFields.filter(function (fld) {
            return !isFieldValid(fld);
        });

        if (invalidFields.length > 0) {
            e.preventDefault();
            alert('Please make sure all required fields are filled out correctly before proceeding. ' +
                  'Postcode must be 4 digits; card number 16 digits; expiration MM/YY; CVV 3 digits.');
            invalidFields[0].focus();
            return false;
        }

        // Store email to output on confirmation page
        localStorage.setItem('customerEmail', emailInput.value.trim());
    });
});



//  ----- Output user's email on confirmation page -----
document.addEventListener('DOMContentLoaded', function () {
    // Find the user inputted email
    var messagePara = document.querySelector('#message p:nth-of-type(2)');
    if (!messagePara) return;
  
    var storedEmail = localStorage.getItem('customerEmail') || '';
    
    // Outputting
    if (storedEmail) {
        messagePara.innerHTML = 'A summary of your order has been sent to your email:<br>' + storedEmail;
    }
});