(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function e(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(o){if(o.ep)return;o.ep=!0;const n=e(o);fetch(o.href,n)}})();const u={async get(t){const a=await fetch(t);if(!a.ok)throw new Error((await a.json()).error||"Помилка API");return a.json()},async send(t,a,e){const s=await fetch(t,{method:a,headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),o=await s.json();if(!s.ok)throw new Error(o.error||"Помилка API");return o},async upload(t,a,e){const s=new FormData;s.append(a,e);const o=await fetch(t,{method:"POST",body:s}),n=await o.json();if(!o.ok)throw new Error(n.error||"Помилка завантаження");return n}},i={categories:[],products:[],banners:[],cart:JSON.parse(localStorage.getItem("stolitsya-pack-cart")||"[]"),filters:{q:"",category:"",sort:"featured",inStock:!1},admin:{products:[],categories:[],banners:[],orders:[],imports:[]},adminAuthenticated:!1},yt=12,st=8,g=t=>`${Number(t||0).toFixed(2)} грн`,_=(t,a)=>t.find(e=>Number(e.id)===Number(a)),r=(t="")=>String(t).replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[a]),f=(t=location.pathname)=>`${location.origin}${t}`,E=(t="",a=80)=>{const e=String(t).replace(/\s+/g," ").trim();return e.length>a?`${e.slice(0,a-1).trim()}…`:e},k=(t="",a=[])=>{const s=String(t).split(/\n+/).map(o=>o.trim()).filter(Boolean).find(o=>a.some(n=>o.toLocaleLowerCase("uk-UA").startsWith(`${n.toLocaleLowerCase("uk-UA")}:`)));return s?s.replace(/^[^:]+:\s*/,"").trim():""},$t=t=>{const a=[];return t.featured&&a.push({text:"🔥 Хіт продажу",type:"hot"}),Number(t.wholesale_price||0)>0&&Number(t.wholesale_price)<Number(t.retail_price||0)&&a.push({text:"💰 Опт",type:"opt"}),t.category_slug==="paketi-z-logotipom"&&a.push({text:"🏷 Акція",type:"sale"}),Date.now()-new Date(t.created_at||0).getTime()<1e3*60*60*24*45&&a.push({text:"⭐ Новинка",type:"new"}),a.push({text:"🏭 Від виробника",type:"maker"}),a.slice(0,2)},d=t=>{const a={menu:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',catalog:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z"/></svg>',truck:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',card:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3zM3 10h18M7 15h4"/></svg>',admin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 4v5c0 4-3 7-7 9-4-2-7-5-7-9V7z"/><path d="M9 12l2 2 4-5"/></svg>',cart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2l2 10h10l2-7H7"/><circle cx="10" cy="19" r="1.8"/><circle cx="17" cy="19" r="1.8"/></svg>',search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/></svg>',box:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8l8-4 8 4-8 4zM4 8v8l8 4 8-4V8M12 12v8"/></svg>',check:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',phone:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l4 4-2 2c2 4 4 6 8 8l2-2 4 4-2 2C10 21 3 14 2 6z"/></svg>',arrow:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',percent:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 5L5 19"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/></svg>',shield:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 4v5c0 4-3 7-7 9-4-2-7-5-7-9V7z"/></svg>',message:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v12H8l-4 4z"/></svg>',instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3"/><path d="M17 7h.01"/></svg>',video:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 8v8l6-4z"/><rect x="3" y="5" width="18" height="14" rx="3"/></svg>'};return`<span class="ui-icon">${a[t]||a.box}</span>`};function C(){return{"@context":"https://schema.org","@type":"Organization",name:"Столиця Пак",url:location.origin,logo:`${location.origin}/uploads/brand/logo.png`,telephone:["+380501308187","+380731308187"],email:"solodovnik.ak@gmail.com",address:{"@type":"PostalAddress",addressLocality:"Київ",streetAddress:"вул. Тепловозна 18",addressCountry:"UA"}}}function rt(t){return{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:t.map((a,e)=>({"@type":"ListItem",position:e+1,name:a.name,item:a.url}))}}function P(){localStorage.setItem("stolitsya-pack-cart",JSON.stringify(i.cart))}function S({title:t,description:a,url:e,image:s,product:o}){document.title=t,L("description",a),L("og:title",t,"property"),L("og:description",a,"property"),L("og:url",e||location.href,"property"),s&&L("og:image",s,"property");let n=document.head.querySelector('link[rel="canonical"]');n||(n=document.createElement("link"),n.setAttribute("rel","canonical"),document.head.appendChild(n)),n.setAttribute("href",e||location.href),document.head.querySelectorAll('script[type="application/ld+json"]:not(#dynamic-jsonld)').forEach(p=>p.remove());const c=document.querySelector("#dynamic-jsonld")||document.createElement("script");c.id="dynamic-jsonld",c.type="application/ld+json",c.textContent=JSON.stringify(o||C()),document.head.appendChild(c)}function L(t,a,e="name"){let s=document.head.querySelector(`meta[${e}="${t}"]`);s||(s=document.createElement("meta"),s.setAttribute(e,t),document.head.appendChild(s)),s.setAttribute("content",a)}function kt(){return location.pathname.replace(/\/+$/,"")||"/"}function wt(t){history.pushState({},"",t),A().then(()=>{var e;const a=new URL(t,location.origin).hash;a&&((e=document.querySelector(a))==null||e.scrollIntoView({behavior:"smooth",block:"start"}))})}function it(){return i.cart.map(t=>{const a=_(i.products,t.product_id);return a?{...a,quantity:t.quantity}:null}).filter(Boolean)}function _t(t,a=1){const e=_(i.products,t);if(!e||!e.active||e.stock_quantity<=0)return;const s=i.cart.find(o=>Number(o.product_id)===Number(t));s?s.quantity+=a:i.cart.push({product_id:Number(t),quantity:a}),P(),x(),N("Товар додано до кошика")}function nt(t,a){i.cart=i.cart.map(e=>Number(e.product_id)===Number(t)?{...e,quantity:Math.max(1,Number(a)||1)}:e),P(),x()}function St(t){i.cart=i.cart.filter(a=>Number(a.product_id)!==Number(t)),P(),x()}function ot(t=""){return String(t).replace(/\D/g,"")}function ct(t=""){let a=ot(t);a.startsWith("380")||a.startsWith("38")?a=a.slice(2):a.startsWith("80")&&(a=a.slice(1)),a=a.slice(0,10);const e=["+38"];return a.length&&e.push(` (${a.slice(0,3)}`),a.length>=3&&(e[1]+=")"),a.length>3&&e.push(` ${a.slice(3,6)}`),a.length>6&&e.push(`-${a.slice(6,8)}`),a.length>8&&e.push(`-${a.slice(8,10)}`),e.join("")}function qt(t){const a=it(),e=w(t),s=[];return a.length||s.push("Кошик порожній. Додайте товар перед оформленням."),String(e.name||"").trim()||s.push("Вкажіть ім'я."),ot(e.phone).length<12&&s.push("Вкажіть телефон у форматі +38 (0XX) XXX-XX-XX."),String(e.city||"").trim()||s.push("Вкажіть місто."),String(e.nova_poshta_branch||"").trim()||s.push("Вкажіть відділення Нової Пошти."),s}function xt(){const t=i.filters.q.toLocaleLowerCase("uk-UA").trim();let a=i.products.filter(e=>{const s=!i.filters.category||e.category_slug===i.filters.category,o=!t||`${e.name} ${e.description} ${e.sku} ${e.category_name}`.toLocaleLowerCase("uk-UA").includes(t),n=!i.filters.inStock||e.stock_quantity>0;return e.active&&s&&o&&n});return i.filters.sort==="price-asc"&&(a=[...a].sort((e,s)=>e.retail_price-s.retail_price)),i.filters.sort==="price-desc"&&(a=[...a].sort((e,s)=>s.retail_price-e.retail_price)),a}function Lt(){const t=i.products.filter(n=>n.active),a=t.filter(n=>n.featured&&n.stock_quantity>0),e=t.filter(n=>!n.featured&&n.stock_quantity>0),s=t.filter(n=>n.featured&&n.stock_quantity<=0),o=t.filter(n=>!n.featured&&n.stock_quantity<=0);return[...a,...e,...s,...o].slice(0,yt)}function Mt(t=st){return i.products.filter(a=>a.active&&a.stock_quantity>0).slice(0,t)}function Nt(t=st){return[...i.products].filter(a=>a.active).reverse().slice(0,t)}function Tt(t,a=5){const e=String(t||"").toLocaleLowerCase("uk-UA").trim();return e?i.products.filter(s=>s.active&&`${s.name} ${s.description} ${s.sku} ${s.category_name}`.toLocaleLowerCase("uk-UA").includes(e)).slice(0,a):[]}function jt(t){const a="stolitsya-pack-recent",e=JSON.parse(localStorage.getItem(a)||"[]").filter(s=>Number(s)!==Number(t.id));localStorage.setItem(a,JSON.stringify([t.id,...e].slice(0,8)))}function Ct(t){return JSON.parse(localStorage.getItem("stolitsya-pack-recent")||"[]").map(e=>_(i.products,e)).filter(e=>e&&e.active&&Number(e.id)!==Number(t)).slice(0,4)}function dt(t=""){const a=Tt(t);return`
    <div class="live-search" data-live-search-box>
      <label aria-label="Пошук товарів">${d("search")}<input data-live-search value="${r(t)}" type="search" placeholder="Пошук товарів, SKU, категорій" autocomplete="off" /></label>
      ${t?`
        <div class="search-suggestions">
          ${a.length?a.map(e=>`
            <a href="/product/${e.slug}" data-link>
              <img src="${r(e.image_url)}" alt="${r(e.name)}" loading="lazy" />
              <span><strong>${r(e.name)}</strong><small>${g(e.retail_price)} · ${r(e.category_name)}</small></span>
            </a>
          `).join(""):'<div class="search-empty">Нічого не знайдено</div>'}
        </div>
      `:""}
    </div>
  `}function Pt(){return`
    <div class="catalog-menu" data-catalog-menu>
      <button class="catalog-trigger" type="button" data-catalog-toggle aria-expanded="false">${d("catalog")}Каталог</button>
      <div class="catalog-dropdown" data-catalog-dropdown>
        <div class="catalog-dropdown-head">
          <strong>Категорії товарів</strong>
          <span>${i.categories.length} напрямків упаковки</span>
        </div>
        <div class="catalog-dropdown-grid">
          ${i.categories.map(t=>`
            <a href="/category/${t.slug}" data-link>
              <strong>${r(t.name)}</strong>
              <small>${r(E(t.description||"Товари для опту та роздробу.",74))}</small>
            </a>
          `).join("")}
        </div>
      </div>
    </div>
  `}async function H(){const t=await u.get("/api/bootstrap");i.categories=t.categories,i.products=t.products,i.banners=t.banners}function q(t){const a=i.cart.reduce((s,o)=>s+o.quantity,0),e=i.categories.slice(0,9);return`
    <header class="topbar">
      <a class="brand" href="/" data-link><span class="brand-mark"><img src="/uploads/brand/logo.png" alt="Столиця Пак" /></span><strong>Столиця Пак</strong><small>упаковка для бізнесу</small></a>
      ${Pt()}
      <div class="header-search">${dt()}</div>
      <div class="header-contact">
        <span>Потрібна допомога?</span>
        <a href="tel:+380501308187">+38 (050) 130-81-87</a>
      </div>
      <button class="menu-btn" data-menu>${d("menu")}Меню</button>
      <nav class="desktop-nav" data-nav>
        <a class="mobile-only" href="/#categories" data-link>${d("catalog")}Каталог</a>
        <a href="/#promo" data-link>${d("percent")}Акції</a>
        <a href="/#delivery" data-link>${d("truck")}Доставка</a>
        <a href="/#payment" data-link>${d("card")}Оплата</a>
        <a href="/#contacts" data-link>${d("phone")}Контакти</a>
        <a class="mobile-only" href="/admin" data-link>${d("admin")}Адмін</a>
      </nav>
      <button class="cart-button" data-open-cart>${d("cart")}Кошик <span data-cart-count>${a}</span></button>
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
        ${e.map(s=>`<a href="/category/${s.slug}" data-link>${r(s.name)}</a>`).join("")}
      </div>
      <div class="footer-column">
        <h3>Доставка і оплата</h3>
        <a href="/#delivery" data-link>Доставка по Україні</a>
        <a href="/#payment" data-link>Оплата після підтвердження</a>
        <a href="/feeds/google.xml" target="_blank">Google Merchant feed</a>
        <a href="/feeds/products.xml" target="_blank">XML feed</a>
        <div class="socials" aria-label="Соціальні мережі">
          <a href="tel:+380501308187" aria-label="Telegram">${d("message")}Telegram</a>
          <a href="mailto:solodovnik.ak@gmail.com" aria-label="Instagram">${d("instagram")}Instagram</a>
          <a href="mailto:solodovnik.ak@gmail.com" aria-label="TikTok">${d("video")}TikTok</a>
        </div>
      </div>
    </footer>
    <aside class="cart-drawer" data-cart-drawer><div class="cart-panel" data-cart-panel></div></aside>
    <div class="toast" data-toast></div>
  `}function lt(t=""){S({title:"Вхід в адмін-панель - Столиця Пак",description:"Вхід в адмін-панель магазину."}),document.querySelector("#app").innerHTML=q(`
    <main class="admin-login">
      <form class="admin-form login-card" data-admin-login>
        <span class="eyebrow">Адмін-панель</span>
        <h1>Вхід</h1>
        <p>Введіть пароль адміністратора, щоб керувати товарами, категоріями, банерами та замовленнями.</p>
        ${t?`<div class="form-error">${r(t)}</div>`:""}
        <label>Пароль<input name="password" type="password" required autocomplete="current-password" /></label>
        <button type="submit">Увійти</button>
      </form>
    </main>
  `),x()}function At(){const t=i.banners[0]||{},a="/uploads/brand/commercial-hero.jpg";return S({title:"Столиця Пак - пакети від виробника оптом і в роздріб по Україні",description:"Пакети від виробника для магазинів, кафе та бізнесу. Опт і роздріб, актуальні залишки, швидке оформлення замовлення та доставка по Україні.",url:f("/"),image:t.image_url,product:{"@context":"https://schema.org","@graph":[C(),{"@type":"WebSite",name:"Столиця Пак",url:location.origin,potentialAction:{"@type":"SearchAction",target:`${location.origin}/?q={search_term_string}`,"query-input":"required name=search_term_string"}}]}}),q(`
    <main>
      <section class="hero" style="--hero-image:url('${a}')">
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
            <a class="primary" href="#categories" data-link>${d("catalog")}Перейти в каталог</a>
            <a class="secondary" href="#contacts" data-link>${d("percent")}Отримати оптовий прайс</a>
          </div>
        </div>
        <div class="hero-visual">
          <img src="${a}" alt="Пакети та пакувальні матеріали Столиця Пак" />
        </div>
        <div class="hero-panel" aria-label="Переваги магазину">
          <div><strong>${i.products.filter(e=>e.active).length}+</strong><span>товарів</span></div>
          <div><strong>${i.categories.length}</strong><span>категорій</span></div>
          <div><strong>Відправка</strong><span>по Україні</span></div>
          <div><strong>Опт</strong><span>від виробника</span></div>
        </div>
      </section>
      ${zt()}
      ${It()}
      ${Bt()}
      ${et("Хіти продажу","Популярні позиції з наявністю для швидкого замовлення.",Mt(8),"Хіти продажу")}
      ${et("Новинки","Свіжі позиції каталогу для магазинів, кафе та виробництв.",Nt(8),"Новинки")}
      ${Ht()}
      ${Ut()}
      ${Dt()}
      ${Wt()}
      ${Xt()}
    </main>
  `)}function Ot(t){i.filters.category=t;const a=i.categories.find(e=>e.slug===t);return a?(S({title:`${a.name} - купити в Україні | Столиця Пак`,description:a.description||`Категорія ${a.name} в інтернет-магазині Столиця Пак.`,url:f(`/category/${a.slug}`),image:a.image_url,product:{"@context":"https://schema.org","@graph":[C(),rt([{name:"Головна",url:f("/")},{name:a.name,url:f(`/category/${a.slug}`)}])]}}),q(`
    <main>
      <section class="page-head category-head">
        <div>
          <span class="eyebrow">Категорія</span>
          <h1>${r(a.name)}</h1>
          <p>${r(a.description||"")}</p>
        </div>
        <img src="${r(a.image_url)}" alt="${r(a.name)}" loading="lazy" />
      </section>
      ${ut()}
    </main>
  `)):pt()}function Et(t){const a=i.products.find(y=>y.slug===t);if(!a)return pt();const e=Ct(a.id);jt(a);const s=Number(a.stock_quantity||0)>0,o=k(a.description,["Розмір","Размер"])||a.sku||"-",n=k(a.description,["Кількість","Количество","Упаковка"])||a.category_name||"-",c=k(a.description,["Матеріал","Материал"])||"-",p=k(a.description,["Призначення","Назначение"])||"-",$=r(a.description||"Якісна упаковка для щоденної роботи бізнесу та роздрібних покупців.").replace(/\n/g,"<br>");S({title:a.seo_title||`${a.name} - Столиця Пак`,description:a.seo_description||a.description,url:f(`/product/${a.slug}`),image:a.image_url,product:{"@context":"https://schema.org","@graph":[C(),rt([{name:"Головна",url:f("/")},{name:a.category_name,url:f(`/category/${a.category_slug}`)},{name:a.name,url:f(`/product/${a.slug}`)}]),{"@type":"Product",name:a.name,sku:a.sku,image:a.image_url,description:a.description,brand:{"@type":"Brand",name:"Столиця Пак"},offers:{"@type":"Offer",priceCurrency:"UAH",price:a.retail_price,availability:a.stock_quantity>0?"https://schema.org/InStock":"https://schema.org/OutOfStock",url:f(`/product/${a.slug}`)}}]}});const v=i.products.filter(y=>y.active&&y.category_slug===a.category_slug&&y.id!==a.id).slice(0,10);return q(`
    <main>
      <section class="product-page">
        <div class="product-gallery">
          <a class="product-main-photo" href="${r(a.image_url)}" target="_blank" rel="noopener" title="Відкрити фото у великому розмірі">
            <img src="${r(a.image_url)}" alt="${r(a.name)}" />
            <span>Збільшити фото</span>
          </a>
          <div class="product-thumbs" aria-label="Фото товару">
            <button class="active" type="button" aria-label="Основне фото"><img src="${r(a.image_url)}" alt="" /></button>
          </div>
        </div>
        <div class="product-detail">
          <a class="breadcrumb" href="/category/${a.category_slug}" data-link>${r(a.category_name)}</a>
          <h1>${r(a.name)}</h1>
          <div class="product-meta-line">
            <span>Артикул: <strong>${r(a.sku||"-")}</strong></span>
            <span>Категорія: <a href="/category/${a.category_slug}" data-link>${r(a.category_name)}</a></span>
          </div>
          <div class="product-buy-card" data-product-summary data-price="${Number(a.retail_price||0)}">
            <span class="stock-badge ${s?"in-stock":"preorder"}">${s?"В наявності":"Під замовлення"}</span>
            <div class="price-box">
              <strong>${g(a.retail_price)}</strong>
              <span>Оптова ціна: ${g(a.wholesale_price)}</span>
              <span>${s?`Залишок: ${a.stock_quantity} шт`:"Менеджер уточнить термін постачання"}</span>
            </div>
            <div class="product-qty-box">
              <span>Кількість</span>
              <div class="product-qty-control">
                <button type="button" data-product-qty-step="-1" ${s?"":"disabled"}>−</button>
                <input data-product-qty value="1" inputmode="numeric" ${s?"":"disabled"} />
                <button type="button" data-product-qty-step="1" ${s?"":"disabled"}>+</button>
              </div>
              <strong>Разом: <span data-product-total>${g(a.retail_price)}</span></strong>
            </div>
            <button class="add-btn wide product-page-add" data-add="${a.id}" ${s?"":"disabled"}>${d("cart")}До кошика</button>
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
          <p>${$}</p>
        </div>
        <div class="product-tab-panel" data-product-pane="specs">
          <h2>Характеристики</h2>
          <dl class="specs-list">
            <div><dt>SKU</dt><dd>${r(a.sku||"-")}</dd></div>
            <div><dt>Категорія</dt><dd>${r(a.category_name)}</dd></div>
            <div><dt>Розмір</dt><dd>${r(o)}</dd></div>
            <div><dt>В упаковці</dt><dd>${r(n)}</dd></div>
            <div><dt>Матеріал</dt><dd>${r(c)}</dd></div>
            <div><dt>Призначення</dt><dd>${r(p)}</dd></div>
            <div><dt>Роздрібна ціна</dt><dd>${g(a.retail_price)}</dd></div>
            <div><dt>Оптова ціна</dt><dd>${g(a.wholesale_price)}</dd></div>
            <div><dt>Наявність</dt><dd>${s?`${a.stock_quantity} шт`:"Під замовлення"}</dd></div>
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
          <p>Для оптових покупців діє окрема ціна: <strong>${g(a.wholesale_price)}</strong>. Залиште замовлення, і менеджер уточнить умови для вашого обсягу.</p>
        </div>
      </section>
      <section class="section product-trust">
        <div class="section-title">
          <div><span class="eyebrow">Довіра</span><h2>Чому купують у Столиця ПАК?</h2></div>
        </div>
        <div class="trust-grid">
          <article>${d("box")}<strong>Власне виробництво</strong><span>Пакувальні матеріали напряму від виробника.</span></article>
          <article>${d("shield")}<strong>Контроль якості</strong><span>Стежимо за якістю товарів перед відправкою.</span></article>
          <article>${d("percent")}<strong>Оптові ціни</strong><span>Окремі умови для магазинів, кафе та складів.</span></article>
          <article>${d("truck")}<strong>Швидка відправка</strong><span>Оперативно підтверджуємо і готуємо замовлення.</span></article>
          <article>${d("check")}<strong>Доставка по Україні</strong><span>Відправляємо замовлення в різні міста України.</span></article>
        </div>
      </section>
      ${v.length?`
        <section class="section related-products product-carousel-section">
          <div class="section-title">
            <div><span class="eyebrow">Схожі товари</span><h2>Ще з цієї категорії</h2></div>
          </div>
          <div class="product-carousel">${v.map(M).join("")}</div>
        </section>
      `:""}
      ${e.length?`
        <section class="section related-products recent-products product-carousel-section">
          <div class="section-title">
            <div><span class="eyebrow">Переглядали</span><h2>Нещодавно переглянуті товари</h2></div>
          </div>
          <div class="product-carousel recent-carousel">${e.map(M).join("")}</div>
        </section>
      `:""}
    </main>
  `)}function pt(){return S({title:"Сторінку не знайдено - Столиця Пак",description:"Сторінку не знайдено."}),q('<main><section class="page-head"><h1>Сторінку не знайдено</h1><a class="primary" href="/" data-link>На головну</a></section></main>')}function Bt(){const t=["paketi-majka","fasuvalni-paketi","paketi-bmw","paketi-z-logotipom","smittevi-paketi","odnorazovij-posud","gospodarski-tovari","polietilenovi-rukavichki","paketi-v-ruloni"],a={"paketi-majka":"Для магазинів, ринків та супермаркетів.","fasuvalni-paketi":"Для продуктів та харчових товарів.","paketi-bmw":"Міцні пакети великої вантажопідйомності.","paketi-z-logotipom":"Фірмова упаковка для впізнаваного бренду.","smittevi-paketi":"Міцні пакети для дому, офісу та складу.","odnorazovij-posud":"Посуд для кафе, доставки та подій.","gospodarski-tovari":"Все для чистоти, кухні та щоденної роботи.","polietilenovi-rukavichki":"Гігієнічний захист для їжі та сервісу.","paketi-v-ruloni":"Зручні рулони для фасування і пакування."},e={"paketi-majka":"Пакети Майка","smittevi-paketi":"Сміттєві пакети","polietilenovi-rukavichki":"Рукавички","paketi-v-ruloni":"Рулони"},s=[...i.categories].sort((c,p)=>{const $=t.indexOf(c.slug),v=t.indexOf(p.slug);return($===-1?99:$)-(v===-1?99:v)}),o=c=>i.products.filter(p=>p.active&&p.category_slug===c).length,n=c=>c%10===1&&c%100!==11?"товар":[2,3,4].includes(c%10)&&![12,13,14].includes(c%100)?"товари":"товарів";return`
    <section class="section categories" id="categories">
      <div class="section-title">
        <div><span class="eyebrow">Каталог</span><h2>Популярні категорії</h2><p>Швидко знайдіть потрібну упаковку для вашого бізнесу.</p></div>
      </div>
      <div class="category-grid">
        ${s.map(c=>{const p=o(c.slug);return`
          <a class="category-card" href="/category/${c.slug}" data-link>
            <span class="category-card-media">
              <img src="${r(c.image_url)}" alt="${r(e[c.slug]||c.name)}" loading="lazy" />
            </span>
            <span class="category-card-body">
              <strong>${r(e[c.slug]||c.name)}</strong>
              <small>${r(a[c.slug]||"Товари в наявності для опту та роздробу.")}</small>
              <span class="category-card-meta">${p} ${n(p)} в категорії</span>
              <span class="category-card-button">Переглянути ${d("arrow")}</span>
            </span>
          </a>
        `}).join("")}
      </div>
      <div class="category-catalog-action">
        <a class="primary" href="#catalog" data-link>${d("catalog")}Переглянути весь каталог</a>
      </div>
      <div class="category-seo">
        <h2>Упаковка для магазинів, кафе та виробництв</h2>
        <p>У каталозі зібрані основні категорії пакувальних матеріалів Столиця Пак: пакети майка, фасувальні пакети, пакети в рулонах, пакети з логотипом, господарські товари, одноразовий посуд, рукавички та сміттєві пакети. Обирайте категорію, переглядайте ціни й залишки та оформлюйте замовлення через кошик.</p>
      </div>
    </section>
  `}function zt(){return`
    <section class="section promo-section" id="promo">
      <div class="section-title">
        <div><span class="eyebrow">Пропозиції</span><h2>Швидкий вибір для бізнесу</h2><p>Найпопулярніші напрямки каталогу з фото, зрозумілими перевагами та прямим переходом до товарів.</p></div>
      </div>
      <div class="promo-grid">
        ${[{title:"Оптові ціни від виробника",text:"Вигідні умови для магазинів, складів, кафе та виробництв.",image:"/uploads/brand/commercial-hero.jpg",href:"/#catalog",label:"Перейти в каталог"},{title:"Пакети майка",text:"Популярні розміри, різні кольори та щільність для щоденної роботи.",image:"/uploads/brand/promo-maika.jpg",href:"/category/paketi-majka",label:"До категорії"},{title:"Фасувальні пакети",text:"Для продуктів, магазинів, дому та виробництва.",image:"/uploads/brand/promo-fasuvannya.jpg",href:"/category/fasuvalni-paketi",label:"До категорії"},{title:"Господарські товари",text:"Рушники, губки, рукавички та товари для чистоти щодня.",image:"/uploads/brand/promo-gospodarski.jpg",href:"/category/gospodarski-tovari",label:"До категорії"}].map(a=>`
          <a class="promo-card" href="${a.href}" data-link style="--promo-image:url('${a.image}')">
            <span>${d("percent")}Столиця Пак</span>
            <strong>${r(a.title)}</strong>
            <small>${r(a.text)}</small>
            <em>${r(a.label)} ${d("arrow")}</em>
          </a>
        `).join("")}
      </div>
    </section>
  `}function Ht(){const t=Lt();return`
    <section class="section catalog featured-catalog" id="catalog">
      <div class="section-title with-tools">
        <div>
          <span class="eyebrow">Популярне</span>
          <h2>Популярні товари</h2>
          <p>Показуємо 12 позицій для швидкого замовлення. Повний каталог доступний у категоріях.</p>
        </div>
        <a class="primary section-action" href="#categories" data-link>${d("catalog")}Перейти в каталог</a>
      </div>
      <div class="product-grid">
        ${t.map(M).join("")}
      </div>
    </section>
  `}function et(t,a,e,s){return e.length?`
    <section class="section catalog product-shelf">
      <div class="section-title with-tools">
        <div>
          <span class="eyebrow">${r(s)}</span>
          <h2>${r(t)}</h2>
          <p>${r(a)}</p>
        </div>
        <a class="secondary light" href="#categories" data-link>${d("catalog")}Усі категорії</a>
      </div>
      <div class="product-grid compact-grid">
        ${e.map(M).join("")}
      </div>
    </section>
  `:""}function It(){return`
    <section class="benefits" aria-label="Переваги">
      <article>${d("truck")}<strong>Швидка доставка</strong><span>Відправляємо замовлення по Україні після підтвердження.</span></article>
      <article>${d("box")}<strong>Власне виробництво</strong><span>Пакувальні матеріали напряму від виробника.</span></article>
      <article>${d("percent")}<strong>Оптові ціни</strong><span>Вигідні умови для магазинів, складів і виробництв.</span></article>
      <article>${d("check")}<strong>Якісний товар</strong><span>Фото, ціни, залишки та категорії зібрані в одному каталозі.</span></article>
    </section>
  `}function Ut(){return`
    <section class="section why-section">
      <div class="section-title">
        <div><span class="eyebrow">Чому ми</span><h2>Столиця Пак для дому, магазину та виробництва</h2><p>Ми зробили MVP-магазин максимально простим: оберіть категорію, додайте товар у кошик і залиште контакти для підтвердження замовлення.</p></div>
      </div>
      <div class="why-grid">
        <article>${d("box")}<strong>Великий асортимент</strong><span>Пакети майка, фасування, рулони, посуд, рукавички та господарські товари.</span></article>
        <article>${d("shield")}<strong>Зрозуміла наявність</strong><span>Залишок видно до оформлення, тому клієнт швидше приймає рішення.</span></article>
        <article>${d("phone")}<strong>Живе підтвердження</strong><span>Після заявки менеджер уточнює оплату, доставку та оптові умови.</span></article>
      </div>
    </section>
  `}function ut(){var a;const t=xt();return`
    <section class="section catalog" id="catalog">
      <div class="section-title with-tools">
        <div>
          <span class="eyebrow">Вітрина</span>
          <h2>${i.filters.category?r(((a=i.categories.find(e=>e.slug===i.filters.category))==null?void 0:a.name)||"Товари"):"Всі товари"}</h2>
          <p>${t.length} товарів знайдено</p>
        </div>
        <div class="tools">
          <label class="search"><span>${d("search")}Пошук</span><input data-filter="q" type="search" placeholder="Назва, SKU, категорія" value="${r(i.filters.q)}" /></label>
          <select data-filter="category" aria-label="Категорія">
            <option value="">Усі категорії</option>
            ${i.categories.map(e=>`<option value="${e.slug}" ${i.filters.category===e.slug?"selected":""}>${r(e.name)}</option>`).join("")}
          </select>
          <select data-filter="sort" aria-label="Сортування">
            <option value="featured" ${i.filters.sort==="featured"?"selected":""}>Спочатку популярні</option>
            <option value="price-asc" ${i.filters.sort==="price-asc"?"selected":""}>Ціна зростає</option>
            <option value="price-desc" ${i.filters.sort==="price-desc"?"selected":""}>Ціна спадає</option>
          </select>
          <label class="check"><input type="checkbox" data-filter="inStock" ${i.filters.inStock?"checked":""} /> В наявності</label>
        </div>
      </div>
      <div class="product-grid">
        ${t.length?t.map(M).join(""):'<div class="no-results">Нічого не знайдено.</div>'}
      </div>
    </section>
  `}function M(t){const a=k(t.description,["Розмір","Размер"])||t.sku||"Уточнюйте",e=k(t.description,["Кількість","Количество","Упаковка"])||t.category_name||"Упаковка",s=Number(t.stock_quantity||0)>0,o=$t(t);return`
    <article class="product-card">
      <a href="/product/${t.slug}" data-link class="quick-view">
        <img src="${r(t.image_url)}" alt="${r(t.name)}" loading="lazy" />
      </a>
      <div class="product-info">
        <div class="product-card-top">
          <span class="stock-badge ${s?"in-stock":"preorder"}">${s?"В наявності":"Під замовлення"}</span>
          <span class="product-card-badges">${o.map(n=>`<span class="promo-badge ${n.type}">${r(n.text)}</span>`).join("")}</span>
        </div>
        <h3><a href="/product/${t.slug}" data-link>${r(t.name)}</a></h3>
        <dl class="product-specs">
          <div><dt>Розмір</dt><dd>${r(E(a,34))}</dd></div>
          <div><dt>В упаковці</dt><dd>${r(E(e,34))}</dd></div>
        </dl>
        <div class="product-bottom">
          <div class="product-price"><strong>${g(t.retail_price)}</strong><span>Опт: ${g(t.wholesale_price)}</span></div>
          <div class="product-actions">
            <button class="add-btn product-add" data-add="${t.id}" ${s?"":"disabled"}>${d("cart")}До кошика</button>
            <a class="details-btn" href="/product/${t.slug}" data-link>Детальніше</a>
          </div>
          <div class="product-perks">
            <span>🚚 Швидка доставка</span>
            <span>🏭 Від виробника</span>
            <span>🇺🇦 Доставка по Україні</span>
          </div>
        </div>
      </div>
    </article>
  `}function Dt(){return`
    <section class="info-grid" id="delivery">
      <article>${d("truck")}<span class="eyebrow">Доставка</span><h2>Доставка по Україні</h2><p>Під час оформлення замовлення вкажіть місто та відділення Нової Пошти. Менеджер підтвердить деталі телефоном.</p></article>
      <article id="payment">${d("card")}<span class="eyebrow">Оплата</span><h2>Оплата після підтвердження</h2><p>Онлайн-оплата поки не підключена. Замовлення зберігається в адмін-панелі, менеджер узгоджує оплату та доставку.</p></article>
    </section>
  `}function Wt(){return`
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
  `}function Xt(){return`
    <section class="section contacts-section" id="contacts">
      <div>
        <span class="eyebrow">Контакти</span>
        <h2>Потрібна консультація щодо упаковки?</h2>
        <p>Зателефонуйте або оформіть замовлення через кошик. Ми допоможемо підібрати розмір, щільність і кількість.</p>
      </div>
      <div class="contact-actions">
        <a class="primary" href="tel:+380501308187">${d("phone")}+38 (050) 130-81-87</a>
        <a class="secondary light" href="mailto:solodovnik.ak@gmail.com">${d("message")}Написати на email</a>
      </div>
    </section>
  `}function x(){var n;const t=document.querySelector("[data-cart-panel]"),a=i.cart.reduce((c,p)=>c+p.quantity,0),e=document.querySelector("[data-cart-count]");if(e&&(e.textContent=String(a)),!t)return;const s=it(),o=s.reduce((c,p)=>c+p.retail_price*p.quantity,0);t.innerHTML=`
    <div class="cart-head">
      <div><span>Ваш кошик</span><strong>${s.length?`${a} товарів`:"Порожній"}</strong></div>
      <button class="icon-btn cart-close" data-close-cart aria-label="Закрити кошик">${d("close")}<span>Закрити</span></button>
    </div>
    ${s.length?`
      <div class="cart-body">
        <div class="cart-list" aria-label="Товари в кошику">
          ${s.map(c=>`
          <div class="cart-item">
            <img src="${r(c.image_url)}" alt="${r(c.name)}" />
            <div class="cart-item-info">
              <strong>${r(c.name)}</strong>
              <span class="cart-item-price">${g(c.retail_price)} / шт</span>
              <div class="qty">
                <button data-qty="${c.id}" data-delta="-1" aria-label="Зменшити кількість">−</button>
                <input data-qty-input="${c.id}" value="${c.quantity}" inputmode="numeric" aria-label="Кількість товару" />
                <button data-qty="${c.id}" data-delta="1" aria-label="Збільшити кількість">+</button>
              </div>
              <button class="remove" data-remove="${c.id}">Видалити</button>
            </div>
            <div class="cart-line-total">
              <span>Сума</span>
              <strong>${g(c.retail_price*c.quantity)}</strong>
            </div>
          </div>
        `).join("")}
        </div>
        <section class="cart-summary" aria-label="Підсумок замовлення">
          <div class="checkout-total">
            <span>Разом</span>
            <strong>${g(o)}</strong>
          </div>
          <div class="cart-summary-row"><span>Кількість товарів</span><strong>${a}</strong></div>
          <div class="cart-trust">
            <span>🚚 Доставка по Україні</span>
            <span>💰 Опт та роздріб</span>
            <span>🏭 Від виробника</span>
            <span>📞 Підтвердимо замовлення телефоном</span>
          </div>
          <button class="primary checkout-anchor" type="button" data-show-checkout>${d("check")}Оформити замовлення</button>
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
          <button type="submit">${d("check")}Оформити замовлення</button>
        </form>
      </div>
    `:`
      <div class="empty-cart">
        <div class="empty-cart-icon">${d("cart")}</div>
        <strong>Ваш кошик порожній</strong>
        <p>Додайте товари з каталогу, а ми швидко підтвердимо замовлення телефоном.</p>
        <a class="primary" href="/#catalog" data-link data-close-cart>${d("catalog")}Перейти в каталог</a>
      </div>
    `}
  `,(n=t.querySelector("button[data-close-cart]"))==null||n.addEventListener("click",c=>{var p;c.preventDefault(),(p=document.querySelector("[data-cart-drawer]"))==null||p.classList.remove("open")})}async function mt(){S({title:"Адмін-панель - Столиця Пак",description:"Керування товарами, категоріями, банерами та замовленнями."});const t=await u.get("/api/admin/session");if(i.adminAuthenticated=t.authenticated,!i.adminAuthenticated){lt();return}await gt(),document.querySelector("#app").innerHTML=q(`
    <main class="admin">
      <section class="page-head"><span class="eyebrow">Адміністрування</span><h1>Адмін-панель</h1><p>Керуйте товарами, категоріями, банерами та замовленнями.</p><button class="secondary admin-logout" data-admin-logout>Вийти</button></section>
      <nav class="admin-tabs">
        <button data-admin-tab="products">Товари</button>
        <button data-admin-tab="categories">Категорії</button>
        <button data-admin-tab="banners">Баннери</button>
        <button data-admin-tab="orders">Замовлення</button>
        <button data-admin-tab="import">Імпорт</button>
      </nav>
      <section data-admin-content>${j()}</section>
    </main>
  `),x()}async function gt(){const[t,a,e,s,o]=await Promise.all([u.get("/api/admin/products"),u.get("/api/admin/categories"),u.get("/api/admin/banners"),u.get("/api/admin/orders"),u.get("/api/admin/imports")]);i.admin.products=t.items,i.admin.categories=a.items,i.admin.banners=e.items,i.admin.orders=s.items,i.admin.imports=o.items}function j(t={}){return`
    <div class="admin-grid">
      <form class="admin-form" data-product-form data-id="${t.id||""}">
        <h2>${t.id?"Редагувати товар":"Новий товар"}</h2>
        ${h("name","Назва",t.name,!0)}
        ${h("sku","SKU",t.sku)}
        ${h("slug","Slug",t.slug)}
        <label>Категорія<select name="category_id" required>${i.admin.categories.map(a=>`<option value="${a.id}" ${Number(t.category_id)===Number(a.id)?"selected":""}>${r(a.name)}</option>`).join("")}</select></label>
        <label>Опис<textarea name="description">${r(t.description||"")}</textarea></label>
        ${h("retail_price","Роздрібна ціна",t.retail_price||0,!0,"number")}
        ${h("wholesale_price","Оптова ціна",t.wholesale_price||0,!1,"number")}
        ${h("stock_quantity","Залишок",t.stock_quantity||0,!1,"number")}
        ${I("image_url",t.image_url)}
        <label class="check"><input name="active" type="checkbox" ${t.active??!0?"checked":""} /> Активний</label>
        <label class="check"><input name="featured" type="checkbox" ${t.featured?"checked":""} /> Популярний</label>
        ${h("seo_title","SEO title",t.seo_title)}
        <label>SEO description<textarea name="seo_description">${r(t.seo_description||"")}</textarea></label>
        <button type="submit">Зберегти товар</button>
      </form>
      <div class="admin-list">
        ${i.admin.products.map(a=>`
          <div class="admin-row">
            <img src="${r(a.image_url)}" alt="" />
            <div><strong>${r(a.name)}</strong><span>${r(a.sku||"")} · ${g(a.retail_price)} · ${a.stock_quantity} шт</span></div>
            <button data-edit-product="${a.id}">Редагувати</button>
            <button data-delete-product="${a.id}">Видалити</button>
          </div>
        `).join("")}
      </div>
    </div>
  `}function B(t={}){return`
    <div class="admin-grid">
      <form class="admin-form" data-category-form data-id="${t.id||""}">
        <h2>${t.id?"Редагувати категорію":"Нова категорія"}</h2>
        ${h("name","Назва",t.name,!0)}
        ${h("slug","Slug",t.slug)}
        <label>Опис<textarea name="description">${r(t.description||"")}</textarea></label>
        ${I("image_url",t.image_url)}
        ${h("sort_order","Сортування",t.sort_order||0,!1,"number")}
        <label class="check"><input name="active" type="checkbox" ${t.active??!0?"checked":""} /> Активна</label>
        <button type="submit">Зберегти категорію</button>
      </form>
      <div class="admin-list">${i.admin.categories.map(a=>`
        <div class="admin-row"><img src="${r(a.image_url)}" alt="" /><div><strong>${r(a.name)}</strong><span>${r(a.slug)}</span></div><button data-edit-category="${a.id}">Редагувати</button><button data-delete-category="${a.id}">Видалити</button></div>
      `).join("")}</div>
    </div>
  `}function z(t={}){return`
    <div class="admin-grid">
      <form class="admin-form" data-banner-form data-id="${t.id||""}">
        <h2>${t.id?"Редагувати банер":"Новий банер"}</h2>
        ${h("title","Заголовок",t.title,!0)}
        <label>Підзаголовок<textarea name="subtitle">${r(t.subtitle||"")}</textarea></label>
        ${I("image_url",t.image_url)}
        ${h("link_url","Посилання",t.link_url||"#catalog")}
        ${h("button_text","Текст кнопки",t.button_text||"До каталогу")}
        ${h("sort_order","Сортування",t.sort_order||0,!1,"number")}
        <label class="check"><input name="active" type="checkbox" ${t.active??!0?"checked":""} /> Активний</label>
        <button type="submit">Зберегти банер</button>
      </form>
      <div class="admin-list">${i.admin.banners.map(a=>`
        <div class="admin-row"><img src="${r(a.image_url)}" alt="" /><div><strong>${r(a.title)}</strong><span>${r(a.subtitle||"")}</span></div><button data-edit-banner="${a.id}">Редагувати</button><button data-delete-banner="${a.id}">Видалити</button></div>
      `).join("")}</div>
    </div>
  `}function ht(){return`
    <div class="admin-list orders">
      ${i.admin.orders.length?i.admin.orders.map(t=>`
        <div class="order-card">
          <div class="order-head">
            <strong>Замовлення #${t.id} · ${g(t.total)}</strong>
            <select data-order-status="${t.id}">
              ${["new","processing","packed","sent","done","cancelled"].map(a=>`<option value="${a}" ${t.status===a?"selected":""}>${a}</option>`).join("")}
            </select>
          </div>
          <p>${r(t.customer_name)} · ${r(t.phone)} · ${r(t.city)} · ${r(t.nova_poshta_branch)}</p>
          <ul>${t.items.map(a=>`<li>${r(a.name)} x ${a.quantity} = ${g(a.total)}</li>`).join("")}</ul>
          ${t.comment?`<p>Коментар: ${r(t.comment)}</p>`:""}
        </div>
      `).join(""):'<div class="empty">Замовлень ще немає.</div>'}
    </div>
  `}function vt(){return`
    <form class="admin-form import-form" data-import-form>
      <h2>Імпорт товарів CSV/XLSX</h2>
      <p>Поля: category_slug, category_name, sku, slug, name, description, retail_price, wholesale_price, stock_quantity, image_url, active, featured, seo_title, seo_description.</p>
      <input type="file" name="file" accept=".csv,.xlsx" required />
      <button type="submit">Імпортувати</button>
    </form>
    <div class="admin-list">${i.admin.imports.map(t=>`<div class="admin-row"><div><strong>${r(t.filename)}</strong><span>${t.status}: ${t.rows_success}/${t.rows_total}, помилок ${t.rows_failed}</span></div></div>`).join("")}</div>
  `}function h(t,a,e="",s=!1,o="text"){return`<label>${a}<input name="${t}" type="${o}" value="${r(e??"")}" ${s?"required":""} /></label>`}function I(t,a=""){return`<label>Зображення<input name="${t}" value="${r(a||"")}" placeholder="/uploads/image.webp або https://..." /></label><label>Завантажити файл<input type="file" data-upload-target="${t}" accept="image/*" /></label>`}function w(t){const a=Object.fromEntries(new FormData(t).entries());return t.querySelectorAll('input[type="checkbox"]').forEach(e=>a[e.name]=e.checked),a}async function b(t="products"){await H(),await gt();const a=document.querySelector("[data-admin-content]");a&&(a.innerHTML=t==="categories"?B():t==="banners"?z():t==="orders"?ht():t==="import"?vt():j())}function N(t,a=1800){const e=document.querySelector("[data-toast]");e&&(e.textContent=t,e.classList.add("show"),setTimeout(()=>e.classList.remove("show"),a))}function ft(t){if(!t)return;const a=t.querySelector("[data-product-qty]"),e=t.querySelector("[data-product-total]"),s=Number(t.dataset.price||0),o=Math.max(1,Number(a==null?void 0:a.value)||1);a&&(a.value=o),e&&(e.textContent=g(s*o))}async function Jt(t){const a=t.querySelector("[data-checkout-error]"),e=qt(t);if(t.classList.toggle("was-validated",!!e.length),e.length){a&&(a.hidden=!1,a.innerHTML=e.map(c=>`<div>${r(c)}</div>`).join("")),N(e[0]);return}const s=w(t);s.phone=ct(s.phone);const o={...s,items:i.cart.map(c=>({product_id:c.product_id,quantity:c.quantity}))},n=await u.send("/api/orders","POST",o);i.cart=[],P(),document.querySelector("[data-cart-drawer]").classList.remove("open"),await H(),A(),N(`Дякуємо! Замовлення прийнято. Номер #${n.id}`,5200)}async function A(){i.products.length||await H();const t=kt();if(i.filters.category="",t==="/admin")return mt();t.startsWith("/category/")?document.querySelector("#app").innerHTML=Ot(t.split("/").pop()):t.startsWith("/product/")?document.querySelector("#app").innerHTML=Et(t.split("/").pop()):document.querySelector("#app").innerHTML=At(),x()}document.addEventListener("click",async t=>{var R,V,K,Q,G,Y,Z,tt,at;const a=t.target.closest("[data-link]"),e=t.target.closest("[data-add]"),s=t.target.closest("[data-open-cart]"),o=t.target.closest("[data-close-cart]"),n=t.target.closest("[data-qty]"),c=t.target.closest("[data-remove]"),p=t.target.closest("[data-admin-tab]"),$=t.target.closest("[data-menu]"),v=t.target.closest("[data-catalog-toggle]"),y=t.target.closest("[data-admin-logout]"),T=t.target.closest("[data-product-tab]"),O=t.target.closest("[data-product-qty-step]"),bt=t.target.closest("[data-show-checkout]");if(a&&((R=a.getAttribute("href"))!=null&&R.startsWith("/"))&&(t.preventDefault(),(V=document.querySelector("[data-nav]"))==null||V.classList.remove("open"),(K=document.querySelector("[data-catalog-menu]"))==null||K.classList.remove("open"),wt(a.getAttribute("href"))),T){const l=T.closest(".product-tabs-section");l==null||l.querySelectorAll("[data-product-tab]").forEach(m=>m.classList.toggle("active",m===T)),l==null||l.querySelectorAll("[data-product-pane]").forEach(m=>m.classList.toggle("active",m.dataset.productPane===T.dataset.productTab))}if(O){const l=O.closest("[data-product-summary]"),m=l==null?void 0:l.querySelector("[data-product-qty]");m&&(m.value=Math.max(1,(Number(m.value)||1)+Number(O.dataset.productQtyStep||0))),ft(l)}if(e){const l=e.closest("[data-product-summary]"),m=l?Number(((Q=l.querySelector("[data-product-qty]"))==null?void 0:Q.value)||1):1;_t(Number(e.dataset.add),m)}if(s&&document.querySelector("[data-cart-drawer]").classList.add("open"),o&&document.querySelector("[data-cart-drawer]").classList.remove("open"),bt&&(t.preventDefault(),(G=document.querySelector("#checkout-form"))==null||G.scrollIntoView({behavior:"smooth",block:"start"})),t.target.matches("[data-cart-drawer]")&&document.querySelector("[data-cart-drawer]").classList.remove("open"),$&&((Y=document.querySelector("[data-nav]"))==null||Y.classList.toggle("open")),v){const l=v.closest("[data-catalog-menu]"),m=!l.classList.contains("open");l.classList.toggle("open",m),v.setAttribute("aria-expanded",String(m))}if(t.target.closest(".topbar")||((Z=document.querySelector("[data-nav]"))==null||Z.classList.remove("open"),(tt=document.querySelector("[data-catalog-menu]"))==null||tt.classList.remove("open")),y&&(await u.send("/api/admin/logout","POST",{}),i.adminAuthenticated=!1,lt()),n){const l=((at=i.cart.find(m=>Number(m.product_id)===Number(n.dataset.qty)))==null?void 0:at.quantity)||1;nt(Number(n.dataset.qty),l+Number(n.dataset.delta))}if(c&&St(Number(c.dataset.remove)),p){const l=p.dataset.adminTab;document.querySelector("[data-admin-content]").innerHTML=l==="categories"?B():l==="banners"?z():l==="orders"?ht():l==="import"?vt():j()}const U=t.target.closest("[data-edit-product]"),D=t.target.closest("[data-edit-category]"),W=t.target.closest("[data-edit-banner]"),X=t.target.closest("[data-delete-product]"),J=t.target.closest("[data-delete-category]"),F=t.target.closest("[data-delete-banner]");U&&(document.querySelector("[data-admin-content]").innerHTML=j(_(i.admin.products,U.dataset.editProduct))),D&&(document.querySelector("[data-admin-content]").innerHTML=B(_(i.admin.categories,D.dataset.editCategory))),W&&(document.querySelector("[data-admin-content]").innerHTML=z(_(i.admin.banners,W.dataset.editBanner))),X&&confirm("Видалити товар?")&&(await u.send(`/api/admin/products/${X.dataset.deleteProduct}`,"DELETE",{}),await b("products")),J&&confirm("Видалити категорію?")&&(await u.send(`/api/admin/categories/${J.dataset.deleteCategory}`,"DELETE",{}),await b("categories")),F&&confirm("Видалити банер?")&&(await u.send(`/api/admin/banners/${F.dataset.deleteBanner}`,"DELETE",{}),await b("banners"))});document.addEventListener("input",t=>{if(t.target.matches('[name="phone"]')&&(t.target.value=ct(t.target.value)),t.target.matches("[data-filter]")){const a=t.target.dataset.filter;i.filters[a]=t.target.type==="checkbox"?t.target.checked:t.target.value;const e=document.querySelector(".catalog");e&&(e.outerHTML=ut())}if(t.target.matches("[data-live-search]")){const a=t.target.closest("[data-live-search-box]");a&&(a.outerHTML=dt(t.target.value));const e=document.querySelector("[data-live-search]");e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))}t.target.matches("[data-qty-input]")&&nt(Number(t.target.dataset.qtyInput),t.target.value),t.target.matches("[data-product-qty]")&&ft(t.target.closest("[data-product-summary]"))});document.addEventListener("change",async t=>{if(t.target.matches("[data-upload-target]")&&t.target.files[0]){const a=await u.upload("/api/admin/upload","image",t.target.files[0]);t.target.closest("form").querySelector(`[name="${t.target.dataset.uploadTarget}"]`).value=a.url}t.target.matches("[data-order-status]")&&(await u.send(`/api/admin/orders/${t.target.dataset.orderStatus}`,"PUT",{status:t.target.value}),await b("orders"))});document.addEventListener("submit",async t=>{t.preventDefault();try{if(t.target.matches("[data-admin-login]")){const a=w(t.target);await u.send("/api/admin/login","POST",{password:a.password}),i.adminAuthenticated=!0,await mt();return}if(t.target.matches("[data-checkout]")&&await Jt(t.target),t.target.matches("[data-product-form]")){const a=t.target.dataset.id;await u.send(a?`/api/admin/products/${a}`:"/api/admin/products","PUT",w(t.target)),await b("products")}if(t.target.matches("[data-category-form]")){const a=t.target.dataset.id;await u.send(a?`/api/admin/categories/${a}`:"/api/admin/categories","PUT",w(t.target)),await b("categories")}if(t.target.matches("[data-banner-form]")){const a=t.target.dataset.id;await u.send(a?`/api/admin/banners/${a}`:"/api/admin/banners","PUT",w(t.target)),await b("banners")}if(t.target.matches("[data-import-form]")){const a=t.target.file.files[0],e=await u.upload("/api/admin/import","file",a);N(`Імпортовано ${e.rows_success} рядків`),await b("import")}}catch(a){N(a.message)}});window.addEventListener("popstate",A);A().catch(t=>{document.querySelector("#app").innerHTML=`<main class="page-head"><h1>Помилка запуску</h1><p>${r(t.message)}</p></main>`});
