import nmap

def scan_host(target: str):
    discovery = nmap.PortScanner()

    discovery.scan(hosts=target, arguments="-sn")
    live_hosts = discovery.all_hosts()

    results = []

    for host in live_hosts:
        if discovery[host].state() != "up":
            continue

        scanner = nmap.PortScanner()

        scanner.scan(hosts=host, arguments="-sV -O -sC -T4")

        if host not in scanner.all_hosts():
            continue

        host_data = scanner[host]

        hostnames = []
        for h in host_data.hostnames():
            if h.get("name"):
                hostnames.append(h.get("name"))

        os_matches = []
        if "osmatch" in host_data:
            for match in host_data["osmatch"]:
                os_matches.append({
                    "name": match.get("name"),
                    "accuracy": match.get("accuracy")
                })

        ports = []

        for proto in host_data.all_protocols():
            for port in host_data[proto].keys():
                port_info = host_data[proto][port]

                ports.append({
                    "protocol": proto,
                    "port": port,
                    "state": port_info.get("state"),
                    "service": port_info.get("name"),
                    "product": port_info.get("product"),
                    "version": port_info.get("version"),
                    "extra_info": port_info.get("extrainfo"),
                    "scripts": port_info.get("script", {})
                })

        results.append({
            "host": host,
            "status": host_data.state(),
            "hostnames": hostnames,
            "os_matches": os_matches,
            "ports": ports
        })

    return results