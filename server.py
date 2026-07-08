#!/usr/bin/env python3
import csv
from email.parser import BytesParser
from email.policy import default as email_policy
import hashlib
import html
import json
import os
import re
import secrets
import shutil
import sqlite3
import sys
import time
import zipfile
from http import HTTPStatus
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"
DATA = ROOT / "data"
UPLOADS = ROOT / "uploads"
IMPORTS = ROOT / "imports"
DB_PATH = DATA / "store.sqlite"
BASE_URL = os.environ.get("STORE_BASE_URL", "http://127.0.0.1:8000")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
ADMIN_SESSION_SECRET = os.environ.get("ADMIN_SESSION_SECRET", "change-me-before-production")

DATA.mkdir(exist_ok=True)
UPLOADS.mkdir(exist_ok=True)
IMPORTS.mkdir(exist_ok=True)


SEED_CATEGORIES = [
    ("10985", "pakety-mayka", "Пакети «Майка»", "Поліетиленові пакети типу майка для магазинів, аптек та побуту.", "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/df60062d1884de700443ac83ca5490bd-6_small_square.webp", 10, 1),
    ("10986", "fasuvalni-pakety", "Фасувальні пакети", "Прозорі фасувальні пакети для продуктів, випічки та дрібних товарів.", "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/14892daa067624d4a929ab61cf2fbf4d-1_small_square.webp", 20, 1),
    ("10987", "pakety-z-logotypom", "Пакети з логотипом", "Пакети з принтами та брендована упаковка для бізнесу.", "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/729bd002bf8dd7b4020a2f894792cd6d-1_small_square.webp", 30, 1),
    ("11056", "bmw", "Пакети BMW", "Щільні пакети BMW різних форматів.", "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/f2807456e42f39a122c51d3794446774-9_small_square.webp", 40, 1),
    ("11059", "pakety-v-ruloni", "Пакети в рулоні", "Рулонні пакети для фасування та самообслуговування.", "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/3a92353099db1ca6c5971771055f6121-0_small_square.webp", 50, 1),
    ("11058", "polietylenovi-rukavychky", "Поліетиленові рукавички", "Одноразові поліетиленові рукавички для сервісу, торгівлі та побуту.", "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/608f328f6b121683128d74120f9b1b08-1_small_square.webp", 60, 1),
    ("11057", "smittievi-pakety", "Сміттєві пакети", "Міцні пакети для сміття для дому, офісу та HoReCa.", "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/86d29d9f58a64cdb0492c406d3652223-3_small_square.webp", 70, 1),
    ("10988", "odnorazovyi-posud", "Одноразовий посуд", "Одноразовий посуд для кав'ярень, офісів та подій.", "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/3768de3d795778368e5226f37a4a0094-4_small_square.webp", 80, 1),
    ("10984", "hoz-tovary", "Господарські товари", "Господарські товари для пакування, прибирання та побуту.", "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/08035f4f60682cceecff3f6e624b8a24-1_small_square.webp", 90, 1),
]


