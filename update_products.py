#!/usr/bin/env python3
"""
ART_SHINERSSS - Automatic Product Scanner & Generator
======================================================
Drop any product image into the 'assets/images/products/' folder with
the filename formatted as:

    Category_Product Name_Price.jpg
    OR
    Category - Product Name - Price.jpg
    OR
    Product Name - Price - Category.jpg

Examples:
    Handmade Bracelets_Rose Quartz Glamour Bracelet_399.jpg
    Beaded Bracelets - Pink Daisy Charm Bracelet - 450.jpg
    Pendant Chains - Baroque Pearl Floral Necklace - 549.jpg
    Customized Name Jewellery_Initial Letter Coin Set_499.jpg
    Bracelet and Chain Gift Sets - Luxury Celebration Hamper - 899.jpg

Run this script (or double-click sync_products.bat) and it will automatically
detect your new images and update 'products.js' with full formatting!
"""

import os
import re
import json
import shutil
import sys

# Ensure UTF-8 output on Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

CATEGORIES = [
    "Handmade Bracelets",
    "Beaded Bracelets",
    "Friendship Bracelets",
    "Handmade Chains",
    "Necklaces",
    "Pendant Chains",
    "Customized Name Jewellery",
    "Bracelet and Chain Gift Sets"
]

CATEGORY_ALIASES = {
    "bracelet": "Handmade Bracelets",
    "bracelets": "Handmade Bracelets",
    "handmade bracelet": "Handmade Bracelets",
    "handmade bracelets": "Handmade Bracelets",
    "beaded": "Beaded Bracelets",
    "beaded bracelet": "Beaded Bracelets",
    "beaded bracelets": "Beaded Bracelets",
    "bead": "Beaded Bracelets",
    "friendship": "Friendship Bracelets",
    "friendship bracelet": "Friendship Bracelets",
    "friendship bracelets": "Friendship Bracelets",
    "bff": "Friendship Bracelets",
    "chain": "Handmade Chains",
    "chains": "Handmade Chains",
    "handmade chain": "Handmade Chains",
    "handmade chains": "Handmade Chains",
    "necklace": "Necklaces",
    "necklaces": "Necklaces",
    "choker": "Necklaces",
    "pendant": "Pendant Chains",
    "pendants": "Pendant Chains",
    "pendant chain": "Pendant Chains",
    "pendant chains": "Pendant Chains",
    "custom": "Customized Name Jewellery",
    "customized": "Customized Name Jewellery",
    "personalized": "Customized Name Jewellery",
    "name": "Customized Name Jewellery",
    "customized name jewellery": "Customized Name Jewellery",
    "gift set": "Bracelet and Chain Gift Sets",
    "gift sets": "Bracelet and Chain Gift Sets",
    "gift": "Bracelet and Chain Gift Sets",
    "hamper": "Bracelet and Chain Gift Sets",
    "set": "Bracelet and Chain Gift Sets",
    "bracelet and chain gift sets": "Bracelet and Chain Gift Sets"
}

IMAGE_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp', '.svg')

def normalize_category(cat_str):
    if not cat_str:
        return "Handmade Bracelets"
    cleaned = cat_str.strip().lower()
    for exact in CATEGORIES:
        if exact.lower() == cleaned:
            return exact
    if cleaned in CATEGORY_ALIASES:
        return CATEGORY_ALIASES[cleaned]
    for key, val in CATEGORY_ALIASES.items():
        if key in cleaned:
            return val
    return "Handmade Bracelets"

