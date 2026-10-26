/**
 * ART_SHINERSSS - Handmade Jewellery Website
 * Core Logic & Interactive Functionality
 * WhatsApp Number: 918122965239 (+91 81229 65239)
 */

// Shop Configuration
const whatsappNumber = "918122965239";

// State Management
let currentFilter = "All Products";
let searchQuery = "";
let currentSort = "featured";
let cart = [];
let cardQuantities = {};
let cardSelectedColors = {};

// -----------------------------------------------------------------------------
// WhatsApp Direct Order Function (Required helper)
// -----------------------------------------------------------------------------
function orderOnWhatsApp(productName, price, quantity, color = "") {
  const colorText = color ? `Color/Variant: ${color}\n` : "";
  const total = price * quantity;
  const message = `Hello ART_SHINERSSS! I would like to order:
Product: ${productName}
${colorText}Price: ₹${price}
Quantity: ${quantity}
Total: ₹${total}

Please confirm availability and delivery charges. Thank you!`;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

// -----------------------------------------------------------------------------
// Initialize App
// -----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadCartFromStorage();
  initCategoryPills();
  renderProducts();
  setupEventListeners();
  updateCartUI();
});

// -----------------------------------------------------------------------------
// Local Storage & Cart Handling
// -----------------------------------------------------------------------------
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem("art_shinersss_cart");
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (e) {
    console.error("Could not load cart from localStorage", e);
    cart = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem("art_shinersss_cart", JSON.stringify(cart));
  } catch (e) {
    console.error("Could not save cart to localStorage", e);
  }
}

// -----------------------------------------------------------------------------
// Dynamic Product Catalog Helper (Merges products.js + in-browser uploads)
// -----------------------------------------------------------------------------
function getActiveProducts() {
  let list = Array.isArray(products) ? [...products] : [];
  try {
    const saved = localStorage.getItem("art_shinersss_custom_products");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = [...parsed, ...list];
      }
    }
  } catch (e) {
    console.error("Error reading custom products from storage", e);
  }
  return list;
}

function addToCart(productId, quantity = 1, color = "") {
  const product = getActiveProducts().find(p => p.id === productId);
  if (!product) return;

  const chosenColor = color || (product.colors && product.colors[0]) || "Standard";

  // Check if identical product + color already in cart
  const existingIndex = cart.findIndex(item => item.id === productId && item.color === chosenColor);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      color: chosenColor,
      quantity: quantity
    });
  }

  saveCartToStorage();
  updateCartUI();
  showToast(product.name, product.image, `${quantity} added to bag (${chosenColor})`);
}

function removeFromCart(index) {
  if (index >= 0 && index < cart.length) {
    const item = cart[index];
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartUI();
    showToast(item.name, item.image, "Item removed from bag");
  }
}

function updateCartQuantity(index, delta) {
  if (index >= 0 && index < cart.length) {
    const newQty = cart[index].quantity + delta;
    if (newQty <= 0) {
      removeFromCart(index);
    } else {
      cart[index].quantity = newQty;
      saveCartToStorage();
      updateCartUI();
    }
  }
}

function clearCart() {
  if (cart.length === 0) return;
  if (confirm("Are you sure you want to clear your shopping cart?")) {
    cart = [];
    saveCartToStorage();
    updateCartUI();
  }
}

