import "./styles.css";

const api = {
  async get(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error((await response.json()).error || "API error");
    return response.json();
  },
  async send(path, method, body) {
    const response = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "API error");
    return data;
  },
  async upload(path, field, file) {
    const form = new FormData();
    form.append(field, file);
    const response = await fetch(path, { method: "POST", body: form });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Upload error");
    return data;
  },
};

const state = {
  categories: [],
  products: [],
  banners: [],
  cart: JSON.parse(localStorage.getItem("stolitsya-pack-cart") || "[]"),
  filters: {
    q: "",
    category: "",
    sort: "featured",
    inStock: false,
  },
  admin: {
    products: [],
    categories: [],
    banners: [],
    orders: [],
    imports: [],
  },
  adminAuthenticated: false,
};

const money = (value) => `${Number(value || 0).toFixed(2)} грн`;
const byId = (items, id) => items.find((item) => Number(item.id) === Number(id));
const esc = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
const icon = (name) => {
  const icons = {
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    catalog: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z"/></svg>',
    truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    card: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3zM3 10h18M7 15h4"/></svg>',
    admin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 4v5c0 4-3 7-7 9-4-2-7-5-7-9V7z"/><path d="M9 12l2 2 4-5"/></svg>',
    cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2l2 10h10l2-7H7"/><circle cx="10" cy="19" r="1.8"/><circle cx="17" cy="19" r="1.8"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/></svg>',
    box: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8l8-4 8 4-8 4zM4 8v8l8 4 8-4V8M12 12v8"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l4 4-2 2c2 4 4 6 8 8l2-2 4 4-2 2C10 21 3 14 2 6z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  };
  return `<span class="ui-icon">${icons[name] || icons.box}</span>`;
};

function saveCart() {
  localStorage.setItem("stolitsya-pack-cart", JSON.stringify(state.cart));
}

function setSeo({ title, description, url, image, product }) {
  document.title = title;
  setMeta("description", description);
  setMeta("og:title", title, "property");
  setMeta("og:description", description, "property");
  setMeta("og:url", url || location.href, "property");
  if (image) setMeta("og:image", image, "property");
  const ld = document.querySelector("#dynamic-jsonld") || document.createElement("script");
  ld.id = "dynamic-jsonld";
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify(product || {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Столиця Пак",
    url: location.origin,
    telephone: "+380501308187",
    address: { "@type": "PostalAddress", addressLocality: "Київ", addressCountry: "UA" },
  });
  document.head.appendChild(ld);
}

function setMeta(name, content, attr = "name") {
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function appPath() {
  return location.pathname.replace(/\/+$/, "") || "/";
}

function navigate(path) {
  history.pushState({}, "", path);
  renderRoute();
}

function cartLines() {
  return state.cart.map((item) => {
    const product = byId(state.products, item.product_id);
    return product ? { ...product, quantity: item.quantity } : null;
  }).filter(Boolean);
}

function addToCart(productId, quantity = 1) {
  const product = byId(state.products, productId);
  if (!product || !product.active || product.stock_quantity <= 0) return;
  const current = state.cart.find((item) => Number(item.product_id) === Number(productId));
  if (current) current.quantity += quantity;
  else state.cart.push({ product_id: Number(productId), quantity });
  saveCart();
  renderCart();
  flash("Товар додано до кошика");
}

function updateCart(productId, quantity) {
  state.cart = state.cart.map((item) => Number(item.product_id) === Number(productId) ? { ...item, quantity: Math.max(1, Number(quantity) || 1) } : item);
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => Number(item.product_id) !== Number(productId));
  saveCart();
  renderCart();
}

function filteredProducts() {
  const q = state.filters.q.toLowerCase().trim();
  let items = state.products.filter((product) => {
    const byCategory = !state.filters.category || product.category_slug === state.filters.category;
    const bySearch = !q || `${product.name} ${product.description} ${product.sku} ${product.category_name}`.toLowerCase().includes(q);
    const byStock = !state.filters.inStock || product.stock_quantity > 0;
    return product.active && byCategory && bySearch && byStock;
  });
  if (state.filters.sort === "price-asc") items = [...items].sort((a, b) => a.retail_price - b.retail_price);
  if (state.filters.sort === "price-desc") items = [...items].sort((a, b) => b.retail_price - a.retail_price);
  return items;
}

async function loadPublicData() {
  const data = await api.get("/api/bootstrap");
  state.categories = data.categories;
  state.products = data.products;
  state.banners = data.banners;
}

function layout(content) {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  return `
    <header class="topbar">
      <a class="brand" href="/" data-link><span class="brand-mark"><img src="/uploads/brand/logo.png" alt="Столиця Пак" /></span><strong>Столиця Пак</strong><small>упаковка для бізнесу</small></a>
      <button class="menu-btn" data-menu>${icon("menu")}Меню</button>
      <nav class="desktop-nav" data-nav>
        <a href="/#catalog" data-link>${icon("catalog")}Каталог</a>
        <a href="/#delivery" data-link>${icon("truck")}Доставка</a>
        <a href="/#payment" data-link>${icon("card")}Оплата</a>
        <a href="/admin" data-link>${icon("admin")}Адмін</a>
      </nav>
      <button class="cart-button" data-open-cart>${icon("cart")}Кошик <span data-cart-count>${count}</span></button>
    </header>
    ${content}
    <footer>
      <div>
        <strong>Столиця Пак</strong>
        <span>Пакувальні матеріали оптом і вроздріб</span>
        <p>Київ, вул. Тепловозна 18</p>
        <p>Пн-Сб: 08:00-18:00</p>
      </div>
      <div>
        <a href="tel:+380501308187">+38 (050) 130-81-87</a>
        <a href="tel:+380731308187">+38 (073) 130-81-87</a>
        <a href="mailto:solodovnik.ak@gmail.com">solodovnik.ak@gmail.com</a>
        <a href="/feeds/google.xml" target="_blank">Google Merchant feed</a>
        <a href="/feeds/products.xml" target="_blank">XML feed</a>
      </div>
    </footer>
    <aside class="cart-drawer" data-cart-drawer><div class="cart-panel" data-cart-panel></div></aside>
    <div class="toast" data-toast></div>
  `;
}

function renderAdminLogin(error = "") {
  setSeo({ title: "Вхід в адмін-панель - Столиця Пак", description: "Вхід в адмін-панель магазину." });
  document.querySelector("#app").innerHTML = layout(`
    <main class="admin-login">
      <form class="admin-form login-card" data-admin-login>
        <span class="eyebrow">Адмін-панель</span>
        <h1>Вхід</h1>
        <p>Введіть пароль адміністратора, щоб керувати товарами, категоріями, баннерами та замовленнями.</p>
        ${error ? `<div class="form-error">${esc(error)}</div>` : ""}
        <label>Пароль<input name="password" type="password" required autocomplete="current-password" /></label>
        <button type="submit">Увійти</button>
      </form>
    </main>
  `);
  renderCart();
}

function renderHome() {
  const banner = state.banners[0] || {};
  setSeo({
    title: "Столиця Пак - пакувальні матеріали та поліетиленові пакети в Україні",
    description: "Інтернет-магазин пакувальних матеріалів: пакети майка, фасувальні пакети, пакети з логотипом, одноразовий посуд та господарські товари.",
    url: location.origin + "/",
    image: banner.image_url,
  });
  return layout(`
    <main>
      <section class="hero" style="--hero-image:url('${esc(banner.image_url || "")}')">
        <div class="hero-copy">
          <span class="eyebrow">Столиця Пак</span>
          <h1>${esc(banner.title || "Пакеты от производителя")}</h1>
          <p>${esc(banner.subtitle || "Опт и розница. Доставка по всей Украине.")}</p>
          <div class="hero-badges">
            <span>${icon("box")}Пакеты от производителя</span>
            <span>${icon("catalog")}Опт и розница</span>
            <span>${icon("truck")}Доставка по всей Украине</span>
          </div>
          <div class="hero-actions">
            <a class="primary" href="${esc(banner.link_url || "#catalog")}" data-link>${icon("catalog")}${esc(banner.button_text || "Перейти в каталог")}</a>
            <a class="secondary" href="tel:+380501308187">${icon("phone")}+38 (050) 130-81-87</a>
          </div>
        </div>
        <div class="hero-panel">
          <div>${icon("box")}<strong>${state.products.filter((p) => p.active).length}</strong><span>товарів у каталозі</span></div>
          <div>${icon("catalog")}<strong>${state.categories.length}</strong><span>категорій</span></div>
          <div>${icon("truck")}<strong>1-2 дні</strong><span>обробка замовлення</span></div>
        </div>
      </section>
      ${renderCategorySection()}
      ${renderCatalogSection()}
      ${renderInfoSections()}
    </main>
  `);
}

function renderCategoryPage(slug) {
  state.filters.category = slug;
  const category = state.categories.find((item) => item.slug === slug);
  if (!category) return renderNotFound();
  setSeo({
    title: `${category.name} - купити в Україні | Столиця Пак`,
    description: category.description || `Категорія ${category.name} в інтернет-магазині Столиця Пак.`,
    url: location.href,
    image: category.image_url,
  });
  return layout(`
    <main>
      <section class="page-head">
        <span class="eyebrow">Категорія</span>
        <h1>${esc(category.name)}</h1>
        <p>${esc(category.description || "")}</p>
      </section>
      ${renderCatalogSection()}
    </main>
  `);
}

function renderProductPage(slug) {
  const product = state.products.find((item) => item.slug === slug);
  if (!product) return renderNotFound();
  setSeo({
    title: product.seo_title || `${product.name} - Столиця Пак`,
    description: product.seo_description || product.description,
    url: location.href,
    image: product.image_url,
    product: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      sku: product.sku,
      image: product.image_url,
      description: product.description,
      offers: {
        "@type": "Offer",
        priceCurrency: "UAH",
        price: product.retail_price,
        availability: product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    },
  });
  return layout(`
    <main>
      <section class="product-page">
        <div class="product-media"><img src="${esc(product.image_url)}" alt="${esc(product.name)}" /></div>
        <div class="product-detail">
          <a class="breadcrumb" href="/category/${product.category_slug}" data-link>${esc(product.category_name)}</a>
          <h1>${esc(product.name)}</h1>
          <p>${esc(product.description || "")}</p>
          <div class="price-box">
            <strong>${money(product.retail_price)}</strong>
            <span>Опт: ${money(product.wholesale_price)}</span>
            <span>Залишок: ${product.stock_quantity} шт</span>
          </div>
          <button class="add-btn wide" data-add="${product.id}" ${product.stock_quantity <= 0 ? "disabled" : ""}>Додати до кошика</button>
        </div>
      </section>
    </main>
  `);
}

function renderNotFound() {
  setSeo({ title: "Сторінку не знайдено - Столиця Пак", description: "Сторінку не знайдено." });
  return layout(`<main><section class="page-head"><h1>Сторінку не знайдено</h1><a class="primary" href="/" data-link>На головну</a></section></main>`);
}

function renderCategorySection() {
  return `
    <section class="section categories">
      <div class="section-title">
        <div><span class="eyebrow">Каталог</span><h2>Категорії товарів</h2></div>
      </div>
      <div class="category-grid">
        ${state.categories.map((category) => `
          <a class="category-card" href="/category/${category.slug}" data-link>
            <img src="${esc(category.image_url)}" alt="${esc(category.name)}" loading="lazy" />
            <span>${icon("box")}${esc(category.name)}</span>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function renderCatalogSection() {
  const items = filteredProducts();
  return `
    <section class="section catalog" id="catalog">
      <div class="section-title with-tools">
        <div>
          <span class="eyebrow">Вітрина</span>
          <h2>${state.filters.category ? esc(state.categories.find((c) => c.slug === state.filters.category)?.name || "Товари") : "Всі товари"}</h2>
          <p>${items.length} товарів знайдено</p>
        </div>
        <div class="tools">
          <label class="search"><span>${icon("search")}Пошук</span><input data-filter="q" type="search" placeholder="Назва, SKU, категорія" value="${esc(state.filters.q)}" /></label>
          <select data-filter="category" aria-label="Категорія">
            <option value="">Усі категорії</option>
            ${state.categories.map((category) => `<option value="${category.slug}" ${state.filters.category === category.slug ? "selected" : ""}>${esc(category.name)}</option>`).join("")}
          </select>
          <select data-filter="sort" aria-label="Сортування">
            <option value="featured" ${state.filters.sort === "featured" ? "selected" : ""}>Спочатку популярні</option>
            <option value="price-asc" ${state.filters.sort === "price-asc" ? "selected" : ""}>Ціна зростає</option>
            <option value="price-desc" ${state.filters.sort === "price-desc" ? "selected" : ""}>Ціна спадає</option>
          </select>
          <label class="check"><input type="checkbox" data-filter="inStock" ${state.filters.inStock ? "checked" : ""} /> В наявності</label>
        </div>
      </div>
      <div class="product-grid">
        ${items.length ? items.map(renderProductCard).join("") : `<div class="no-results">Нічого не знайдено.</div>`}
      </div>
    </section>
  `;
}

function renderProductCard(product) {
  return `
    <article class="product-card">
      <a href="/product/${product.slug}" data-link class="quick-view">
        <img src="${esc(product.image_url)}" alt="${esc(product.name)}" loading="lazy" />
      </a>
      <div class="product-info">
        <span class="badge">${icon("check")}${product.stock_quantity > 0 ? "В наявності" : "Немає"}</span>
        <h3><a href="/product/${product.slug}" data-link>${esc(product.name)}</a></h3>
        <p>${esc(product.description || "")}</p>
        <div class="product-bottom">
          <div><strong>${money(product.retail_price)}</strong><span>Опт: ${money(product.wholesale_price)}</span></div>
          <button class="add-btn" data-add="${product.id}" ${product.stock_quantity <= 0 ? "disabled" : ""}>${icon("cart")}До кошика</button>
        </div>
      </div>
    </article>
  `;
}

function renderInfoSections() {
  return `
    <section class="info-grid" id="delivery">
      <article>${icon("truck")}<span class="eyebrow">Доставка</span><h2>Нова Пошта по Україні</h2><p>На етапі MVP клієнт вводить місто та відділення вручну. Інтеграція API Нової Пошти підготовлена як майбутній adapter.</p></article>
      <article id="payment">${icon("card")}<span class="eyebrow">Оплата</span><h2>Підтвердження менеджером</h2><p>Онлайн-оплата поки не підключена. Замовлення зберігається в адмін-панелі, менеджер підтверджує оплату та доставку телефоном.</p></article>
    </section>
  `;
}

function renderCart() {
  const panel = document.querySelector("[data-cart-panel]");
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const countNode = document.querySelector("[data-cart-count]");
  if (countNode) countNode.textContent = String(count);
  if (!panel) return;
  const lines = cartLines();
  const total = lines.reduce((sum, item) => sum + item.retail_price * item.quantity, 0);
  panel.innerHTML = `
    <div class="cart-head"><div><span>Кошик</span><strong>${money(total)}</strong></div><button class="icon-btn" data-close-cart>${icon("close")}</button></div>
    ${lines.length ? `
      <div class="cart-list">
        ${lines.map((item) => `
          <div class="cart-item">
            <img src="${esc(item.image_url)}" alt="${esc(item.name)}" />
            <div>
              <strong>${esc(item.name)}</strong>
              <span>${money(item.retail_price)}</span>
              <div class="qty">
                <button data-qty="${item.id}" data-delta="-1">-</button>
                <input data-qty-input="${item.id}" value="${item.quantity}" inputmode="numeric" />
                <button data-qty="${item.id}" data-delta="1">+</button>
                <button class="remove" data-remove="${item.id}">Видалити</button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
      <form class="checkout" data-checkout>
        <label>Ім'я<input required name="name" placeholder="Ваше ім'я" /></label>
        <label>Телефон<input required name="phone" placeholder="+38..." /></label>
        <label>Місто<input required name="city" placeholder="Київ" /></label>
        <label>Відділення Нової Пошти<input required name="nova_poshta_branch" placeholder="Відділення №..." /></label>
        <label>Коментар<textarea name="comment" placeholder="Побажання до замовлення"></textarea></label>
        <button type="submit">${icon("check")}Оформити замовлення</button>
      </form>
    ` : `<div class="empty">Кошик порожній.</div>`}
  `;
}

async function renderAdmin() {
  setSeo({ title: "Адмін-панель - Столиця Пак", description: "Керування товарами, категоріями, баннерами та замовленнями." });
  const session = await api.get("/api/admin/session");
  state.adminAuthenticated = session.authenticated;
  if (!state.adminAuthenticated) {
    renderAdminLogin();
    return;
  }
  await loadAdminData();
  document.querySelector("#app").innerHTML = layout(`
    <main class="admin">
      <section class="page-head"><span class="eyebrow">MVP admin</span><h1>Адмін-панель</h1><p>Керуйте товарами, категоріями, баннерами та замовленнями.</p><button class="secondary admin-logout" data-admin-logout>Вийти</button></section>
      <nav class="admin-tabs">
        <button data-admin-tab="products">Товари</button>
        <button data-admin-tab="categories">Категорії</button>
        <button data-admin-tab="banners">Баннери</button>
        <button data-admin-tab="orders">Замовлення</button>
        <button data-admin-tab="import">Імпорт</button>
      </nav>
      <section data-admin-content>${renderAdminProducts()}</section>
    </main>
  `);
  renderCart();
}

async function loadAdminData() {
  const [products, categories, banners, orders, imports] = await Promise.all([
    api.get("/api/admin/products"),
    api.get("/api/admin/categories"),
    api.get("/api/admin/banners"),
    api.get("/api/admin/orders"),
    api.get("/api/admin/imports"),
  ]);
  state.admin.products = products.items;
  state.admin.categories = categories.items;
  state.admin.banners = banners.items;
  state.admin.orders = orders.items;
  state.admin.imports = imports.items;
}

function renderAdminProducts(edit = {}) {
  return `
    <div class="admin-grid">
      <form class="admin-form" data-product-form data-id="${edit.id || ""}">
        <h2>${edit.id ? "Редагувати товар" : "Новий товар"}</h2>
        ${input("name", "Назва", edit.name, true)}
        ${input("sku", "SKU", edit.sku)}
        ${input("slug", "Slug", edit.slug)}
        <label>Категорія<select name="category_id" required>${state.admin.categories.map((cat) => `<option value="${cat.id}" ${Number(edit.category_id) === Number(cat.id) ? "selected" : ""}>${esc(cat.name)}</option>`).join("")}</select></label>
        <label>Опис<textarea name="description">${esc(edit.description || "")}</textarea></label>
        ${input("retail_price", "Роздрібна ціна", edit.retail_price || 0, true, "number")}
        ${input("wholesale_price", "Оптова ціна", edit.wholesale_price || 0, false, "number")}
        ${input("stock_quantity", "Залишок", edit.stock_quantity || 0, false, "number")}
        ${imageInput("image_url", edit.image_url)}
        <label class="check"><input name="active" type="checkbox" ${edit.active ?? true ? "checked" : ""} /> Активний</label>
        <label class="check"><input name="featured" type="checkbox" ${edit.featured ? "checked" : ""} /> Популярний</label>
        ${input("seo_title", "SEO title", edit.seo_title)}
        <label>SEO description<textarea name="seo_description">${esc(edit.seo_description || "")}</textarea></label>
        <button type="submit">Зберегти товар</button>
      </form>
      <div class="admin-list">
        ${state.admin.products.map((product) => `
          <div class="admin-row">
            <img src="${esc(product.image_url)}" alt="" />
            <div><strong>${esc(product.name)}</strong><span>${esc(product.sku || "")} · ${money(product.retail_price)} · ${product.stock_quantity} шт</span></div>
            <button data-edit-product="${product.id}">Редагувати</button>
            <button data-delete-product="${product.id}">Видалити</button>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderAdminCategories(edit = {}) {
  return `
    <div class="admin-grid">
      <form class="admin-form" data-category-form data-id="${edit.id || ""}">
        <h2>${edit.id ? "Редагувати категорію" : "Нова категорія"}</h2>
        ${input("name", "Назва", edit.name, true)}
        ${input("slug", "Slug", edit.slug)}
        <label>Опис<textarea name="description">${esc(edit.description || "")}</textarea></label>
        ${imageInput("image_url", edit.image_url)}
        ${input("sort_order", "Сортування", edit.sort_order || 0, false, "number")}
        <label class="check"><input name="active" type="checkbox" ${edit.active ?? true ? "checked" : ""} /> Активна</label>
        <button type="submit">Зберегти категорію</button>
      </form>
      <div class="admin-list">${state.admin.categories.map((category) => `
        <div class="admin-row"><img src="${esc(category.image_url)}" alt="" /><div><strong>${esc(category.name)}</strong><span>${esc(category.slug)}</span></div><button data-edit-category="${category.id}">Редагувати</button><button data-delete-category="${category.id}">Видалити</button></div>
      `).join("")}</div>
    </div>
  `;
}

function renderAdminBanners(edit = {}) {
  return `
    <div class="admin-grid">
      <form class="admin-form" data-banner-form data-id="${edit.id || ""}">
        <h2>${edit.id ? "Редагувати баннер" : "Новий баннер"}</h2>
        ${input("title", "Заголовок", edit.title, true)}
        <label>Підзаголовок<textarea name="subtitle">${esc(edit.subtitle || "")}</textarea></label>
        ${imageInput("image_url", edit.image_url)}
        ${input("link_url", "Посилання", edit.link_url || "#catalog")}
        ${input("button_text", "Текст кнопки", edit.button_text || "До каталогу")}
        ${input("sort_order", "Сортування", edit.sort_order || 0, false, "number")}
        <label class="check"><input name="active" type="checkbox" ${edit.active ?? true ? "checked" : ""} /> Активний</label>
        <button type="submit">Зберегти баннер</button>
      </form>
      <div class="admin-list">${state.admin.banners.map((banner) => `
        <div class="admin-row"><img src="${esc(banner.image_url)}" alt="" /><div><strong>${esc(banner.title)}</strong><span>${esc(banner.subtitle || "")}</span></div><button data-edit-banner="${banner.id}">Редагувати</button><button data-delete-banner="${banner.id}">Видалити</button></div>
      `).join("")}</div>
    </div>
  `;
}

function renderAdminOrders() {
  return `
    <div class="admin-list orders">
      ${state.admin.orders.length ? state.admin.orders.map((order) => `
        <div class="order-card">
          <div class="order-head">
            <strong>Замовлення #${order.id} · ${money(order.total)}</strong>
            <select data-order-status="${order.id}">
              ${["new", "processing", "packed", "sent", "done", "cancelled"].map((status) => `<option value="${status}" ${order.status === status ? "selected" : ""}>${status}</option>`).join("")}
            </select>
          </div>
          <p>${esc(order.customer_name)} · ${esc(order.phone)} · ${esc(order.city)} · ${esc(order.nova_poshta_branch)}</p>
          <ul>${order.items.map((item) => `<li>${esc(item.name)} x ${item.quantity} = ${money(item.total)}</li>`).join("")}</ul>
          ${order.comment ? `<p>Коментар: ${esc(order.comment)}</p>` : ""}
        </div>
      `).join("") : `<div class="empty">Замовлень ще немає.</div>`}
    </div>
  `;
}

function renderAdminImport() {
  return `
    <form class="admin-form import-form" data-import-form>
      <h2>Імпорт товарів CSV/XLSX</h2>
      <p>Поля: category_slug, category_name, sku, slug, name, description, retail_price, wholesale_price, stock_quantity, image_url, active, featured, seo_title, seo_description.</p>
      <input type="file" name="file" accept=".csv,.xlsx" required />
      <button type="submit">Імпортувати</button>
    </form>
    <div class="admin-list">${state.admin.imports.map((item) => `<div class="admin-row"><div><strong>${esc(item.filename)}</strong><span>${item.status}: ${item.rows_success}/${item.rows_total}, помилок ${item.rows_failed}</span></div></div>`).join("")}</div>
  `;
}

function input(name, label, value = "", required = false, type = "text") {
  return `<label>${label}<input name="${name}" type="${type}" value="${esc(value ?? "")}" ${required ? "required" : ""} /></label>`;
}

function imageInput(name, value = "") {
  return `<label>Зображення<input name="${name}" value="${esc(value || "")}" placeholder="/uploads/image.webp або https://..." /></label><label>Завантажити файл<input type="file" data-upload-target="${name}" accept="image/*" /></label>`;
}

function formData(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  form.querySelectorAll('input[type="checkbox"]').forEach((input) => data[input.name] = input.checked);
  return data;
}

async function refreshAdmin(tab = "products") {
  await loadPublicData();
  await loadAdminData();
  const content = document.querySelector("[data-admin-content]");
  if (!content) return;
  content.innerHTML = tab === "categories" ? renderAdminCategories() : tab === "banners" ? renderAdminBanners() : tab === "orders" ? renderAdminOrders() : tab === "import" ? renderAdminImport() : renderAdminProducts();
}

function flash(message) {
  const node = document.querySelector("[data-toast]");
  if (!node) return;
  node.textContent = message;
  node.classList.add("show");
  setTimeout(() => node.classList.remove("show"), 1800);
}

async function submitOrder(form) {
  const data = formData(form);
  const payload = {
    ...data,
    items: state.cart.map((item) => ({ product_id: item.product_id, quantity: item.quantity })),
  };
  const order = await api.send("/api/orders", "POST", payload);
  state.cart = [];
  saveCart();
  document.querySelector("[data-cart-drawer]").classList.remove("open");
  await loadPublicData();
  renderRoute();
  flash(`Замовлення #${order.id} збережено`);
}

async function renderRoute() {
  if (!state.products.length) await loadPublicData();
  const path = appPath();
  state.filters.category = "";
  if (path === "/admin") return renderAdmin();
  if (path.startsWith("/category/")) {
    document.querySelector("#app").innerHTML = renderCategoryPage(path.split("/").pop());
  } else if (path.startsWith("/product/")) {
    document.querySelector("#app").innerHTML = renderProductPage(path.split("/").pop());
  } else {
    document.querySelector("#app").innerHTML = renderHome();
  }
  renderCart();
}

document.addEventListener("click", async (event) => {
  const link = event.target.closest("[data-link]");
  const add = event.target.closest("[data-add]");
  const openCart = event.target.closest("[data-open-cart]");
  const closeCart = event.target.closest("[data-close-cart]");
  const qty = event.target.closest("[data-qty]");
  const remove = event.target.closest("[data-remove]");
  const adminTab = event.target.closest("[data-admin-tab]");
  const menu = event.target.closest("[data-menu]");
  const logout = event.target.closest("[data-admin-logout]");

  if (link && link.getAttribute("href")?.startsWith("/")) {
    event.preventDefault();
    navigate(link.getAttribute("href"));
  }
  if (add) addToCart(Number(add.dataset.add));
  if (openCart) document.querySelector("[data-cart-drawer]").classList.add("open");
  if (closeCart) document.querySelector("[data-cart-drawer]").classList.remove("open");
  if (menu) document.querySelector("[data-nav]")?.classList.toggle("open");
  if (logout) {
    await api.send("/api/admin/logout", "POST", {});
    state.adminAuthenticated = false;
    renderAdminLogin();
  }
  if (qty) {
    const current = state.cart.find((item) => Number(item.product_id) === Number(qty.dataset.qty))?.quantity || 1;
    updateCart(Number(qty.dataset.qty), current + Number(qty.dataset.delta));
  }
  if (remove) removeFromCart(Number(remove.dataset.remove));
  if (adminTab) {
    const tab = adminTab.dataset.adminTab;
    document.querySelector("[data-admin-content]").innerHTML = tab === "categories" ? renderAdminCategories() : tab === "banners" ? renderAdminBanners() : tab === "orders" ? renderAdminOrders() : tab === "import" ? renderAdminImport() : renderAdminProducts();
  }

  const editProduct = event.target.closest("[data-edit-product]");
  const editCategory = event.target.closest("[data-edit-category]");
  const editBanner = event.target.closest("[data-edit-banner]");
  const deleteProduct = event.target.closest("[data-delete-product]");
  const deleteCategory = event.target.closest("[data-delete-category]");
  const deleteBanner = event.target.closest("[data-delete-banner]");
  if (editProduct) document.querySelector("[data-admin-content]").innerHTML = renderAdminProducts(byId(state.admin.products, editProduct.dataset.editProduct));
  if (editCategory) document.querySelector("[data-admin-content]").innerHTML = renderAdminCategories(byId(state.admin.categories, editCategory.dataset.editCategory));
  if (editBanner) document.querySelector("[data-admin-content]").innerHTML = renderAdminBanners(byId(state.admin.banners, editBanner.dataset.editBanner));
  if (deleteProduct && confirm("Видалити товар?")) { await api.send(`/api/admin/products/${deleteProduct.dataset.deleteProduct}`, "DELETE", {}); await refreshAdmin("products"); }
  if (deleteCategory && confirm("Видалити категорію?")) { await api.send(`/api/admin/categories/${deleteCategory.dataset.deleteCategory}`, "DELETE", {}); await refreshAdmin("categories"); }
  if (deleteBanner && confirm("Видалити баннер?")) { await api.send(`/api/admin/banners/${deleteBanner.dataset.deleteBanner}`, "DELETE", {}); await refreshAdmin("banners"); }
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-filter]")) {
    const key = event.target.dataset.filter;
    state.filters[key] = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    const section = document.querySelector(".catalog");
    if (section) section.outerHTML = renderCatalogSection();
  }
  if (event.target.matches("[data-qty-input]")) updateCart(Number(event.target.dataset.qtyInput), event.target.value);
});

document.addEventListener("change", async (event) => {
  if (event.target.matches("[data-upload-target]") && event.target.files[0]) {
    const data = await api.upload("/api/admin/upload", "image", event.target.files[0]);
    event.target.closest("form").querySelector(`[name="${event.target.dataset.uploadTarget}"]`).value = data.url;
  }
  if (event.target.matches("[data-order-status]")) {
    await api.send(`/api/admin/orders/${event.target.dataset.orderStatus}`, "PUT", { status: event.target.value });
    await refreshAdmin("orders");
  }
});

document.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    if (event.target.matches("[data-admin-login]")) {
      const data = formData(event.target);
      await api.send("/api/admin/login", "POST", { password: data.password });
      state.adminAuthenticated = true;
      await renderAdmin();
      return;
    }
    if (event.target.matches("[data-checkout]")) await submitOrder(event.target);
    if (event.target.matches("[data-product-form]")) {
      const id = event.target.dataset.id;
      await api.send(id ? `/api/admin/products/${id}` : "/api/admin/products", "PUT", formData(event.target));
      await refreshAdmin("products");
    }
    if (event.target.matches("[data-category-form]")) {
      const id = event.target.dataset.id;
      await api.send(id ? `/api/admin/categories/${id}` : "/api/admin/categories", "PUT", formData(event.target));
      await refreshAdmin("categories");
    }
    if (event.target.matches("[data-banner-form]")) {
      const id = event.target.dataset.id;
      await api.send(id ? `/api/admin/banners/${id}` : "/api/admin/banners", "PUT", formData(event.target));
      await refreshAdmin("banners");
    }
    if (event.target.matches("[data-import-form]")) {
      const file = event.target.file.files[0];
      const result = await api.upload("/api/admin/import", "file", file);
      flash(`Імпортовано ${result.rows_success} рядків`);
      await refreshAdmin("import");
    }
  } catch (error) {
    flash(error.message);
  }
});

window.addEventListener("popstate", renderRoute);

renderRoute().catch((error) => {
  document.querySelector("#app").innerHTML = `<main class="page-head"><h1>Помилка запуску</h1><p>${esc(error.message)}</p></main>`;
});
