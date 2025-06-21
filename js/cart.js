(() => {
  // Retrieve cart from localStorage or initialize empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Formatter for Indian Rupees
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });

  // Update cart icon count in nav
  function updateCartIconCount() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) cartCountEl.textContent = count;
  }

  // Render cart items on Cart page
  function renderCart() {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if (!container || !totalEl) return;

    container.innerHTML = "";
    let total = 0;
    cart.forEach(({ name, price, quantity, image }, idx) => {
      total += price * quantity;
      const itemElem = document.createElement("article");
      itemElem.className = "cart-item";
      itemElem.innerHTML = `
          <img src="${image ? image : 'img/placeholder.jpg'}" alt="${name}" loading="lazy" />
          <div class="cart-item-details">
            <h3>${name}</h3>
            <p>${formatter.format(price)} x ${quantity}</p>
            <button type="button" aria-label="Remove ${name} from cart" data-index="${idx}">Remove</button>
          </div>
        `;
      container.appendChild(itemElem);
    });
    totalEl.textContent = formatter.format(total);
  }

  // Remove item from cart with confirmation
  function removeFromCart(idx) {
    if (confirm("Are you sure you want to remove this item from your cart?")) {
      cart.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartIconCount();
      showMessage("Item removed from cart.");
    }
  }

  // Add or increment item in cart
  function addToCart(item) {
    const existingIdx = cart.findIndex((i) => i.name === item.name);
    if (existingIdx > -1) {
      cart[existingIdx].quantity++;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartIconCount();
    showMessage(`${item.name} added to cart!`);
  }

  // Display feedback message
  function showMessage(msg) {
    let msgBox = document.getElementById("feedback-message");
    if (!msgBox) {
      msgBox = document.createElement("div");
      msgBox.id = "feedback-message";
      msgBox.style.position = "fixed";
      msgBox.style.top = "1rem";
      msgBox.style.right = "1rem";
      msgBox.style.backgroundColor = "#dc2626";
      msgBox.style.color = "white";
      msgBox.style.padding = "1rem 1.5rem";
      msgBox.style.borderRadius = "0.5rem";
      msgBox.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
      msgBox.style.zIndex = 2000;
      msgBox.style.fontWeight = "600";
      msgBox.style.opacity = "0";
      msgBox.style.transition = "opacity 0.3s ease";
      document.body.appendChild(msgBox);
    }
    msgBox.textContent = msg;
    msgBox.style.opacity = "1";
    clearTimeout(window._msgTimeout);
    window._msgTimeout = setTimeout(() => {
      msgBox.style.opacity = "0";
    }, 3000);
  }

  // Place order handler for reservation and checkout forms
  function placeOrder(e) {
    e.preventDefault();
    const form = e.target;
    const fullName = form.querySelector("#fullName, #checkout-name, #name")?.value.trim();
    const address = form.querySelector("#address, #checkout-address")?.value.trim();
    const phone = form.querySelector("#phone, #checkout-phone")?.value.trim();
    const email = form.querySelector("#email")?.value.trim();
    const date = form.querySelector("#date")?.value.trim();
    const time = form.querySelector("#time")?.value.trim();
    const guests = form.querySelector("#guests")?.value.trim();
    const payment = form.querySelector("#payment, #checkout-payment")?.value;

    // Basic required field checks
    if (form.id === "reservation-form") {
      if (!fullName || !date || !time || !guests || !email) {
        showMessage("Please fill out all required reservation fields.");
        return;
      }
    } else {
      if (!fullName || !address || !phone || !payment) {
        showMessage("Please fill out all required checkout fields.");
        return;
      }
      if (cart.length === 0) {
        showMessage("Your cart is empty.");
        return;
      }
    }

    // Here you'd send data to backend API if available

    showMessage("Form submitted successfully! Thank you.");
    if (form.id === "checkout-form") {
      // Clear cart on order placed
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartIconCount();
    }
    form.reset();
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateCartIconCount();
    renderCart();

    // Delegate remove button clicks
    const cartContainer = document.getElementById("cart-items");
    if (cartContainer) {
      cartContainer.addEventListener("click", (ev) => {
        if (ev.target.tagName === "BUTTON" && ev.target.dataset.index !== undefined) {
          removeFromCart(parseInt(ev.target.dataset.index));
        }
      });
    }

    // Add event listeners to forms with reservation or checkout
    document.querySelectorAll("form").forEach((form) => {
      if (form.id === "checkout-form" || form.id === "reservation-form") {
        form.addEventListener("submit", placeOrder);
      }
    });

    // Expose addToCart globally for inline calls in menu.html
    window.addToCart = addToCart;
  });
})();







function renderCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!container || !totalEl) return;

  container.innerHTML = "";
  let total = 0;
  cart.forEach(({name, price, quantity, image}, idx) => {
    total += price * quantity;
    const itemElem = document.createElement("article");
    itemElem.className = "cart-item";
    itemElem.innerHTML = `
      <img src="${image || 'img/placeholder.jpg'}" alt="${name}" loading="lazy" />
      <div class="cart-item-details">
        <h3>${name}</h3>
        <p>${formatter.format(price)}</p>
        <div class="quantity-controls">
          <button type="button" class="quantity-btn" data-action="decrease" data-index="${idx}" aria-label="Decrease quantity of ${name}">-</button>
          <span class="quantity-value" aria-live="polite" aria-atomic="true">${quantity}</span>
          <button type="button" class="quantity-btn" data-action="increase" data-index="${idx}" aria-label="Increase quantity of ${name}">+</button>
        </div>
        <button type="button" class="remove-btn" aria-label="Remove ${name} from cart" data-index="${idx}">Remove</button>
      </div>
    `;
    container.appendChild(itemElem);
  });
  totalEl.textContent = formatter.format(total);
}







const cartContainer = document.getElementById("cart-items");
if (cartContainer) {
  cartContainer.addEventListener("click", (ev) => {
    const target = ev.target;
    if (target.classList.contains("quantity-btn")) {
      const idx = parseInt(target.dataset.index);
      if (isNaN(idx)) return;
      if (target.dataset.action === "increase") {
        cart[idx].quantity += 1;
      } else if (target.dataset.action === "decrease" && cart[idx].quantity > 1) {
        cart[idx].quantity -= 1;
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartIconCount();
    }
    if (target.classList.contains("remove-btn")) {
      removeFromCart(parseInt(target.dataset.index));
    }
  });
}