// -----------------------------------------------------------------------------
// Cart Drawer UI & Free Shipping Calculation
// -----------------------------------------------------------------------------
function updateCartUI() {
  const countBadges = document.querySelectorAll(".cart-counter-badge");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  countBadges.forEach(badge => {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? "flex" : "none";
  });

  const cartContainer = document.getElementById("cartItemsContainer");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const cartDeliveryFeeEl = document.getElementById("cartDeliveryFee");
  const cartGrandTotalEl = document.getElementById("cartGrandTotal");
  const shippingFill = document.getElementById("shippingProgressFill");
  const shippingMeterText = document.getElementById("shippingMeterText");
  const cartCheckoutBtn = document.getElementById("cartCheckoutBtn");
  const cartFooter = document.getElementById("cartFooter");

  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty-state">
        <div class="cart-empty-icon"><i class="fas fa-shopping-bag"></i></div>
        <h3>Your Bag is Empty</h3>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin: 8px 0 20px;">
          Explore our handmade bracelets, chains & personalized gifts!
        </p>
        <button class="btn btn-primary btn-sm" onclick="closeCart(); scrollToShop();">Start Shopping</button>
      </div>
    `;
    if (cartFooter) cartFooter.style.display = "none";
    return;
  }

  if (cartFooter) cartFooter.style.display = "block";

  // Render items
  cartContainer.innerHTML = cart.map((item, index) => `
    <div class="cart-item-row">
      <div class="cart-item-thumb">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/hero-jewellery.jpg'">
      </div>
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <span class="cart-item-color"><i class="fas fa-palette" style="font-size: 0.65rem;"></i> ${item.color}</span>
        <div class="cart-item-price">₹${item.price}</div>
      </div>
      <div class="cart-item-actions">
        <button class="cart-remove-btn" onclick="removeFromCart(${index})" title="Remove item">
          <i class="fas fa-trash-alt"></i>
        </button>
        <div class="qty-stepper">
          <button class="qty-btn" onclick="updateCartQuantity(${index}, -1)">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQuantity(${index}, 1)">+</button>
        </div>
      </div>
    </div>
  `).join("");

  // Subtotal calculation
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
  if (cartDeliveryFeeEl) {
    cartDeliveryFeeEl.innerHTML = `<span style="font-size: 0.8rem; color: var(--gold-600); font-weight: 600;">Confirmed on WhatsApp</span>`;
  }
  if (cartGrandTotalEl) cartGrandTotalEl.textContent = `₹${subtotal.toLocaleString("en-IN")} + Delivery`;
}

function openCart() {
  const backdrop = document.getElementById("cartBackdrop");
  if (backdrop) backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  const backdrop = document.getElementById("cartBackdrop");
  if (backdrop) backdrop.classList.remove("open");
  document.body.style.overflow = "";
}

// -----------------------------------------------------------------------------
// Checkout via WhatsApp (Entire Cart)
// -----------------------------------------------------------------------------
function checkoutCartOnWhatsApp() {
  if (cart.length === 0) {
    alert("Your shopping bag is empty! Please add products first.");
    return;
  }

  // Optional customer details
  const nameInput = document.getElementById("cartCustName");
  const cityInput = document.getElementById("cartCustCity");
  const noteInput = document.getElementById("cartCustNote");

  const customerName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Valued Customer";
  const customerCity = cityInput && cityInput.value.trim() ? cityInput.value.trim() : "Not specified";
  const customerNote = noteInput && noteInput.value.trim() ? noteInput.value.trim() : "";

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  let itemsListText = "";
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    itemsListText += `${index + 1}. 💎 *${item.name}*\n   • Color: ${item.color}\n   • Qty: ${item.quantity} × ₹${item.price} = ₹${itemTotal}\n`;
  });

  let message = `🌸 *ORDER REQUEST - ART_SHINERSSS* 🌸
━━━━━━━━━━━━━━━━━━
Hello ART_SHINERSSS! I would like to place an order from your website:

*Items Ordered:*
${itemsListText}
━━━━━━━━━━━━━━━━━━
*Items Subtotal:* ₹${subtotal.toLocaleString("en-IN")}
*Delivery Charges:* Please confirm for my location
*Total Items Cost:* ₹${subtotal.toLocaleString("en-IN")} (+ delivery)
━━━━━━━━━━━━━━━━━━

*Customer Details:*
• Name: ${customerName}
• Delivery City / Address: ${customerCity}`;

  if (customerNote) {
    message += `\n• Special Note: ${customerNote}`;
  }

  message += `\n\nPlease confirm availability, UPI payment details, and shipping timeline. Thank you! ✨`;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

// -----------------------------------------------------------------------------
// Filter & Render Products
// -----------------------------------------------------------------------------
function initCategoryPills() {
  const pillsContainer = document.getElementById("filterPillsContainer");
  if (!pillsContainer) return;

  pillsContainer.innerHTML = categoriesList.map(cat => `
    <button class="filter-pill ${cat === currentFilter ? 'active' : ''}" onclick="setCategoryFilter('${cat}')">
      ${cat}
    </button>
  `).join("");
}

function setCategoryFilter(category) {
  currentFilter = category;
  initCategoryPills();
  highlightActiveCategoryCard(category);
  renderProducts();

  // Smooth scroll to catalog toolbar on mobile
  const catalogEl = document.getElementById("shopCatalog");
  if (catalogEl && window.innerWidth < 768) {
    catalogEl.scrollIntoView({ behavior: "smooth" });
  }
}

function highlightActiveCategoryCard(category) {
  const cards = document.querySelectorAll(".category-card");
  cards.forEach(card => {
    const cardCat = card.getAttribute("data-category");
    if (cardCat === category) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });
}

function renderProducts() {
  const container = document.getElementById("productsGrid");
  const countDisplay = document.getElementById("catalogProductCount");
  if (!container) return;

  // Filter by category
  let list = products.filter(p => {
    if (currentFilter === "All Products") return true;
    return p.category === currentFilter || p.subcategory === currentFilter;
  });

  // Filter by search query
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.colors && p.colors.some(c => c.toLowerCase().includes(q)))
    );
  }

  // Sort
  if (currentSort === "price-low") {
    list.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-high") {
    list.sort((a, b) => b.price - a.price);
  } else if (currentSort === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  }

  if (countDisplay) {
    countDisplay.textContent = `Showing ${list.length} handcrafted piece${list.length === 1 ? '' : 's'}`;
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="catalog-empty-state">
        <div class="empty-state-icon"><i class="fas fa-search"></i></div>
        <h3>No jewellery found matching your criteria</h3>
        <p style="color: var(--text-muted); margin: 8px 0 20px;">
          Try adjusting your search terms or view all products.
        </p>
        <button class="btn btn-outline btn-sm" onclick="resetFilters()">View All Collections</button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(product => {
    const qty = cardQuantities[product.id] || 1;
    const selectedColor = cardSelectedColors[product.id] || (product.colors ? product.colors[0] : "");
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return `
      <div class="product-card" id="card-${product.id}">
        <div class="card-media-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='assets/images/hero-jewellery.jpg'">
          ${product.badge ? `<span class="card-badge">${product.badge}</span>` : ""}
          <button class="card-quickview-btn" onclick="openQuickView('${product.id}')">
            <i class="fas fa-eye"></i> Quick View
          </button>
        </div>

        <div class="card-body">
          <div class="card-category">${product.category}</div>
          <h3 class="card-title" onclick="openQuickView('${product.id}')" style="cursor: pointer;">${product.name}</h3>
          
          <div class="card-rating">
            <div class="stars">
              ${generateStarsHTML(product.rating)}
            </div>
            <span class="rating-count">(${product.reviewCount})</span>
            <span style="margin-left: auto; font-size: 0.72rem; color: #2E7D32; font-weight: 600;">
              <i class="fas fa-check-circle"></i> ${product.availability}
            </span>
          </div>

          <!-- Color Variants -->
          ${product.colors && product.colors.length > 0 ? `
            <div class="card-colors-row">
              ${product.colors.map(col => `
                <button type="button" 
                  class="color-option-tag ${col === selectedColor ? 'selected' : ''}" 
                  style="${col === selectedColor ? 'background: var(--blush-100); border-color: var(--blush-500); font-weight: 700;' : ''}"
                  onclick="selectCardColor('${product.id}', '${col}')">
                  ${col}
                </button>
              `).join("")}
            </div>
          ` : ""}

          <!-- Price Row -->
          <div class="card-price-row">
            <span class="current-price">₹${product.price}</span>
            ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice}</span>` : ""}
            ${discount > 0 ? `<span class="discount-tag">${discount}% OFF</span>` : ""}
          </div>

          <!-- Quantity Stepper & Buttons -->
          <div class="card-actions">
            <div class="card-qty-row">
              <span class="qty-label">Quantity</span>
              <div class="qty-stepper">
                <button class="qty-btn" onclick="changeCardQty('${product.id}', -1)">−</button>
                <span class="qty-display" id="qty-disp-${product.id}">${qty}</span>
                <button class="qty-btn" onclick="changeCardQty('${product.id}', 1)">+</button>
              </div>
            </div>

            <div class="card-btn-group">
              <button class="btn-add-cart" onclick="addCardToCart('${product.id}')">
                <i class="fas fa-shopping-bag"></i> Add to Cart
              </button>
              <button class="btn-card-whatsapp" onclick="directCardWhatsAppOrder('${product.id}')">
                <i class="fab fa-whatsapp"></i> Buy on WA
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function generateStarsHTML(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  let html = "";
  for (let i = 0; i < fullStars; i++) {
    html += '<i class="fas fa-star"></i>';
  }
  if (hasHalf) {
    html += '<i class="fas fa-star-half-alt"></i>';
  }
  return html;
}

function changeCardQty(productId, delta) {
  const current = cardQuantities[productId] || 1;
  const next = Math.max(1, current + delta);
  cardQuantities[productId] = next;
  const disp = document.getElementById(`qty-disp-${productId}`);
  if (disp) disp.textContent = next;
}

function selectCardColor(productId, color) {
  cardSelectedColors[productId] = color;
  renderProducts();
}

function addCardToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const qty = cardQuantities[productId] || 1;
  const color = cardSelectedColors[productId] || (product.colors ? product.colors[0] : "Standard");
  addToCart(productId, qty, color);
}

function directCardWhatsAppOrder(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const qty = cardQuantities[productId] || 1;
  const color = cardSelectedColors[productId] || (product.colors ? product.colors[0] : "");
  orderOnWhatsApp(product.name, product.price, qty, color);
}

function resetFilters() {
  currentFilter = "All Products";
  searchQuery = "";
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";
  initCategoryPills();
  highlightActiveCategoryCard("All Products");
  renderProducts();
}

// -----------------------------------------------------------------------------
// Quick View Modal
// -----------------------------------------------------------------------------
function openQuickView(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const modalContainer = document.getElementById("quickviewModal");
  if (!modalContainer) return;

  let selectedModalColor = product.colors && product.colors.length > 0 ? product.colors[0] : "";
  let modalQty = 1;

  modalContainer.innerHTML = `
    <div class="quickview-card">
      <button class="modal-close-btn" onclick="closeQuickView()">&times;</button>
      <div class="quickview-image-pane">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/hero-jewellery.jpg'">
      </div>
      <div class="quickview-details-pane">
        <span class="card-category" style="margin-bottom: 8px;">${product.category}</span>
        <h2 style="font-size: 1.6rem; margin-bottom: 8px;">${product.name}</h2>

        <div class="card-rating" style="margin-bottom: 16px;">
          <div class="stars">${generateStarsHTML(product.rating)}</div>
          <span class="rating-count">(${product.reviewCount} verified reviews)</span>
          <span style="margin-left: auto; color: #2E7D32; font-size: 0.78rem; font-weight: 700;">
            <i class="fas fa-check-circle"></i> ${product.availability}
          </span>
        </div>

        <div class="card-price-row" style="margin-bottom: 16px;">
          <span class="current-price" style="font-size: 1.65rem;">₹${product.price}</span>
          ${product.originalPrice ? `<span class="original-price" style="font-size: 1.05rem;">₹${product.originalPrice}</span>` : ""}
          <span class="discount-tag">Handmade with Love</span>
        </div>

        <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">
          ${product.description}
        </p>

        <!-- Color Selector -->
        ${product.colors && product.colors.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 0.825rem; font-weight: 700; margin-bottom: 8px;">
              Select Color / Style: <span id="modalSelectedColorLabel" style="color: var(--blush-600);">${selectedModalColor}</span>
            </label>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${product.colors.map(col => `
                <button type="button" class="color-option-tag" id="modal-col-${col.replace(/\s+/g, '-')}" 
                  style="${col === selectedModalColor ? 'background: var(--blush-500); color: #FFF; border-color: var(--blush-500);' : ''}"
                  onclick="setModalColor('${col}')">
                  ${col}
                </button>
              `).join("")}
            </div>
          </div>
        ` : ""}

        <!-- Quantity Picker -->
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 24px;">
          <span style="font-size: 0.85rem; font-weight: 600;">Quantity:</span>
          <div class="qty-stepper">
            <button class="qty-btn" onclick="updateModalQty(-1)">−</button>
            <span class="qty-display" id="modalQtyDisplay">${modalQty}</span>
            <button class="qty-btn" onclick="updateModalQty(1)">+</button>
          </div>
        </div>

        <!-- Action CTAs -->
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: auto;">
          <button class="btn btn-primary" onclick="submitModalAddToCart('${product.id}')">
            <i class="fas fa-shopping-bag"></i> Add to Shopping Bag
          </button>
          <button class="btn btn-whatsapp" onclick="submitModalWhatsAppOrder('${product.id}')">
            <i class="fab fa-whatsapp"></i> Order on WhatsApp Now
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.classList.add("open");
  document.body.style.overflow = "hidden";

  // Modal internal state helpers attached to window
  window._modalCurrentColor = selectedModalColor;
  window._modalCurrentQty = modalQty;
  window._modalCurrentProduct = product;
}

window.setModalColor = function(color) {
  window._modalCurrentColor = color;
  const label = document.getElementById("modalSelectedColorLabel");
  if (label) label.textContent = color;

  if (window._modalCurrentProduct && window._modalCurrentProduct.colors) {
    window._modalCurrentProduct.colors.forEach(c => {
      const btn = document.getElementById(`modal-col-${c.replace(/\s+/g, '-')}`);
      if (btn) {
        if (c === color) {
          btn.style.background = "var(--blush-500)";
          btn.style.color = "#FFF";
          btn.style.borderColor = "var(--blush-500)";
        } else {
          btn.style.background = "var(--cream-100)";
          btn.style.color = "var(--text-secondary)";
          btn.style.borderColor = "var(--cream-300)";
        }
      }
    });
  }
};

window.updateModalQty = function(delta) {
  window._modalCurrentQty = Math.max(1, (window._modalCurrentQty || 1) + delta);
  const disp = document.getElementById("modalQtyDisplay");
  if (disp) disp.textContent = window._modalCurrentQty;
};

window.submitModalAddToCart = function(productId) {
  addToCart(productId, window._modalCurrentQty, window._modalCurrentColor);
  closeQuickView();
};

window.submitModalWhatsAppOrder = function(productId) {
  const p = window._modalCurrentProduct;
  if (!p) return;
  orderOnWhatsApp(p.name, p.price, window._modalCurrentQty, window._modalCurrentColor);
};

function closeQuickView() {
  const modalContainer = document.getElementById("quickviewModal");
  if (modalContainer) modalContainer.classList.remove("open");
  document.body.style.overflow = "";
}

// -----------------------------------------------------------------------------
// Custom Jewellery Order Submission
// -----------------------------------------------------------------------------
function submitCustomOrder(event) {
  event.preventDefault();

  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const type = document.getElementById("custType").value;
  const color = document.getElementById("custColor").value.trim();
  const size = document.getElementById("custSize").value.trim();
  const personalization = document.getElementById("custPersonalization").value.trim();
  const budget = document.getElementById("custBudget").value;
  const notes = document.getElementById("custNotes").value.trim();

  if (!name || !phone) {
    alert("Please enter your name and WhatsApp number.");
    return;
  }

  const message = `✨ *CUSTOM JEWELLERY REQUEST - ART_SHINERSSS* ✨
━━━━━━━━━━━━━━━━━━
Hello ART_SHINERSSS! I would like to design and order a customized handmade piece:

• *Customer Name:* ${name}
• *WhatsApp Contact:* ${phone}
• *Jewellery Type:* ${type}
• *Preferred Colour:* ${color || "As recommended by artisan"}
• *Size / Length:* ${size || "Standard adjustable"}
• *Personalization / Name Charm:* ${personalization || "None / General aesthetic"}
• *Budget Range:* ${budget}
• *Design Requirements:* ${notes || "Custom craft with boutique charms"}

📷 *Reference Photo:* (I will attach and send my reference image right below in this WhatsApp chat)

Please review my customization request and send me your design ideas & price estimate. Thank you! 💕`;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");

  // Show confirmation alert
  alert("Opening WhatsApp with your customization details! You can attach any reference photos directly in the WhatsApp chat.");
  document.getElementById("customOrderForm").reset();
}

// -----------------------------------------------------------------------------
// Toast Notifications
// -----------------------------------------------------------------------------
function showToast(title, image, desc = "") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <img src="${image}" alt="${title}" class="toast-img" onerror="this.src='assets/images/hero-jewellery.jpg'">
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-desc">${desc}</div>
    </div>
    <button class="toast-btn" onclick="openCart()">View Bag</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

// -----------------------------------------------------------------------------
// Setup Event Listeners
// -----------------------------------------------------------------------------
function setupEventListeners() {
  // Search bar
  const searchInput = document.getElementById("searchInput");
  const searchClearBtn = document.getElementById("searchClearBtn");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      if (searchClearBtn) {
        if (searchQuery.length > 0) {
          searchClearBtn.classList.add("visible");
        } else {
          searchClearBtn.classList.remove("visible");
        }
      }
      renderProducts();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      searchQuery = "";
      searchClearBtn.classList.remove("visible");
      renderProducts();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  // Category cards click
  const categoryCards = document.querySelectorAll(".category-card");
  categoryCards.forEach(card => {
    card.addEventListener("click", () => {
      const cat = card.getAttribute("data-category");
      if (cat) {
        setCategoryFilter(cat);
        scrollToShop();
      }
    });
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById("mobileMenuToggle");
  const navLinks = document.getElementById("navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-open");
    });

    // Close when clicking nav link
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("mobile-open");
      });
    });
  }

  // Sticky header scroll effect
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  });

  // Modal backdrop click to close
  const quickviewModal = document.getElementById("quickviewModal");
  if (quickviewModal) {
    quickviewModal.addEventListener("click", (e) => {
      if (e.target === quickviewModal) {
        closeQuickView();
      }
    });
  }

  const cartBackdrop = document.getElementById("cartBackdrop");
  if (cartBackdrop) {
    cartBackdrop.addEventListener("click", (e) => {
      if (e.target === cartBackdrop) {
        closeCart();
      }
    });
  }

  // Escape key closes modal & cart
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeQuickView();
      closeCart();
    }
  });
}

function scrollToShop() {
  const shop = document.getElementById("shopCatalog");
  if (shop) {
    shop.scrollIntoView({ behavior: "smooth" });
  }
}
