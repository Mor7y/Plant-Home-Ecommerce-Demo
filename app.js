// Selectors for:

// Navbar

const navMenu = document.querySelector(".nav-menu");
const closeMenu = document.querySelector(".nav-close");
const navMenuBars = document.querySelector(".nav-menu-bars");
const navLinks = document.querySelectorAll(".nav-link");
const openCart = document.querySelector(".nav-shopcart");
const themeIcon = document.querySelector(".theme");
const cartItemCount = document.querySelector(".shop-count");

// Products section

const productOverlay = document.querySelector(".product-overlay");
const addProductBtn = document.querySelector(".add-product");
const productForm = document.querySelector(".product-form");
const productWraper = document.querySelector(".prodcut-wraper");

// Shoping Cart

const shopCart = document.querySelector(".shop-cart");
const cartProducts = document.querySelector(".cart-products");
const shopTotalPrice = document.querySelector(".shop-total span");
const placeOrderBtn = document.querySelector(".check-out");
const closeShoptBtn = document.querySelector(".cart-header button");
const cartEmpty = document.querySelector(".cart-empty");

// Notification & Contact

const notification = document.querySelector(".notification-container");
const contactForm = document.querySelector(".contact-form");
const formFields = document.querySelectorAll(".contact-input");
const subscribeForm = document.querySelector(".footer-subscribe");
const subscribeInput = document.querySelector(".footer-subscribe input");
const notificaitonClose = document.querySelector(".notification-close");

class Product {
  constructor(imgSrc, name, price, id) {
    this.imgSrc = imgSrc;
    this.price = price;
    this.name = name;
    this.id = id;
  }

  setNewProduct() {
    const product = document.createElement("article");
    product.classList.add("product-card");
    product.dataset.id = this.id;

    product.innerHTML = `
  <div class="product-circle"></div>
  <img src="${this.imgSrc}" alt="no-img" />
  <h3 class="product-title">${this.name}</h3>
  <p class="product-price"><span>$</span>${this.price}</p>
  <button class="product-btn">
    <i class="fa-solid fa-bag-shopping"></i>
  </button>
  <i class="fa-solid fa-xmark remove-product"></i>`;

    return product;
  }

  addToCart() {
    const boughItem = document.createElement("div");
    boughItem.classList.add("cart-product");
    boughItem.dataset.id = this.id;

    boughItem.innerHTML = `
       <img src="${this.imgSrc}" alt="plant-image" class="cart-img" />
        <div class="cart-details">
          <h4 class="cart-name">${this.name}</h4>
          <p class="cart-price">€${this.price}</p>
        </div>
        <i class="fa-solid fa-x"></i>
        <input type="number" value="1" min="1" max="20" class="cart-count" />
        <p class="cart-total">€${this.price}</p>
        <i class="fa-solid fa-trash remove-item"></i>`;

    return boughItem;
  }
}

// Small events for:

// Nav

navMenuBars.addEventListener("click", toggleNavMenu);
closeMenu.addEventListener("click", toggleNavMenu);
navLinks.forEach((link) => link.addEventListener("click", toggleNavMenu));
openCart.onclick = () => {
  shopCart.classList.add("show-cart");
  showEmptyCart();
};

closeShoptBtn.onclick = () => shopCart.classList.remove("show-cart");

// Shop Cart

placeOrderBtn.onclick = () => {
  localStorage.removeItem("items");

  if (cartProducts.children.length == 0) {
    showNotification("Your cart is empty!");
  } else {
    showNotification("Order placed succesfully!");
  }

  cartProducts.innerHTML = "";
  updateTotal();
  countCartItems();
  showEmptyCart();
};

// Contact

contactForm.onsubmit = (e) => {
  e.preventDefault();
  let validForm = true;
  formFields.forEach((item) => {
    if (item.value === "") {
      validForm = false;
    }
  });

  if (validForm) {
    formFields.forEach((input) => (input.value = ""));
    showNotification("Your Message has been sent successfully!");
  } else {
    showNotification("Please fill in all the fields");
  }
};

subscribeForm.onsubmit = (e) => {
  e.preventDefault();
  subscribeInput.value = "";
  showNotification("You have been successfully subscribed to our Newsletter!");
};

// Notification

let timeoutId;

notification.onmouseover = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
};

notification.onmouseleave = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    notification.classList.remove("show");
  }, 1000);
};

notificaitonClose.onclick = () => {
  notification.classList.remove("show");
};

// Window events

window.onclick = (e) => {
  const offsetBottom = shopCart.offsetHeight - shopCart.offsetTop;
  if (e.x < shopCart.offsetLeft && e.y < offsetBottom)
    shopCart.classList.remove("show-cart");
};

