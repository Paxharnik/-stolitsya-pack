(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const u of s.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&n(u)}).observe(document,{childList:!0,subtree:!0});function e(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(o){if(o.ep)return;o.ep=!0;const s=e(o);fetch(o.href,s)}})();const d={async get(t){const a=await fetch(t);if(!a.ok)throw new Error((await a.json()).error||"API error");return a.json()},async send(t,a,e){const n=await fetch(t,{method:a,headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),o=await n.json();if(!n.ok)throw new Error(o.error||"API error");return o},async upload(t,a,e){const n=new FormData;n.append(a,e);const o=await fetch(t,{method:"POST",body:n}),s=await o.json();if(!o.ok)throw new Error(s.error||"Upload error");return s}},r={categories:[],products:[],banners:[],cart:JSON.parse(localStorage.getItem("stolitsya-pack-cart")||"[]"),filters:{q:"",category:"",sort:"featured",inStock:!1},admin:{products:[],categories:[],banners:[],orders:[],imports:[]},adminAuthenticated:!1},p=t=>`${Number(t||0).toFixed(2)} грн`,v=(t,a)=>t.find(e=>Number(e.id)===Number(a)),i=(t="")=>String(t).replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[a]),c=t=>{const a={menu:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',catalog:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z"/></svg>',truck:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',card:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3zM3 10h18M7 15h4"/></svg>',admin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 4v5c0 4-3 7-7 9-4-2-7-5-7-9V7z"/><path d="M9 12l2 2 4-5"/></svg>',cart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2l2 10h10l2-7H7"/><circle cx="10" cy="19" r="1.8"/><circle cx="17" cy="19" r="1.8"/></svg>',search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/></svg>',box:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8l8-4 8 4-8 4zM4 8v8l8 4 8-4V8M12 12v8"/></svg>',check:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',phone:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l4 4-2 2c2 4 4 6 8 8l2-2 4 4-2 2C10 21 3 14 2 6z"/></svg>',arrow:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'};return`<span class="ui-icon">${a[t]||a.box}</span>`};function k(){localStorage.setItem("stolitsya-pack-cart",JSON.stringify(r.cart))}function f({title:t,description:a,url:e,image:n,product:o}){document.title=t,$("description",a),$("og:title",t,"property"),$("og:description",a,"property"),$("og:url",e||location.href,"property"),n&&$("og:image",n,"property");const s=document.querySelector("#dynamic-jsonld")||document.createElement("script");s.id="dynamic-jsonld",s.type="application/ld+json",s.textContent=JSON.stringify(o||{"@context":"https://schema.org","@type":"Store",name:"Столиця Пак",url:location.origin,telephone:"+380501308187",address:{"@type":"PostalAddress",addressLocality:"Київ",addressCountry:"UA"}}),document.head.appendChild(s)}function $(t,a,e="name"){let n=document.head.querySelector(`meta[${e}="${t}"]`);n||(n=document.createElement("meta"),n.setAttribute(e,t),document.head.appendChild(n)),n.setAttribute("content",a)}function R(){return location.pathname.replace(/\/+$/,"")||"/"}function Q(t){history.pushState({},"",t),q()}function Y(){return r.cart.map(t=>{const a=v(r.products,t.product_id);return a?{...a,quantity:t.quantity}:null}).filter(Boolean)}function Z(t,a=1){const e=v(r.products,t);if(!e||!e.active||e.stock_quantity<=0)return;const n=r.cart.find(o=>Number(o.product_id)===Number(t));n?n.quantity+=a:r.cart.push({product_id:Number(t),quantity:a}),k(),b(),_("Товар додано до кошика")}function D(t,a){r.cart=r.cart.map(e=>Number(e.product_id)===Number(t)?{...e,quantity:Math.max(1,Number(a)||1)}:e),k(),b()}function tt(t){r.cart=r.cart.filter(a=>Number(a.product_id)!==Number(t)),k(),b()}function at(){const t=r.filters.q.toLowerCase().trim();let a=r.products.filter(e=>{const n=!r.filters.category||e.category_slug===r.filters.category,o=!t||`${e.name} ${e.description} ${e.sku} ${e.category_name}`.toLowerCase().includes(t),s=!r.filters.inStock||e.stock_quantity>0;return e.active&&n&&o&&s});return r.filters.sort==="price-asc"&&(a=[...a].sort((e,n)=>e.retail_price-n.retail_price)),r.filters.sort==="price-desc"&&(a=[...a].sort((e,n)=>n.retail_price-e.retail_price)),a}async function M(){const t=await d.get("/api/bootstrap");r.categories=t.categories,r.products=t.products,r.banners=t.banners}function h(t){const a=r.cart.reduce((e,n)=>e+n.quantity,0);return`
    <header class="topbar">
      <a class="brand" href="/" data-link><span class="brand-mark"><img src="/uploads/brand/logo.png" alt="Столиця Пак" /></span><strong>Столиця Пак</strong><small>упаковка для бізнесу</small></a>
      <button class="menu-btn" data-menu>${c("menu")}Меню</button>
      <nav class="desktop-nav" data-nav>
        <a href="/#catalog" data-link>${c("catalog")}Каталог</a>
        <a href="/#delivery" data-link>${c("truck")}Доставка</a>
        <a href="/#payment" data-link>${c("card")}Оплата</a>
        <a href="/admin" data-link>${c("admin")}Адмін</a>
      </nav>
      <button class="cart-button" data-open-cart>${c("cart")}Кошик <span data-cart-count>${a}</span></button>
    </header>
    ${t}
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
  `}function I(t=""){f({title:"Вхід в адмін-панель - Столиця Пак",description:"Вхід в адмін-панель магазину."}),document.querySelector("#app").innerHTML=h(`
    <main class="admin-login">
      <form class="admin-form login-card" data-admin-login>
        <span class="eyebrow">Адмін-панель</span>
        <h1>Вхід</h1>
        <p>Введіть пароль адміністратора, щоб керувати товарами, категоріями, баннерами та замовленнями.</p>
        ${t?`<div class="form-error">${i(t)}</div>`:""}
        <label>Пароль<input name="password" type="password" required autocomplete="current-password" /></label>
        <button type="submit">Увійти</button>
      </form>
    </main>
  `),b()}function et(){const t=r.banners[0]||{};return f({title:"Столиця Пак - пакувальні матеріали та поліетиленові пакети в Україні",description:"Інтернет-магазин пакувальних матеріалів: пакети майка, фасувальні пакети, пакети з логотипом, одноразовий посуд та господарські товари.",url:location.origin+"/",image:t.image_url}),h(`
    <main>
      <section class="hero" style="--hero-image:url('${i(t.image_url||"")}')">
        <div class="hero-copy">
          <span class="eyebrow">Столиця Пак</span>
          <h1>${i(t.title||"Пакеты от производителя")}</h1>
          <p>${i(t.subtitle||"Опт и розница. Доставка по всей Украине.")}</p>
          <div class="hero-badges">
            <span>${c("box")}Пакеты от производителя</span>
            <span>${c("catalog")}Опт и розница</span>
            <span>${c("truck")}Доставка по всей Украине</span>
          </div>
          <div class="hero-actions">
            <a class="primary" href="${i(t.link_url||"#catalog")}" data-link>${c("catalog")}${i(t.button_text||"Перейти в каталог")}</a>
            <a class="secondary" href="tel:+380501308187">${c("phone")}+38 (050) 130-81-87</a>
          </div>
        </div>
        <div class="hero-panel">
          <div>${c("box")}<strong>${r.products.filter(a=>a.active).length}</strong><span>товарів у каталозі</span></div>
          <div>${c("catalog")}<strong>${r.categories.length}</strong><span>категорій</span></div>
          <div>${c("truck")}<strong>1-2 дні</strong><span>обробка замовлення</span></div>
        </div>
      </section>
      ${nt()}
      ${L()}
      ${ot()}
    </main>
  `)}function rt(t){r.filters.category=t;const a=r.categories.find(e=>e.slug===t);return a?(f({title:`${a.name} - купити в Україні | Столиця Пак`,description:a.description||`Категорія ${a.name} в інтернет-магазині Столиця Пак.`,url:location.href,image:a.image_url}),h(`
    <main>
      <section class="page-head">
        <span class="eyebrow">Категорія</span>
        <h1>${i(a.name)}</h1>
        <p>${i(a.description||"")}</p>
      </section>
      ${L()}
    </main>
  `)):U()}function it(t){const a=r.products.find(e=>e.slug===t);return a?(f({title:a.seo_title||`${a.name} - Столиця Пак`,description:a.seo_description||a.description,url:location.href,image:a.image_url,product:{"@context":"https://schema.org","@type":"Product",name:a.name,sku:a.sku,image:a.image_url,description:a.description,offers:{"@type":"Offer",priceCurrency:"UAH",price:a.retail_price,availability:a.stock_quantity>0?"https://schema.org/InStock":"https://schema.org/OutOfStock"}}}),h(`
    <main>
      <section class="product-page">
        <div class="product-media"><img src="${i(a.image_url)}" alt="${i(a.name)}" /></div>
        <div class="product-detail">
          <a class="breadcrumb" href="/category/${a.category_slug}" data-link>${i(a.category_name)}</a>
          <h1>${i(a.name)}</h1>
          <p>${i(a.description||"")}</p>
          <div class="price-box">
            <strong>${p(a.retail_price)}</strong>
            <span>Опт: ${p(a.wholesale_price)}</span>
            <span>Залишок: ${a.stock_quantity} шт</span>
          </div>
          <button class="add-btn wide" data-add="${a.id}" ${a.stock_quantity<=0?"disabled":""}>Додати до кошика</button>
        </div>
      </section>
    </main>
  `)):U()}function U(){return f({title:"Сторінку не знайдено - Столиця Пак",description:"Сторінку не знайдено."}),h('<main><section class="page-head"><h1>Сторінку не знайдено</h1><a class="primary" href="/" data-link>На головну</a></section></main>')}function nt(){return`
    <section class="section categories">
      <div class="section-title">
        <div><span class="eyebrow">Каталог</span><h2>Категорії товарів</h2></div>
      </div>
      <div class="category-grid">
        ${r.categories.map(t=>`
          <a class="category-card" href="/category/${t.slug}" data-link>
            <img src="${i(t.image_url)}" alt="${i(t.name)}" loading="lazy" />
            <span>${c("box")}${i(t.name)}</span>
          </a>
        `).join("")}
      </div>
    </section>
  `}function L(){var a;const t=at();return`
    <section class="section catalog" id="catalog">
      <div class="section-title with-tools">
        <div>
          <span class="eyebrow">Вітрина</span>
          <h2>${r.filters.category?i(((a=r.categories.find(e=>e.slug===r.filters.category))==null?void 0:a.name)||"Товари"):"Всі товари"}</h2>
          <p>${t.length} товарів знайдено</p>
        </div>
        <div class="tools">
          <label class="search"><span>${c("search")}Пошук</span><input data-filter="q" type="search" placeholder="Назва, SKU, категорія" value="${i(r.filters.q)}" /></label>
          <select data-filter="category" aria-label="Категорія">
            <option value="">Усі категорії</option>
            ${r.categories.map(e=>`<option value="${e.slug}" ${r.filters.category===e.slug?"selected":""}>${i(e.name)}</option>`).join("")}
          </select>
          <select data-filter="sort" aria-label="Сортування">
            <option value="featured" ${r.filters.sort==="featured"?"selected":""}>Спочатку популярні</option>
            <option value="price-asc" ${r.filters.sort==="price-asc"?"selected":""}>Ціна зростає</option>
            <option value="price-desc" ${r.filters.sort==="price-desc"?"selected":""}>Ціна спадає</option>
          </select>
          <label class="check"><input type="checkbox" data-filter="inStock" ${r.filters.inStock?"checked":""} /> В наявності</label>
        </div>
      </div>
      <div class="product-grid">
        ${t.length?t.map(st).join(""):'<div class="no-results">Нічого не знайдено.</div>'}
      </div>
    </section>
  `}function st(t){return`
    <article class="product-card">
      <a href="/product/${t.slug}" data-link class="quick-view">
        <img src="${i(t.image_url)}" alt="${i(t.name)}" loading="lazy" />
      </a>
      <div class="product-info">
        <span class="badge">${c("check")}${t.stock_quantity>0?"В наявності":"Немає"}</span>
        <h3><a href="/product/${t.slug}" data-link>${i(t.name)}</a></h3>
        <p>${i(t.description||"")}</p>
        <div class="product-bottom">
          <div><strong>${p(t.retail_price)}</strong><span>Опт: ${p(t.wholesale_price)}</span></div>
          <button class="add-btn" data-add="${t.id}" ${t.stock_quantity<=0?"disabled":""}>${c("cart")}До кошика</button>
        </div>
      </div>
    </article>
  `}function ot(){return`
    <section class="info-grid" id="delivery">
      <article>${c("truck")}<span class="eyebrow">Доставка</span><h2>Нова Пошта по Україні</h2><p>На етапі MVP клієнт вводить місто та відділення вручну. Інтеграція API Нової Пошти підготовлена як майбутній adapter.</p></article>
      <article id="payment">${c("card")}<span class="eyebrow">Оплата</span><h2>Підтвердження менеджером</h2><p>Онлайн-оплата поки не підключена. Замовлення зберігається в адмін-панелі, менеджер підтверджує оплату та доставку телефоном.</p></article>
    </section>
  `}function b(){const t=document.querySelector("[data-cart-panel]"),a=r.cart.reduce((s,u)=>s+u.quantity,0),e=document.querySelector("[data-cart-count]");if(e&&(e.textContent=String(a)),!t)return;const n=Y(),o=n.reduce((s,u)=>s+u.retail_price*u.quantity,0);t.innerHTML=`
    <div class="cart-head"><div><span>Кошик</span><strong>${p(o)}</strong></div><button class="icon-btn" data-close-cart>${c("close")}</button></div>
    ${n.length?`
      <div class="cart-list">
        ${n.map(s=>`
          <div class="cart-item">
            <img src="${i(s.image_url)}" alt="${i(s.name)}" />
            <div>
              <strong>${i(s.name)}</strong>
              <span>${p(s.retail_price)}</span>
              <div class="qty">
                <button data-qty="${s.id}" data-delta="-1">-</button>
                <input data-qty-input="${s.id}" value="${s.quantity}" inputmode="numeric" />
                <button data-qty="${s.id}" data-delta="1">+</button>
                <button class="remove" data-remove="${s.id}">Видалити</button>
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
        <button type="submit">${c("check")}Оформити замовлення</button>
      </form>
    `:'<div class="empty">Кошик порожній.</div>'}
  `}async function F(){f({title:"Адмін-панель - Столиця Пак",description:"Керування товарами, категоріями, баннерами та замовленнями."});const t=await d.get("/api/admin/session");if(r.adminAuthenticated=t.authenticated,!r.adminAuthenticated){I();return}await V(),document.querySelector("#app").innerHTML=h(`
    <main class="admin">
      <section class="page-head"><span class="eyebrow">MVP admin</span><h1>Адмін-панель</h1><p>Керуйте товарами, категоріями, баннерами та замовленнями.</p><button class="secondary admin-logout" data-admin-logout>Вийти</button></section>
      <nav class="admin-tabs">
        <button data-admin-tab="products">Товари</button>
        <button data-admin-tab="categories">Категорії</button>
        <button data-admin-tab="banners">Баннери</button>
        <button data-admin-tab="orders">Замовлення</button>
        <button data-admin-tab="import">Імпорт</button>
      </nav>
      <section data-admin-content>${w()}</section>
    </main>
  `),b()}async function V(){const[t,a,e,n,o]=await Promise.all([d.get("/api/admin/products"),d.get("/api/admin/categories"),d.get("/api/admin/banners"),d.get("/api/admin/orders"),d.get("/api/admin/imports")]);r.admin.products=t.items,r.admin.categories=a.items,r.admin.banners=e.items,r.admin.orders=n.items,r.admin.imports=o.items}function w(t={}){return`
    <div class="admin-grid">
      <form class="admin-form" data-product-form data-id="${t.id||""}">
        <h2>${t.id?"Редагувати товар":"Новий товар"}</h2>
        ${l("name","Назва",t.name,!0)}
        ${l("sku","SKU",t.sku)}
        ${l("slug","Slug",t.slug)}
        <label>Категорія<select name="category_id" required>${r.admin.categories.map(a=>`<option value="${a.id}" ${Number(t.category_id)===Number(a.id)?"selected":""}>${i(a.name)}</option>`).join("")}</select></label>
        <label>Опис<textarea name="description">${i(t.description||"")}</textarea></label>
        ${l("retail_price","Роздрібна ціна",t.retail_price||0,!0,"number")}
        ${l("wholesale_price","Оптова ціна",t.wholesale_price||0,!1,"number")}
        ${l("stock_quantity","Залишок",t.stock_quantity||0,!1,"number")}
        ${P("image_url",t.image_url)}
        <label class="check"><input name="active" type="checkbox" ${t.active??!0?"checked":""} /> Активний</label>
        <label class="check"><input name="featured" type="checkbox" ${t.featured?"checked":""} /> Популярний</label>
        ${l("seo_title","SEO title",t.seo_title)}
        <label>SEO description<textarea name="seo_description">${i(t.seo_description||"")}</textarea></label>
        <button type="submit">Зберегти товар</button>
      </form>
      <div class="admin-list">
        ${r.admin.products.map(a=>`
          <div class="admin-row">
            <img src="${i(a.image_url)}" alt="" />
            <div><strong>${i(a.name)}</strong><span>${i(a.sku||"")} · ${p(a.retail_price)} · ${a.stock_quantity} шт</span></div>
            <button data-edit-product="${a.id}">Редагувати</button>
            <button data-delete-product="${a.id}">Видалити</button>
          </div>
        `).join("")}
      </div>
    </div>
  `}function S(t={}){return`
    <div class="admin-grid">
      <form class="admin-form" data-category-form data-id="${t.id||""}">
        <h2>${t.id?"Редагувати категорію":"Нова категорія"}</h2>
        ${l("name","Назва",t.name,!0)}
        ${l("slug","Slug",t.slug)}
        <label>Опис<textarea name="description">${i(t.description||"")}</textarea></label>
        ${P("image_url",t.image_url)}
        ${l("sort_order","Сортування",t.sort_order||0,!1,"number")}
        <label class="check"><input name="active" type="checkbox" ${t.active??!0?"checked":""} /> Активна</label>
        <button type="submit">Зберегти категорію</button>
      </form>
      <div class="admin-list">${r.admin.categories.map(a=>`
        <div class="admin-row"><img src="${i(a.image_url)}" alt="" /><div><strong>${i(a.name)}</strong><span>${i(a.slug)}</span></div><button data-edit-category="${a.id}">Редагувати</button><button data-delete-category="${a.id}">Видалити</button></div>
      `).join("")}</div>
    </div>
  `}function x(t={}){return`
    <div class="admin-grid">
      <form class="admin-form" data-banner-form data-id="${t.id||""}">
        <h2>${t.id?"Редагувати баннер":"Новий баннер"}</h2>
        ${l("title","Заголовок",t.title,!0)}
        <label>Підзаголовок<textarea name="subtitle">${i(t.subtitle||"")}</textarea></label>
        ${P("image_url",t.image_url)}
        ${l("link_url","Посилання",t.link_url||"#catalog")}
        ${l("button_text","Текст кнопки",t.button_text||"До каталогу")}
        ${l("sort_order","Сортування",t.sort_order||0,!1,"number")}
        <label class="check"><input name="active" type="checkbox" ${t.active??!0?"checked":""} /> Активний</label>
        <button type="submit">Зберегти баннер</button>
      </form>
      <div class="admin-list">${r.admin.banners.map(a=>`
        <div class="admin-row"><img src="${i(a.image_url)}" alt="" /><div><strong>${i(a.title)}</strong><span>${i(a.subtitle||"")}</span></div><button data-edit-banner="${a.id}">Редагувати</button><button data-delete-banner="${a.id}">Видалити</button></div>
      `).join("")}</div>
    </div>
  `}function J(){return`
    <div class="admin-list orders">
      ${r.admin.orders.length?r.admin.orders.map(t=>`
        <div class="order-card">
          <div class="order-head">
            <strong>Замовлення #${t.id} · ${p(t.total)}</strong>
            <select data-order-status="${t.id}">
              ${["new","processing","packed","sent","done","cancelled"].map(a=>`<option value="${a}" ${t.status===a?"selected":""}>${a}</option>`).join("")}
            </select>
          </div>
          <p>${i(t.customer_name)} · ${i(t.phone)} · ${i(t.city)} · ${i(t.nova_poshta_branch)}</p>
          <ul>${t.items.map(a=>`<li>${i(a.name)} x ${a.quantity} = ${p(a.total)}</li>`).join("")}</ul>
          ${t.comment?`<p>Коментар: ${i(t.comment)}</p>`:""}
        </div>
      `).join(""):'<div class="empty">Замовлень ще немає.</div>'}
    </div>
  `}function K(){return`
    <form class="admin-form import-form" data-import-form>
      <h2>Імпорт товарів CSV/XLSX</h2>
      <p>Поля: category_slug, category_name, sku, slug, name, description, retail_price, wholesale_price, stock_quantity, image_url, active, featured, seo_title, seo_description.</p>
      <input type="file" name="file" accept=".csv,.xlsx" required />
      <button type="submit">Імпортувати</button>
    </form>
    <div class="admin-list">${r.admin.imports.map(t=>`<div class="admin-row"><div><strong>${i(t.filename)}</strong><span>${t.status}: ${t.rows_success}/${t.rows_total}, помилок ${t.rows_failed}</span></div></div>`).join("")}</div>
  `}function l(t,a,e="",n=!1,o="text"){return`<label>${a}<input name="${t}" type="${o}" value="${i(e??"")}" ${n?"required":""} /></label>`}function P(t,a=""){return`<label>Зображення<input name="${t}" value="${i(a||"")}" placeholder="/uploads/image.webp або https://..." /></label><label>Завантажити файл<input type="file" data-upload-target="${t}" accept="image/*" /></label>`}function y(t){const a=Object.fromEntries(new FormData(t).entries());return t.querySelectorAll('input[type="checkbox"]').forEach(e=>a[e.name]=e.checked),a}async function m(t="products"){await M(),await V();const a=document.querySelector("[data-admin-content]");a&&(a.innerHTML=t==="categories"?S():t==="banners"?x():t==="orders"?J():t==="import"?K():w())}function _(t){const a=document.querySelector("[data-toast]");a&&(a.textContent=t,a.classList.add("show"),setTimeout(()=>a.classList.remove("show"),1800))}async function ct(t){const e={...y(t),items:r.cart.map(o=>({product_id:o.product_id,quantity:o.quantity}))},n=await d.send("/api/orders","POST",e);r.cart=[],k(),document.querySelector("[data-cart-drawer]").classList.remove("open"),await M(),q(),_(`Замовлення #${n.id} збережено`)}async function q(){r.products.length||await M();const t=R();if(r.filters.category="",t==="/admin")return F();t.startsWith("/category/")?document.querySelector("#app").innerHTML=rt(t.split("/").pop()):t.startsWith("/product/")?document.querySelector("#app").innerHTML=it(t.split("/").pop()):document.querySelector("#app").innerHTML=et(),b()}document.addEventListener("click",async t=>{var H,B,z;const a=t.target.closest("[data-link]"),e=t.target.closest("[data-add]"),n=t.target.closest("[data-open-cart]"),o=t.target.closest("[data-close-cart]"),s=t.target.closest("[data-qty]"),u=t.target.closest("[data-remove]"),T=t.target.closest("[data-admin-tab]"),W=t.target.closest("[data-menu]"),X=t.target.closest("[data-admin-logout]");if(a&&((H=a.getAttribute("href"))!=null&&H.startsWith("/"))&&(t.preventDefault(),Q(a.getAttribute("href"))),e&&Z(Number(e.dataset.add)),n&&document.querySelector("[data-cart-drawer]").classList.add("open"),o&&document.querySelector("[data-cart-drawer]").classList.remove("open"),W&&((B=document.querySelector("[data-nav]"))==null||B.classList.toggle("open")),X&&(await d.send("/api/admin/logout","POST",{}),r.adminAuthenticated=!1,I()),s){const g=((z=r.cart.find(G=>Number(G.product_id)===Number(s.dataset.qty)))==null?void 0:z.quantity)||1;D(Number(s.dataset.qty),g+Number(s.dataset.delta))}if(u&&tt(Number(u.dataset.remove)),T){const g=T.dataset.adminTab;document.querySelector("[data-admin-content]").innerHTML=g==="categories"?S():g==="banners"?x():g==="orders"?J():g==="import"?K():w()}const C=t.target.closest("[data-edit-product]"),N=t.target.closest("[data-edit-category]"),A=t.target.closest("[data-edit-banner]"),E=t.target.closest("[data-delete-product]"),O=t.target.closest("[data-delete-category]"),j=t.target.closest("[data-delete-banner]");C&&(document.querySelector("[data-admin-content]").innerHTML=w(v(r.admin.products,C.dataset.editProduct))),N&&(document.querySelector("[data-admin-content]").innerHTML=S(v(r.admin.categories,N.dataset.editCategory))),A&&(document.querySelector("[data-admin-content]").innerHTML=x(v(r.admin.banners,A.dataset.editBanner))),E&&confirm("Видалити товар?")&&(await d.send(`/api/admin/products/${E.dataset.deleteProduct}`,"DELETE",{}),await m("products")),O&&confirm("Видалити категорію?")&&(await d.send(`/api/admin/categories/${O.dataset.deleteCategory}`,"DELETE",{}),await m("categories")),j&&confirm("Видалити баннер?")&&(await d.send(`/api/admin/banners/${j.dataset.deleteBanner}`,"DELETE",{}),await m("banners"))});document.addEventListener("input",t=>{if(t.target.matches("[data-filter]")){const a=t.target.dataset.filter;r.filters[a]=t.target.type==="checkbox"?t.target.checked:t.target.value;const e=document.querySelector(".catalog");e&&(e.outerHTML=L())}t.target.matches("[data-qty-input]")&&D(Number(t.target.dataset.qtyInput),t.target.value)});document.addEventListener("change",async t=>{if(t.target.matches("[data-upload-target]")&&t.target.files[0]){const a=await d.upload("/api/admin/upload","image",t.target.files[0]);t.target.closest("form").querySelector(`[name="${t.target.dataset.uploadTarget}"]`).value=a.url}t.target.matches("[data-order-status]")&&(await d.send(`/api/admin/orders/${t.target.dataset.orderStatus}`,"PUT",{status:t.target.value}),await m("orders"))});document.addEventListener("submit",async t=>{t.preventDefault();try{if(t.target.matches("[data-admin-login]")){const a=y(t.target);await d.send("/api/admin/login","POST",{password:a.password}),r.adminAuthenticated=!0,await F();return}if(t.target.matches("[data-checkout]")&&await ct(t.target),t.target.matches("[data-product-form]")){const a=t.target.dataset.id;await d.send(a?`/api/admin/products/${a}`:"/api/admin/products","PUT",y(t.target)),await m("products")}if(t.target.matches("[data-category-form]")){const a=t.target.dataset.id;await d.send(a?`/api/admin/categories/${a}`:"/api/admin/categories","PUT",y(t.target)),await m("categories")}if(t.target.matches("[data-banner-form]")){const a=t.target.dataset.id;await d.send(a?`/api/admin/banners/${a}`:"/api/admin/banners","PUT",y(t.target)),await m("banners")}if(t.target.matches("[data-import-form]")){const a=t.target.file.files[0],e=await d.upload("/api/admin/import","file",a);_(`Імпортовано ${e.rows_success} рядків`),await m("import")}}catch(a){_(a.message)}});window.addEventListener("popstate",q);q().catch(t=>{document.querySelector("#app").innerHTML=`<main class="page-head"><h1>Помилка запуску</h1><p>${i(t.message)}</p></main>`});