SEED_PRODUCTS = [
    ("562569", "10985", "PK-562569", "paket-mayka-22x36-100", "пакет майка 22 Х 36 (100 шт)", "Міцний пакет типу майка для магазинів, аптек та щоденного використання.", 25, 22, 240, "https://wfpstorage.s3-eu-west-1.amazonaws.com/products/prod.old/e3b5b2920bf7f3b7d731d3cfc6e17f7a/c7cb49cceda3af464227121c72b677ff_1744878776.webp", 1, 1),
    ("552820", "10987", "PK-552820", "paket-vyshyvanka-30x55-100", "Пакет поліетиленовий «майка» «Вишиванка» 30x55 см, упаковка 100 шт", "Декоративний пакет майка з українським принтом для роздрібної торгівлі.", 120, 108, 80, "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/34ab0afdc114242216a5d186cf71945d-6_wide.webp", 1, 1),
    ("552823", "10987", "PK-552823", "paket-gazeta-30x50-100", "Пакет поліетиленовий «майка» «Газета» 30x50 см, упаковка 100 шт", "Пакет з принтом для магазинів одягу, сувенірів і товарів повсякденного попиту.", 100, 92, 65, "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/1023d1de3a9b744cb8ad43b4c57e0e0f-2_wide.webp", 1, 1),
    ("552886", "11056", "PK-552886", "paket-bmw-40x60-50", "Пакет поліетиленовий BMW «майка» 40x60 см, упаковка 50 шт", "Великий поліетиленовий пакет BMW формату 40x60 см для об'ємних покупок.", 150, 138, 48, "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/67dfff87d85095b1dcf99da9fb258069-9_wide.webp", 1, 1),
    ("552920", "10986", "PK-552920", "paket-fasuvannia-26x35-eko", "Пакет для фасування 18/4/35 (26x35 см) еко, 900 г", "Прозорі фасувальні пакети для продуктів, овочів, випічки та побутових товарів.", 130, 119, 90, "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/998cd9eb8ac4d3ad43f44ce60035310c-6_wide.webp", 1, 1),
    ("552921", "10986", "PK-552921", "paket-fasuvalnyi-18x27", "Пакет фасувальний поліетиленовий 10/4/27 (18x27 см)", "Компактний фасувальний пакет для невеликих продуктів і дрібної упаковки.", 65, 58, 150, "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/311e018559570c447742548820bac2ea-4_wide.webp", 1, 1),
    ("552946", "10985", "PK-552946", "paket-mayka-22x38-lux-200", "Пакет поліетиленовий «майка» 22x38 см Люкс, упаковка 200 шт", "Пакети майка підвищеної міцності у великій упаковці 200 шт.", 54, 49, 125, "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/6c6d60ca4b8cc6a639a3870421b66961-1_wide.webp", 1, 1),
    ("562774", "10986", "PK-562774", "paket-fasuvalnyi-18x35", "Пакет фасувальний 18x35 | Прозорий пакет для пакування продуктів", "Універсальні прозорі пакети для пакування продуктів у магазинах і кафе.", 170, 156, 72, "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/d8842aa2df9effff4d19f50d031eb205-1_wide.webp", 1, 1),
    ("562770", "10986", "PK-562770", "paket-fasuvalnyi-14x32", "Пакет фасувальний 14x32 | Прозорий пакет для пакування продуктів", "Фасувальний пакет середнього розміру для продуктів і дрібних товарів.", 120, 110, 84, "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/66e5529c79088c883d07c6a848cb04ee-6_wide.webp", 1, 1),
    ("565573", "10985", "PK-565573", "paket-mayka-24x42-100", "Пакет поліетиленовий «майка» 24x42 см, упаковка 100 шт", "Пакет майка збільшеного розміру для продуктових і господарських магазинів.", 30, 27, 180, "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/178c0f0ac994a20fff05e087786dd87d-7_wide.webp", 1, 1),
    ("565898", "10987", "PK-565898", "paket-klubnika-30x55-100", "Пакет поліетиленовий «майка» «Клубника» 30x55 см, упаковка 100 шт", "Яскравий пакет з принтом для магазинів, ринків та сезонних товарів.", 120, 108, 76, "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/2af323bf6c2cc7c0d139757818792acd-6_wide.webp", 1, 1),
    ("565899", "11056", "PK-565899", "paket-bmw-40x60-52mkm-50", "Пакет поліетиленовий BMW «майка» 40x60 см, 52 мкм, упаковка 50 шт", "Щільний пакет BMW 52 мкм для важчих покупок і презентабельної упаковки.", 170, 158, 44, "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/e6c3087c42954b6dec7e079b5c73ea3b-7_wide.webp", 1, 1),
    ("660001", "11059", "PK-660001", "pakety-v-ruloni-24x42-100", "Пакети в рулоні 24x42 см, 100 шт", "Рулонні пакети для торгових залів, кухні, фасування продуктів та самообслуговування.", 48, 43, 110, "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/3a92353099db1ca6c5971771055f6121-0_small_square.webp", 1, 0),
    ("660002", "11058", "PK-660002", "polietylenovi-rukavychky-100", "Поліетиленові рукавички одноразові, 100 шт", "Одноразові рукавички для роботи з продуктами, прибирання та сервісних зон.", 35, 31, 260, "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/608f328f6b121683128d74120f9b1b08-1_small_square.webp", 1, 0),
    ("660003", "11057", "PK-660003", "smittievi-pakety-35l-30", "Сміттєві пакети міцні 35 л, 30 шт", "Пакети для сміття для офісів, кафе, магазинів та домашнього використання.", 42, 38, 140, "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/86d29d9f58a64cdb0492c406d3652223-3_small_square.webp", 1, 0),
    ("660004", "10988", "PK-660004", "odnorazovi-stakany-180ml-100", "Одноразові стакани 180 мл, 100 шт", "Одноразовий посуд для кав'ярень, офісів, кейтерингу та подій.", 78, 70, 95, "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/3768de3d795778368e5226f37a4a0094-4_small_square.webp", 1, 0),
    ("660005", "10984", "PK-660005", "hospodarski-tovary-pakuvannia", "Господарські товари для пакування та прибирання", "Базові господарські товари для магазинів, складів, офісів та побуту.", 95, 86, 60, "https://cdn.wayforpay.shop/image/8412670cc10f39db2e3285faaac95c5e/08035f4f60682cceecff3f6e624b8a24-1_small_square.webp", 1, 0),
]


def slugify(value):
    value = value.lower().strip()
    translit = {
        "а": "a", "б": "b", "в": "v", "г": "h", "ґ": "g", "д": "d", "е": "e", "є": "ie", "ж": "zh",
        "з": "z", "и": "y", "і": "i", "ї": "i", "й": "i", "к": "k", "л": "l", "м": "m", "н": "n",
        "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "kh", "ц": "ts",
        "ч": "ch", "ш": "sh", "щ": "shch", "ь": "", "ю": "iu", "я": "ia", "ы": "y", "э": "e", "ъ": "",
    }
    value = "".join(translit.get(ch, ch) for ch in value)
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or f"item-{int(time.time())}"


def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def row_to_dict(row):
    return {key: row[key] for key in row.keys()}


