const products = [
  {
    id: 1,
    name: "Nebula Noise-Canceling Headphones",
    category: "Audio",
    price: 229,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Aurora Smart Lamp",
    category: "Home",
    price: 139,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Vortex Fitness Watch",
    category: "Wearables",
    price: 189,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Pulse Mechanical Keyboard",
    category: "Tech",
    price: 159,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Zen Ceramic Aroma Diffuser",
    category: "Home",
    price: 79,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1616628182509-6f4eec20f0fd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Atlas Urban Backpack",
    category: "Fashion",
    price: 119,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1622560482379-c981a15df8a6?auto=format&fit=crop&w=900&q=80",
  },
];

const state = {
  search: "",
  category: "all",
  sort: "featured",
  cart: [],
};

const productGrid = document.getElementById("productGrid");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");
const sortBy = document.getElementById("sortBy");
const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");
const shopNow = document.getElementById("shopNow");
const newsletterForm = document.getElementById("newsletterForm");
const newsletterMessage = document.getElementById("newsletterMessage");

function initCategories() {
  const categories = [...new Set(products.map((p) => p.category))];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });
}

function filteredProducts() {
  let list = [...products].filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(state.search.toLowerCase());
    const matchCategory = state.category === "all" || product.category === state.category;
    return matchSearch && matchCategory;
  });

  if (state.sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (state.sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (state.sort === "rating-desc") {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}

function renderProducts() {
  const list = filteredProducts();
  productGrid.innerHTML = list
    .map(
      (product) => `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <div class="product-content">
          <h3>${product.name}</h3>
          <p class="meta">${product.category} • ⭐ ${product.rating}</p>
          <div class="price-row">
            <span class="price">$${product.price.toFixed(2)}</span>
            <button class="add-btn" data-id="${product.id}">Add</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  state.cart.push(product);
  updateCart();
  showToast(`${product.name} added to cart`);
}

function removeFromCart(index) {
  state.cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  cartCount.textContent = state.cart.length;
  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;

  if (!state.cart.length) {
    cartItems.innerHTML = `<p class="meta">Your cart is empty.</p>`;
    return;
  }

  cartItems.innerHTML = state.cart
    .map(
      (item, index) => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <div class="meta">$${item.price.toFixed(2)}</div>
        </div>
        <button data-remove="${index}">Remove</button>
      </div>
    `
    )
    .join("");
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 1800);
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-btn");
  if (!button) return;
  addToCart(Number(button.dataset.id));
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-remove]");
  if (!button) return;
  removeFromCart(Number(button.dataset.remove));
});

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value.trim();
  renderProducts();
});

categoryFilter.addEventListener("change", (event) => {
  state.category = event.target.value;
  renderProducts();
});

sortBy.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

cartButton.addEventListener("click", () => {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
});

closeCart.addEventListener("click", () => {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
});

shopNow.addEventListener("click", () => {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  searchInput.focus();
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("newsletterEmail").value;
  newsletterMessage.textContent = `Thanks! ${email} is now subscribed for VIP drops.`;
  newsletterMessage.classList.remove("hidden");
  newsletterForm.reset();
});

document.getElementById("checkout").addEventListener("click", () => {
  if (!state.cart.length) {
    showToast("Your cart is empty.");
    return;
  }

  showToast("Checkout successful! Order placed.");
  state.cart = [];
  updateCart();
  cartDrawer.classList.remove("open");
});

initCategories();
renderProducts();
updateCart();
