# data_clean.py
import re
import pandas as pd

IN_PATH  = "data.csv"
OUT_CSV  = "support_workers_clean.csv"
OUT_JSON = "support_workers_clean.json"

df = pd.read_csv(IN_PATH)

# No need
cols_to_drop = [c for c in df.columns if "unnamed" in c.lower() or "no need" in c.lower()]
df = df.drop(columns=cols_to_drop, errors="ignore")


def normalize_region(area: str) -> str | None:
    if not isinstance(area, str):
        return None
    s = area.lower()
    if "sydney" in s: return "Sydney"
    if "melbourne" in s: return "Melbourne"
    if "brisbane" in s: return "Brisbane"
    if "adelaide" in s: return "Adelaide"
    if "perth" in s: return "Perth"
    if "canberra" in s: return "Canberra"
    return area.strip().title()

def parse_au_status(val) -> bool | None:
    if not isinstance(val, str):
        return None
    s = val.strip().lower()
    true_hits  = ["australian citizen", "i'm an australian citizen",
                  "permanent resident", "pr", "nz citizen"]
    false_hits = ["temporary visa", "bridging", "student", "no restrictions", "408", "tss", "whv"]
    if any(t in s for t in true_hits):  return True
    if any(t in s for t in false_hits): return False
    if "permanent resident" in s or "nz citizen" in s:
        return True
    return None

def parse_years(val) -> float | None:
    if not isinstance(val, str):
        return None
    s = val.strip().lower()
    if "no experience" in s or "none" in s:
        return 0.0
    if "more than" in s:
        m = re.search(r"(\d+)", s)
        return float(m.group(1)) if m else None
    m = re.search(r"(\d+\.?\d*)\s*(years?|yrs?|y)", s)
    if m: return float(m.group(1))
    m = re.search(r"(\d+\.?\d*)\s*(months?|mos?|m)", s)
    if m: return float(m.group(1)) / 12.0
    m = re.search(r"^\s*(\d+\.?\d*)\s*$", s)
    if m: return float(m.group(1))
    return None

COL_NAME = "name"
COL_AREA = "area"
COL_AU   = "australian"
COL_EXP  = "exp as support worker"

region_series = df[COL_AREA].apply(normalize_region) if COL_AREA in df else None
is_au_series  = df[COL_AU].apply(parse_au_status)   if COL_AU   in df else None
exp_series    = df[COL_EXP].apply(parse_years)      if COL_EXP  in df else None

out = pd.DataFrame()
if COL_NAME in df: out["name"] = df[COL_NAME]
out["region"] = region_series
out["is_australian"] = is_au_series
out["experience_years"] = exp_series


for opt in ["qualification", "previous role", "previous work place"]:
    if opt in df.columns:
        out[opt.replace(" ", "_")] = df[opt]

out.to_csv(OUT_CSV, index=False)
out.to_json(OUT_JSON, orient="records")

print(f"Saved: {OUT_CSV}")
print(f"Saved: {OUT_JSON}")