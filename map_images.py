import os
import json
import shutil
import re
from difflib import get_close_matches

def clean_text(text):
    text = text.lower()
    # Remove extension
    text = os.path.splitext(text)[0]
    # Remove leading numbers and dots (e.g., "1.", "10.")
    text = re.sub(r'^\d+[\.-]?\s*', '', text)
    # Replace non-alphanumeric with space
    text = re.sub(r'[^a-z0-9]', ' ', text)
    # remove "img", "webp", "png", "jpg"
    text = re.sub(r'\b(img|webp|png|jpg|jpeg)\b', '', text)
    # remove extra spaces
    text = ' '.join(text.split())
    return text

def main():
    img_dir = r"d:\augusto\imagenes"
    out_dir = r"d:\augusto\img - codigos"
    json_path = r"d:\augusto\excel_dump.json"

    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    products = []
    prices_sheet = data.get("Precios", [])
    
    # Skip first two rows (header)
    for row in prices_sheet[2:]:
        if len(row) >= 2 and row[0].strip() and row[1].strip():
            code = row[0].strip()
            name = row[1].strip()
            # If name is empty or just dots, skip
            if name == "" or name == "..":
                continue
            
            clean_name = clean_text(name)
            # Add some synonyms to help matching
            clean_name = clean_name.replace("whey protein", "proteina")
            
            products.append({
                'code': code,
                'name': name,
                'clean': clean_name
            })

    # product clean names
    product_clean_names = [p['clean'] for p in products]

    mapped = []
    unmapped = []

    for root, dirs, files in os.walk(img_dir):
        for file in files:
            if file == ".DS_Store" or file.endswith(".pdf"):
                continue
            
            filepath = os.path.join(root, file)
            clean_filename = clean_text(file)
            
            # Find best match
            matches = get_close_matches(clean_filename, product_clean_names, n=1, cutoff=0.4)
            if matches:
                matched_clean = matches[0]
                # Find the product
                prod = next(p for p in products if p['clean'] == matched_clean)
                ext = os.path.splitext(file)[1]
                new_name = prod['code'] + ext
                new_path = os.path.join(out_dir, new_name)
                shutil.copy2(filepath, new_path)
                mapped.append((file, prod['name'], new_name))
            else:
                unmapped.append(file)
                
    print("MAPPED:")
    for m in mapped:
        print(f"  {m[0]} -> {m[1]} ({m[2]})")
        
    print("\nUNMAPPED:")
    for u in unmapped:
        print(f"  {u}")

if __name__ == "__main__":
    main()
