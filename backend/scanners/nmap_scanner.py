import nmap

def scan_host(target: str):
    nm = nmap.PortScanner()

    nm.scan(hosts=target, arguments="-sn")
    live_hosts = nm.all_hosts()

    results = []

    for host in live_hosts:
        if nm[host].state() != "up":
            continue

        scanner = nmap.PortScanner()
        scanner.scan(hosts=host, arguments="-T4 -F")

        if host not in scanner.all_hosts():
            continue

        for proto in scanner[host].all_protocols():
            for port in scanner[host][proto].keys():
                port_info = scanner[host][proto][port]

                results.append({
                    "host": host,
                    "protocol": proto,
                    "port": port,
                    "service": port_info.get("name")
                })

    return results