# Grafana — Performance & Metrics Dashboard

> The open-source standard for operational dashboards, time-series analytics, and performance visualization. In this repository, Grafana is the primary visualization layer for load tests (k6, JMeter, Locust) and infrastructure saturation metrics. 
>
> **Versions verified (2026-05):** Grafana v13.0.x, k6 v0.51.0

## When to reach for Grafana

Use when:
- You are running load or soak tests and need to visualize throughput, latency percentiles, and error rates over time.
- You need to combine test metrics (e.g., from k6 or JMeter) with infrastructure metrics (CPU, memory, database connections from Prometheus).
- You want to set up alerting on specific thresholds (e.g., P95 latency > 500ms over 5 minutes) via Slack or PagerDuty.

Avoid when:
- You are solely looking for pass/fail functional test reports. (Use [`allure-report.md`](./allure-report.md) or [`report-portal.md`](./report-portal.md) instead).
- You need a simple static snapshot. Grafana requires a persistent time-series database (like Prometheus or InfluxDB) to serve its interactive graphs.

## Install / setup

Grafana is typically run via Docker Compose alongside its data sources. 

```bash
# Run Grafana locally via Docker
docker run -d -p 3000:3000 --name grafana grafana/grafana:13.0.1
```

For a complete performance testing stack (k6 + InfluxDB/Prometheus + Grafana), we recommend using a `docker-compose.yml` file. See the `documents/ci/docker.md` guidelines for managing containerized infrastructure in this repo.

## The 3-step happy path (k6 integration)

1. **Spin up the stack.** Ensure your time-series database (e.g., InfluxDB v2 or Prometheus) and Grafana are running.
2. **Run your load test and export metrics.** Using k6 as the example, stream the output to the database:
   ```bash
   K6_PROMETHEUS_RW_SERVER_URL=http://localhost:9090/api/v1/write \
   k6 run --out experimental-prometheus-rw tests/perf/k6/scenarios/cart-add-item.js
   ```
3. **Visualize in Grafana.** 
   - Open Grafana at `http://localhost:3000` (default login `admin`/`admin`).
   - Add the database as a Data Source.
   - Import the official **k6 Load Testing Dashboard** (Dashboard ID: `19349` or `4411`).

## Configuration / conventions in this repo

- **Dashboard as Code:** Do not rely on manual dashboard clicks in production. Export your Grafana dashboards as JSON and commit them to `tests/perf/dashboards/` (create this folder if it doesn't exist).
- **Data Sources:** Use Prometheus as the default backend for new performance metrics. InfluxDB is acceptable for legacy JMeter/Locust integrations.
- **Annotations:** Use Grafana annotations to mark the exact start and end times of test runs, deployments, or chaos experiments. 

## Worked example

Here is a typical PromQL (Prometheus Query Language) snippet used in our Grafana panels to calculate the P95 latency for a specific scenario:

```promql
histogram_quantile(0.95, sum(rate(k6_http_req_duration_bucket{scenario="cart_add_item", expected_response="true"}[5m])) by (le))
```

This query takes the raw HTTP duration buckets from k6, calculates the rate over 5 minutes, and extracts the 95th percentile — which is then graphed against our 500ms SLO line.

## Anti-patterns this guideline rules out

- ❌ **Using Grafana as a primary datastore:** Grafana is a visualization layer. It does not store metrics. Always pair it with a robust time-series DB.
- ❌ **Manual dashboard edits in CI/CD:** If the dashboard breaks, you lose history. Always back up dashboard definitions as JSON in the repository.
- ❌ **Alerting on noisy, unactionable graphs:** Only set Grafana alerts on SLO-breaching metrics (e.g., Error Rate > 1%), not on arbitrary spikes in traffic.

## Related

- [`../performance/k6.md`](../performance/k6.md) — How to author the k6 load tests that feed Grafana.
- [`../performance/README.md`](../performance/README.md) — The performance testing decision matrix and SLO discipline.
