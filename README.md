# Столиця Пак MVP Store

Рабочий минимальный интернет-магазин для `packing.in.ua`: витрина, корзина, оформление заказа, SQLite-база и простая админ-панель.

## Архитектура

```text
stolitsya-pack/
  src/                 Vite SPA: витрина + /admin
  server.py            backend API + static server + SQLite
  data/store.sqlite    база данных SQLite
  uploads/             загруженные изображения
  imports/             шаблон CSV и импортируемые файлы
  integrations/        место для будущих adapters
  dist/                production build
```

Backend написан на Python stdlib и SQLite, чтобы проект запускался без сложной инфраструктуры. Таблицы сделаны так, чтобы позже можно было перенести данные в PostgreSQL.

## Что реализовано

- Категории товаров.
- Карточки товаров.
- Страница товара `/product/:slug`.
- Страница категории `/category/:slug`.
- Поиск и фильтры.
- Корзина в браузере.
- Оформление заказа без онлайн-оплаты: имя, телефон, город, отделение Новой Почты, комментарий.
- Сохранение заказов в SQLite.
- Админ-панель `/admin`.
- Добавление, редактирование и удаление товаров.
- Добавление, редактирование и удаление категорий.
- Загрузка изображений товаров и баннеров.
- Управление ценами, остатками, активностью товара.
- Управление баннерами главной.
- Просмотр заказов и смена статусов.
- Простая защита админ-панели паролем.
- Импорт товаров из CSV/XLSX.
- SEO для главной, категорий и товаров.
- `robots.txt`, `sitemap.xml`, JSON-LD.
- Google Merchant feed: `/feeds/google.xml`.
- XML feed: `/feeds/products.xml`.

## Что пока не реализовано

- Онлайн-оплата WayForPay не подключена. Заказы сохраняются локально, оплату подтверждает менеджер.
- API Новой Пошты не подключен. Клиент вводит город и отделение вручную.
- CRM не подключена. В `integrations/` оставлено место для будущего adapter layer.
- Текущая авторизация админки минимальная: один пароль и cookie-сессия. Перед продакшеном задайте сильные `ADMIN_PASSWORD` и `ADMIN_SESSION_SECRET`, а для нескольких менеджеров добавьте пользователей/роли.

## Запуск

```bash
pnpm install
pnpm build
python3 server.py
```

Открыть:

```text
http://127.0.0.1:8000/
http://127.0.0.1:8000/admin
```

Пароль админки по умолчанию:

```text
admin123
```

Для запуска с собственным паролем:

```bash
ADMIN_PASSWORD="strong-password" ADMIN_SESSION_SECRET="random-secret" python3 server.py
```

## Импорт CSV/XLSX

Шаблон: `imports/products-template.csv`.

Поддерживаемые поля:

```text
category_slug, category_name, sku, slug, name, description,
retail_price, wholesale_price, stock_quantity, image_url,
active, featured, seo_title, seo_description
```

Импорт доступен в админке во вкладке `Імпорт`. Товары обновляются по `sku`.

## Будущие улучшения

- Добавить полноценные роли пользователей в админ-панели.
- Подключить WayForPay adapter.
- Подключить Новую Почту для выбора городов/отделений.
- Подключить CRM adapter, когда будет выбрана CRM.
- Перенести SQLite в PostgreSQL при росте нагрузки.