window.onscroll = () => {
  const header = document.querySelector(".header");
  const sections = document.querySelectorAll("section[id]");
  const scrollUp = document.querySelector(".scroll-up");
  const scrollDistance = window.scrollY;

  scrollDistance > 80
    ? header.classList.add("scroll-header")
    : header.classList.remove("scroll-header");

  scrollDistance > 120
    ? scrollUp.classList.add("show-scrollup")
    : scrollUp.classList.remove("show-scrollup");

  sections.forEach((section) => {
    const sectionHeight = section.clientHeight;
    const sectionTop = section.offsetTop - 100;
    const id = section.getAttribute("id");
    if (
      scrollDistance > sectionTop &&
      scrollDistance < sectionHeight + sectionTop
    ) {
      document
        .querySelector(`.nav-menu a[href="#${id}"]`)
        .classList.add("active-link");
    } else {
      document
        .querySelector(`.nav-menu a[href="#${id}"]`)
        .classList.remove("active-link");
    }
  });
};

window.onload = () => {
  loadStorage("products");
  loadStorage("items");
  addBuyProduct();
  addRemoveBtn();
  addRemoveItem();
  countCartItems();
  updateTotal();
  addItemInput();
  activateProductsObserver();
};

// Nav functionalities

function toggleNavMenu() {
  const targetClass = this.className;
  if (targetClass === "nav-menu-bars") {
    navMenu.classList.add("show-menu");
  } else if (targetClass === "nav-close" || targetClass === "nav-link") {
    navMenu.classList.remove("show-menu");
  }
}

themeIcon.addEventListener("click", function (e) {
  const icon = e.target;

  if (icon.classList.contains("fa-moon")) {
    icon.classList.replace("fa-moon", "fa-sun");
    document.body.classList.add("dark-mode");
    localStorage.removeItem("dark-mode");
    updatedStorage("dark-mode", "on");
  } else {
    icon.classList.replace("fa-sun", "fa-moon");
    document.body.classList.remove("dark-mode");
    localStorage.removeItem("dark-mode");
    updatedStorage("dark-mode", "off");
  }
});

// Products Functionalities

addProductBtn.onclick = () => {
  productOverlay.classList.add("show");
};

productOverlay.onclick = (e) => {
  if (productOverlay === e.target) {
    productOverlay.classList.remove("show");
  }
};

productForm.onsubmit = (e) => {
  e.preventDefault();

  const imgValue = document.querySelector(".new-prod-img").value;
  const nameValue = document.querySelector(".new-prod-name").value;
  const priceValue = document.querySelector(".new-prod-price").value;
  const articleId = Math.random().toString(36).substring(2, 13);

  if (imgValue === "" || nameValue === "" || priceValue === "") return;
  productOverlay.classList.remove("show");

  const newProduct = new Product(
    imgValue,
    nameValue,
    (+priceValue).toFixed(2),
    articleId
  );
  productWraper.insertBefore(newProduct.setNewProduct(), addProductBtn);
  document.querySelector(".new-prod-name").value = "";
  document.querySelector(".new-prod-price").value = "";

  updatedStorage("products", newProduct);
  addBuyProduct();
  addRemoveBtn();
  activateProductsObserver();
};

function buyProduct() {
  const buyId = this.parentNode.dataset.id;
  const shopCartItem = document.querySelector(`div[data-id="${buyId}"`);
  const productImgSrc = document
    .querySelector(`article[data-id="${buyId}"] img`)
    .getAttribute("src");
  const productName = document.querySelector(
    `article[data-id="${buyId}"] .product-title`
  ).textContent;

  const productPrice = document.querySelector(
    `article[data-id="${buyId}"] .product-price`
  );

  showNotification(`${productName} has been added to the cart`);

  if (shopCartItem) {
    if (buyId === shopCartItem.dataset.id) {
      const itemCountInput = shopCartItem.querySelector(".cart-count");
      itemCountInput.value = +itemCountInput.value + 1;
      updateItemCount(itemCountInput);
      updateTotal();
      return;
    }
  }

  const priceText = productPrice.childNodes[1].textContent;
  const cartItem = new Product(productImgSrc, productName, priceText, buyId);
  cartProducts.appendChild(cartItem.addToCart());

  // try here

  // end here

  updatedStorage("items", cartItem);
  updateTotal();
  countCartItems();
  addRemoveItem();
  addItemInput();
}

// Shoping Cart functions

function countCartItems() {
  const numberOfItems = cartProducts.children.length;
  if (0 < numberOfItems) {
    cartItemCount.classList.add("show-count");
    cartItemCount.innerText = numberOfItems;
  } else {
    cartItemCount.classList.remove("show-count");
    cartItemCount.innerText = 0;
  }
}

function updateItemCount(target) {
  const value = +target.value;
  const parentId = target.parentNode.dataset.id;
  const itemPrice = document.querySelector(
    `div[data-id="${parentId}"] .cart-price`
  );
  const totalItemPrice = document.querySelector(
    `div[data-id="${parentId}"] .cart-total`
  );
  const priceValue = +itemPrice.innerText.replace("€", "");

  totalItemPrice.innerText = `€${value * priceValue}`;
}

function updateTotal() {
  const itemPrice = document.querySelectorAll(".cart-total");
  const price = Array.from(itemPrice).reduce((acc, item) => {
    const price = item.innerText.replace("€", "");
    return acc + +price;
  }, 0);
  shopTotalPrice.innerText = `€${price.toFixed(2)}`;
}

