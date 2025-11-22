# **Monitoring Dashboard**

A production-grade, containerized, Kubernetes-ready **Monitoring Dashboard** consisting of:

* **Backend API** exposing mock system metrics
* **React Frontend** visualizing metrics in real-time
* **Docker** & **Docker Compose** setup for local development
* **Kubernetes Manifests** with Deployments, Services, Probes, Resource Limits
* **CI/CD Pipeline** using GitHub Actions
* Clean modular folder structure

This README is aligned with the complete deliverable list.

---

## **📌 1. System Architecture**

```
                   +-----------------------------+
                   |         Frontend (React)    |
                   |  http://<frontend-service>  |
                   +-----------------------------+
                               |
                               |  polls /metrics every 10 sec
                               v
                   +-----------------------------+
                   |         Backend API         |
                   |   /metrics → JSON payload   |
                   | CPU, latency, error rate…   |
                   +-----------------------------+
                               |
                     Containerized via Docker
                               |
                           Kubernetes
                   +-----------------------------+
                   | Deployments + Services      |
                   | Liveness + Readiness Probes |
                   | Resource Requests & Limits  |
                   +-----------------------------+
```

---

## **📌 2. Tech Stack**

### **Backend**

* Node.js / Express
* Simulates metrics like:

  * CPU usage
  * Request latency
  * Error rate
  * Increasing counters

### **Frontend**

* React
* Polls backend every **10 seconds**
* Displays:

  * Metric cards
  * Live charts
  * Error rate trends

### **DevOps / Infra**

* Docker (multi-stage builds)
* Docker Compose
* Kubernetes (k3s/)
* GitHub Actions CI/CD
* NodePort Services for external access

---

## **📌 3. Repository Structure**

```
monitoring-dashboard/
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── k8s-manifest/
│   ├── monitoring.yaml
│
├── docker-compose.yml
├── .github/workflows/ci-cd.yaml
└── README.md
```

---

# **📌 4. Local Deployment – Docker Compose**

### **🔧 4.1 Prerequisites**

* Docker Desktop / Docker Engine
* Docker Compose v2+
* Node

---

### **▶️ 4.2 Start All Services**

```bash
docker-compose up --build
```

### **Access locally**

| Service      | URL                                                            |
| ------------ | -------------------------------------------------------------- |
| **Backend**  | [http://localhost:8080/metrics](http://localhost:8080/metrics) |
| **Frontend** | [http://localhost:3000](http://localhost:3000)                 |

---

### **Example Backend Response**

```json
{
  "cpu_usage": 37.5,
  "request_latency_ms": 121,
  "error_rate": 0.02,
  "total_requests": 5087
}
```

---

# **📌 5. Kubernetes Deployment Guide**

## **5.1 Prerequisites**

* Local Kubernetes (minikube / k3s / kind)
* `kubectl` configured
* Docker images available via:

  * Remote registry (Docker Hub / GHCR), or
  * Imported into cluster (`kind load docker-image …`)

---

## **5.2 Create Namespace, Deploy Backend & Frontend**

```bash
kubectl apply -f k8s-manifest/monitoring.yaml
```

---

## **5.4 Health Probes & Resource Limits**

### **Liveness Probe**

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 15
```

### **Readiness Probe**

```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10
```

### **Resource Requests & Limits**

```yaml
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "256Mi"
```

---

## **5.5 Access Services in Kubernetes**

```bash
kubectl get svc -n monitoring
```

### Example:

* Backend:
  `http://<node-ip>:<backend-nodeport>/metrics`
* Frontend:
  `http://<node-ip>:<frontend-nodeport>`

---

# **📌 6. CI/CD Pipeline – GitHub Actions**

Workflow located at:

```
.github/workflows/ci-cd.yaml
```

---

## **6.1 Pipeline Triggers**

* On **push** to `main`
* On **pull request** to `main`

---

## **6.2 Pipeline Stages**

### **1. Checkout Code**

Uses official GitHub checkout action.

### **2. Install Dependencies**

* Backend: `npm install` / `pip install -r requirements.txt`
* Frontend: `npm install` / `yarn install`

### **3. Unit Tests**

* Backend: `npm test` / `pytest`
* Frontend: `npm test` (if configured)

### **4. Linting**

* JS/TS → `eslint`

### **5. Build Docker Images**

```bash
docker build -t <registry>/monitoring-backend:<tag> backend/
docker build -t <registry>/monitoring-frontend:<tag> frontend/
```

### **6. Push Images to Docker Registry**

Requires GitHub Secrets:

* `DOCKER_USERNAME`
* `DOCKER_PASSWORD`
* or GHCR PAT

### **7. Deploy to Kubernetes**

```bash
kubectl apply -f k8s-manifest/
```

---

## **6.3 Running the Pipeline**

* Push code to **main**
* Check pipeline at **GitHub → Actions**

---

# **📌 7. Logs & Troubleshooting**

## **7.1 Docker Compose**

View backend logs:

```bash
docker-compose logs backend
```

View frontend logs:

```bash
docker-compose logs frontend
```

Follow logs live:

```bash
docker-compose logs -f
```

---

## **7.2 Kubernetes**

List pods:

```bash
kubectl get pods -n monitoring
```

Describe pod:

```bash
kubectl describe pod <pod-name> -n monitoring
```

Logs:

```bash
kubectl logs <pod-name> -n monitoring
```

Get inside a running pod (interactive shell):

```bash
kubectl exec -it <pod-name> -n monitoring -- /bin/bash
```

Execute a single command inside a pod:

```bash
kubectl exec -n monitoring <pod-name> -- curl localhost:8080/metrics
```

View resource usage inside a pod (if top exists):

```bash
kubectl exec -n monitoring <pod-name> -- top
```

Common issues:

* **ImagePullBackOff** → wrong image tag or authentication
* **CrashLoopBackOff** → application error
* **Probe failed** → wrong probe path or port

---