def parse_filename(filename):
    """
    Parses filenames in formats like:
      Category_Name_Price
      Category - Name - Price
      Name - Price - Category
      Name_Price
    """
    name_no_ext = os.path.splitext(filename)[0].strip()
    
    # Extract price (number preceded by optional ₹, Rs, INR, etc.)
    price_match = re.search(r'(?:₹|rs\.?|inr)?\s*(\d{2,5})\b', name_no_ext, re.IGNORECASE)
    price = 399
    if price_match:
        price = int(price_match.group(1))

    # Split by common delimiters (underscore or hyphen surrounded by spaces or just hyphen)
    parts = []
    if '_' in name_no_ext:
        parts = [p.strip() for p in name_no_ext.split('_') if p.strip()]
    elif ' - ' in name_no_ext:
        parts = [p.strip() for p in name_no_ext.split(' - ') if p.strip()]
    elif '-' in name_no_ext:
        parts = [p.strip() for p in name_no_ext.split('-') if p.strip()]
    else:
        parts = [name_no_ext]

    category = "Handmade Bracelets"
    product_name = ""

    # Check parts to identify category, price, and product name
    non_price_parts = []
    for part in parts:
        clean_part = re.sub(r'(?:₹|rs\.?|inr)?\s*\d{2,5}\b', '', part, flags=re.IGNORECASE).strip()
        if clean_part:
            non_price_parts.append(clean_part)

    if len(non_price_parts) >= 2:
        # Check if first part is a category
        cat_candidate1 = normalize_category(non_price_parts[0])
        cat_candidate2 = normalize_category(non_price_parts[-1])
        
        # Test if first part matches known category keywords
        if any(k in non_price_parts[0].lower() for k in ["bracelet", "chain", "necklace", "pendant", "custom", "gift", "set"]):
            category = cat_candidate1
            product_name = " ".join(non_price_parts[1:])
        elif any(k in non_price_parts[-1].lower() for k in ["bracelet", "chain", "necklace", "pendant", "custom", "gift", "set"]):
            category = cat_candidate2
            product_name = " ".join(non_price_parts[:-1])
        else:
            category = cat_candidate1
            product_name = " ".join(non_price_parts[1:])
    elif len(non_price_parts) == 1:
        product_name = non_price_parts[0]
        # Guess category from name
        category = normalize_category(product_name)
    else:
        product_name = "Artisan Handcrafted Piece"

    # Clean product name
    product_name = re.sub(r'[_]+', ' ', product_name).strip()
    product_name = ' '.join(word.capitalize() for word in product_name.split())
    
    if not product_name:
        product_name = "Handcrafted Boutique Jewellery"

    return {
        "name": product_name,
        "category": category,
        "price": price
    }

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    products_file = os.path.join(root_dir, "products.js")
    products_dir = os.path.join(root_dir, "assets", "images", "products")
    
    if not os.path.exists(products_dir):
        os.makedirs(products_dir, exist_ok=True)
        print(f"[+] Created directory: {products_dir}")

    # Read existing products.js to preserve existing items
    existing_items = []
    if os.path.exists(products_file):
        with open(products_file, "r", encoding="utf-8") as f:
            content = f.read()
            # Extract JSON array between const products = [ ... ];
            m = re.search(r'const\s+products\s*=\s*(\[[\s\S]*?\]);', content)
            if m:
                try:
                    # Clean JS to valid JSON
                    raw_json = m.group(1)
                    # Replace unquoted keys with quoted keys
                    raw_json = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)\s*:', r'\1"\2":', raw_json)
                    # Remove trailing commas before } or ]
                    raw_json = re.sub(r',\s*([\]}])', r'\1', raw_json)
                    existing_items = json.loads(raw_json)
                except Exception as e:
                    print(f"[!] Warning: Could not parse existing products as strict JSON ({e}). Falling back to fresh merge.")
                    existing_items = []

    # Map existing images
    known_images = {p.get("image", "").replace("\\", "/"): p for p in existing_items}
    
    # Scan assets/images/products/
    image_files = []
    for f in os.listdir(products_dir):
        if f.lower().endswith(IMAGE_EXTENSIONS):
            image_files.append(f)

    if not image_files:
        print("[i] No new images found in 'assets/images/products/'.")
        print("[i] Put files like: 'Handmade Bracelets_Rose Pearl Bracelet_399.jpg' into 'assets/images/products/'")
        return

    added_count = 0
    next_id_num = len(existing_items) + 1

    for img_file in image_files:
        rel_path = f"assets/images/products/{img_file}".replace("\\", "/")
        
        info = parse_filename(img_file)
        orig_price = int(info["price"] * 1.45) # approx 30-40% discount display
        
        if rel_path in known_images:
            # Update existing item with any changes
            item = known_images[rel_path]
            item["name"] = info["name"]
            item["category"] = info["category"]
            item["price"] = info["price"]
            item["originalPrice"] = orig_price
            print(f"[~] Updated: {info['name']} (Rs. {info['price']}) -> {info['category']}")
        else:
            # Create new product entry
            new_item = {
                "id": f"prod-{next_id_num:03d}",
                "name": info["name"],
                "category": info["category"],
                "subcategory": info["category"],
                "price": info["price"],
                "originalPrice": orig_price,
                "image": rel_path,
                "badge": "New Arrival",
                "rating": 5.0,
                "reviewCount": 12,
                "availability": "In Stock",
                "colors": ["18K Gold Finish", "Pastel Pink", "Classic Pearl"],
                "description": f"Exquisitely handcrafted {info['name'].lower()} designed with luxury beads and anti-tarnish finish. Crafted with love by ART_SHINERSSS.",
                "featured": True
            }
            existing_items.append(new_item)
            known_images[rel_path] = new_item
            next_id_num += 1
            added_count += 1
            print(f"[+] Added New: {info['name']} | Price: Rs. {info['price']} | Category: {info['category']}")

    # Create backup before writing
    if os.path.exists(products_file):
        shutil.copyfile(products_file, os.path.join(root_dir, "products.backup.js"))

    # Write updated products.js
    output_js = """// ART_SHINERSSS - Product Catalog Data
// All prices in Indian Rupees (₹)
// Automatically generated & synced via update_products.py / sync_products.bat

const products = """ + json.dumps(existing_items, indent=2, ensure_ascii=False) + """;

// Product categories definition
const categoriesList = [
  "All Products",
  "Handmade Bracelets",
  "Beaded Bracelets",
  "Friendship Bracelets",
  "Handmade Chains",
  "Necklaces",
  "Pendant Chains",
  "Customized Name Jewellery",
  "Bracelet and Chain Gift Sets"
];

// Export for module or global use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { products, categoriesList };
}
"""

    with open(products_file, "w", encoding="utf-8") as f:
        f.write(output_js)

    print("\n" + "="*60)
    print(f"[SUCCESS] Total products in catalog: {len(existing_items)}")
    print(f"[+] {added_count} new product(s) added from 'assets/images/products/'.")
    print("[+] Updated file: products.js")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