def init_db():
    with db() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS categories (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              external_id TEXT UNIQUE,
              slug TEXT NOT NULL UNIQUE,
              name TEXT NOT NULL,
              description TEXT DEFAULT '',
              image_url TEXT DEFAULT '',
              sort_order INTEGER DEFAULT 0,
              active INTEGER DEFAULT 1,
              created_at TEXT DEFAULT CURRENT_TIMESTAMP,
              updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS products (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              external_id TEXT UNIQUE,
              category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
              sku TEXT UNIQUE,
              slug TEXT NOT NULL UNIQUE,
              name TEXT NOT NULL,
              description TEXT DEFAULT '',
              retail_price REAL NOT NULL DEFAULT 0,
              wholesale_price REAL NOT NULL DEFAULT 0,
              stock_quantity INTEGER NOT NULL DEFAULT 0,
              image_url TEXT DEFAULT '',
              active INTEGER DEFAULT 1,
              featured INTEGER DEFAULT 0,
              seo_title TEXT DEFAULT '',
              seo_description TEXT DEFAULT '',
              created_at TEXT DEFAULT CURRENT_TIMESTAMP,
              updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS banners (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              subtitle TEXT DEFAULT '',
              image_url TEXT DEFAULT '',
              link_url TEXT DEFAULT '#catalog',
              button_text TEXT DEFAULT 'До каталогу',
              sort_order INTEGER DEFAULT 0,
              active INTEGER DEFAULT 1,
              created_at TEXT DEFAULT CURRENT_TIMESTAMP,
              updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS customers (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              phone TEXT NOT NULL,
              city TEXT DEFAULT '',
              nova_poshta_branch TEXT DEFAULT '',
              comment TEXT DEFAULT '',
              created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS orders (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              customer_id INTEGER NOT NULL REFERENCES customers(id),
              status TEXT NOT NULL DEFAULT 'new',
              total REAL NOT NULL DEFAULT 0,
              customer_name TEXT NOT NULL,
              phone TEXT NOT NULL,
              city TEXT DEFAULT '',
              nova_poshta_branch TEXT DEFAULT '',
              comment TEXT DEFAULT '',
              created_at TEXT DEFAULT CURRENT_TIMESTAMP,
              updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS order_items (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
              product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
              sku TEXT DEFAULT '',
              name TEXT NOT NULL,
              quantity INTEGER NOT NULL,
              price REAL NOT NULL,
              total REAL NOT NULL
            );

            CREATE TABLE IF NOT EXISTS imports (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              filename TEXT NOT NULL,
              status TEXT NOT NULL,
              rows_total INTEGER DEFAULT 0,
              rows_success INTEGER DEFAULT 0,
              rows_failed INTEGER DEFAULT 0,
              message TEXT DEFAULT '',
              created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
        category_count = conn.execute("SELECT COUNT(*) FROM categories").fetchone()[0]
        if category_count == 0:
            conn.executemany(
                """
                INSERT INTO categories (external_id, slug, name, description, image_url, sort_order, active)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                SEED_CATEGORIES,
            )
        product_count = conn.execute("SELECT COUNT(*) FROM products").fetchone()[0]
        if product_count == 0:
            category_map = {
                row["external_id"]: row["id"]
                for row in conn.execute("SELECT id, external_id FROM categories").fetchall()
            }
            for item in SEED_PRODUCTS:
                external_id, category_external_id, sku, slug, name, description, retail, wholesale, stock, image, active, featured = item
                conn.execute(
                    """
                    INSERT INTO products
                    (external_id, category_id, sku, slug, name, description, retail_price, wholesale_price, stock_quantity, image_url, active, featured, seo_title, seo_description)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (external_id, category_map[category_external_id], sku, slug, name, description, retail, wholesale, stock, image, active, featured, name, description[:155]),
                )
        banner_count = conn.execute("SELECT COUNT(*) FROM banners").fetchone()[0]
        if banner_count == 0:
            conn.execute(
                """
                INSERT INTO banners (title, subtitle, image_url, link_url, button_text, sort_order, active)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    "Пакувальні матеріали для бізнесу та дому",
                    "Пакети майка, фасувальні пакети, одноразовий посуд і господарські товари з доставкою по Україні.",
                    "https://w4p-merch.s3.eu-central-1.amazonaws.com/merchant/shop/images/prod_e3b5b2920bf7f3b7d731d3cfc6e17f7a/7e7fe982ef0ca27329a41c7cfe4ff027.jpg",
                    "#catalog",
                    "Перейти до каталогу",
                    10,
                    1,
                ),
            )


def read_json(handler):
    length = int(handler.headers.get("content-length", "0"))
    if not length:
        return {}
    return json.loads(handler.rfile.read(length).decode("utf-8"))


def send_json(handler, payload, status=200):
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(data)))
    handler.end_headers()
    handler.wfile.write(data)


def admin_token():
    return hashlib.sha256(f"{ADMIN_PASSWORD}:{ADMIN_SESSION_SECRET}".encode("utf-8")).hexdigest()


def cookie_value(handler, key):
    cookie = handler.headers.get("Cookie", "")
    for part in cookie.split(";"):
        if "=" not in part:
            continue
        name, value = part.strip().split("=", 1)
        if name == key:
            return value
    return ""


def is_admin_authenticated(handler):
    return secrets.compare_digest(cookie_value(handler, "store_admin"), admin_token())


def require_admin(handler):
    if is_admin_authenticated(handler):
        return True
    send_json(handler, {"error": "Admin authentication required"}, HTTPStatus.UNAUTHORIZED)
    return False


def send_admin_login(handler):
    data = json.dumps({"ok": True}, ensure_ascii=False).encode("utf-8")
    handler.send_response(200)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Set-Cookie", f"store_admin={admin_token()}; Path=/; HttpOnly; SameSite=Lax")
    handler.send_header("Content-Length", str(len(data)))
    handler.end_headers()
    handler.wfile.write(data)


def send_text(handler, payload, content_type="text/plain; charset=utf-8", status=200):
    data = payload.encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", content_type)
    handler.send_header("Content-Length", str(len(data)))
    handler.end_headers()
    handler.wfile.write(data)


def parse_multipart(handler):
    content_type = handler.headers.get("Content-Type", "")
    if "multipart/form-data" not in content_type:
        return {}
    try:
        length = int(handler.headers.get("Content-Length", "0"))
    except ValueError:
        length = 0
    if length <= 0:
        return {}
    body = handler.rfile.read(length)
    message = BytesParser(policy=email_policy).parsebytes(
        f"Content-Type: {content_type}\r\nMIME-Version: 1.0\r\n\r\n".encode("utf-8") + body
    )
    if not message.is_multipart():
        return {}
    files = {}
    for part in message.iter_parts():
        name = part.get_param("name", header="content-disposition")
        if not name:
            continue
        files[name] = {
            "filename": part.get_filename() or "",
            "content": part.get_payload(decode=True) or b"",
        }
    return files


def product_query(public_only=True):
    where = "WHERE p.active = 1 AND c.active = 1" if public_only else ""
    return f"""
        SELECT p.*, c.slug AS category_slug, c.name AS category_name
        FROM products p
        JOIN categories c ON c.id = p.category_id
        {where}
        ORDER BY p.featured DESC, p.created_at DESC
    """


def list_products(query, public_only=True):
    filters = []
    params = []
    if public_only:
        filters.extend(["p.active = 1", "c.active = 1"])
    if query.get("category"):
        filters.append("c.slug = ?")
        params.append(query["category"][0])
    search = (query.get("q", [""])[0] or "").strip()
    where = f"WHERE {' AND '.join(filters)}" if filters else ""
    sort = query.get("sort", ["featured"])[0]
    order = "p.featured DESC, p.created_at DESC"
    if sort == "price-asc":
        order = "p.retail_price ASC"
    if sort == "price-desc":
        order = "p.retail_price DESC"
    with db() as conn:
        rows = conn.execute(
            f"""
            SELECT p.*, c.slug AS category_slug, c.name AS category_name
            FROM products p JOIN categories c ON c.id = p.category_id
            {where}
            ORDER BY {order}
            """,
            params,
        ).fetchall()
    items = [row_to_dict(row) for row in rows]
    if search:
        needle = search.casefold()
        items = [
            item for item in items
            if needle in (item["name"] or "").casefold()
            or needle in (item["description"] or "").casefold()
            or needle in (item["sku"] or "").casefold()
        ]
    return items


def parse_csv(path):
    with open(path, newline="", encoding="utf-8-sig") as file:
        return list(csv.DictReader(file))


def parse_xlsx(path):
    ns = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    with zipfile.ZipFile(path) as archive:
        shared = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ElementTree.fromstring(archive.read("xl/sharedStrings.xml"))
            for item in root.findall(".//a:si", ns):
                shared.append("".join(text.text or "" for text in item.findall(".//a:t", ns)))
        sheet_name = "xl/worksheets/sheet1.xml"
        root = ElementTree.fromstring(archive.read(sheet_name))
        rows = []
        for row in root.findall(".//a:row", ns):
            values = []
            for cell in row.findall("a:c", ns):
                value_node = cell.find("a:v", ns)
                value = value_node.text if value_node is not None else ""
                if cell.attrib.get("t") == "s" and value:
                    value = shared[int(value)]
                elif cell.attrib.get("t") == "inlineStr":
                    value = "".join(text.text or "" for text in cell.findall(".//a:t", ns))
                values.append(value)
            rows.append(values)
    if not rows:
        return []
    headers = [str(item).strip() for item in rows[0]]
    return [dict(zip(headers, row + [""] * (len(headers) - len(row)))) for row in rows[1:]]


def row_value(row, *keys):
    for key in keys:
        value = row.get(key)
        if value not in (None, ""):
            return str(value).strip()
    return ""


def catalog_description(row):
    description = row_value(row, "description", "Описание", "Опис")
    details = [
        ("Бренд", row_value(row, "brand", "Бренд")),
        ("Размер", row_value(row, "size", "Размер", "Розмір")),
        ("Количество в упаковке", row_value(row, "pack_quantity", "Количество в упаковке", "Кількість в упаковці")),
        ("Плотность", row_value(row, "density", "Плотность", "Щільність")),
        ("Цвет", row_value(row, "color", "Цвет", "Колір")),
    ]
    extra = [f"{label}: {value}" for label, value in details if value]
    if description and extra:
        return description + "\n\n" + "\n".join(extra)
    if extra:
        return "\n".join(extra)
    return description


def import_products(path):
    rows = parse_xlsx(path) if path.suffix.lower() == ".xlsx" else parse_csv(path)
    rows = [row for row in rows if any(str(value).strip() for value in row.values())]
    success = 0
    failed = 0
    messages = []
    with db() as conn:
        category_by_slug = {row["slug"]: row["id"] for row in conn.execute("SELECT id, slug FROM categories")}
        for idx, row in enumerate(rows, start=2):
            try:
                name = row_value(row, "name", "Назва", "Название")
                if not name:
                    raise ValueError("empty name")
                category_slug = row_value(row, "category_slug", "category", "Категория", "Категорія")
                if category_slug not in category_by_slug:
                    category_name = row_value(row, "category_name", "Категория", "Категорія") or category_slug or "Імпорт"
                    category_slug = slugify(category_slug or category_name)
                    conn.execute(
                        "INSERT OR IGNORE INTO categories (slug, name, active) VALUES (?, ?, 1)",
                        (category_slug, category_name),
                    )
                    category_by_slug[category_slug] = conn.execute("SELECT id FROM categories WHERE slug = ?", (category_slug,)).fetchone()["id"]
                sku = row_value(row, "sku", "SKU", "Артикул (SKU)", "Артикул") or f"IMP-{idx}-{int(time.time())}"
                slug = (row.get("slug") or slugify(name)).strip()
                description = catalog_description(row)
                payload = (
                    category_by_slug[category_slug],
                    sku,
                    slug,
                    name,
                    description,
                    float(row_value(row, "retail_price", "price", "Цена", "Ціна") or 0),
                    float(row_value(row, "wholesale_price", "opt_price", "Оптовая цена", "Оптова ціна", "retail_price", "price", "Цена", "Ціна") or 0),
                    int(float(row_value(row, "stock_quantity", "stock", "Остаток", "Залишок") or 0)),
                    row_value(row, "image_url", "URL изображения", "URL зображення"),
                    int(float(row.get("active") or 1)),
                    int(float(row.get("featured") or 0)),
                    row_value(row, "seo_title", "SEO Title") or name,
                    row_value(row, "seo_description", "SEO Description") or description[:155],
                    sku,
                )
                conn.execute(
                    """
                    INSERT INTO products
                    (category_id, sku, slug, name, description, retail_price, wholesale_price, stock_quantity, image_url, active, featured, seo_title, seo_description)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(sku) DO UPDATE SET
                      category_id=excluded.category_id, slug=excluded.slug, name=excluded.name,
                      description=excluded.description, retail_price=excluded.retail_price,
                      wholesale_price=excluded.wholesale_price, stock_quantity=excluded.stock_quantity,
                      image_url=excluded.image_url, active=excluded.active, featured=excluded.featured,
                      seo_title=excluded.seo_title, seo_description=excluded.seo_description,
                      updated_at=CURRENT_TIMESTAMP
                    WHERE products.sku = ?
                    """,
                    payload,
                )
                success += 1
            except Exception as exc:
                failed += 1
                messages.append(f"Row {idx}: {exc}")
        conn.execute(
            "INSERT INTO imports (filename, status, rows_total, rows_success, rows_failed, message) VALUES (?, ?, ?, ?, ?, ?)",
            (path.name, "done" if failed == 0 else "partial", len(rows), success, failed, "\n".join(messages[:20])),
        )
    return {"rows_total": len(rows), "rows_success": success, "rows_failed": failed, "errors": messages[:20]}


def google_feed():
    products = list_products({}, public_only=True)
    rows = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
        "<channel>",
        "<title>Столиця Пак</title>",
        f"<link>{html.escape(BASE_URL)}</link>",
        "<description>Пакувальні матеріали та поліетиленові пакети</description>",
    ]
    for product in products:
        rows.extend(
            [
                "<item>",
                f"<g:id>{html.escape(product['sku'] or str(product['id']))}</g:id>",
                f"<g:title>{html.escape(product['name'])}</g:title>",
                f"<g:description>{html.escape(product['description'] or product['name'])}</g:description>",
                f"<g:link>{html.escape(BASE_URL + '/product/' + product['slug'])}</g:link>",
                f"<g:image_link>{html.escape(product['image_url'])}</g:image_link>",
                "<g:availability>in_stock</g:availability>" if product["stock_quantity"] > 0 else "<g:availability>out_of_stock</g:availability>",
                f"<g:price>{product['retail_price']:.2f} UAH</g:price>",
                "<g:condition>new</g:condition>",
                "</item>",
            ]
        )
    rows.extend(["</channel>", "</rss>"])
    return "\n".join(rows)


def xml_feed():
    products = list_products({}, public_only=True)
    rows = ['<?xml version="1.0" encoding="UTF-8"?>', '<yml_catalog date="' + time.strftime("%Y-%m-%d %H:%M") + '">', "<shop>", "<name>Столиця Пак</name>", f"<url>{html.escape(BASE_URL)}</url>", "<currencies><currency id=\"UAH\" rate=\"1\"/></currencies>", "<categories>"]
    category_ids = set()
    for product in products:
        category_ids.add((product["category_id"], product["category_name"]))
    for category_id, name in sorted(category_ids):
        rows.append(f'<category id="{category_id}">{html.escape(name)}</category>')
    rows.append("</categories><offers>")
    for product in products:
        rows.extend(
            [
                f'<offer id="{product["id"]}" available="{str(product["stock_quantity"] > 0).lower()}">',
                f"<url>{html.escape(BASE_URL + '/product/' + product['slug'])}</url>",
                f"<price>{product['retail_price']:.2f}</price>",
                "<currencyId>UAH</currencyId>",
                f"<categoryId>{product['category_id']}</categoryId>",
                f"<picture>{html.escape(product['image_url'])}</picture>",
                f"<name>{html.escape(product['name'])}</name>",
                f"<description>{html.escape(product['description'] or product['name'])}</description>",
                "</offer>",
            ]
        )
    rows.extend(["</offers>", "</shop>", "</yml_catalog>"])
    return "\n".join(rows)


def sitemap():
    with db() as conn:
        categories = conn.execute("SELECT slug FROM categories WHERE active = 1").fetchall()
        products = conn.execute("SELECT slug FROM products WHERE active = 1").fetchall()
    urls = [BASE_URL + "/"]
    urls.extend(BASE_URL + "/category/" + row["slug"] for row in categories)
    urls.extend(BASE_URL + "/product/" + row["slug"] for row in products)
    rows = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    rows.extend(f"<url><loc>{html.escape(url)}</loc><changefreq>daily</changefreq></url>" for url in urls)
    rows.append("</urlset>")
    return "\n".join(rows)


def organization_jsonld():
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Столиця Пак",
        "url": BASE_URL,
        "logo": BASE_URL + "/uploads/brand/logo.png",
        "description": "Інтернет-магазин пакувальних матеріалів та поліетиленових пакетів в Україні.",
        "telephone": ["+380501308187", "+380731308187"],
        "email": "solodovnik.ak@gmail.com",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Київ",
            "streetAddress": "вул. Тепловозна 18",
            "addressCountry": "UA",
        },
    }


def breadcrumbs_jsonld(items):
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": index + 1, "name": item["name"], "item": item["url"]}
            for index, item in enumerate(items)
        ],
    }


def page_meta(path):
    meta = {
        "title": "Столиця Пак - пакети від виробника оптом і в роздріб по Україні",
        "description": "Пакети від виробника для магазинів, кафе та бізнесу. Опт і роздріб, актуальні залишки, швидке оформлення замовлення та доставка по Україні.",
        "url": BASE_URL + path,
        "robots": "index, follow",
        "og_type": "website",
        "image": BASE_URL + "/uploads/brand/hero-packing.webp",
        "jsonld": {
            "@context": "https://schema.org",
            "@graph": [
                organization_jsonld(),
                {
                    "@type": "WebSite",
                    "name": "Столиця Пак",
                    "url": BASE_URL,
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": BASE_URL + "/?q={search_term_string}",
                        "query-input": "required name=search_term_string",
                    },
                },
            ],
        },
    }
    with db() as conn:
        if path == "/admin":
            meta.update({
                "title": "Вхід в адмін-панель - Столиця Пак",
                "description": "Службова сторінка входу в адмін-панель магазину.",
                "robots": "noindex, nofollow",
            })
        if path.startswith("/category/"):
            slug = path.rsplit("/", 1)[1]
            row = conn.execute("SELECT * FROM categories WHERE active = 1 AND slug = ?", (slug,)).fetchone()
            if row:
                meta.update({
                    "title": f"{row['name']} - купити в Україні | Столиця Пак",
                    "description": row["description"] or f"Категорія {row['name']} в інтернет-магазині Столиця Пак.",
                    "image": row["image_url"] or meta["image"],
                    "jsonld": {
                        "@context": "https://schema.org",
                        "@graph": [
                            organization_jsonld(),
                            breadcrumbs_jsonld([
                                {"name": "Головна", "url": BASE_URL + "/"},
                                {"name": row["name"], "url": BASE_URL + "/category/" + row["slug"]},
                            ]),
                        ],
                    },
                })
        if path.startswith("/product/"):
            slug = path.rsplit("/", 1)[1]
            row = conn.execute(
                """
                SELECT p.*, c.name AS category_name, c.slug AS category_slug
                FROM products p JOIN categories c ON c.id = p.category_id
                WHERE p.active = 1 AND c.active = 1 AND p.slug = ?
                """,
                (slug,),
            ).fetchone()
            if row:
                product_url = BASE_URL + "/product/" + row["slug"]
                meta.update({
                    "title": row["seo_title"] or f"{row['name']} - Столиця Пак",
                    "description": row["seo_description"] or row["description"] or row["name"],
                    "image": row["image_url"] or meta["image"],
                    "og_type": "product",
                    "jsonld": {
                        "@context": "https://schema.org",
                        "@graph": [
                            organization_jsonld(),
                            breadcrumbs_jsonld([
                                {"name": "Головна", "url": BASE_URL + "/"},
                                {"name": row["category_name"], "url": BASE_URL + "/category/" + row["category_slug"]},
                                {"name": row["name"], "url": product_url},
                            ]),
                            {
                                "@type": "Product",
                                "name": row["name"],
                                "sku": row["sku"],
                                "image": row["image_url"],
                                "description": row["description"] or row["name"],
                                "brand": {"@type": "Brand", "name": "Столиця Пак"},
                                "offers": {
                                    "@type": "Offer",
                                    "priceCurrency": "UAH",
                                    "price": row["retail_price"],
                                    "availability": "https://schema.org/InStock" if row["stock_quantity"] > 0 else "https://schema.org/OutOfStock",
                                    "url": product_url,
                                },
                            },
                        ],
                    },
                })
    return meta


def render_index(path):
    index_path = DIST / "index.html"
    if not index_path.exists():
        index_path = ROOT / "index.html"
    content = index_path.read_text(encoding="utf-8")
    meta = page_meta(path)
    content = re.sub(r"<title>.*?</title>", lambda _: f"<title>{html.escape(meta['title'])}</title>", content, flags=re.S)
    content = re.sub(r'<meta name="description" content="[^"]*"', lambda _: f'<meta name="description" content="{html.escape(meta["description"])}"', content)
    content = re.sub(r'<meta name="robots" content="[^"]*"', lambda _: f'<meta name="robots" content="{html.escape(meta["robots"])}"', content)
    content = re.sub(r'<link rel="canonical" href="[^"]*"', lambda _: f'<link rel="canonical" href="{html.escape(meta["url"])}"', content)
    content = re.sub(r'<meta property="og:type" content="[^"]*"', lambda _: f'<meta property="og:type" content="{html.escape(meta["og_type"])}"', content)
    content = re.sub(r'<meta property="og:title" content="[^"]*"', lambda _: f'<meta property="og:title" content="{html.escape(meta["title"])}"', content)
    content = re.sub(r'<meta property="og:description" content="[^"]*"', lambda _: f'<meta property="og:description" content="{html.escape(meta["description"])}"', content)
    content = re.sub(r'<meta property="og:url" content="[^"]*"', lambda _: f'<meta property="og:url" content="{html.escape(meta["url"])}"', content)
    content = re.sub(r'<meta property="og:image" content="[^"]*"', lambda _: f'<meta property="og:image" content="{html.escape(meta["image"])}"', content)
    content = re.sub(
        r'<script type="application/ld\+json">.*?</script>',
        lambda _: '<script type="application/ld+json">' + json.dumps(meta["jsonld"], ensure_ascii=False) + "</script>",
        content,
        flags=re.S,
    )
    return content


class StoreHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        parsed = urlparse(path)
        clean = unquote(parsed.path)
        if clean.startswith("/uploads/"):
            return str(ROOT / clean.lstrip("/"))
        if clean in ("/robots.txt", "/sitemap.xml"):
            return str(DIST / clean.lstrip("/"))
        target = DIST / clean.lstrip("/")
        if target.is_file():
            return str(target)
        return str(DIST / "index.html")

    def do_GET(self):
        parsed = urlparse(self.path)
        query = parse_qs(parsed.query)
        path = parsed.path
        try:
            if path == "/api/admin/session":
                return send_json(self, {"authenticated": is_admin_authenticated(self)})
            if path.startswith("/api/admin/") and not require_admin(self):
                return
            if path == "/api/bootstrap":
                with db() as conn:
                    categories = [row_to_dict(row) for row in conn.execute("SELECT * FROM categories WHERE active = 1 ORDER BY sort_order, name")]
                    banners = [row_to_dict(row) for row in conn.execute("SELECT * FROM banners WHERE active = 1 ORDER BY sort_order, id")]
                return send_json(self, {"categories": categories, "products": list_products(query), "banners": banners})
            if path == "/api/products":
                return send_json(self, {"items": list_products(query)})
            if path.startswith("/api/products/"):
                slug = path.rsplit("/", 1)[1]
                with db() as conn:
                    row = conn.execute(
                        """
                        SELECT p.*, c.slug AS category_slug, c.name AS category_name
                        FROM products p
                        JOIN categories c ON c.id = p.category_id
                        WHERE p.active = 1 AND c.active = 1 AND p.slug = ?
                        """,
                        (slug,),
                    ).fetchone()
                if not row:
                    return send_json(self, {"error": "Not found"}, 404)
                return send_json(self, row_to_dict(row))
            if path == "/api/admin/products":
                return send_json(self, {"items": list_products(query, public_only=False)})
            if path == "/api/admin/categories":
                with db() as conn:
                    rows = conn.execute("SELECT * FROM categories ORDER BY sort_order, name").fetchall()
                return send_json(self, {"items": [row_to_dict(row) for row in rows]})
            if path == "/api/admin/banners":
                with db() as conn:
                    rows = conn.execute("SELECT * FROM banners ORDER BY sort_order, id").fetchall()
                return send_json(self, {"items": [row_to_dict(row) for row in rows]})
            if path == "/api/admin/orders":
                with db() as conn:
                    orders = [row_to_dict(row) for row in conn.execute("SELECT * FROM orders ORDER BY created_at DESC")]
                    for order in orders:
                        items = conn.execute("SELECT * FROM order_items WHERE order_id = ?", (order["id"],)).fetchall()
                        order["items"] = [row_to_dict(item) for item in items]
                return send_json(self, {"items": orders})
            if path == "/api/admin/imports":
                with db() as conn:
                    rows = conn.execute("SELECT * FROM imports ORDER BY created_at DESC LIMIT 20").fetchall()
                return send_json(self, {"items": [row_to_dict(row) for row in rows]})
            if path == "/feeds/google.xml":
                return send_text(self, google_feed(), "application/xml; charset=utf-8")
            if path == "/feeds/products.xml":
                return send_text(self, xml_feed(), "application/xml; charset=utf-8")
            if path == "/sitemap.xml":
                return send_text(self, sitemap(), "application/xml; charset=utf-8")
            if path == "/robots.txt":
                return send_text(self, f"User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin/\n\nSitemap: {BASE_URL}/sitemap.xml\n")
            if path == "/" or path == "/admin" or path.startswith("/category/") or path.startswith("/product/"):
                return send_text(self, render_index(path), "text/html; charset=utf-8")
            return super().do_GET()
        except Exception as exc:
            return send_json(self, {"error": str(exc)}, 500)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        try:
            if path == "/api/admin/login":
                payload = read_json(self)
                if secrets.compare_digest(str(payload.get("password", "")), ADMIN_PASSWORD):
                    return send_admin_login(self)
                return send_json(self, {"error": "Invalid password"}, HTTPStatus.UNAUTHORIZED)
            if path == "/api/admin/logout":
                data = json.dumps({"ok": True}, ensure_ascii=False).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Set-Cookie", "store_admin=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0")
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)
                return
            if path == "/api/orders":
                payload = read_json(self)
                items = payload.get("items") or []
                if not items:
                    return send_json(self, {"error": "Cart is empty"}, 400)
                name = (payload.get("name") or "").strip()
                phone = (payload.get("phone") or "").strip()
                if not name or not phone:
                    return send_json(self, {"error": "Name and phone are required"}, 400)
                with db() as conn:
                    product_map = {
                        row["id"]: row_to_dict(row)
                        for row in conn.execute("SELECT * FROM products WHERE active = 1")
                    }
                    order_items = []
                    total = 0
                    for item in items:
                        product = product_map.get(int(item.get("product_id", 0)))
                        quantity = max(1, int(item.get("quantity", 1)))
                        if not product:
                            continue
                        price = float(product["retail_price"])
                        line_total = price * quantity
                        total += line_total
                        order_items.append((product, quantity, price, line_total))
                    if not order_items:
                        return send_json(self, {"error": "No valid products in cart"}, 400)
                    cur = conn.execute(
                        "INSERT INTO customers (name, phone, city, nova_poshta_branch, comment) VALUES (?, ?, ?, ?, ?)",
                        (name, phone, payload.get("city", ""), payload.get("nova_poshta_branch", ""), payload.get("comment", "")),
                    )
                    customer_id = cur.lastrowid
                    cur = conn.execute(
                        """
                        INSERT INTO orders (customer_id, total, customer_name, phone, city, nova_poshta_branch, comment)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        """,
                        (customer_id, total, name, phone, payload.get("city", ""), payload.get("nova_poshta_branch", ""), payload.get("comment", "")),
                    )
                    order_id = cur.lastrowid
                    for product, quantity, price, line_total in order_items:
                        conn.execute(
                            "INSERT INTO order_items (order_id, product_id, sku, name, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?, ?)",
                            (order_id, product["id"], product["sku"], product["name"], quantity, price, line_total),
                        )
                        conn.execute("UPDATE products SET stock_quantity = MAX(stock_quantity - ?, 0) WHERE id = ?", (quantity, product["id"]))
                return send_json(self, {"id": order_id, "status": "new", "total": total}, 201)
            if path == "/api/admin/upload":
                if not require_admin(self):
                    return
                return self.handle_upload("image")
            if path == "/api/admin/import":
                if not require_admin(self):
                    return
                return self.handle_import()
            return send_json(self, {"error": "Not found"}, 404)
        except Exception as exc:
            return send_json(self, {"error": str(exc)}, 500)

    def do_PUT(self):
        try:
            payload = read_json(self)
            path = urlparse(self.path).path
            if path.startswith("/api/admin") and not require_admin(self):
                return
            if path.startswith("/api/admin/products/"):
                item_id = int(path.rsplit("/", 1)[1])
                return self.save_product(payload, item_id)
            if path == "/api/admin/products":
                return self.save_product(payload)
            if path.startswith("/api/admin/categories/"):
                item_id = int(path.rsplit("/", 1)[1])
                return self.save_category(payload, item_id)
            if path == "/api/admin/categories":
                return self.save_category(payload)
            if path.startswith("/api/admin/banners/"):
                item_id = int(path.rsplit("/", 1)[1])
                return self.save_banner(payload, item_id)
            if path == "/api/admin/banners":
                return self.save_banner(payload)
            if path.startswith("/api/admin/orders/"):
                item_id = int(path.rsplit("/", 1)[1])
                with db() as conn:
                    conn.execute("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (payload.get("status", "new"), item_id))
                return send_json(self, {"ok": True})
            return send_json(self, {"error": "Not found"}, 404)
        except Exception as exc:
            return send_json(self, {"error": str(exc)}, 500)

    def do_DELETE(self):
        try:
            path = urlparse(self.path).path
            if path.startswith("/api/admin") and not require_admin(self):
                return
            table = None
            if path.startswith("/api/admin/products/"):
                table = "products"
            if path.startswith("/api/admin/categories/"):
                table = "categories"
            if path.startswith("/api/admin/banners/"):
                table = "banners"
            if not table:
                return send_json(self, {"error": "Not found"}, 404)
            item_id = int(path.rsplit("/", 1)[1])
            with db() as conn:
                if table == "categories":
                    used = conn.execute("SELECT COUNT(*) FROM products WHERE category_id = ?", (item_id,)).fetchone()[0]
                    if used:
                        return send_json(self, {"error": "Category has products"}, 400)
                conn.execute(f"DELETE FROM {table} WHERE id = ?", (item_id,))
            return send_json(self, {"ok": True})
        except Exception as exc:
            return send_json(self, {"error": str(exc)}, 500)

    def save_product(self, payload, item_id=None):
        with db() as conn:
            category_id = int(payload.get("category_id") or 0)
            slug = payload.get("slug") or slugify(payload.get("name", ""))
            data = (
                category_id,
                payload.get("sku") or None,
                slug,
                payload.get("name", ""),
                payload.get("description", ""),
                float(payload.get("retail_price") or 0),
                float(payload.get("wholesale_price") or 0),
                int(payload.get("stock_quantity") or 0),
                payload.get("image_url", ""),
                1 if payload.get("active") else 0,
                1 if payload.get("featured") else 0,
                payload.get("seo_title") or payload.get("name", ""),
                payload.get("seo_description") or payload.get("description", "")[:155],
            )
            if item_id:
                conn.execute(
                    """
                    UPDATE products SET category_id=?, sku=?, slug=?, name=?, description=?, retail_price=?,
                    wholesale_price=?, stock_quantity=?, image_url=?, active=?, featured=?, seo_title=?,
                    seo_description=?, updated_at=CURRENT_TIMESTAMP WHERE id=?
                    """,
                    data + (item_id,),
                )
            else:
                cur = conn.execute(
                    """
                    INSERT INTO products (category_id, sku, slug, name, description, retail_price, wholesale_price,
                    stock_quantity, image_url, active, featured, seo_title, seo_description)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    data,
                )
                item_id = cur.lastrowid
        return send_json(self, {"id": item_id})

    def save_category(self, payload, item_id=None):
        data = (
            payload.get("slug") or slugify(payload.get("name", "")),
            payload.get("name", ""),
            payload.get("description", ""),
            payload.get("image_url", ""),
            int(payload.get("sort_order") or 0),
            1 if payload.get("active") else 0,
        )
        with db() as conn:
            if item_id:
                conn.execute("UPDATE categories SET slug=?, name=?, description=?, image_url=?, sort_order=?, active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?", data + (item_id,))
            else:
                cur = conn.execute("INSERT INTO categories (slug, name, description, image_url, sort_order, active) VALUES (?, ?, ?, ?, ?, ?)", data)
                item_id = cur.lastrowid
        return send_json(self, {"id": item_id})

    def save_banner(self, payload, item_id=None):
        data = (
            payload.get("title", ""),
            payload.get("subtitle", ""),
            payload.get("image_url", ""),
            payload.get("link_url", "#catalog"),
            payload.get("button_text", "До каталогу"),
            int(payload.get("sort_order") or 0),
            1 if payload.get("active") else 0,
        )
        with db() as conn:
            if item_id:
                conn.execute("UPDATE banners SET title=?, subtitle=?, image_url=?, link_url=?, button_text=?, sort_order=?, active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?", data + (item_id,))
            else:
                cur = conn.execute("INSERT INTO banners (title, subtitle, image_url, link_url, button_text, sort_order, active) VALUES (?, ?, ?, ?, ?, ?, ?)", data)
                item_id = cur.lastrowid
        return send_json(self, {"id": item_id})

    def handle_upload(self, field_name):
        file_item = parse_multipart(self).get(field_name)
        if file_item is None or not file_item["filename"]:
            return send_json(self, {"error": "No file"}, 400)
        ext = Path(file_item["filename"]).suffix.lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
            return send_json(self, {"error": "Unsupported image type"}, 400)
        filename = f"{int(time.time() * 1000)}-{slugify(Path(file_item['filename']).stem)}{ext}"
        target = UPLOADS / filename
        with open(target, "wb") as file:
            file.write(file_item["content"])
        return send_json(self, {"url": f"/uploads/{filename}"})

    def handle_import(self):
        file_item = parse_multipart(self).get("file")
        if file_item is None or not file_item["filename"]:
            return send_json(self, {"error": "No file"}, 400)
        ext = Path(file_item["filename"]).suffix.lower()
        if ext not in [".csv", ".xlsx"]:
            return send_json(self, {"error": "Only CSV/XLSX supported"}, 400)
        target = IMPORTS / f"{int(time.time() * 1000)}-{slugify(Path(file_item['filename']).stem)}{ext}"
        with open(target, "wb") as file:
            file.write(file_item["content"])
        return send_json(self, import_products(target))


if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", "8000"))
    if not DIST.exists():
        print("dist/ not found. Run pnpm build first.", file=sys.stderr)
    server = ThreadingHTTPServer(("127.0.0.1", port), StoreHandler)
    print(f"Store server: http://127.0.0.1:{port}")
    server.serve_forever()
