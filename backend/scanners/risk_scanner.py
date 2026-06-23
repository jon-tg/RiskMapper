import sqlite3
import json
import requests
from datetime import datetime, timedelta
import time

DB_NAME = "riskmapper.db"
CACHE_DAYS = 7

NVD_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0"

def init_cve_cache():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cve_cache (
            query TEXT PRIMARY KEY,
            results TEXT NOT NULL,
            cached_at TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()

def get_cached_cves(query: str):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT results, cached_at
        FROM cve_cache
        WHERE query = ?
    """, (query,))

    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    results_json, cached_at = row
    cached_time = datetime.fromisoformat(cached_at)

    if datetime.now() - cached_time > timedelta(days=CACHE_DAYS):
        return None

    return json.loads(results_json)

def save_cves_to_cache(query: str, results):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT OR REPLACE INTO cve_cache (query, results, cached_at)
        VALUES (?, ?, ?)
    """, (
        query,
        json.dumps(results),
        datetime.now().isoformat(timespec="seconds")
    ))

    conn.commit()
    conn.close()

def build_cve_query(port: dict):
    service = port.get("service", "")
    product = port.get("product", "")
    version = port.get("version", "")

    product = str(product).strip()
    version = str(version).strip()
    service = str(service).strip()

    if " " in version:
        version = version.split(" ")[0]

    if product and version:
        return f"{product} {version}"

    if product:
        return product

    if service:
        return service

    return None

def scan_risk(target: dict):
    risk_results = []

    for port in target.get("ports", []):
        query = build_cve_query(port)

        if not query:
            cves = []
        else:
            cves = search_cves(query)
            
        risk_results.append({
            "port": port.get("port"),
            "protocol": port.get("protocol"),
            "service": port.get("service"),
            "product": port.get("product"),
            "version": port.get("version"),
            "cves": cves,
        })

        time.sleep(3)

    return {
        "host": target.get("host"),
        "ports": risk_results,
    }

def search_cves(query: str):
    if not query:
        return []

    cached = get_cached_cves(query)
    if cached is not None:
        print("Using cached CVEs:", query)
        return cached

    params = {
        "keywordSearch": query,
        "resultsPerPage": 5,
    }

    response = requests.get(NVD_URL, params=params)

    if response.status_code == 429:
        print("Rate limited:", query)
        return []

    if response.status_code == 404:
        print("No results:", query)
        return []

    response.raise_for_status()
    data = response.json()

    results = simplify_cves(data.get("vulnerabilities", []))
    save_cves_to_cache(query, results)

    return results

def simplify_cves(vulnerabilities):
    simplified = []

    for item in vulnerabilities:
        cve = item.get("cve", {})

        metrics = cve.get("metrics", {})
        score = None
        severity = "UNKNOWN"

        if "cvssMetricV31" in metrics:
            metric = metrics["cvssMetricV31"][0]
            score = metric["cvssData"].get("baseScore")
            severity = metric["cvssData"].get("baseSeverity")
        elif "cvssMetricV30" in metrics:
            metric = metrics["cvssMetricV30"][0]
            score = metric["cvssData"].get("baseScore")
            severity = metric["cvssData"].get("baseSeverity")
        elif "cvssMetricV2" in metrics:
            metric = metrics["cvssMetricV2"][0]
            score = metric["cvssData"].get("baseScore")
            severity = metric.get("baseSeverity", "UNKNOWN")

        simplified.append({
            "id": cve.get("id"),
            "description": cve.get("descriptions", [{}])[0].get("value"),
            "score": score,
            "severity": severity,
            "published": cve.get("published"),
        })

    return simplified