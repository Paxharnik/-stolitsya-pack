(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function a(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=a(o);fetch(o.href,n)}})();const l={async get(t){const e=await fetch(t);if(!e.ok)throw new Error((await e.json()).error||"Помилка API");return e.json()},async send(t,e,a){const i=await fetch(t,{method:e,headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}),o=await i.json();if(!i.ok)throw new Error(o.error||"Помилка API");return o},async upload(t,e,a){const i=new FormData;i.append(e,a);const o=await fetch(t,{method:"POST",body:i}),n=await o.json();if(!o.ok)throw new Error(n.error||"Помилка завантаження");return n}},r={categories:[],products:[],banners:[],cart:JSON.parse(localStorage.getItem("stolitsya-pack-cart")||"[]"),filters:{q:"",category:"",sort:"featured",inStock:!1},admin:{products:[],categories:[],banners:[],orders:[],imports:[]},adminAuthenticated:!1},nt=12,X=8,p=t=>`${Number(t||0).toFixed(2)} грн`,v=(t,e)=>t.find(a=>Number(a.id)===Number(e)),s=(t="")=>String(t).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[e]),m=(t=location.pathname)=>`${location.origin}${t}`,ot=(t="",e=80)=>{const a=String(t).replace(/\s+/g," ").trim();return a.length>e?`${a.slice(0,e-1).trim()}…`:a},c=t=>{const e={menu:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',catalog:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z"/></svg>',truck:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',card:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3zM3 10h18M7 15h4"/></svg>',admin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 4v5c0 4-3 7-7 9-4-2-7-5-7-9V7z"/><path d="M9 12l2 2 4-5"/></svg>',cart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2l2 10h10l2-7H7"/><circle cx="10" cy="19" r="1.8"/><circle cx="17" cy="19" r="1.8"/></svg>',search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/></svg>',box:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8l8-4 8 4-8 4zM4 8v8l8 4 8-4V8M12 12v8"/></svg>',check:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',phone:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l4 4-2 2c2 4 4 6 8 8l2-2 4 4-2 2C10 21 3 14 2 6z"/></svg>',arrow:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',percent:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 5L5 19"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/></svg>',shield:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 4v5c0 4-3 7-7 9-4-2-7-5-7-9V7z"/></svg>',message:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v12H8l-4 4z"/></svg>',instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3"/><path d="M17 7h.01"/></svg>',video:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 8v8l6-4z"/><rect x="3" y="5" width="18" height="14" rx="3"/></svg>'};return`<span class="ui-icon">${e[t]||e.box}</span>`};function x(){return{"@context":"https://schema.org","@type":"Organization",name:"Столиця Пак",url:location.origin,logo:`${location.origin}/uploads/brand/logo.png`,telephone:["+380501308187","+380731308187"],email:"solodovnik.ak@gmail.com",address:{"@type":"PostalAddress",addressLocality:"Київ",streetAddress:"вул. Тепловозна 18",addressCountry:"UA"}}}function W(t){return{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:t.map((e,a)=>({"@type":"ListItem",position:a+1,name:e.name,item:e.url}))}}function L(){localStorage.setItem("stolitsya-pack-cart",JSON.stringify(r.cart))}function $({title:t,description:e,url:a,image:i,product:o}){document.title=t,k("description",e),k("og:title",t,"property"),k("og:description",e,"property"),k("og:url",a||location.href,"property"),i&&k("og:image",i,"property");let n=document.head.querySelector('link[rel="canonical"]');n||(n=document.createElement("link"),n.setAttribute("rel","canonical"),document.head.appendChild(n)),n.setAttribute("href",a||location.href),document.head.querySelectorAll('script[type="application/ld+json"]:not(#dynamic-jsonld)').forEach(S=>S.remove());const d=document.querySelector("#dynamic-jsonld")||document.createElement("script");d.id="dynamic-jsonld",d.type="application/ld+json",d.textContent=JSON.stringify(o||x()),document.head.appendChild(d)}function k(t,e,a="name"){let i=document.head.querySelector(`meta[${a}="${t}"]`);i||(i=document.createElement("meta"),i.setAttribute(a,t),document.head.appendChild(i)),i.setAttribute("content",e)}function ct(){return location.pathname.replace(/\/+$/,"")||"/"}function dt(t){history.pushState({},"",t),M().then(()=>{var a;const e=new URL(t,location.origin).hash;e&&((a=document.querySelector(e))==null||a.scrollIntoView({behavior:"smooth",block:"start"}))})}function J(){return r.cart.map(t=>{const e=v(r.products,t.product_id);return e?{...e,quantity:t.quantity}:null}).filter(Boolean)}function lt(t,e=1){const a=v(r.products,t);if(!a||!a.active||a.stock_quantity<=0)return;const i=r.cart.find(o=>Number(o.product_id)===Number(t));i?i.quantity+=e:r.cart.push({product_id:Number(t),quantity:e}),L(),y(),_("Товар додано до кошика")}function F(t,e){r.cart=r.cart.map(a=>Number(a.product_id)===Number(t)?{...a,quantity:Math.max(1,Number(e)||1)}:a),L(),y()}function ut(t){r.cart=r.cart.filter(e=>Number(e.product_id)!==Number(t)),L(),y()}function R(t=""){return String(t).replace(/\D/g,"")}function K(t=""){let e=R(t);e.startsWith("380")||e.startsWith("38")?e=e.slice(2):e.startsWith("80")&&(e=e.slice(1)),e=e.slice(0,10);const a=["+38"];return e.length&&a.push(` (${e.slice(0,3)}`),e.length>=3&&(a[1]+=")"),e.length>3&&a.push(` ${e.slice(3,6)}`),e.length>6&&a.push(`-${e.slice(6,8)}`),e.length>8&&a.push(`-${e.slice(8,10)}`),a.join("")}function pt(t){const e=J(),a=f(t),i=[];return e.length||i.push("Кошик порожній. Додайте товар перед оформленням."),String(a.name||"").trim()||i.push("Вкажіть ім'я."),R(a.phone).length<12&&i.push("Вкажіть телефон у форматі +38 (0XX) XXX-XX-XX."),String(a.city||"").trim()||i.push("Вкажіть місто."),String(a.nova_poshta_branch||"").trim()||i.push("Вкажіть відділення Нової Пошти."),i}function mt(){const t=r.filters.q.toLocaleLowerCase("uk-UA").trim();let e=r.products.filter(a=>{const i=!r.filters.category||a.category_slug===r.filters.category,o=!t||`${a.name} ${a.description} ${a.sku} ${a.category_name}`.toLocaleLowerCase("uk-UA").includes(t),n=!r.filters.inStock||a.stock_quantity>0;return a.active&&i&&o&&n});return r.filters.sort==="price-asc"&&(e=[...e].sort((a,i)=>a.retail_price-i.retail_price)),r.filters.sort==="price-desc"&&(e=[...e].sort((a,i)=>i.retail_price-a.retail_price)),e}function gt(){const t=r.products.filter(n=>n.active),e=t.filter(n=>n.featured&&n.stock_quantity>0),a=t.filter(n=>!n.featured&&n.stock_quantity>0),i=t.filter(n=>n.featured&&n.stock_quantity<=0),o=t.filter(n=>!n.featured&&n.stock_quantity<=0);return[...e,...a,...i,...o].slice(0,nt)}function ht(t=X){return r.products.filter(e=>e.active&&e.stock_quantity>0).slice(0,t)}function ft(t=X){return[...r.products].filter(e=>e.active).reverse().slice(0,t)}function vt(t,e=5){const a=String(t||"").toLocaleLowerCase("uk-UA").trim();return a?r.products.filter(i=>i.active&&`${i.name} ${i.description} ${i.sku} ${i.category_name}`.toLocaleLowerCase("uk-UA").includes(a)).slice(0,e):[]}function $t(t){const e="stolitsya-pack-recent",a=JSON.parse(localStorage.getItem(e)||"[]").filter(i=>Number(i)!==Number(t.id));localStorage.setItem(e,JSON.stringify([t.id,...a].slice(0,8)))}function bt(t){return JSON.parse(localStorage.getItem("stolitsya-pack-recent")||"[]").map(a=>v(r.products,a)).filter(a=>a&&a.active&&Number(a.id)!==Number(t)).slice(0,4)}function V(t=""){const e=vt(t);return`
    <div class="live-search" data-live-search-box>
      <label>${c("search")}<input data-live-search value="${s(t)}" type="search" placeholder="Пошук товарів, SKU, категорій" autocomplete="off" /></label>
      ${t?`
        <div class="search-suggestions">
          ${e.length?e.map(a=>`
            <a href="/product/${a.slug}" data-link>
              <img src="${s(a.image_url)}" alt="${s(a.name)}" loading="lazy" />
              <span><strong>${s(a.name)}</strong><small>${p(a.retail_price)} · ${s(a.category_name)}</small></span>
            </a>
          `).join(""):'<div class="search-empty">Нічого не знайдено</div>'}
        </div>
      `:""}
    </div>
  `}async function j(){const t=await l.get("/api/bootstrap");r.categories=t.categories,r.products=t.products,r.banners=t.banners}function b(t){const e=r.cart.reduce((i,o)=>i+o.quantity,0),a=r.categories.slice(0,9);return`
    <header class="topbar">
      <a class="brand" href="/" data-link><span class="brand-mark"><img src="/uploads/brand/logo.png" alt="Столиця Пак" /></span><strong>Столиця Пак</strong><small>упаковка для бізнесу</small></a>
      <button class="menu-btn" data-menu>${c("menu")}Меню</button>
      <nav class="desktop-nav" data-nav>
        <a href="/#catalog" data-link>${c("catalog")}Каталог</a>
        <a href="/#promo" data-link>${c("percent")}Акції</a>
        <a href="/#delivery" data-link>${c("truck")}Доставка</a>
        <a href="/#payment" data-link>${c("card")}Оплата</a>
        <a href="/#contacts" data-link>${c("phone")}Контакти</a>
      </nav>
      <div class="header-search">${V()}</div>
      <button class="cart-button" data-open-cart>${c("cart")}Кошик <span data-cart-count>${e}</span></button>
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
        ${a.map(i=>`<a href="/category/${i.slug}" data-link>${s(i.name)}</a>`).join("")}
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
  `}function G(t=""){$({title:"Вхід в адмін-панель - Столиця Пак",description:"Вхід в адмін-панель магазину."}),document.querySelector("#app").innerHTML=b(`
    <main class="admin-login">
      <form class="admin-form login-card" data-admin-login>
        <span class="eyebrow">Адмін-панель</span>
        <h1>Вхід</h1>
        <p>Введіть пароль адміністратора, щоб керувати товарами, категоріями, банерами та замовленнями.</p>
        ${t?`<div class="form-error">${s(t)}</div>`:""}
        <label>Пароль<input name="password" type="password" required autocomplete="current-password" /></label>
        <button type="submit">Увійти</button>
      </form>
    </main>
  `),y()}function yt(){const t=r.banners[0]||{},e="/uploads/brand/commercial-hero.jpg";return $({title:"Столиця Пак - пакети від виробника оптом і в роздріб по Україні",description:"Пакети від виробника для магазинів, кафе та бізнесу. Опт і роздріб, актуальні залишки, швидке оформлення замовлення та доставка по Україні.",url:m("/"),image:t.image_url,product:{"@context":"https://schema.org","@graph":[x(),{"@type":"WebSite",name:"Столиця Пак",url:location.origin,potentialAction:{"@type":"SearchAction",target:`${location.origin}/?q={search_term_string}`,"query-input":"required name=search_term_string"}}]}}),b(`
    <main>
      <section class="hero" style="--hero-image:url('${e}')">
        <div class="hero-copy">
          <span class="eyebrow">Виробник упаковки</span>
          <h1>Пакети від виробника<br><span>Опт та роздріб по Україні</span></h1>
          <p>Поліетиленові пакети, пакети майка, фасування, BMW, сміттєві пакети та упаковка для бізнесу з актуальними цінами й залишками.</p>
          <div class="hero-badges">
            <span>${c("box")}Власне виробництво</span>
            <span>${c("percent")}Оптові умови</span>
            <span>${c("truck")}Доставка по Україні</span>
          </div>
          <div class="hero-actions">
            <a class="primary" href="#categories" data-link>${c("catalog")}Перейти в каталог</a>
            <a class="secondary" href="tel:+380501308187">${c("phone")}Зв'язатися</a>
          </div>
        </div>
        <div class="hero-panel">
          <div>${c("box")}<strong>${r.products.filter(a=>a.active).length}</strong><span>товарів у каталозі</span></div>
          <div>${c("catalog")}<strong>${r.categories.length}</strong><span>категорій</span></div>
          <div>${c("truck")}<strong>1-2 дні</strong><span>обробка замовлення</span></div>
        </div>
      </section>
      ${St()}
      ${xt()}
      ${_t()}
      ${D("Хіти продажу","Популярні позиції з наявністю для швидкого замовлення.",ht(8),"Хіти продажу")}
      ${D("Новинки","Свіжі позиції каталогу для магазинів, кафе та виробництв.",ft(8),"Новинки")}
      ${qt()}
      ${Lt()}
      ${Mt()}
      ${Tt()}
      ${Pt()}
    </main>
  `)}function kt(t){r.filters.category=t;const e=r.categories.find(a=>a.slug===t);return e?($({title:`${e.name} - купити в Україні | Столиця Пак`,description:e.description||`Категорія ${e.name} в інтернет-магазині Столиця Пак.`,url:m(`/category/${e.slug}`),image:e.image_url,product:{"@context":"https://schema.org","@graph":[x(),W([{name:"Головна",url:m("/")},{name:e.name,url:m(`/category/${e.slug}`)}])]}}),b(`
    <main>
      <section class="page-head category-head">
        <div>
          <span class="eyebrow">Категорія</span>
          <h1>${s(e.name)}</h1>
          <p>${s(e.description||"")}</p>
        </div>
        <img src="${s(e.image_url)}" alt="${s(e.name)}" loading="lazy" />
      </section>
      ${Q()}
    </main>
  `)):Y()}function wt(t){const e=r.products.find(o=>o.slug===t);if(!e)return Y();const a=bt(e.id);$t(e),$({title:e.seo_title||`${e.name} - Столиця Пак`,description:e.seo_description||e.description,url:m(`/product/${e.slug}`),image:e.image_url,product:{"@context":"https://schema.org","@graph":[x(),W([{name:"Головна",url:m("/")},{name:e.category_name,url:m(`/category/${e.category_slug}`)},{name:e.name,url:m(`/product/${e.slug}`)}]),{"@type":"Product",name:e.name,sku:e.sku,image:e.image_url,description:e.description,brand:{"@type":"Brand",name:"Столиця Пак"},offers:{"@type":"Offer",priceCurrency:"UAH",price:e.retail_price,availability:e.stock_quantity>0?"https://schema.org/InStock":"https://schema.org/OutOfStock",url:m(`/product/${e.slug}`)}}]}});const i=r.products.filter(o=>o.active&&o.category_slug===e.category_slug&&o.id!==e.id).slice(0,4);return b(`
    <main>
      <section class="product-page">
        <div class="product-media"><img src="${s(e.image_url)}" alt="${s(e.name)}" loading="lazy" /></div>
        <div class="product-detail">
          <a class="breadcrumb" href="/category/${e.category_slug}" data-link>${s(e.category_name)}</a>
          <h1>${s(e.name)}</h1>
          <p class="lead">${s(e.description||"Якісна упаковка для щоденної роботи бізнесу та роздрібних покупців.")}</p>
          <div class="price-box">
            <strong>${p(e.retail_price)}</strong>
            <span>Опт: ${p(e.wholesale_price)}</span>
            <span>Залишок: ${e.stock_quantity} шт</span>
          </div>
          <button class="add-btn wide" data-add="${e.id}" ${e.stock_quantity<=0?"disabled":""}>${c("cart")}Додати до кошика</button>
          <section class="product-service-block" aria-labelledby="product-service-title">
            <h2 id="product-service-title">Доставка / Оплата / Опт</h2>
            <div class="commerce-notes">
            <article>${c("truck")}<strong>Доставка</strong><span>Відправляємо по Україні після підтвердження менеджером.</span></article>
            <article>${c("card")}<strong>Оплата</strong><span>Оплата узгоджується телефоном після оформлення замовлення.</span></article>
            <article>${c("percent")}<strong>Опт</strong><span>Для оптових покупців діє окрема ціна: ${p(e.wholesale_price)}.</span></article>
            </div>
          </section>
          <div class="specs">
            <h2>Характеристики</h2>
            <dl>
              <div><dt>SKU</dt><dd>${s(e.sku||"-")}</dd></div>
              <div><dt>Категорія</dt><dd>${s(e.category_name)}</dd></div>
              <div><dt>Роздрібна ціна</dt><dd>${p(e.retail_price)}</dd></div>
              <div><dt>Оптова ціна</dt><dd>${p(e.wholesale_price)}</dd></div>
              <div><dt>Наявність</dt><dd>${e.stock_quantity>0?`${e.stock_quantity} шт`:"Немає в наявності"}</dd></div>
            </dl>
          </div>
        </div>
      </section>
      ${i.length?`
        <section class="section related-products">
          <div class="section-title">
            <div><span class="eyebrow">Схожі товари</span><h2>Ще з цієї категорії</h2></div>
          </div>
          <div class="product-grid">${i.map(w).join("")}</div>
        </section>
      `:""}
      ${a.length?`
        <section class="section related-products recent-products">
          <div class="section-title">
            <div><span class="eyebrow">Переглядали</span><h2>Нещодавно переглянуті товари</h2></div>
          </div>
          <div class="product-grid compact-grid">${a.map(w).join("")}</div>
        </section>
      `:""}
    </main>
  `)}function Y(){return $({title:"Сторінку не знайдено - Столиця Пак",description:"Сторінку не знайдено."}),b('<main><section class="page-head"><h1>Сторінку не знайдено</h1><a class="primary" href="/" data-link>На головну</a></section></main>')}function _t(){return`
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
              <small>${s(ot(t.description||"Товари в наявності для опту та роздробу.",72))}</small>
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
  `}function St(){return`
    <section class="section promo-section" id="promo">
      <div class="section-title">
        <div><span class="eyebrow">Пропозиції</span><h2>Швидкий вибір для бізнесу</h2><p>Найпопулярніші напрямки каталогу з фото, зрозумілими перевагами та прямим переходом до товарів.</p></div>
      </div>
      <div class="promo-grid">
        ${[{title:"Оптові ціни від виробника",text:"Вигідні умови для магазинів, складів, кафе та виробництв.",image:"/uploads/brand/commercial-hero.jpg",href:"/#catalog",label:"Перейти в каталог"},{title:"Пакети майка",text:"Популярні розміри, різні кольори та щільність для щоденної роботи.",image:"/uploads/brand/promo-maika.jpg",href:"/category/paketi-majka",label:"До категорії"},{title:"Фасувальні пакети",text:"Для продуктів, магазинів, дому та виробництва.",image:"/uploads/brand/promo-fasuvannya.jpg",href:"/category/fasuvalni-paketi",label:"До категорії"},{title:"Господарські товари",text:"Рушники, губки, рукавички та товари для чистоти щодня.",image:"/uploads/brand/promo-gospodarski.jpg",href:"/category/gospodarski-tovari",label:"До категорії"}].map(e=>`
          <a class="promo-card" href="${e.href}" data-link style="--promo-image:url('${e.image}')">
            <span>${c("percent")}Столиця Пак</span>
            <strong>${s(e.title)}</strong>
            <small>${s(e.text)}</small>
            <em>${s(e.label)} ${c("arrow")}</em>
          </a>
        `).join("")}
      </div>
    </section>
  `}function qt(){const t=gt();return`
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
        ${t.map(w).join("")}
      </div>
    </section>
  `}function D(t,e,a,i){return a.length?`
    <section class="section catalog product-shelf">
      <div class="section-title with-tools">
        <div>
          <span class="eyebrow">${s(i)}</span>
          <h2>${s(t)}</h2>
          <p>${s(e)}</p>
        </div>
        <a class="secondary light" href="#categories" data-link>${c("catalog")}Усі категорії</a>
      </div>
      <div class="product-grid compact-grid">
        ${a.map(w).join("")}
      </div>
    </section>
  `:""}function xt(){return`
    <section class="benefits" aria-label="Переваги">
      <article>${c("shield")}<strong>Стабільна якість</strong><span>Пакування для щоденної роботи бізнесу без зайвої метушні.</span></article>
      <article>${c("percent")}<strong>Опт і роздріб</strong><span>Роздрібна та оптова ціна одразу в картці товару.</span></article>
      <article>${c("truck")}<strong>Доставка по Україні</strong><span>Менеджер швидко уточнює деталі після оформлення.</span></article>
      <article>${c("check")}<strong>120 товарів</strong><span>Каталог з категоріями, цінами, залишками та фото.</span></article>
    </section>
  `}function Lt(){return`
    <section class="section why-section">
      <div class="section-title">
        <div><span class="eyebrow">Чому ми</span><h2>Столиця Пак для дому, магазину та виробництва</h2><p>Ми зробили MVP-магазин максимально простим: оберіть категорію, додайте товар у кошик і залиште контакти для підтвердження замовлення.</p></div>
      </div>
      <div class="why-grid">
        <article>${c("box")}<strong>Великий асортимент</strong><span>Пакети майка, фасування, рулони, посуд, рукавички та господарські товари.</span></article>
        <article>${c("shield")}<strong>Зрозуміла наявність</strong><span>Залишок видно до оформлення, тому клієнт швидше приймає рішення.</span></article>
        <article>${c("phone")}<strong>Живе підтвердження</strong><span>Після заявки менеджер уточнює оплату, доставку та оптові умови.</span></article>
      </div>
    </section>
  `}function Q(){var e;const t=mt();return`
    <section class="section catalog" id="catalog">
      <div class="section-title with-tools">
        <div>
          <span class="eyebrow">Вітрина</span>
          <h2>${r.filters.category?s(((e=r.categories.find(a=>a.slug===r.filters.category))==null?void 0:e.name)||"Товари"):"Всі товари"}</h2>
          <p>${t.length} товарів знайдено</p>
        </div>
        <div class="tools">
          <label class="search"><span>${c("search")}Пошук</span><input data-filter="q" type="search" placeholder="Назва, SKU, категорія" value="${s(r.filters.q)}" /></label>
          <select data-filter="category" aria-label="Категорія">
            <option value="">Усі категорії</option>
            ${r.categories.map(a=>`<option value="${a.slug}" ${r.filters.category===a.slug?"selected":""}>${s(a.name)}</option>`).join("")}
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
        ${t.length?t.map(w).join(""):'<div class="no-results">Нічого не знайдено.</div>'}
      </div>
    </section>
  `}function w(t){return`
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
  `}function Mt(){return`
    <section class="info-grid" id="delivery">
      <article>${c("truck")}<span class="eyebrow">Доставка</span><h2>Доставка по Україні</h2><p>Під час оформлення замовлення вкажіть місто та відділення Нової Пошти. Менеджер підтвердить деталі телефоном.</p></article>
      <article id="payment">${c("card")}<span class="eyebrow">Оплата</span><h2>Оплата після підтвердження</h2><p>Онлайн-оплата поки не підключена. Замовлення зберігається в адмін-панелі, менеджер узгоджує оплату та доставку.</p></article>
    </section>
  `}function Tt(){return`
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
  `}function Pt(){return`
    <section class="section contacts-section" id="contacts">
      <div>
        <span class="eyebrow">Контакти</span>
        <h2>Потрібна консультація щодо упаковки?</h2>
        <p>Зателефонуйте або оформіть замовлення через кошик. Ми допоможемо підібрати розмір, щільність і кількість.</p>
      </div>
      <div class="contact-actions">
        <a class="primary" href="tel:+380501308187">${c("phone")}+38 (050) 130-81-87</a>
        <a class="secondary light" href="mailto:solodovnik.ak@gmail.com">${c("message")}Написати на email</a>
      </div>
    </section>
  `}function y(){const t=document.querySelector("[data-cart-panel]"),e=r.cart.reduce((n,d)=>n+d.quantity,0),a=document.querySelector("[data-cart-count]");if(a&&(a.textContent=String(e)),!t)return;const i=J(),o=i.reduce((n,d)=>n+d.retail_price*d.quantity,0);t.innerHTML=`
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
  `}async function Z(){$({title:"Адмін-панель - Столиця Пак",description:"Керування товарами, категоріями, банерами та замовленнями."});const t=await l.get("/api/admin/session");if(r.adminAuthenticated=t.authenticated,!r.adminAuthenticated){G();return}await tt(),document.querySelector("#app").innerHTML=b(`
    <main class="admin">
      <section class="page-head"><span class="eyebrow">Адміністрування</span><h1>Адмін-панель</h1><p>Керуйте товарами, категоріями, банерами та замовленнями.</p><button class="secondary admin-logout" data-admin-logout>Вийти</button></section>
      <nav class="admin-tabs">
        <button data-admin-tab="products">Товари</button>
        <button data-admin-tab="categories">Категорії</button>
        <button data-admin-tab="banners">Баннери</button>
        <button data-admin-tab="orders">Замовлення</button>
        <button data-admin-tab="import">Імпорт</button>
      </nav>
      <section data-admin-content>${q()}</section>
    </main>
  `),y()}async function tt(){const[t,e,a,i,o]=await Promise.all([l.get("/api/admin/products"),l.get("/api/admin/categories"),l.get("/api/admin/banners"),l.get("/api/admin/orders"),l.get("/api/admin/imports")]);r.admin.products=t.items,r.admin.categories=e.items,r.admin.banners=a.items,r.admin.orders=i.items,r.admin.imports=o.items}function q(t={}){return`
    <div class="admin-grid">
      <form class="admin-form" data-product-form data-id="${t.id||""}">
        <h2>${t.id?"Редагувати товар":"Новий товар"}</h2>
        ${u("name","Назва",t.name,!0)}
        ${u("sku","SKU",t.sku)}
        ${u("slug","Slug",t.slug)}
        <label>Категорія<select name="category_id" required>${r.admin.categories.map(e=>`<option value="${e.id}" ${Number(t.category_id)===Number(e.id)?"selected":""}>${s(e.name)}</option>`).join("")}</select></label>
        <label>Опис<textarea name="description">${s(t.description||"")}</textarea></label>
        ${u("retail_price","Роздрібна ціна",t.retail_price||0,!0,"number")}
        ${u("wholesale_price","Оптова ціна",t.wholesale_price||0,!1,"number")}
        ${u("stock_quantity","Залишок",t.stock_quantity||0,!1,"number")}
        ${N("image_url",t.image_url)}
        <label class="check"><input name="active" type="checkbox" ${t.active??!0?"checked":""} /> Активний</label>
        <label class="check"><input name="featured" type="checkbox" ${t.featured?"checked":""} /> Популярний</label>
        ${u("seo_title","SEO title",t.seo_title)}
        <label>SEO description<textarea name="seo_description">${s(t.seo_description||"")}</textarea></label>
        <button type="submit">Зберегти товар</button>
      </form>
      <div class="admin-list">
        ${r.admin.products.map(e=>`
          <div class="admin-row">
            <img src="${s(e.image_url)}" alt="" />
            <div><strong>${s(e.name)}</strong><span>${s(e.sku||"")} · ${p(e.retail_price)} · ${e.stock_quantity} шт</span></div>
            <button data-edit-product="${e.id}">Редагувати</button>
            <button data-delete-product="${e.id}">Видалити</button>
          </div>
        `).join("")}
      </div>
    </div>
  `}function T(t={}){return`
    <div class="admin-grid">
      <form class="admin-form" data-category-form data-id="${t.id||""}">
        <h2>${t.id?"Редагувати категорію":"Нова категорія"}</h2>
        ${u("name","Назва",t.name,!0)}
        ${u("slug","Slug",t.slug)}
        <label>Опис<textarea name="description">${s(t.description||"")}</textarea></label>
        ${N("image_url",t.image_url)}
        ${u("sort_order","Сортування",t.sort_order||0,!1,"number")}
        <label class="check"><input name="active" type="checkbox" ${t.active??!0?"checked":""} /> Активна</label>
        <button type="submit">Зберегти категорію</button>
      </form>
      <div class="admin-list">${r.admin.categories.map(e=>`
        <div class="admin-row"><img src="${s(e.image_url)}" alt="" /><div><strong>${s(e.name)}</strong><span>${s(e.slug)}</span></div><button data-edit-category="${e.id}">Редагувати</button><button data-delete-category="${e.id}">Видалити</button></div>
      `).join("")}</div>
    </div>
  `}function P(t={}){return`
    <div class="admin-grid">
      <form class="admin-form" data-banner-form data-id="${t.id||""}">
        <h2>${t.id?"Редагувати банер":"Новий банер"}</h2>
        ${u("title","Заголовок",t.title,!0)}
        <label>Підзаголовок<textarea name="subtitle">${s(t.subtitle||"")}</textarea></label>
        ${N("image_url",t.image_url)}
        ${u("link_url","Посилання",t.link_url||"#catalog")}
        ${u("button_text","Текст кнопки",t.button_text||"До каталогу")}
        ${u("sort_order","Сортування",t.sort_order||0,!1,"number")}
        <label class="check"><input name="active" type="checkbox" ${t.active??!0?"checked":""} /> Активний</label>
        <button type="submit">Зберегти банер</button>
      </form>
      <div class="admin-list">${r.admin.banners.map(e=>`
        <div class="admin-row"><img src="${s(e.image_url)}" alt="" /><div><strong>${s(e.title)}</strong><span>${s(e.subtitle||"")}</span></div><button data-edit-banner="${e.id}">Редагувати</button><button data-delete-banner="${e.id}">Видалити</button></div>
      `).join("")}</div>
    </div>
  `}function et(){return`
    <div class="admin-list orders">
      ${r.admin.orders.length?r.admin.orders.map(t=>`
        <div class="order-card">
          <div class="order-head">
            <strong>Замовлення #${t.id} · ${p(t.total)}</strong>
            <select data-order-status="${t.id}">
              ${["new","processing","packed","sent","done","cancelled"].map(e=>`<option value="${e}" ${t.status===e?"selected":""}>${e}</option>`).join("")}
            </select>
          </div>
          <p>${s(t.customer_name)} · ${s(t.phone)} · ${s(t.city)} · ${s(t.nova_poshta_branch)}</p>
          <ul>${t.items.map(e=>`<li>${s(e.name)} x ${e.quantity} = ${p(e.total)}</li>`).join("")}</ul>
          ${t.comment?`<p>Коментар: ${s(t.comment)}</p>`:""}
        </div>
      `).join(""):'<div class="empty">Замовлень ще немає.</div>'}
    </div>
  `}function at(){return`
    <form class="admin-form import-form" data-import-form>
      <h2>Імпорт товарів CSV/XLSX</h2>
      <p>Поля: category_slug, category_name, sku, slug, name, description, retail_price, wholesale_price, stock_quantity, image_url, active, featured, seo_title, seo_description.</p>
      <input type="file" name="file" accept=".csv,.xlsx" required />
      <button type="submit">Імпортувати</button>
    </form>
    <div class="admin-list">${r.admin.imports.map(t=>`<div class="admin-row"><div><strong>${s(t.filename)}</strong><span>${t.status}: ${t.rows_success}/${t.rows_total}, помилок ${t.rows_failed}</span></div></div>`).join("")}</div>
  `}function u(t,e,a="",i=!1,o="text"){return`<label>${e}<input name="${t}" type="${o}" value="${s(a??"")}" ${i?"required":""} /></label>`}function N(t,e=""){return`<label>Зображення<input name="${t}" value="${s(e||"")}" placeholder="/uploads/image.webp або https://..." /></label><label>Завантажити файл<input type="file" data-upload-target="${t}" accept="image/*" /></label>`}function f(t){const e=Object.fromEntries(new FormData(t).entries());return t.querySelectorAll('input[type="checkbox"]').forEach(a=>e[a.name]=a.checked),e}async function g(t="products"){await j(),await tt();const e=document.querySelector("[data-admin-content]");e&&(e.innerHTML=t==="categories"?T():t==="banners"?P():t==="orders"?et():t==="import"?at():q())}function _(t,e=1800){const a=document.querySelector("[data-toast]");a&&(a.textContent=t,a.classList.add("show"),setTimeout(()=>a.classList.remove("show"),e))}async function jt(t){const e=t.querySelector("[data-checkout-error]"),a=pt(t);if(a.length){e&&(e.hidden=!1,e.innerHTML=a.map(d=>`<div>${s(d)}</div>`).join("")),_(a[0]);return}const i=f(t);i.phone=K(i.phone);const o={...i,items:r.cart.map(d=>({product_id:d.product_id,quantity:d.quantity}))},n=await l.send("/api/orders","POST",o);r.cart=[],L(),document.querySelector("[data-cart-drawer]").classList.remove("open"),await j(),M(),_(`Дякуємо, замовлення прийнято. Номер замовлення #${n.id}`,5200)}async function M(){r.products.length||await j();const t=ct();if(r.filters.category="",t==="/admin")return Z();t.startsWith("/category/")?document.querySelector("#app").innerHTML=kt(t.split("/").pop()):t.startsWith("/product/")?document.querySelector("#app").innerHTML=wt(t.split("/").pop()):document.querySelector("#app").innerHTML=yt(),y()}document.addEventListener("click",async t=>{var I,z,U;const e=t.target.closest("[data-link]"),a=t.target.closest("[data-add]"),i=t.target.closest("[data-open-cart]"),o=t.target.closest("[data-close-cart]"),n=t.target.closest("[data-qty]"),d=t.target.closest("[data-remove]"),S=t.target.closest("[data-admin-tab]"),rt=t.target.closest("[data-menu]"),it=t.target.closest("[data-admin-logout]");if(e&&((I=e.getAttribute("href"))!=null&&I.startsWith("/"))&&(t.preventDefault(),dt(e.getAttribute("href"))),a&&lt(Number(a.dataset.add)),i&&document.querySelector("[data-cart-drawer]").classList.add("open"),o&&document.querySelector("[data-cart-drawer]").classList.remove("open"),rt&&((z=document.querySelector("[data-nav]"))==null||z.classList.toggle("open")),it&&(await l.send("/api/admin/logout","POST",{}),r.adminAuthenticated=!1,G()),n){const h=((U=r.cart.find(st=>Number(st.product_id)===Number(n.dataset.qty)))==null?void 0:U.quantity)||1;F(Number(n.dataset.qty),h+Number(n.dataset.delta))}if(d&&ut(Number(d.dataset.remove)),S){const h=S.dataset.adminTab;document.querySelector("[data-admin-content]").innerHTML=h==="categories"?T():h==="banners"?P():h==="orders"?et():h==="import"?at():q()}const C=t.target.closest("[data-edit-product]"),A=t.target.closest("[data-edit-category]"),O=t.target.closest("[data-edit-banner]"),E=t.target.closest("[data-delete-product]"),B=t.target.closest("[data-delete-category]"),H=t.target.closest("[data-delete-banner]");C&&(document.querySelector("[data-admin-content]").innerHTML=q(v(r.admin.products,C.dataset.editProduct))),A&&(document.querySelector("[data-admin-content]").innerHTML=T(v(r.admin.categories,A.dataset.editCategory))),O&&(document.querySelector("[data-admin-content]").innerHTML=P(v(r.admin.banners,O.dataset.editBanner))),E&&confirm("Видалити товар?")&&(await l.send(`/api/admin/products/${E.dataset.deleteProduct}`,"DELETE",{}),await g("products")),B&&confirm("Видалити категорію?")&&(await l.send(`/api/admin/categories/${B.dataset.deleteCategory}`,"DELETE",{}),await g("categories")),H&&confirm("Видалити банер?")&&(await l.send(`/api/admin/banners/${H.dataset.deleteBanner}`,"DELETE",{}),await g("banners"))});document.addEventListener("input",t=>{if(t.target.matches('[name="phone"]')&&(t.target.value=K(t.target.value)),t.target.matches("[data-filter]")){const e=t.target.dataset.filter;r.filters[e]=t.target.type==="checkbox"?t.target.checked:t.target.value;const a=document.querySelector(".catalog");a&&(a.outerHTML=Q())}if(t.target.matches("[data-live-search]")){const e=t.target.closest("[data-live-search-box]");e&&(e.outerHTML=V(t.target.value));const a=document.querySelector("[data-live-search]");a&&(a.focus(),a.setSelectionRange(a.value.length,a.value.length))}t.target.matches("[data-qty-input]")&&F(Number(t.target.dataset.qtyInput),t.target.value)});document.addEventListener("change",async t=>{if(t.target.matches("[data-upload-target]")&&t.target.files[0]){const e=await l.upload("/api/admin/upload","image",t.target.files[0]);t.target.closest("form").querySelector(`[name="${t.target.dataset.uploadTarget}"]`).value=e.url}t.target.matches("[data-order-status]")&&(await l.send(`/api/admin/orders/${t.target.dataset.orderStatus}`,"PUT",{status:t.target.value}),await g("orders"))});document.addEventListener("submit",async t=>{t.preventDefault();try{if(t.target.matches("[data-admin-login]")){const e=f(t.target);await l.send("/api/admin/login","POST",{password:e.password}),r.adminAuthenticated=!0,await Z();return}if(t.target.matches("[data-checkout]")&&await jt(t.target),t.target.matches("[data-product-form]")){const e=t.target.dataset.id;await l.send(e?`/api/admin/products/${e}`:"/api/admin/products","PUT",f(t.target)),await g("products")}if(t.target.matches("[data-category-form]")){const e=t.target.dataset.id;await l.send(e?`/api/admin/categories/${e}`:"/api/admin/categories","PUT",f(t.target)),await g("categories")}if(t.target.matches("[data-banner-form]")){const e=t.target.dataset.id;await l.send(e?`/api/admin/banners/${e}`:"/api/admin/banners","PUT",f(t.target)),await g("banners")}if(t.target.matches("[data-import-form]")){const e=t.target.file.files[0],a=await l.upload("/api/admin/import","file",e);_(`Імпортовано ${a.rows_success} рядків`),await g("import")}}catch(e){_(e.message)}});window.addEventListener("popstate",M);M().catch(t=>{document.querySelector("#app").innerHTML=`<main class="page-head"><h1>Помилка запуску</h1><p>${s(t.message)}</p></main>`});
