// This was a huge task, took me a while, as I've never worked with HTML/JS storage before now.
// Despite this I tried to keep it as 'simple' as I could to not spend weeks on this task.
// I wish the videos for tasks was more in-depth, it seems very sparse compared to the tasks we get.

// ============== PRODUCTS ==============
const products = [
  {
    id: 1,
    name: 'Mouse',
    price: 250,
    image:
      'https://www.easygetproduct.com/wp-content/uploads/2019/03/9.-VicTsing-MM057-2.4G-Wireless-Portable-Mobile-Mouse-Optical-Mice-with-USB-Receiver-5-Adjustable-DPI-Levels-6-Buttons-for-Notebook-PC-Laptop-Computer-Black-1.jpg',
  },
  {
    id: 2,
    name: 'Keyboard',
    price: 450,
    image:
      'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6539/6539505_sd.jpg',
  },
  {
    id: 3,
    name: 'Headphones',
    price: 600,
    image:
      'https://i5.walmartimages.com/seo/VILINICE-Noise-Cancelling-Headphones-Wireless-Bluetooth-Over-Ear-Headphones-with-Microphone-Black-Q8_0cd6ae5a-8ea9-4e46-8b5e-fffb7da5e6f5.d4808578fda9397ec198b2d5dec46404.jpeg?odnHeight=424&odnWidth=424&odnBg=FFFFFF',
  },
];

let cart = JSON.parse(localStorage.getItem('cart')) || []; // Stores cart in local storage

// ============== DOM ELEMENTS ==============
// Grabs the HTML elements to interact with
const productsDiv = document.getElementById('products');
const cartList = document.getElementById('cart');
const totalSpan = document.getElementById('total');
const clearBtn = document.getElementById('clearBtn');
const fontSelect = document.getElementById('fontSelect');
const cacheStatus = document.getElementById('cacheStatus');

const greeting = document.getElementById('greeting');
const usernameInput = document.getElementById('usernameInput');
const shippingSelect = document.getElementById('shipping');
const saveNameBtn = document.getElementById('saveNameBtn');
const resetBtn = document.getElementById('resetBtn');

// ============== CACHE ==============
// Allows caches static assets
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.js')
    .then(() => {
      cacheStatus.textContent = 'Using cached resources for faster loading.';
    })
    .catch(() => {
      cacheStatus.textContent = 'Cache not available.';
    });
}

// ============== COOKIES ==============
// Stores small persistent user data
function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
}

// Read cookie value by name
function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let c of cookies) {
    const [key, value] = c.split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

// Effectively deletes a cookie
function deleteCookie(name) {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

// Clears cart, cookies, UI preferences
function resetAll() {
  // clear cart
  cart = [];
  localStorage.removeItem('cart');
  renderCart();

  //clear cookies
  deleteCookie('username');
  deleteCookie('shipping');

  //reset greeting
  greeting.textContent = '';

  //reset shipping
  shippingSelect.value = 'standard';

  // clear font preferences
  sessionStorage.removeItem('font');
  document.body.style.fontFamily = 'Arial';
  fontSelect.value = 'Arial';
}

resetBtn.addEventListener('click', resetAll);

// ============== USERNAME COOKIE ==============
// Loads the saves username on page load
function loadUsername() {
  const name = getCookie('username');
  if (name) {
    greeting.textContent = `welcome back, ${name}`;
  }
}

// Allows saving the username to cookie
saveNameBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if (!name) return;

  setCookie('username', name);
  greeting.textContent = `welcome, ${name}`;
});

// ============== SHIPPING COOKIE ==============
// Saves shipping method
function saveShipping(method) {
  setCookie('shipping', method);
}

// Loads saved shipping method
function loadShipping() {
  const method = getCookie('shipping');
  if (method) {
    shippingSelect.value = method;
  }
}

// Checks for user changing shipping option
shippingSelect.addEventListener('change', e => {
  saveShipping(e.target.value);
});

// ============== FONT (SESSION STORAGE) ==============
// Apply font to page
function applyFont(font) {
  document.body.style.fontFamily = font;
}

// Saves font for this session
function saveFont(font) {
  sessionStorage.setItem('font', font);
}

// Loads saved font on page load
function loadFont() {
  const savedFont = sessionStorage.getItem('font');
  if (savedFont) {
    applyFont(savedFont);
    fontSelect.value = savedFont;
  }
}

// Checks for user changing font
fontSelect.addEventListener('change', e => {
  const font = e.target.value;
  applyFont(font);
  saveFont(font);
});

// ============== CART (LOCAL STORAGE) ==============
// Saves cart to local storage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Renders the product list
function renderProducts() {
  productsDiv.innerHTML = '';
  products.forEach(product => {
    const div = document.createElement('div');
    div.innerHTML = `
        <img src="${product.image}" width="100"><br>
        <p>${product.name} - R${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
    productsDiv.appendChild(div);
  });
}

// Renders the cart items and total price
function renderCart() {
  cartList.innerHTML = '';

  if (cart.length === 0) {
    cartList.innerHTML = '<li>Your cart is empty.</li>';
    totalSpan.textContent = 0;
    return;
  }

  let total = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} x${item.quantity} - R${item.price * item.quantity}`;
    cartList.appendChild(li);
    total += item.price * item.quantity;
  });

  totalSpan.textContent = total;
}

// Add item to cart
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
}

// clears items cart
function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

// ============== INIT ==============
// Sets up the initial page state
clearBtn.addEventListener('click', clearCart);

renderProducts();
renderCart();
loadFont();
loadUsername();
loadShipping();
