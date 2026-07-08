(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function e(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=e(o);fetch(o.href,n)}})();const l={async get(t){const a=await fetch(t);if(!a.ok)throw new Error((await a.json()).error||"API error");return a.json()},async send(t,a,e){const i=await fetch(t,{method:a,headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),o=await i.json();if(!i.ok)throw new Error(o.error||"API error");return o},async upload(t,a,e){const i=new FormData;i.append(a,e);const o=await fetch(t,{method:"POST",body:i}),n=await o.json();if(!o.ok)throw new Error(n.error||"Upload error");return n}},r={categories:[],products:[],banners:[],cart:JSON.parse(localStorage.getItem("stolitsya-pack-cart")||"[]"),filters:{q:"",category:"",sort:"featured",inStock:!1},admin:{products:[],categories:[],banners:[],orders:[],imports:[]},adminAuthenticated:!1},rt=12,p=t=>`${Number(t||0).toFixed(2)} грн`,_=(t,a)=>t.find(e=>Number(e.id)===Number(a)),s=(t="")=>String(t).replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[a]),m=(t=location.pathname)=>`${location.origin}${t}`,it=(t="",a=80)=>{const e=String(t).replace(/\s+/g," ").trim();return e.length>a?`${e.slice(0,a-1).trim()}…`:e},c=t=>{const a={menu:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',catalog:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z"/></svg>',truck:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',card:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3zM3 10h18M7 15h4"/></svg>',admin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 4v5c0 4-3 7-7 9-4-2-7-5-7-9V7z"/><path d="M9 12l2 2 4-5"/></svg>',cart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2l2 10h10l2-7H7"/><circle cx="10" cy="19" r="1.8"/><circle cx="17" cy="19" r="1.8"/></svg>',search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/></svg>',box:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8l8-4 8 4-8 4zM4 8v8l8 4 8-4V8M12 12v8"/></svg>',check:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',phone:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l4 4-2 2c2 4 4 6 8 8l2-2 4 4-2 2C10 21 3 14 2 6z"/></svg>',arrow:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',percent:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 5L5 19"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/></svg>',shield:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 4v5c0 4-3 7-7 9-4-2-7-5-7-9V7z"/></svg>',message:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v12H8l-4 4z"/></svg>',instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3"/><path d="M17 7h.01"/></svg>',video:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 8v8l6-4z"/><rect x="3" y="5" width="18" height="14" rx="3"/></svg>'};return`<span class="ui-icon">${a[t]||a.box}</span>`};function S(){return{"@context":"https://schema.org","@type":"Organization",name:"Столиця Пак",url:location.origin,logo:`${location.origin}/uploads/brand/logo.png`,telephone:["+380501308187","+380731308187"],email:"solodovnik.ak@gmail.com",address:{"@type":"PostalAddress",addressLocality:"Київ",streetAddress:"вул. Тепловозна 18",addressCountry:"UA"}}}function D(t){return{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:t.map((a,e)=>({"@type":"ListItem",position:e+1,name:a.name,item:a.url}))}}function x(){localStorage.setItem("stolitsya-pack-cart",JSON.stringify(r.cart))}function v({title:t,description:a,url:e,image:i,product:o}){document.title=t,y("description",a),y("og:title",t,"property"),y("og:description",a,"property"),y("og:url",e||location.href,"property"),i&&y("og:image",i,"property");let n=document.head.querySelector('link[rel="canonical"]');n||(n=document.createElement("link"),n.setAttribute("rel","canonical"),document.head.appendChild(n)),n.setAttribute("href",e||location.href),document.head.querySelectorAll('script[type="application/ld+json"]:not(#dynamic-jsonld)').forEach(w=>w.remove());const d=document.querySelector("#dynamic-jsonld")||document.createElement("script");d.id="dynamic-jsonld",d.type="application/ld+json",d.textContent=JSON.stringify(o||S()),document.head.appendChild(d)}function y(t,a,e="name"){let i=document.head.querySelector(`meta[${e}="${t}"]`);i||(i=document.createElement("meta"),i.setAttribute(e,t),document.head.appendChild(i)),i.setAttribute("content",a)}function nt(){return location.pathname.replace(/\/+$/,"")||"/"}function st(t){history.pushState({},"",t),M()}function X(){return r.cart.map(t=>{const a=_(r.products,t.product_id);return a?{...a,quantity:t.quantity}:null}).filter(Boolean)}function ot(t,a=1){const e=_(r.products,t);if(!e||!e.active||e.stock_quantity<=0)return;const i=r.cart.find(o=>Number(o.product_id)===Number(t));i?i.quantity+=a:r.cart.push({product_id:Number(t),quantity:a}),x(),b(),k("Товар додано до кошика")}function F(t,a){r.cart=r.cart.map(e=>Number(e.product_id)===Number(t)?{...e,quantity:Math.max(1,Number(a)||1)}:e),x(),b()}function ct(t){r.cart=r.cart.filter(a=>Number(a.product_id)!==Number(t)),x(),b()}function W(t=""){return String(t).replace(/\D/g,"")}function J(t=""){let a=W(t);a.startsWith("380")||a.startsWith("38")?a=a.slice(2):a.startsWith("80")&&(a=a.slice(1)),a=a.slice(0,10);const e=["+38"];return a.length&&e.push(` (${a.slice(0,3)}`),a.length>=3&&(e[1]+=")"),a.length>3&&e.push(` ${a.slice(3,6)}`),a.length>6&&e.push(`-${a.slice(6,8)}`),a.length>8&&e.push(`-${a.slice(8,10)}`),e.join("")}function dt(t){const a=X(),e=f(t),i=[];return a.length||i.push("Кошик порожній. Додайте товар перед оформленням."),String(e.name||"").trim()||i.push("Вкажіть ім'я."),W(e.phone).length<12&&i.push("Вкажіть телефон у форматі +38 (0XX) XXX-XX-XX."),String(e.city||"").trim()||i.push("Вкажіть місто."),String(e.nova_poshta_branch||"").trim()||i.push("Вкажіть відділення Нової Пошти."),i}function lt(){const t=r.filters.q.toLocaleLowerCase("uk-UA").trim();let a=r.products.filter(e=>{const i=!r.filters.category||e.category_slug===r.filters.category,o=!t||`${e.name} ${e.description} ${e.sku} ${e.category_name}`.toLocaleLowerCase("uk-UA").includes(t),n=!r.filters.inStock||e.stock_quantity>0;return e.active&&i&&o&&n});return r.filters.sort==="price-asc"&&(a=[...a].sort((e,i)=>e.retail_price-i.retail_price)),r.filters.sort==="price-desc"&&(a=[...a].sort((e,i)=>i.retail_price-e.retail_price)),a}function ut(){const t=r.products.filter(n=>n.active),a=t.filter(n=>n.featured&&n.stock_quantity>0),e=t.filter(n=>!n.featured&&n.stock_quantity>0),i=t.filter(n=>n.featured&&n.stock_quantity<=0),o=t.filter(n=>!n.featured&&n.stock_quantity<=0);return[...a,...e,...i,...o].slice(0,rt)}async function P(){const t=await l.get("/api/bootstrap");r.categories=t.categories,r.products=t.products,r.banners=t.banners}function $(t){const a=r.cart.reduce((i,o)=>i+o.quantity,0),e=r.categories.slice(0,9);return`
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
        ${e.map(i=>`<a href="/category/${i.slug}" data-link>${s(i.name)}</a>`).join("")}
      </div>
      <div class="footer-column">
        <h3>Доставка і оплата</h3>
        <a href="/#delivery" data-link>Доставка по Україні</a>
        <a href="/#payment" data-link>Оплата після підтвердження</a>
        <a href="/feeds/google.xml" target="_blank">Google Merchant feed</a>
        <a href="/feeds/products.xml" target="_blank">XML feed</a>
        <div class="socials" aria-label="Соціальні мережі">
          <a href="tel:+380501308187" aria-label="Telegram">${c("message")}Telegram</a>
          <a href="mailto:solodovnik.ak@gmail.com" aria-label="Instagram">${c("instagram")}Instagram</a>
          <a href="mailto:solodovnik.ak@gmail.com" aria-label="TikTok">${c("video")}TikTok</a>
        </div>
      </div>
    </footer>
    <aside class="cart-drawer" data-cart-drawer><div class="cart-panel" data-cart-panel></div></aside>
    <div class="toast" data-toast></div>
  `}function V(t=""){v({title:"Вхід в адмін-панель - Столиця Пак",description:"Вхід в адмін-панель магазину."}),document.querySelector("#app").innerHTML=$(`
    <main class="admin-login">
      <form class="admin-form login-card" data-admin-login>
        <span class="eyebrow">Адмін-панель</span>
        <h1>Вхід</h1>
        <p>Введіть пароль адміністратора, щоб керувати товарами, категоріями, баннерами та замовленнями.</p>
        ${t?`<div class="form-error">${s(t)}</div>`:""}
        <label>Пароль<input name="password" type="password" required autocomplete="current-password" /></label>
        <button type="submit">Увійти</button>
      </form>
    </main>
  `),b()}function pt(){const t=r.banners[0]||{};return v({title:"Столиця Пак - пакети від виробника оптом і в роздріб по Україні",description:"Пакети від виробника для магазинів, кафе та бізнесу. Опт і роздріб, актуальні залишки, швидке оформлення замовлення та доставка по Україні.",url:m("/"),image:t.image_url,product:{"@context":"https://schema.org","@graph":[S(),{"@type":"WebSite",name:"Столиця Пак",url:location.origin,potentialAction:{"@type":"SearchAction",target:`${location.origin}/?q={search_term_string}`,"query-input":"required name=search_term_string"}}]}}),$(`
    <main>
      <section class="hero" style="--hero-image:url('${s(t.image_url||"")}')">
        <div class="hero-copy">
          <span class="eyebrow">Столиця Пак</span>
          <h1>Пакеты от производителя — опт и розница по Украине</h1>
          <p>Поліетиленові пакети, фасування, пакети з логотипом, посуд і господарські товари для бізнесу.</p>
          <div class="hero-badges">
            <span>${c("box")}Власний каталог із наявністю</span>
            <span>${c("percent")}Оптові ціни для бізнесу</span>
            <span>${c("truck")}Відправка по всій Україні</span>
          </div>
          <div class="hero-actions">
            <a class="primary" href="#categories" data-link>${c("catalog")}Перейти в каталог</a>
            <a class="secondary" href="tel:+380501308187">${c("phone")}Связаться</a>
          </div>
        </div>
        <div class="hero-panel">
          <div>${c("box")}<strong>${r.products.filter(a=>a.active).length}</strong><span>товарів у каталозі</span></div>
          <div>${c("catalog")}<strong>${r.categories.length}</strong><span>категорій</span></div>
          <div>${c("truck")}<strong>1-2 дні</strong><span>обробка замовлення</span></div>
        </div>
      </section>
      ${vt()}
      ${ht()}
      ${ft()}
      ${$t()}
    </main>
  `)}function mt(t){r.filters.category=t;const a=r.categories.find(e=>e.slug===t);return a?(v({title:`${a.name} - купити в Україні | Столиця Пак`,description:a.description||`Категорія ${a.name} в інтернет-магазині Столиця Пак.`,url:m(`/category/${a.slug}`),image:a.image_url,product:{"@context":"https://schema.org","@graph":[S(),D([{name:"Головна",url:m("/")},{name:a.name,url:m(`/category/${a.slug}`)}])]}}),$(`
    <main>
      <section class="page-head category-head">
        <div>
          <span class="eyebrow">Категорія</span>
          <h1>${s(a.name)}</h1>
          <p>${s(a.description||"")}</p>
        </div>
        <img src="${s(a.image_url)}" alt="${s(a.name)}" loading="lazy" />
      </section>
      ${R()}
    </main>
  `)):K()}function gt(t){const a=r.products.find(i=>i.slug===t);if(!a)return K();v({title:a.seo_title||`${a.name} - Столиця Пак`,description:a.seo_description||a.description,url:m(`/product/${a.slug}`),image:a.image_url,product:{"@context":"https://schema.org","@graph":[S(),D([{name:"Головна",url:m("/")},{name:a.category_name,url:m(`/category/${a.category_slug}`)},{name:a.name,url:m(`/product/${a.slug}`)}]),{"@type":"Product",name:a.name,sku:a.sku,image:a.image_url,description:a.description,brand:{"@type":"Brand",name:"Столиця Пак"},offers:{"@type":"Offer",priceCurrency:"UAH",price:a.retail_price,availability:a.stock_quantity>0?"https://schema.org/InStock":"https://schema.org/OutOfStock",url:m(`/product/${a.slug}`)}}]}});const e=r.products.filter(i=>i.active&&i.category_slug===a.category_slug&&i.id!==a.id).slice(0,4);return $(`
    <main>
      <section class="product-page">
        <div class="product-media"><img src="${s(a.image_url)}" alt="${s(a.name)}" loading="lazy" /></div>
        <div class="product-detail">
          <a class="breadcrumb" href="/category/${a.category_slug}" data-link>${s(a.category_name)}</a>
          <h1>${s(a.name)}</h1>
          <p class="lead">${s(a.description||"Якісна упаковка для щоденної роботи бізнесу та роздрібних покупців.")}</p>
          <div class="price-box">
            <strong>${p(a.retail_price)}</strong>
            <span>Опт: ${p(a.wholesale_price)}</span>
            <span>Залишок: ${a.stock_quantity} шт</span>
          </div>
          <button class="add-btn wide" data-add="${a.id}" ${a.stock_quantity<=0?"disabled":""}>${c("cart")}Додати до кошика</button>
          <section class="product-service-block" aria-labelledby="product-service-title">
            <h2 id="product-service-title">Доставка / Оплата / Опт</h2>
            <div class="commerce-notes">
            <article>${c("truck")}<strong>Доставка</strong><span>Відправляємо по Україні після підтвердження менеджером.</span></article>
            <article>${c("card")}<strong>Оплата</strong><span>Оплата узгоджується телефоном після оформлення замовлення.</span></article>
            <article>${c("percent")}<strong>Опт</strong><span>Для оптових покупців діє окрема ціна: ${p(a.wholesale_price)}.</span></article>
            </div>
          </section>
          <div class="specs">
            <h2>Характеристики</h2>
            <dl>
              <div><dt>SKU</dt><dd>${s(a.sku||"-")}</dd></div>
              <div><dt>Категорія</dt><dd>${s(a.category_name)}</dd></div>
              <div><dt>Роздрібна ціна</dt><dd>${p(a.retail_price)}</dd></div>
              <div><dt>Оптова ціна</dt><dd>${p(a.wholesale_price)}</dd></div>
              <div><dt>Наявність</dt><dd>${a.stock_quantity>0?`${a.stock_quantity} шт`:"Немає в наявності"}</dd></div>
            </dl>
          </div>
        </div>
      </section>
      ${e.length?`
        <section class="section related-products">
          <div class="section-title">
            <div><span class="eyebrow">Схожі товари</span><h2>Ще з цієї категорії</h2></div>
          </div>
          <div class="product-grid">${e.map(A).join("")}</div>
        </section>
      `:""}
    </main>
  `)}function K(){return v({title:"Сторінку не знайдено - Столиця Пак",description:"Сторінку не знайдено."}),$('<main><section class="page-head"><h1>Сторінку не знайдено</h1><a class="primary" href="/" data-link>На головну</a></section></main>')}function ht(){return`
    <section class="section categories" id="categories">
      <div class="section-title">
        <div><span class="eyebrow">Каталог</span><h2>Популярні категорії упаковки</h2><p>Швидко оберіть потрібний напрям: пакети майка, фасування, рулони, посуд або господарські товари.</p></div>
      </div>
      <div class="category-grid">
        ${r.categories.map(t=>`
          <a class="category-card" href="/category/${t.slug}" data-link>
            <img src="${s(t.image_url)}" alt="${s(t.name)}" loading="lazy" />
            <span class="category-card-body">
              <strong>${s(t.name)}</strong>
              <small>${s(it(t.description||"Товари в наявності для опту та роздробу.",72))}</small>
              <em>Переглянути ${c("arrow")}</em>
            </span>
          </a>
        `).join("")}
      </div>
      <div class="category-seo">
        <h2>Упаковка для магазинів, кафе та виробництв</h2>
        <p>У каталозі зібрані основні категорії пакувальних матеріалів Столиця Пак: пакети майка, фасувальні пакети, пакети в рулонах, пакети з логотипом, господарські товари, одноразовий посуд, рукавички та сміттєві пакети. Обирайте категорію, переглядайте ціни й залишки та оформлюйте замовлення через кошик.</p>
      </div>
    </section>
  `}function ft(){const t=ut();return`
    <section class="section catalog featured-catalog" id="catalog">
      <div class="section-title with-tools">
        <div>
          <span class="eyebrow">Популярне</span>
          <h2>Популярні товари</h2>
          <p>Показуємо 12 позицій для швидкого замовлення. Повний каталог доступний у категоріях.</p>
        </div>
        <a class="primary section-action" href="#categories" data-link>${c("catalog")}Перейти в каталог</a>
      </div>
      <div class="product-grid">
        ${t.map(A).join("")}
      </div>
    </section>
  `}function vt(){return`
    <section class="benefits" aria-label="Переваги">
      <article>${c("shield")}<strong>Надійна упаковка</strong><span>Підбираємо товари для магазинів, складів, кафе та виробництв.</span></article>
      <article>${c("percent")}<strong>Опт і роздріб</strong><span>У картці товару одразу видно роздрібну та оптову ціну.</span></article>
      <article>${c("truck")}<strong>Доставка по Україні</strong><span>Замовлення зберігається в системі, менеджер швидко уточнює деталі.</span></article>
      <article>${c("check")}<strong>120 товарів</strong><span>Актуальний каталог з категоріями, цінами, залишками та фото.</span></article>
    </section>
  `}function R(){var a;const t=lt();return`
    <section class="section catalog" id="catalog">
      <div class="section-title with-tools">
        <div>
          <span class="eyebrow">Вітрина</span>
          <h2>${r.filters.category?s(((a=r.categories.find(e=>e.slug===r.filters.category))==null?void 0:a.name)||"Товари"):"Всі товари"}</h2>
          <p>${t.length} товарів знайдено</p>
        </div>
        <div class="tools">
          <label class="search"><span>${c("search")}Пошук</span><input data-filter="q" type="search" placeholder="Назва, SKU, категорія" value="${s(r.filters.q)}" /></label>
          <select data-filter="category" aria-label="Категорія">
            <option value="">Усі категорії</option>
            ${r.categories.map(e=>`<option value="${e.slug}" ${r.filters.category===e.slug?"selected":""}>${s(e.name)}</option>`).join("")}
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
        ${t.length?t.map(A).join(""):'<div class="no-results">Нічого не знайдено.</div>'}
      </div>
    </section>
  `}function A(t){return`
    <article class="product-card">
      <a href="/product/${t.slug}" data-link class="quick-view">
        <img src="${s(t.image_url)}" alt="${s(t.name)}" loading="lazy" />
      </a>
      <div class="product-info">
        <span class="badge">${c("check")}${t.stock_quantity>0?"В наявності":"Немає"}</span>
        <h3><a href="/product/${t.slug}" data-link>${s(t.name)}</a></h3>
        <p>${s(t.description||"")}</p>
        <div class="product-bottom">
          <div><strong>${p(t.retail_price)}</strong><span>Опт: ${p(t.wholesale_price)}</span></div>
          <button class="add-btn" data-add="${t.id}" ${t.stock_quantity<=0?"disabled":""}>${c("cart")}До кошика</button>
        </div>
      </div>
    </article>
  `}function $t(){return`
    <section class="info-grid" id="delivery">
      <article>${c("truck")}<span class="eyebrow">Доставка</span><h2>Нова Пошта по Україні</h2><p>На етапі MVP клієнт вводить місто та відділення вручну. Інтеграція API Нової Пошти підготовлена як майбутній adapter.</p></article>
      <article id="payment">${c("card")}<span class="eyebrow">Оплата</span><h2>Підтвердження менеджером</h2><p>Онлайн-оплата поки не підключена. Замовлення зберігається в адмін-панелі, менеджер підтверджує оплату та доставку телефоном.</p></article>
    </section>
  `}function b(){const t=document.querySelector("[data-cart-panel]"),a=r.cart.reduce((n,d)=>n+d.quantity,0),e=document.querySelector("[data-cart-count]");if(e&&(e.textContent=String(a)),!t)return;const i=X(),o=i.reduce((n,d)=>n+d.retail_price*d.quantity,0);t.innerHTML=`
    <div class="cart-head"><div><span>Кошик</span><strong>${p(o)}</strong></div><button class="icon-btn" data-close-cart>${c("close")}</button></div>
    ${i.length?`
      <div class="cart-list">
        ${i.map(n=>`
          <div class="cart-item">
            <img src="${s(n.image_url)}" alt="${s(n.name)}" />
            <div>
              <strong>${s(n.name)}</strong>
              <span>${p(n.retail_price)}</span>
              <div class="qty">
                <button data-qty="${n.id}" data-delta="-1">-</button>
                <input data-qty-input="${n.id}" value="${n.quantity}" inputmode="numeric" />
                <button data-qty="${n.id}" data-delta="1">+</button>
                <button class="remove" data-remove="${n.id}">Видалити</button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
      <form class="checkout" data-checkout novalidate>
        <div class="checkout-total"><span>До сплати</span><strong>${p(o)}</strong></div>
        <div class="form-error" data-checkout-error hidden></div>
        <label>Ім'я<input required name="name" placeholder="Ваше ім'я" /></label>
        <label>Телефон<input required name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+38 (0__) ___-__-__" /></label>
        <label>Місто<input required name="city" placeholder="Київ" /></label>
        <label>Відділення Нової Пошти<input required name="nova_poshta_branch" placeholder="Відділення №..." /></label>
        <label>Коментар<textarea name="comment" placeholder="Побажання до замовлення"></textarea></label>
        <button type="submit">${c("check")}Оформити замовлення</button>
      </form>
    `:'<div class="empty">Кошик порожній.</div>'}
  `}async function G(){v({title:"Адмін-панель - Столиця Пак",description:"Керування товарами, категоріями, баннерами та замовленнями."});const t=await l.get("/api/admin/session");if(r.adminAuthenticated=t.authenticated,!r.adminAuthenticated){V();return}await Y(),document.querySelector("#app").innerHTML=$(`
    <main class="admin">
      <section class="page-head"><span class="eyebrow">MVP admin</span><h1>Адмін-панель</h1><p>Керуйте товарами, категоріями, баннерами та замовленнями.</p><button class="secondary admin-logout" data-admin-logout>Вийти</button></section>
      <nav class="admin-tabs">
        <button data-admin-tab="products">Товари</button>
        <button data-admin-tab="categories">Категорії</button>
        <button data-admin-tab="banners">Баннери</button>
        <button data-admin-tab="orders">Замовлення</button>
        <button data-admin-tab="import">Імпорт</button>
      </nav>
      <section data-admin-content>${q()}</section>
    </main>
  `),b()}async function Y(){const[t,a,e,i,o]=await Promise.all([l.get("/api/admin/products"),l.get("/api/admin/categories"),l.get("/api/admin/banners"),l.get("/api/admin/orders"),l.get("/api/admin/imports")]);r.admin.products=t.items,r.admin.categories=a.items,r.admin.banners=e.items,r.admin.orders=i.items,r.admin.imports=o.items}function q(t={}){return`
    <div class="admin-grid">
      <form class="admin-form" data-product-form data-id="${t.id||""}">
        <h2>${t.id?"Редагувати товар":"Новий товар"}</h2>
        ${u("name","Назва",t.name,!0)}
        ${u("sku","SKU",t.sku)}
        ${u("slug","Slug",t.slug)}
        <label>Категорія<select name="category_id" required>${r.admin.categories.map(a=>`<option value="${a.id}" ${Number(t.category_id)===Number(a.id)?"selected":""}>${s(a.name)}</option>`).join("")}</select></label>
        <label>Опис<textarea name="description">${s(t.description||"")}</textarea></label>
        ${u("retail_price","Роздрібна ціна",t.retail_price||0,!0,"number")}
        ${u("wholesale_price","Оптова ціна",t.wholesale_price||0,!1,"number")}
        ${u("stock_quantity","Залишок",t.stock_quantity||0,!1,"number")}
        ${C("image_url",t.image_url)}
        <label class="check"><input name="active" type="checkbox" ${t.active??!0?"checked":""} /> Активний</label>
        <label class="check"><input name="featured" type="checkbox" ${t.featured?"checked":""} /> Популярний</label>
        ${u("seo_title","SEO title",t.seo_title)}
        <label>SEO description<textarea name="seo_description">${s(t.seo_description||"")}</textarea></label>
        <button type="submit">Зберегти товар</button>
      </form>
      <div class="admin-list">
        ${r.admin.products.map(a=>`
          <div class="admin-row">
            <img src="${s(a.image_url)}" alt="" />
            <div><strong>${s(a.name)}</strong><span>${s(a.sku||"")} · ${p(a.retail_price)} · ${a.stock_quantity} шт</span></div>
            <button data-edit-product="${a.id}">Редагувати</button>
            <button data-delete-product="${a.id}">Видалити</button>
          </div>
        `).join("")}
      </div>
    </div>
  `}function L(t={}){return`
    <div class="admin-grid">
      <form class="admin-form" data-category-form data-id="${t.id||""}">
        <h2>${t.id?"Редагувати категорію":"Нова категорія"}</h2>
        ${u("name","Назва",t.name,!0)}
        ${u("slug","Slug",t.slug)}
        <label>Опис<textarea name="description">${s(t.description||"")}</textarea></label>
        ${C("image_url",t.image_url)}
        ${u("sort_order","Сортування",t.sort_order||0,!1,"number")}
        <label class="check"><input name="active" type="checkbox" ${t.active??!0?"checked":""} /> Активна</label>
        <button type="submit">Зберегти категорію</button>
      </form>
      <div class="admin-list">${r.admin.categories.map(a=>`
        <div class="admin-row"><img src="${s(a.image_url)}" alt="" /><div><strong>${s(a.name)}</strong><span>${s(a.slug)}</span></div><button data-edit-category="${a.id}">Редагувати</button><button data-delete-category="${a.id}">Видалити</button></div>
      `).join("")}</div>
    </div>
  `}function T(t={}){return`
    <div class="admin-grid">
      <form class="admin-form" data-banner-form data-id="${t.id||""}">
        <h2>${t.id?"Редагувати баннер":"Новий баннер"}</h2>
        ${u("title","Заголовок",t.title,!0)}
        <label>Підзаголовок<textarea name="subtitle">${s(t.subtitle||"")}</textarea></label>
        ${C("image_url",t.image_url)}
        ${u("link_url","Посилання",t.link_url||"#catalog")}
        ${u("button_text","Текст кнопки",t.button_text||"До каталогу")}
        ${u("sort_order","Сортування",t.sort_order||0,!1,"number")}
        <label class="check"><input name="active" type="checkbox" ${t.active??!0?"checked":""} /> Активний</label>
        <button type="submit">Зберегти баннер</button>
      </form>
      <div class="admin-list">${r.admin.banners.map(a=>`
        <div class="admin-row"><img src="${s(a.image_url)}" alt="" /><div><strong>${s(a.title)}</strong><span>${s(a.subtitle||"")}</span></div><button data-edit-banner="${a.id}">Редагувати</button><button data-delete-banner="${a.id}">Видалити</button></div>
      `).join("")}</div>
    </div>
  `}function Q(){return`
    <div class="admin-list orders">
      ${r.admin.orders.length?r.admin.orders.map(t=>`
        <div class="order-card">
          <div class="order-head">
            <strong>Замовлення #${t.id} · ${p(t.total)}</strong>
            <select data-order-status="${t.id}">
              ${["new","processing","packed","sent","done","cancelled"].map(a=>`<option value="${a}" ${t.status===a?"selected":""}>${a}</option>`).join("")}
            </select>
          </div>
          <p>${s(t.customer_name)} · ${s(t.phone)} · ${s(t.city)} · ${s(t.nova_poshta_branch)}</p>
          <ul>${t.items.map(a=>`<li>${s(a.name)} x ${a.quantity} = ${p(a.total)}</li>`).join("")}</ul>
          ${t.comment?`<p>Коментар: ${s(t.comment)}</p>`:""}
        </div>
      `).join(""):'<div class="empty">Замовлень ще немає.</div>'}
    </div>
  `}function Z(){return`
    <form class="admin-form import-form" data-import-form>
      <h2>Імпорт товарів CSV/XLSX</h2>
      <p>Поля: category_slug, category_name, sku, slug, name, description, retail_price, wholesale_price, stock_quantity, image_url, active, featured, seo_title, seo_description.</p>
      <input type="file" name="file" accept=".csv,.xlsx" required />
      <button type="submit">Імпортувати</button>
    </form>
    <div class="admin-list">${r.admin.imports.map(t=>`<div class="admin-row"><div><strong>${s(t.filename)}</strong><span>${t.status}: ${t.rows_success}/${t.rows_total}, помилок ${t.rows_failed}</span></div></div>`).join("")}</div>
  `}function u(t,a,e="",i=!1,o="text"){return`<label>${a}<input name="${t}" type="${o}" value="${s(e??"")}" ${i?"required":""} /></label>`}function C(t,a=""){return`<label>Зображення<input name="${t}" value="${s(a||"")}" placeholder="/uploads/image.webp або https://..." /></label><label>Завантажити файл<input type="file" data-upload-target="${t}" accept="image/*" /></label>`}function f(t){const a=Object.fromEntries(new FormData(t).entries());return t.querySelectorAll('input[type="checkbox"]').forEach(e=>a[e.name]=e.checked),a}async function g(t="products"){await P(),await Y();const a=document.querySelector("[data-admin-content]");a&&(a.innerHTML=t==="categories"?L():t==="banners"?T():t==="orders"?Q():t==="import"?Z():q())}function k(t,a=1800){const e=document.querySelector("[data-toast]");e&&(e.textContent=t,e.classList.add("show"),setTimeout(()=>e.classList.remove("show"),a))}async function bt(t){const a=t.querySelector("[data-checkout-error]"),e=dt(t);if(e.length){a&&(a.hidden=!1,a.innerHTML=e.map(d=>`<div>${s(d)}</div>`).join("")),k(e[0]);return}const i=f(t);i.phone=J(i.phone);const o={...i,items:r.cart.map(d=>({product_id:d.product_id,quantity:d.quantity}))},n=await l.send("/api/orders","POST",o);r.cart=[],x(),document.querySelector("[data-cart-drawer]").classList.remove("open"),await P(),M(),k(`Спасибо, заказ принят. Номер заказа #${n.id}`,5200)}async function M(){r.products.length||await P();const t=nt();if(r.filters.category="",t==="/admin")return G();t.startsWith("/category/")?document.querySelector("#app").innerHTML=mt(t.split("/").pop()):t.startsWith("/product/")?document.querySelector("#app").innerHTML=gt(t.split("/").pop()):document.querySelector("#app").innerHTML=pt(),b()}document.addEventListener("click",async t=>{var z,I,U;const a=t.target.closest("[data-link]"),e=t.target.closest("[data-add]"),i=t.target.closest("[data-open-cart]"),o=t.target.closest("[data-close-cart]"),n=t.target.closest("[data-qty]"),d=t.target.closest("[data-remove]"),w=t.target.closest("[data-admin-tab]"),tt=t.target.closest("[data-menu]"),at=t.target.closest("[data-admin-logout]");if(a&&((z=a.getAttribute("href"))!=null&&z.startsWith("/"))&&(t.preventDefault(),st(a.getAttribute("href"))),e&&ot(Number(e.dataset.add)),i&&document.querySelector("[data-cart-drawer]").classList.add("open"),o&&document.querySelector("[data-cart-drawer]").classList.remove("open"),tt&&((I=document.querySelector("[data-nav]"))==null||I.classList.toggle("open")),at&&(await l.send("/api/admin/logout","POST",{}),r.adminAuthenticated=!1,V()),n){const h=((U=r.cart.find(et=>Number(et.product_id)===Number(n.dataset.qty)))==null?void 0:U.quantity)||1;F(Number(n.dataset.qty),h+Number(n.dataset.delta))}if(d&&ct(Number(d.dataset.remove)),w){const h=w.dataset.adminTab;document.querySelector("[data-admin-content]").innerHTML=h==="categories"?L():h==="banners"?T():h==="orders"?Q():h==="import"?Z():q()}const N=t.target.closest("[data-edit-product]"),j=t.target.closest("[data-edit-category]"),E=t.target.closest("[data-edit-banner]"),B=t.target.closest("[data-delete-product]"),O=t.target.closest("[data-delete-category]"),H=t.target.closest("[data-delete-banner]");N&&(document.querySelector("[data-admin-content]").innerHTML=q(_(r.admin.products,N.dataset.editProduct))),j&&(document.querySelector("[data-admin-content]").innerHTML=L(_(r.admin.categories,j.dataset.editCategory))),E&&(document.querySelector("[data-admin-content]").innerHTML=T(_(r.admin.banners,E.dataset.editBanner))),B&&confirm("Видалити товар?")&&(await l.send(`/api/admin/products/${B.dataset.deleteProduct}`,"DELETE",{}),await g("products")),O&&confirm("Видалити категорію?")&&(await l.send(`/api/admin/categories/${O.dataset.deleteCategory}`,"DELETE",{}),await g("categories")),H&&confirm("Видалити баннер?")&&(await l.send(`/api/admin/banners/${H.dataset.deleteBanner}`,"DELETE",{}),await g("banners"))});document.addEventListener("input",t=>{if(t.target.matches('[name="phone"]')&&(t.target.value=J(t.target.value)),t.target.matches("[data-filter]")){const a=t.target.dataset.filter;r.filters[a]=t.target.type==="checkbox"?t.target.checked:t.target.value;const e=document.querySelector(".catalog");e&&(e.outerHTML=R())}t.target.matches("[data-qty-input]")&&F(Number(t.target.dataset.qtyInput),t.target.value)});document.addEventListener("change",async t=>{if(t.target.matches("[data-upload-target]")&&t.target.files[0]){const a=await l.upload("/api/admin/upload","image",t.target.files[0]);t.target.closest("form").querySelector(`[name="${t.target.dataset.uploadTarget}"]`).value=a.url}t.target.matches("[data-order-status]")&&(await l.send(`/api/admin/orders/${t.target.dataset.orderStatus}`,"PUT",{status:t.target.value}),await g("orders"))});document.addEventListener("submit",async t=>{t.preventDefault();try{if(t.target.matches("[data-admin-login]")){const a=f(t.target);await l.send("/api/admin/login","POST",{password:a.password}),r.adminAuthenticated=!0,await G();return}if(t.target.matches("[data-checkout]")&&await bt(t.target),t.target.matches("[data-product-form]")){const a=t.target.dataset.id;await l.send(a?`/api/admin/products/${a}`:"/api/admin/products","PUT",f(t.target)),await g("products")}if(t.target.matches("[data-category-form]")){const a=t.target.dataset.id;await l.send(a?`/api/admin/categories/${a}`:"/api/admin/categories","PUT",f(t.target)),await g("categories")}if(t.target.matches("[data-banner-form]")){const a=t.target.dataset.id;await l.send(a?`/api/admin/banners/${a}`:"/api/admin/banners","PUT",f(t.target)),await g("banners")}if(t.target.matches("[data-import-form]")){const a=t.target.file.files[0],e=await l.upload("/api/admin/import","file",a);k(`Імпортовано ${e.rows_success} рядків`),await g("import")}}catch(a){k(a.message)}});window.addEventListener("popstate",M);M().catch(t=>{document.querySelector("#app").innerHTML=`<main class="page-head"><h1>Помилка запуску</h1><p>${s(t.message)}</p></main>`});
