# RiskMapper

RiskMapper is a network reconnaissance and vulnerability assessment tool that combines host discovery with vulnerability intelligence. It uses Nmap to identify hosts, operating systems, and services on a network, then queries the National Vulnerability Database (NVD) to surface potential CVEs associated with discovered software.

## Features

* Host discovery using Nmap
* Service and version detection
* Operating system fingerprinting
* CVE lookups from the National Vulnerability Database
* Host risk analysis
* React frontend interface
* FastAPI backend

---

# Architecture

```
Frontend (React)
        ↓
FastAPI Backend
        ↓
Nmap + NVD API
```

The frontend provides the user interface, while the backend performs network scans and vulnerability lookups.

---

# Requirements

* Python 3.10+
* Node.js 18+
* Nmap installed and available in your system PATH
* Internet connection for CVE retrieval

---

# Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment.

### Linux / macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```
Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will be available at:

```
http://localhost:8000
```

Interactive API documentation is available at:

```
http://localhost:8000/docs
```

---

# Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will be available at:

```
http://localhost:5173
```

---

# Using the Hosted Frontend

A hosted version of the frontend is available at:

```
https://risk-mapper.vercel.app
```

The backend must still be running locally because network scans are performed on the user's machine.

Start the backend:

```bash
cd backend
uvicorn main:app --reload
```

Once the backend is running, you may use either:

* Local frontend (`http://localhost:5173`)
* Hosted frontend (`https://risk-mapper.vercel.app`)

---

# Usage

1. Start the FastAPI backend.
2. Open either the local frontend or the hosted frontend.
3. Enter an IP address or CIDR range.
4. Run a network scan.
5. Review discovered hosts, services, operating systems, and open ports.
6. Select a host to perform a risk analysis.
7. View potential vulnerabilities associated with the detected software.

---

# Example Targets

Single host:

```text
192.168.1.1
```

Entire subnet:

```text
192.168.1.0/24
```

---

# Technologies Used

## Backend

* FastAPI
* Python
* Nmap
* Requests

## Frontend

* React
* Tailwind CSS
* Vite

## External Data Source

* National Vulnerability Database (NVD)

---

# Disclaimer

RiskMapper is intended for educational purposes and authorized security testing only.

Always obtain permission before scanning networks or systems that you do not own or administer.
