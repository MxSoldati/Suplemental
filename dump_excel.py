import openpyxl
import json

def dump_excel(file_path):
    wb = openpyxl.load_workbook(file_path, data_only=True)
    out = {}
    for ws in wb.worksheets:
        rows = []
        for row in list(ws.rows)[:100]:
            r = [cell.value for cell in row]
            if any(x is not None for x in r):
                rows.append([str(x) if x is not None else "" for x in r])
        out[ws.title] = rows
        
    with open("D:\\augusto\\excel_dump.json", "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    dump_excel("D:\\augusto\\PRECIOS 2026 - SUPLEMENTAL (1).xlsx")
