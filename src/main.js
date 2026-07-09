import "./styles.css";

const api = {
  async get(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error((await response.json()).error || "Помилка API");
    return response.json();
  },
  async send(path, method, body) {
    const response = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Помилка API");
    return data;
  },
  async upload(path, field, file) {
    const form = new FormData();
    form.append(field, file);
    const response = await fetch(path, { method: "POST", body: form });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Помилка завантаження");
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

const HOME_PRODUCT_LIMIT = 12;
const HOME_ROW_LIMIT = 8;
const money = (value) => `${Number(value || 0).toFixed(2)} грн`;
const byId = (items, id) => items.find((item) => Number(item.id) === Number(id));
const esc = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
const canonicalUrl = (path = location.pathname) => `${location.origin}${path}`;
const shortText = (value = "", max = 80) => {
  const text = String(value).replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
};
const productAttribute = (description = "", labels = []) => {
  const lines = String(description).split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const found = lines.find((line) => labels.some((label) => line.toLocaleLowerCase("uk-UA").startsWith(`${label.toLocaleLowerCase("uk-UA")}:`)));
  return found ? found.replace(/^[^:]+:\s*/, "").trim() : "";
};
const productCardBadges = (product) => {
  const badges = [];
  if (product.featured) badges.push({ text: "🔥 Хіт продажу", type: "hot" });
  if (Number(product.wholesale_price || 0) > 0 && Number(product.wholesale_price) < Number(product.retail_price || 0)) badges.push({ text: "💰 Опт", type: "opt" });
  if (product.category_slug === "paketi-z-logotipom") badges.push({ text: "🏷 Акція", type: "sale" });
  if (Date.now() - new Date(product.created_at || 0).getTime() < 1000 * 60 * 60 * 24 * 45) badges.push({ text: "⭐ Новинка", type: "new" });
  badges.push({ text: "🏭 Від виробника", type: "maker" });
  return badges.slice(0, 2);
};
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
    percent: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 5L5 19"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 4v5c0 4-3 7-7 9-4-2-7-5-7-9V7z"/></svg>',
    message: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v12H8l-4 4z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3"/><path d="M17 7h.01"/></svg>',
    video: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 8v8l6-4z"/><rect x="3" y="5" width="18" height="14" rx="3"/></svg>',
  };
  return `<span class="ui-icon">${icons[name] || icons.box}</span>`;
};

function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Столиця Пак",
    url: location.origin,
    logo: `${location.origin}/uploads/brand/logo.png`,
    telephone: ["+380501308187", "+380731308187"],
    email: "solodovnik.ak@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Київ",
      streetAddress: "вул. Тепловозна 18",
      addressCountry: "UA",
    },
  };
}

function breadcrumbsJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

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
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url || location.href);
  document.head.querySelectorAll('script[type="application/ld+json"]:not(#dynamic-jsonld)').forEach((tag) => tag.remove());
  const ld = document.querySelector("#dynamic-jsonld") || document.createElement("script");
  ld.id = "dynamic-jsonld";
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify(product || organizationJsonLd());
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
  renderRoute().then(() => {
    const hash = new URL(path, location.origin).hash;
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
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

function phoneDigits(value = "") {
  return String(value).replace(/\D/g, "");
}

function formatPhone(value = "") {
  let digits = phoneDigits(value);
  if (digits.startsWith("380")) digits = digits.slice(2);
  else if (digits.startsWith("38")) digits = digits.slice(2);
  else if (digits.startsWith("80")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  const parts = ["+38"];
  if (digits.length) parts.push(` (${digits.slice(0, 3)}`);
  if (digits.length >= 3) parts[1] += ")";
  if (digits.length > 3) parts.push(` ${digits.slice(3, 6)}`);
  if (digits.length > 6) parts.push(`-${digits.slice(6, 8)}`);
  if (digits.length > 8) parts.push(`-${digits.slice(8, 10)}`);
  return parts.join("");
}

function validateCheckout(form) {
  const lines = cartLines();
  const data = formData(form);
  const errors = [];
  if (!lines.length) errors.push("Кошик порожній. Додайте товар перед оформленням.");
  if (!String(data.name || "").trim()) errors.push("Вкажіть ім'я.");
  if (phoneDigits(data.phone).length < 12) errors.push("Вкажіть телефон у форматі +38 (0XX) XXX-XX-XX.");
  if (!String(data.city || "").trim()) errors.push("Вкажіть місто.");
  if (!String(data.nova_poshta_branch || "").trim()) errors.push("Вкажіть відділення Нової Пошти.");
  return errors;
}

function filteredProducts() {
  const q = state.filters.q.toLocaleLowerCase("uk-UA").trim();
  let items = state.products.filter((product) => {
    const byCategory = !state.filters.category || product.category_slug === state.filters.category;
    const bySearch = !q || `${product.name} ${product.description} ${product.sku} ${product.category_name}`.toLocaleLowerCase("uk-UA").includes(q);
    const byStock = !state.filters.inStock || product.stock_quantity > 0;
    return product.active && byCategory && bySearch && byStock;
  });
  if (state.filters.sort === "price-asc") items = [...items].sort((a, b) => a.retail_price - b.retail_price);
  if (state.filters.sort === "price-desc") items = [...items].sort((a, b) => b.retail_price - a.retail_price);
  return items;
}

function featuredProducts() {
  const active = state.products.filter((product) => product.active);
  const featuredInStock = active.filter((product) => product.featured && product.stock_quantity > 0);
  const inStock = active.filter((product) => !product.featured && product.stock_quantity > 0);
  const featuredUnavailable = active.filter((product) => product.featured && product.stock_quantity <= 0);
  const unavailable = active.filter((product) => !product.featured && product.stock_quantity <= 0);
  return [...featuredInStock, ...inStock, ...featuredUnavailable, ...unavailable].slice(0, HOME_PRODUCT_LIMIT);
}

function inStockProducts(limit = HOME_ROW_LIMIT) {
  return state.products.filter((product) => product.active && product.stock_quantity > 0).slice(0, limit);
}

function newestProducts(limit = HOME_ROW_LIMIT) {
  return [...state.products].filter((product) => product.active).reverse().slice(0, limit);
}

function searchProducts(query, limit = 5) {
  const normalized = String(query || "").toLocaleLowerCase("uk-UA").trim();
  if (!normalized) return [];
  return state.products
    .filter((product) => product.active && `${product.name} ${product.description} ${product.sku} ${product.category_name}`.toLocaleLowerCase("uk-UA").includes(normalized))
    .slice(0, limit);
}

function trackRecentProduct(product) {
  const key = "stolitsya-pack-recent";
  const current = JSON.parse(localStorage.getItem(key) || "[]").filter((id) => Number(id) !== Number(product.id));
  localStorage.setItem(key, JSON.stringify([product.id, ...current].slice(0, 8)));
}

function recentProducts(excludeId) {
  const ids = JSON.parse(localStorage.getItem("stolitsya-pack-recent") || "[]");
  return ids
    .map((id) => byId(state.products, id))
    .filter((product) => product && product.active && Number(product.id) !== Number(excludeId))
    .slice(0, 4);
}

function renderLiveSearch(query = "") {
  const results = searchProducts(query);
  return `
    <div class="live-search" data-live-search-box>
      <label aria-label="Пошук товарів">${icon("search")}<input data-live-search value="${esc(query)}" type="search" placeholder="Пошук товарів, SKU, категорій" autocomplete="off" /></label>
      ${query ? `
        <div class="search-suggestions">
          ${results.length ? results.map((product) => `
            <a href="/product/${product.slug}" data-link>
              <img src="${esc(product.image_url)}" alt="${esc(product.name)}" loading="lazy" />
              <span><strong>${esc(product.name)}</strong><small>${money(product.retail_price)} · ${esc(product.category_name)}</small></span>
            </a>
          `).join("") : `<div class="search-empty">Нічого не знайдено</div>`}
        </div>
      ` : ""}
    </div>
  `;
}

function renderCatalogDropdown() {
  return `
    <div class="catalog-menu" data-catalog-menu>
      <button class="catalog-trigger" type="button" data-catalog-toggle aria-expanded="false">${icon("catalog")}Каталог</button>
      <div class="catalog-dropdown" data-catalog-dropdown>
        <div class="catalog-dropdown-head">
          <strong>Категорії товарів</strong>
          <span>${state.categories.length} напрямків упаковки</span>
        </div>
        <div class="catalog-dropdown-grid">
          ${state.categories.map((category) => `
            <a href="/category/${category.slug}" data-link>
              <strong>${esc(category.name)}</strong>
              <small>${esc(shortText(category.description || "Товари для опту та роздробу.", 74))}</small>
            </a>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

async function loadPublicData() {
  const data = await api.get("/api/bootstrap");
  state.categories = data.categories;
  state.products = data.products;
  state.banners = data.banners;
}

function layout(content) {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const footerCategories = state.categories.slice(0, 9);
  return `
    <header class="topbar">
      <a class="brand" href="/" data-link><span class="brand-mark"><img src="/uploads/brand/logo.png" alt="Столиця Пак" /></span><strong>Столиця Пак</strong><small>упаковка для бізнесу</small></a>
      ${renderCatalogDropdown()}
      <div class="header-search">${renderLiveSearch()}</div>
      <div class="header-contact">
        <span>Потрібна допомога?</span>
        <a href="tel:+380501308187">+38 (050) 130-81-87</a>
      </div>
      <button class="menu-btn" data-menu>${icon("menu")}Меню</button>
      <nav class="desktop-nav" data-nav>
        <a class="mobile-only" href="/#categories" data-link>${icon("catalog")}Каталог</a>
        <a href="/#promo" data-link>${icon("percent")}Акції</a>
        <a href="/#delivery" data-link>${icon("truck")}Доставка</a>
        <a href="/#payment" data-link>${icon("card")}Оплата</a>
        <a href="/#contacts" data-link>${icon("phone")}Контакти</a>
        <a class="mobile-only" href="/admin" data-link>${icon("admin")}Адмін</a>
      </nav>
      <button class="cart-button" data-open-cart>${icon("cart")}Кошик <span data-cart-count>${count}</span></button>
    </header>
    ${content}
    <footer class="site-footer">
      <div class="footer-brand">
        <img src="/uploads/brand/logo.png" alt="Столиця Пак" loading="lazy" />
        <strong>Столиця Пак</strong>
        <span>Пакети від виробника: опт і роздріб по Україні</span>
        <p>© ${new Date().getFullYear()} Столиця Пак. Всі права захищені.</p>
      </div>
      <div class="footer-column">
        <h3>Контакти</h3>
        <a href="tel:+380501308187">+38 (050) 130-81-87</a>
        <a href="tel:+380731308187">+38 (073) 130-81-87</a>
        <a href="mailto:solodovnik.ak@gmail.com">solodovnik.ak@gmail.com</a>
        <p>Київ, вул. Тепловозна 18</p>
        <p>Пн-Сб: 08:00-18:00</p>
      </div>
      <div class="footer-column">
        <h3>Категорії</h3>
        ${footerCategories.map((category) => `<a href="/category/${category.slug}" data-link>${esc(category.name)}</a>`).join("")}
      </div>
      <div class="footer-column">
        <h3>Доставка і оплата</h3>
        <a href="/#delivery" data-link>Доставка по Україні</a>
        <a href="/#payment" data-link>Оплата після підтвердження</a>
        <a href="/feeds/google.xml" target="_blank">Google Merchant feed</a>
        <a href="/feeds/products.xml" target="_blank">XML feed</a>
        <div class="socials" aria-label="Соціальні мережі">
          <a href="tel:+380501308187" aria-label="Telegram">${icon("message")}Telegram</a>
          <a href="mailto:solodovnik.ak@gmail.com" aria-label="Instagram">${icon("instagram")}Instagram</a>
          <a href="mailto:solodovnik.ak@gmail.com" aria-label="TikTok">${icon("video")}TikTok</a>
        </div>
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
        <p>Введіть пароль адміністратора, щоб керувати товарами, категоріями, банерами та замовленнями.</p>
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
  const heroImage = "/uploads/brand/commercial-hero.jpg";
  setSeo({
    title: "Столиця Пак - пакети від виробника оптом і в роздріб по Україні",
    description: "Пакети від виробника для магазинів, кафе та бізнесу. Опт і роздріб, актуальні залишки, швидке оформлення замовлення та доставка по Україні.",
    url: canonicalUrl("/"),
    image: banner.image_url,
    product: {
      "@context": "https://schema.org",
      "@graph": [
        organizationJsonLd(),
        {
          "@type": "WebSite",
          name: "Столиця Пак",
          url: location.origin,
          potentialAction: {
            "@type": "SearchAction",
            target: `${location.origin}/?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        },
      ],
    },
  });
  return layout(`
    <main>
      <section class="hero" style="--hero-image:url('${heroImage}')">
        <div class="hero-copy">
          <span class="eyebrow">Виробник упаковки</span>
          <h1>Пакети від виробника</h1>
          <strong class="hero-accent">Опт та роздріб<br>по Україні</strong>
          <p>Пакувальні матеріали для магазинів, кафе, виробництв і дому. Актуальний каталог, зрозумілі ціни та швидке оформлення замовлення.</p>
          <div class="hero-categories" aria-label="Основні категорії">
            <span>Поліетиленові пакети</span>
            <span>Пакети Майка</span>
            <span>Фасувальні пакети</span>
            <span>Пакети BMW</span>
            <span>Сміттєві пакети</span>
            <span>Одноразовий посуд</span>
            <span>Господарські товари</span>
          </div>
          <div class="hero-actions">
            <a class="primary" href="#categories" data-link>${icon("catalog")}Перейти в каталог</a>
            <a class="secondary" href="#contacts" data-link>${icon("percent")}Отримати оптовий прайс</a>
          </div>
        </div>
        <div class="hero-visual">
          <img src="${heroImage}" alt="Пакети та пакувальні матеріали Столиця Пак" />
        </div>
        <div class="hero-panel" aria-label="Переваги магазину">
          <div><strong>${state.products.filter((p) => p.active).length}+</strong><span>товарів</span></div>
          <div><strong>${state.categories.length}</strong><span>категорій</span></div>
          <div><strong>Відправка</strong><span>по Україні</span></div>
          <div><strong>Опт</strong><span>від виробника</span></div>
        </div>
      </section>
      ${renderPromoSection()}
      ${renderBenefitsSection()}
      ${renderCategorySection()}
      ${renderProductShelf("Хіти продажу", "Популярні позиції з наявністю для швидкого замовлення.", inStockProducts(8), "Хіти продажу")}
      ${renderProductShelf("Новинки", "Свіжі позиції каталогу для магазинів, кафе та виробництв.", newestProducts(8), "Новинки")}
      ${renderFeaturedSection()}
      ${renderWhySection()}
      ${renderInfoSections()}
      ${renderReviewsSection()}
      ${renderContactsSection()}
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
    url: canonicalUrl(`/category/${category.slug}`),
    image: category.image_url,
    product: {
      "@context": "https://schema.org",
      "@graph": [
        organizationJsonLd(),
        breadcrumbsJsonLd([
          { name: "Головна", url: canonicalUrl("/") },
          { name: category.name, url: canonicalUrl(`/category/${category.slug}`) },
        ]),
      ],
    },
  });
  return layout(`
    <main>
      <section class="page-head category-head">
        <div>
          <span class="eyebrow">Категорія</span>
          <h1>${esc(category.name)}</h1>
          <p>${esc(category.description || "")}</p>
        </div>
        <img src="${esc(category.image_url)}" alt="${esc(category.name)}" loading="lazy" />
      </section>
      ${renderCatalogSection()}
    </main>
  `);
}

function renderProductPage(slug) {
  const product = state.products.find((item) => item.slug === slug);
  if (!product) return renderNotFound();
  const recent = recentProducts(product.id);
  trackRecentProduct(product);
  const inStock = Number(product.stock_quantity || 0) > 0;
  const size = productAttribute(product.description, ["Розмір", "Размер"]) || product.sku || "-";
  const pack = productAttribute(product.description, ["Кількість", "Количество", "Упаковка"]) || product.category_name || "-";
  const material = productAttribute(product.description, ["Матеріал", "Материал"]) || "-";
  const purpose = productAttribute(product.description, ["Призначення", "Назначение"]) || "-";
  const descriptionHtml = esc(product.description || "Якісна упаковка для щоденної роботи бізнесу та роздрібних покупців.").replace(/\n/g, "<br>");
  setSeo({
    title: product.seo_title || `${product.name} - Столиця Пак`,
    description: product.seo_description || product.description,
    url: canonicalUrl(`/product/${product.slug}`),
    image: product.image_url,
    product: {
      "@context": "https://schema.org",
      "@graph": [
        organizationJsonLd(),
        breadcrumbsJsonLd([
          { name: "Головна", url: canonicalUrl("/") },
          { name: product.category_name, url: canonicalUrl(`/category/${product.category_slug}`) },
          { name: product.name, url: canonicalUrl(`/product/${product.slug}`) },
        ]),
        {
          "@type": "Product",
          name: product.name,
          sku: product.sku,
          image: product.image_url,
          description: product.description,
          brand: { "@type": "Brand", name: "Столиця Пак" },
          offers: {
            "@type": "Offer",
            priceCurrency: "UAH",
            price: product.retail_price,
            availability: product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: canonicalUrl(`/product/${product.slug}`),
          },
        },
      ],
    },
  });
  const related = state.products
    .filter((item) => item.active && item.category_slug === product.category_slug && item.id !== product.id)
    .slice(0, 10);
  return layout(`
    <main>
      <section class="product-page">
        <div class="product-gallery">
          <a class="product-main-photo" href="${esc(product.image_url)}" target="_blank" rel="noopener" title="Відкрити фото у великому розмірі">
            <img src="${esc(product.image_url)}" alt="${esc(product.name)}" />
            <span>Збільшити фото</span>
          </a>
          <div class="product-thumbs" aria-label="Фото товару">
            <button class="active" type="button" aria-label="Основне фото"><img src="${esc(product.image_url)}" alt="" /></button>
          </div>
        </div>
        <div class="product-detail">
          <a class="breadcrumb" href="/category/${product.category_slug}" data-link>${esc(product.category_name)}</a>
          <h1>${esc(product.name)}</h1>
          <div class="product-meta-line">
            <span>Артикул: <strong>${esc(product.sku || "-")}</strong></span>
            <span>Категорія: <a href="/category/${product.category_slug}" data-link>${esc(product.category_name)}</a></span>
          </div>
          <div class="product-buy-card" data-product-summary data-price="${Number(product.retail_price || 0)}">
            <span class="stock-badge ${inStock ? "in-stock" : "preorder"}">${inStock ? "В наявності" : "Під замовлення"}</span>
            <div class="price-box">
              <strong>${money(product.retail_price)}</strong>
              <span>Оптова ціна: ${money(product.wholesale_price)}</span>
              <span>${inStock ? `Залишок: ${product.stock_quantity} шт` : "Менеджер уточнить термін постачання"}</span>
            </div>
            <div class="product-qty-box">
              <span>Кількість</span>
              <div class="product-qty-control">
                <button type="button" data-product-qty-step="-1" ${!inStock ? "disabled" : ""}>−</button>
                <input data-product-qty value="1" inputmode="numeric" ${!inStock ? "disabled" : ""} />
                <button type="button" data-product-qty-step="1" ${!inStock ? "disabled" : ""}>+</button>
              </div>
              <strong>Разом: <span data-product-total>${money(product.retail_price)}</span></strong>
            </div>
            <button class="add-btn wide product-page-add" data-add="${product.id}" ${!inStock ? "disabled" : ""}>${icon("cart")}До кошика</button>
            <div class="product-page-perks">
              <span>🚚 Швидка доставка</span>
              <span>🏭 Від виробника</span>
              <span>🇺🇦 Доставка по Україні</span>
              <span>💰 Оптові ціни</span>
            </div>
          </div>
        </div>
      </section>
      <section class="section product-tabs-section">
        <div class="product-tabs" role="tablist" aria-label="Інформація про товар">
          <button class="active" type="button" data-product-tab="description">Опис</button>
          <button type="button" data-product-tab="specs">Характеристики</button>
          <button type="button" data-product-tab="delivery">Доставка</button>
          <button type="button" data-product-tab="payment">Оплата</button>
          <button type="button" data-product-tab="wholesale">Опт</button>
        </div>
        <div class="product-tab-panel active" data-product-pane="description">
          <h2>Опис</h2>
          <p>${descriptionHtml}</p>
        </div>
        <div class="product-tab-panel" data-product-pane="specs">
          <h2>Характеристики</h2>
          <dl class="specs-list">
            <div><dt>SKU</dt><dd>${esc(product.sku || "-")}</dd></div>
            <div><dt>Категорія</dt><dd>${esc(product.category_name)}</dd></div>
            <div><dt>Розмір</dt><dd>${esc(size)}</dd></div>
            <div><dt>В упаковці</dt><dd>${esc(pack)}</dd></div>
            <div><dt>Матеріал</dt><dd>${esc(material)}</dd></div>
            <div><dt>Призначення</dt><dd>${esc(purpose)}</dd></div>
            <div><dt>Роздрібна ціна</dt><dd>${money(product.retail_price)}</dd></div>
            <div><dt>Оптова ціна</dt><dd>${money(product.wholesale_price)}</dd></div>
            <div><dt>Наявність</dt><dd>${inStock ? `${product.stock_quantity} шт` : "Під замовлення"}</dd></div>
          </dl>
        </div>
        <div class="product-tab-panel" data-product-pane="delivery">
          <h2>Доставка</h2>
          <p>Відправляємо замовлення по Україні після підтвердження менеджером. Деталі доставки та зручне відділення узгоджуються під час обробки замовлення.</p>
        </div>
        <div class="product-tab-panel" data-product-pane="payment">
          <h2>Оплата</h2>
          <p>Оплата узгоджується телефоном після оформлення замовлення. Менеджер підтвердить наявність, суму та спосіб оплати.</p>
        </div>
        <div class="product-tab-panel" data-product-pane="wholesale">
          <h2>Опт</h2>
          <p>Для оптових покупців діє окрема ціна: <strong>${money(product.wholesale_price)}</strong>. Залиште замовлення, і менеджер уточнить умови для вашого обсягу.</p>
        </div>
      </section>
      <section class="section product-trust">
        <div class="section-title">
          <div><span class="eyebrow">Довіра</span><h2>Чому купують у Столиця ПАК?</h2></div>
        </div>
        <div class="trust-grid">
          <article>${icon("box")}<strong>Власне виробництво</strong><span>Пакувальні матеріали напряму від виробника.</span></article>
          <article>${icon("shield")}<strong>Контроль якості</strong><span>Стежимо за якістю товарів перед відправкою.</span></article>
          <article>${icon("percent")}<strong>Оптові ціни</strong><span>Окремі умови для магазинів, кафе та складів.</span></article>
          <article>${icon("truck")}<strong>Швидка відправка</strong><span>Оперативно підтверджуємо і готуємо замовлення.</span></article>
          <article>${icon("check")}<strong>Доставка по Україні</strong><span>Відправляємо замовлення в різні міста України.</span></article>
        </div>
      </section>
      ${related.length ? `
        <section class="section related-products product-carousel-section">
          <div class="section-title">
            <div><span class="eyebrow">Схожі товари</span><h2>Ще з цієї категорії</h2></div>
          </div>
          <div class="product-carousel">${related.map(renderProductCard).join("")}</div>
        </section>
      ` : ""}
      ${recent.length ? `
        <section class="section related-products recent-products product-carousel-section">
          <div class="section-title">
            <div><span class="eyebrow">Переглядали</span><h2>Нещодавно переглянуті товари</h2></div>
          </div>
          <div class="product-carousel recent-carousel">${recent.map(renderProductCard).join("")}</div>
        </section>
      ` : ""}
    </main>
  `);
}

function renderNotFound() {
  setSeo({ title: "Сторінку не знайдено - Столиця Пак", description: "Сторінку не знайдено." });
  return layout(`<main><section class="page-head"><h1>Сторінку не знайдено</h1><a class="primary" href="/" data-link>На головну</a></section></main>`);
}

function renderCategorySection() {
  const desiredOrder = [
    "paketi-majka",
    "fasuvalni-paketi",
    "paketi-bmw",
    "paketi-z-logotipom",
    "smittevi-paketi",
    "odnorazovij-posud",
    "gospodarski-tovari",
    "polietilenovi-rukavichki",
    "paketi-v-ruloni",
  ];
  const descriptions = {
    "paketi-majka": "Для магазинів, ринків та супермаркетів.",
    "fasuvalni-paketi": "Для продуктів та харчових товарів.",
    "paketi-bmw": "Міцні пакети великої вантажопідйомності.",
    "paketi-z-logotipom": "Фірмова упаковка для впізнаваного бренду.",
    "smittevi-paketi": "Міцні пакети для дому, офісу та складу.",
    "odnorazovij-posud": "Посуд для кафе, доставки та подій.",
    "gospodarski-tovari": "Все для чистоти, кухні та щоденної роботи.",
    "polietilenovi-rukavichki": "Гігієнічний захист для їжі та сервісу.",
    "paketi-v-ruloni": "Зручні рулони для фасування і пакування.",
  };
  const displayNames = {
    "paketi-majka": "Пакети Майка",
    "smittevi-paketi": "Сміттєві пакети",
    "polietilenovi-rukavichki": "Рукавички",
    "paketi-v-ruloni": "Рулони",
  };
  const categories = [...state.categories].sort((a, b) => {
    const aIndex = desiredOrder.indexOf(a.slug);
    const bIndex = desiredOrder.indexOf(b.slug);
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });
  const categoryCount = (slug) => state.products.filter((product) => product.active && product.category_slug === slug).length;
  const productWord = (count) => {
    if (count % 10 === 1 && count % 100 !== 11) return "товар";
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return "товари";
    return "товарів";
  };
  return `
    <section class="section categories" id="categories">
      <div class="section-title">
        <div><span class="eyebrow">Каталог</span><h2>Популярні категорії</h2><p>Швидко знайдіть потрібну упаковку для вашого бізнесу.</p></div>
      </div>
      <div class="category-grid">
        ${categories.map((category) => {
          const count = categoryCount(category.slug);
          return `
          <a class="category-card" href="/category/${category.slug}" data-link>
            <span class="category-card-media">
              <img src="${esc(category.image_url)}" alt="${esc(displayNames[category.slug] || category.name)}" loading="lazy" />
            </span>
            <span class="category-card-body">
              <strong>${esc(displayNames[category.slug] || category.name)}</strong>
              <small>${esc(descriptions[category.slug] || "Товари в наявності для опту та роздробу.")}</small>
              <span class="category-card-meta">${count} ${productWord(count)} в категорії</span>
              <span class="category-card-button">Переглянути ${icon("arrow")}</span>
            </span>
          </a>
        `;
        }).join("")}
      </div>
      <div class="category-catalog-action">
        <a class="primary" href="#catalog" data-link>${icon("catalog")}Переглянути весь каталог</a>
      </div>
      <div class="category-seo">
        <h2>Упаковка для магазинів, кафе та виробництв</h2>
        <p>У каталозі зібрані основні категорії пакувальних матеріалів Столиця Пак: пакети майка, фасувальні пакети, пакети в рулонах, пакети з логотипом, господарські товари, одноразовий посуд, рукавички та сміттєві пакети. Обирайте категорію, переглядайте ціни й залишки та оформлюйте замовлення через кошик.</p>
      </div>
    </section>
  `;
}

function renderPromoSection() {
  const promos = [
    {
      title: "Оптові ціни від виробника",
      text: "Вигідні умови для магазинів, складів, кафе та виробництв.",
      image: "/uploads/brand/commercial-hero.jpg",
      href: "/#catalog",
      label: "Перейти в каталог",
    },
    {
      title: "Пакети майка",
      text: "Популярні розміри, різні кольори та щільність для щоденної роботи.",
      image: "/uploads/brand/promo-maika.jpg",
      href: "/category/paketi-majka",
      label: "До категорії",
    },
    {
      title: "Фасувальні пакети",
      text: "Для продуктів, магазинів, дому та виробництва.",
      image: "/uploads/brand/promo-fasuvannya.jpg",
      href: "/category/fasuvalni-paketi",
      label: "До категорії",
    },
    {
      title: "Господарські товари",
      text: "Рушники, губки, рукавички та товари для чистоти щодня.",
      image: "/uploads/brand/promo-gospodarski.jpg",
      href: "/category/gospodarski-tovari",
      label: "До категорії",
    },
  ];
  return `
    <section class="section promo-section" id="promo">
      <div class="section-title">
        <div><span class="eyebrow">Пропозиції</span><h2>Швидкий вибір для бізнесу</h2><p>Найпопулярніші напрямки каталогу з фото, зрозумілими перевагами та прямим переходом до товарів.</p></div>
      </div>
      <div class="promo-grid">
        ${promos.map((promo) => `
          <a class="promo-card" href="${promo.href}" data-link style="--promo-image:url('${promo.image}')">
            <span>${icon("percent")}Столиця Пак</span>
            <strong>${esc(promo.title)}</strong>
            <small>${esc(promo.text)}</small>
            <em>${esc(promo.label)} ${icon("arrow")}</em>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function renderFeaturedSection() {
  const items = featuredProducts();
  return `
    <section class="section catalog featured-catalog" id="catalog">
      <div class="section-title with-tools">
        <div>
          <span class="eyebrow">Популярне</span>
          <h2>Популярні товари</h2>
          <p>Показуємо 12 позицій для швидкого замовлення. Повний каталог доступний у категоріях.</p>
        </div>
        <a class="primary section-action" href="#categories" data-link>${icon("catalog")}Перейти в каталог</a>
      </div>
      <div class="product-grid">
        ${items.map(renderProductCard).join("")}
      </div>
    </section>
  `;
}

function renderProductShelf(title, description, items, eyebrowText) {
  if (!items.length) return "";
  return `
    <section class="section catalog product-shelf">
      <div class="section-title with-tools">
        <div>
          <span class="eyebrow">${esc(eyebrowText)}</span>
          <h2>${esc(title)}</h2>
          <p>${esc(description)}</p>
        </div>
        <a class="secondary light" href="#categories" data-link>${icon("catalog")}Усі категорії</a>
      </div>
      <div class="product-grid compact-grid">
        ${items.map(renderProductCard).join("")}
      </div>
    </section>
  `;
}

function renderBenefitsSection() {
  return `
    <section class="benefits" aria-label="Переваги">
      <article>${icon("truck")}<strong>Швидка доставка</strong><span>Відправляємо замовлення по Україні після підтвердження.</span></article>
      <article>${icon("box")}<strong>Власне виробництво</strong><span>Пакувальні матеріали напряму від виробника.</span></article>
      <article>${icon("percent")}<strong>Оптові ціни</strong><span>Вигідні умови для магазинів, складів і виробництв.</span></article>
      <article>${icon("check")}<strong>Якісний товар</strong><span>Фото, ціни, залишки та категорії зібрані в одному каталозі.</span></article>
    </section>
  `;
}

function renderWhySection() {
  return `
    <section class="section why-section">
      <div class="section-title">
        <div><span class="eyebrow">Чому ми</span><h2>Столиця Пак для дому, магазину та виробництва</h2><p>Ми зробили MVP-магазин максимально простим: оберіть категорію, додайте товар у кошик і залиште контакти для підтвердження замовлення.</p></div>
      </div>
      <div class="why-grid">
        <article>${icon("box")}<strong>Великий асортимент</strong><span>Пакети майка, фасування, рулони, посуд, рукавички та господарські товари.</span></article>
        <article>${icon("shield")}<strong>Зрозуміла наявність</strong><span>Залишок видно до оформлення, тому клієнт швидше приймає рішення.</span></article>
        <article>${icon("phone")}<strong>Живе підтвердження</strong><span>Після заявки менеджер уточнює оплату, доставку та оптові умови.</span></article>
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
  const size = productAttribute(product.description, ["Розмір", "Размер"]) || product.sku || "Уточнюйте";
  const pack = productAttribute(product.description, ["Кількість", "Количество", "Упаковка"]) || product.category_name || "Упаковка";
  const inStock = Number(product.stock_quantity || 0) > 0;
  const badges = productCardBadges(product);
  return `
    <article class="product-card">
      <a href="/product/${product.slug}" data-link class="quick-view">
        <img src="${esc(product.image_url)}" alt="${esc(product.name)}" loading="lazy" />
      </a>
      <div class="product-info">
        <div class="product-card-top">
          <span class="stock-badge ${inStock ? "in-stock" : "preorder"}">${inStock ? "В наявності" : "Під замовлення"}</span>
          <span class="product-card-badges">${badges.map((badge) => `<span class="promo-badge ${badge.type}">${esc(badge.text)}</span>`).join("")}</span>
        </div>
        <h3><a href="/product/${product.slug}" data-link>${esc(product.name)}</a></h3>
        <dl class="product-specs">
          <div><dt>Розмір</dt><dd>${esc(shortText(size, 34))}</dd></div>
          <div><dt>В упаковці</dt><dd>${esc(shortText(pack, 34))}</dd></div>
        </dl>
        <div class="product-bottom">
          <div class="product-price"><strong>${money(product.retail_price)}</strong><span>Опт: ${money(product.wholesale_price)}</span></div>
          <div class="product-actions">
            <button class="add-btn product-add" data-add="${product.id}" ${!inStock ? "disabled" : ""}>${icon("cart")}До кошика</button>
            <a class="details-btn" href="/product/${product.slug}" data-link>Детальніше</a>
          </div>
          <div class="product-perks">
            <span>🚚 Швидка доставка</span>
            <span>🏭 Від виробника</span>
            <span>🇺🇦 Доставка по Україні</span>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderInfoSections() {
  return `
    <section class="info-grid" id="delivery">
      <article>${icon("truck")}<span class="eyebrow">Доставка</span><h2>Доставка по Україні</h2><p>Під час оформлення замовлення вкажіть місто та відділення Нової Пошти. Менеджер підтвердить деталі телефоном.</p></article>
      <article id="payment">${icon("card")}<span class="eyebrow">Оплата</span><h2>Оплата після підтвердження</h2><p>Онлайн-оплата поки не підключена. Замовлення зберігається в адмін-панелі, менеджер узгоджує оплату та доставку.</p></article>
    </section>
  `;
}

function renderReviewsSection() {
  return `
    <section class="section reviews-section">
      <div class="section-title">
        <div><span class="eyebrow">Відгуки</span><h2>Клієнти обирають простоту</h2><p>Блок підготовлений для реальних відгуків після запуску. Зараз показані типові сценарії покупців.</p></div>
      </div>
      <div class="review-grid">
        <article><strong>Магазин біля дому</strong><p>“Швидко знайшли пакети майка, додали в кошик і залишили заявку. Зручно, що видно оптову ціну.”</p></article>
        <article><strong>Кафе та доставка</strong><p>“Фасування, рукавички й одноразовий посуд можна замовити в одному місці.”</p></article>
        <article><strong>Виробництво</strong><p>“Категорії зрозумілі, товарні картки містять ціну, залишок і SKU.”</p></article>
      </div>
    </section>
  `;
}

function renderContactsSection() {
  return `
    <section class="section contacts-section" id="contacts">
      <div>
        <span class="eyebrow">Контакти</span>
        <h2>Потрібна консультація щодо упаковки?</h2>
        <p>Зателефонуйте або оформіть замовлення через кошик. Ми допоможемо підібрати розмір, щільність і кількість.</p>
      </div>
      <div class="contact-actions">
        <a class="primary" href="tel:+380501308187">${icon("phone")}+38 (050) 130-81-87</a>
        <a class="secondary light" href="mailto:solodovnik.ak@gmail.com">${icon("message")}Написати на email</a>
      </div>
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
    <div class="cart-head">
      <div><span>Ваш кошик</span><strong>${lines.length ? `${count} товарів` : "Порожній"}</strong></div>
      <button class="icon-btn cart-close" data-close-cart aria-label="Закрити кошик">${icon("close")}<span>Закрити</span></button>
    </div>
    ${lines.length ? `
      <div class="cart-body">
        <div class="cart-list" aria-label="Товари в кошику">
          ${lines.map((item) => `
          <div class="cart-item">
            <img src="${esc(item.image_url)}" alt="${esc(item.name)}" />
            <div class="cart-item-info">
              <strong>${esc(item.name)}</strong>
              <span class="cart-item-price">${money(item.retail_price)} / шт</span>
              <div class="qty">
                <button data-qty="${item.id}" data-delta="-1" aria-label="Зменшити кількість">−</button>
                <input data-qty-input="${item.id}" value="${item.quantity}" inputmode="numeric" aria-label="Кількість товару" />
                <button data-qty="${item.id}" data-delta="1" aria-label="Збільшити кількість">+</button>
              </div>
              <button class="remove" data-remove="${item.id}">Видалити</button>
            </div>
            <div class="cart-line-total">
              <span>Сума</span>
              <strong>${money(item.retail_price * item.quantity)}</strong>
            </div>
          </div>
        `).join("")}
        </div>
        <section class="cart-summary" aria-label="Підсумок замовлення">
          <div class="checkout-total">
            <span>Разом</span>
            <strong>${money(total)}</strong>
          </div>
          <div class="cart-summary-row"><span>Кількість товарів</span><strong>${count}</strong></div>
          <div class="cart-trust">
            <span>🚚 Доставка по Україні</span>
            <span>💰 Опт та роздріб</span>
            <span>🏭 Від виробника</span>
            <span>📞 Підтвердимо замовлення телефоном</span>
          </div>
          <button class="primary checkout-anchor" type="button" data-show-checkout>${icon("check")}Оформити замовлення</button>
          <button class="secondary light continue-shopping" type="button" data-close-cart>Продовжити покупки</button>
        </section>
        <form class="checkout" id="checkout-form" data-checkout novalidate>
          <div class="checkout-title">
            <span class="eyebrow">Оформлення</span>
            <h2>Контактні дані</h2>
            <p>Менеджер підтвердить замовлення телефоном.</p>
          </div>
          <div class="form-error" data-checkout-error hidden></div>
          <label>Ім'я<input required name="name" placeholder="Ваше ім'я" /></label>
          <label>Телефон<input required name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+38 (0__) ___-__-__" /></label>
          <label>Місто<input required name="city" placeholder="Київ" /></label>
          <label>Відділення Нової Пошти<input required name="nova_poshta_branch" placeholder="Відділення №..." /></label>
          <label>Коментар<textarea name="comment" placeholder="Побажання до замовлення"></textarea></label>
          <button type="submit">${icon("check")}Оформити замовлення</button>
        </form>
      </div>
    ` : `
      <div class="empty-cart">
        <div class="empty-cart-icon">${icon("cart")}</div>
        <strong>Ваш кошик порожній</strong>
        <p>Додайте товари з каталогу, а ми швидко підтвердимо замовлення телефоном.</p>
        <a class="primary" href="/#catalog" data-link data-close-cart>${icon("catalog")}Перейти в каталог</a>
      </div>
    `}
  `;
  panel.querySelector("button[data-close-cart]")?.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector("[data-cart-drawer]")?.classList.remove("open");
  });
}

async function renderAdmin() {
  setSeo({ title: "Адмін-панель - Столиця Пак", description: "Керування товарами, категоріями, банерами та замовленнями." });
  const session = await api.get("/api/admin/session");
  state.adminAuthenticated = session.authenticated;
  if (!state.adminAuthenticated) {
    renderAdminLogin();
    return;
  }
  await loadAdminData();
  document.querySelector("#app").innerHTML = layout(`
    <main class="admin">
      <section class="page-head"><span class="eyebrow">Адміністрування</span><h1>Адмін-панель</h1><p>Керуйте товарами, категоріями, банерами та замовленнями.</p><button class="secondary admin-logout" data-admin-logout>Вийти</button></section>
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
        <h2>${edit.id ? "Редагувати банер" : "Новий банер"}</h2>
        ${input("title", "Заголовок", edit.title, true)}
        <label>Підзаголовок<textarea name="subtitle">${esc(edit.subtitle || "")}</textarea></label>
        ${imageInput("image_url", edit.image_url)}
        ${input("link_url", "Посилання", edit.link_url || "#catalog")}
        ${input("button_text", "Текст кнопки", edit.button_text || "До каталогу")}
        ${input("sort_order", "Сортування", edit.sort_order || 0, false, "number")}
        <label class="check"><input name="active" type="checkbox" ${edit.active ?? true ? "checked" : ""} /> Активний</label>
        <button type="submit">Зберегти банер</button>
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

function flash(message, duration = 1800) {
  const node = document.querySelector("[data-toast]");
  if (!node) return;
  node.textContent = message;
  node.classList.add("show");
  setTimeout(() => node.classList.remove("show"), duration);
}

function updateProductTotal(summary) {
  if (!summary) return;
  const input = summary.querySelector("[data-product-qty]");
  const total = summary.querySelector("[data-product-total]");
  const price = Number(summary.dataset.price || 0);
  const quantity = Math.max(1, Number(input?.value) || 1);
  if (input) input.value = quantity;
  if (total) total.textContent = money(price * quantity);
}

async function submitOrder(form) {
  const errorNode = form.querySelector("[data-checkout-error]");
  const errors = validateCheckout(form);
  form.classList.toggle("was-validated", Boolean(errors.length));
  if (errors.length) {
    if (errorNode) {
      errorNode.hidden = false;
      errorNode.innerHTML = errors.map((error) => `<div>${esc(error)}</div>`).join("");
    }
    flash(errors[0]);
    return;
  }
  const data = formData(form);
  data.phone = formatPhone(data.phone);
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
  flash(`Дякуємо! Замовлення прийнято. Номер #${order.id}`, 5200);
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
  const catalogToggle = event.target.closest("[data-catalog-toggle]");
  const logout = event.target.closest("[data-admin-logout]");
  const productTab = event.target.closest("[data-product-tab]");
  const productQtyStep = event.target.closest("[data-product-qty-step]");
  const showCheckout = event.target.closest("[data-show-checkout]");

  if (link && link.getAttribute("href")?.startsWith("/")) {
    event.preventDefault();
    document.querySelector("[data-nav]")?.classList.remove("open");
    document.querySelector("[data-catalog-menu]")?.classList.remove("open");
    navigate(link.getAttribute("href"));
  }
  if (productTab) {
    const section = productTab.closest(".product-tabs-section");
    section?.querySelectorAll("[data-product-tab]").forEach((button) => button.classList.toggle("active", button === productTab));
    section?.querySelectorAll("[data-product-pane]").forEach((pane) => pane.classList.toggle("active", pane.dataset.productPane === productTab.dataset.productTab));
  }
  if (productQtyStep) {
    const summary = productQtyStep.closest("[data-product-summary]");
    const input = summary?.querySelector("[data-product-qty]");
    if (input) input.value = Math.max(1, (Number(input.value) || 1) + Number(productQtyStep.dataset.productQtyStep || 0));
    updateProductTotal(summary);
  }
  if (add) {
    const summary = add.closest("[data-product-summary]");
    const quantity = summary ? Number(summary.querySelector("[data-product-qty]")?.value || 1) : 1;
    addToCart(Number(add.dataset.add), quantity);
  }
  if (openCart) document.querySelector("[data-cart-drawer]").classList.add("open");
  if (closeCart) document.querySelector("[data-cart-drawer]").classList.remove("open");
  if (showCheckout) {
    event.preventDefault();
    document.querySelector("#checkout-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (event.target.matches("[data-cart-drawer]")) document.querySelector("[data-cart-drawer]").classList.remove("open");
  if (menu) document.querySelector("[data-nav]")?.classList.toggle("open");
  if (catalogToggle) {
    const catalog = catalogToggle.closest("[data-catalog-menu]");
    const open = !catalog.classList.contains("open");
    catalog.classList.toggle("open", open);
    catalogToggle.setAttribute("aria-expanded", String(open));
  }
  if (!event.target.closest(".topbar")) {
    document.querySelector("[data-nav]")?.classList.remove("open");
    document.querySelector("[data-catalog-menu]")?.classList.remove("open");
  }
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
  if (deleteBanner && confirm("Видалити банер?")) { await api.send(`/api/admin/banners/${deleteBanner.dataset.deleteBanner}`, "DELETE", {}); await refreshAdmin("banners"); }
});

document.addEventListener("input", (event) => {
  if (event.target.matches('[name="phone"]')) {
    event.target.value = formatPhone(event.target.value);
  }
  if (event.target.matches("[data-filter]")) {
    const key = event.target.dataset.filter;
    state.filters[key] = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    const section = document.querySelector(".catalog");
    if (section) section.outerHTML = renderCatalogSection();
  }
  if (event.target.matches("[data-live-search]")) {
    const box = event.target.closest("[data-live-search-box]");
    if (box) box.outerHTML = renderLiveSearch(event.target.value);
    const nextInput = document.querySelector("[data-live-search]");
    if (nextInput) {
      nextInput.focus();
      nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
    }
  }
  if (event.target.matches("[data-qty-input]")) updateCart(Number(event.target.dataset.qtyInput), event.target.value);
  if (event.target.matches("[data-product-qty]")) updateProductTotal(event.target.closest("[data-product-summary]"));
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
