import requests
import time


NVD_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0"


def scan_risk(target: dict):
    risk_results = []

    for port in target.get("ports", []):
        query = build_cve_query(port)

        if not query:
            cves = []
        else:
            cves = search_cves(query)

        print(cves)
            
        risk_results.append({
            "port": port.get("port"),
            "protocol": port.get("protocol"),
            "service": port.get("service"),
            "product": port.get("product"),
            "version": port.get("version"),
            "cves": cves,
        })

        print(risk_results)

        time.sleep(3)

    return {
        "host": target.get("host"),
        "ports": risk_results,
    }

def search_cves(query: str):
    if not query:
        return []

    params = {
        "keywordSearch": query,
        "resultsPerPage": 5,
    }

    response = requests.get(NVD_URL, params=params, timeout=10)

    if response.status_code == 429:
        print("Rate limited:", query)
        return []

    if response.status_code == 404:
        print("No results:", query)
        return []

    response.raise_for_status()
    data = response.json()

    return simplify_cves(data.get("vulnerabilities", []))

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