function showEmptyCart() {
  if (cartProducts.children.length == 0) {
    cartEmpty.classList.add("show");
  } else {
    cartEmpty.classList.remove("show");
  }
}

// Notification Function

function showNotification(text) {
  notification.classList.add("no-transition");
  notification.classList.remove("show");
  setTimeout(() => {
    notification.classList.add("show");
    notification.classList.remove("no-transition");
  }, 100);
  notification.children[0].innerHTML = text;

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// LocalStorage functions

function updatedStorage(key, item) {
  const items = JSON.parse(localStorage.getItem(key)) || [];
  items.push(item);
  localStorage.setItem(key, JSON.stringify(items));
}

function loadStorage(Key) {
  const keyItems = JSON.parse(localStorage.getItem(Key)) || [];

  keyItems.forEach((product) => {
    const items = new Product(
      product.imgSrc,
      product.name,
      product.price,
      product.id
    );
    if (Key === "products") {
      productWraper.insertBefore(items.setNewProduct(), addProductBtn);
    }
    if (Key === "items") {
      cartProducts.appendChild(items.addToCart());
    }
  });

  const darkModeToggle = JSON.parse(localStorage.getItem("dark-mode")) || [];

  if (darkModeToggle[0] === "on") {
    document.body.classList.add("dark-mode");
    themeIcon.classList.replace("fa-moon", "fa-sun");
  }
}

// Activate apended DOM elements

function addBuyProduct() {
  // for articles added with Add Product +
  const prodcutBuyBtn = document.querySelectorAll(".product-btn");

  prodcutBuyBtn.forEach((btn) => {
    btn.addEventListener("click", buyProduct);
  });
}

function addRemoveBtn() {
  const removeBtns = document.querySelectorAll(".remove-product");
  removeBtns.forEach((btn) => {
    btn.onclick = (e) => {
      removeParent(e, "products");
    };
  });
}

function addRemoveItem() {
  const trashBtn = document.querySelectorAll(".remove-item");

  trashBtn.forEach((btn) => {
    btn.onclick = (e) => {
      removeParent(e, "items");
      updateTotal();
      countCartItems();
      showEmptyCart();
    };
  });
}

function addItemInput() {
  const countInput = document.querySelectorAll(".cart-count");
  countInput.forEach((counter) => {
    counter.onchange = (e) => {
      updateItemCount(e.target);
      updateTotal();
    };
  });
}

function removeParent(current, storageName) {
  const itemToRemove = current.target.parentNode;
  const btnId = itemToRemove.dataset.id;
  itemToRemove.remove();

  const localStorageProducts = JSON.parse(localStorage.getItem(storageName));
  const updatedProducts = localStorageProducts.filter(
    (item) => btnId !== item.id
  );
  localStorage.setItem(storageName, JSON.stringify(updatedProducts));
}

// Scroll Reveal

const observer = new IntersectionObserver(scrollReveal);

function scrollReveal(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.remove("no-transition");
        entry.target.classList.add("show-intersection");
      }, 100);
    } else {
      entry.target.classList.add("no-transition");
      entry.target.classList.remove("show-intersection");
    }
  });
}

function applyObserverStyle(elementClass, orientation, distance, delay) {
  const element = document.querySelector(`${elementClass}`);
  element.style.opacity = "0";
  element.style.transition = "none";
  if (orientation === "horizontal") {
    element.style.transform = `translateX(${distance}`;
  } else if (orientation === "vertical") {
    element.style.transform = `translateY(${distance}`;
  }
  setTimeout(() => {
    element.style.transition = `all ${delay}s ease-out`;
  }, 100);

  return element;
}

observer.observe(
  applyObserverStyle(".home-container", "vertical", "-20px", 0.6)
);
observer.observe(applyObserverStyle(".about-img", "horizontal", "-100%", 0.6));
observer.observe(
  applyObserverStyle(".about-wraper", "horizontal", "100%", 0.6)
);
observer.observe(
  applyObserverStyle(".steps-container", "vertical", "-20px", 0.6)
);

let delay = 0.5;

function activateProductsObserver() {
  const products = productWraper.querySelectorAll("article");
  products.forEach((prodcut) => {
    const prodId = prodcut.dataset.id;
    delay += 0.1;
    observer.observe(
      applyObserverStyle(
        `article[data-id="${prodId}"]`,
        "vertical",
        "-20%",
        delay
      )
    );
  });
}
observer.observe(applyObserverStyle(".add-product", "vertical", "-20px", 1.4));
observer.observe(
  applyObserverStyle(".contact-box", "horizontal", "-100%", 0.6)
);
observer.observe(
  applyObserverStyle(".contact-form", "horizontal", "100%", 0.6)
);
observer.observe(
  applyObserverStyle(".footer-content.left", "horizontal", "-100%", 0.6)
);
observer.observe(
  applyObserverStyle(".footer-content.right", "horizontal", "100%", 0.6)
);
