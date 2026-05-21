import nmap

def scan_host(target: str):
    nm = nmap.PortScanner()
    nm.scan(target, arguments="-T4 -F")

    results = []

    for host in nm.all_hosts():
        for proto in nm[host].all_protocols():
            for port in nm[host][proto]:
                results.append({
                "host": host,
                "port": port,
                "service": nm[host][proto][port]["name"]
                })
    return results