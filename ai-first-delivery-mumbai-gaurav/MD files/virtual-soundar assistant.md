# Virtual Assistant — Soundar V

> Personal knowledge base and action tracker for Soundar Venkatesan.
> Last updated: 10 May 2026

---

## My Notes

- **Sprint 24 Demo** went well — client appreciated the real-time ingestion latency improvement (from 12s → 3.4s avg).
- Need to document the new Glue job partitioning strategy before handoff to Ops team.
- Gaurav suggested exploring **Agentic AI** patterns for automated pipeline recovery — worth a spike in Sprint 25.
- **Code review SLA** is slipping — 38% of PRs are exceeding 24-hour turnaround. Need to address in retro.
- Attended the AI-First Delivery training (Module 3: GenAI for Data Engineering). Key insight: use LLMs for schema drift detection.
- Snowflake cost spiked 22% in April — root cause: unoptimized materialized views in the analytics layer.

---

## My links references

- [AWS Glue Best Practices](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-best-practices.html) — Bookmark for team onboarding
- [FHIR R4 Resource Index](https://www.hl7.org/fhir/resourcelist.html) — Quick reference for API development
- [CitiusTech Engineering Wiki](https://wiki.citiustech.com/engineering) — Internal standards and templates
- [Snowflake Cost Optimization Guide](https://docs.snowflake.com/en/user-guide/cost-management) — Used for April cost analysis
- [Radiology Partners – SharePoint](https://citiustech.sharepoint.com/sites/RP-DataPlatform) — Project docs and SOWs
- [GenAI for Data Pipelines – Medium Article](https://medium.com/@dataeng/genai-pipelines) — Shared with team in Slack

---

## My network

- **Gaurav Chonkar** — Delivery Lead / Manager — Sync every Monday 10:30 AM IST
- **Priya Ramachandran** — RP Client-side Data Architect — Primary technical counterpart
- **Vikram Rajagopal** — Peer Tech Lead (Arcadia account) — Knowledge sharing on cloud patterns
- **Anita Deshmukh** — QA Lead — Coordinates test automation for data pipelines
- **Rajesh Iyer** — DevOps Engineer — Owns Terraform modules and CI/CD pipelines
- **Dr. Mark Sullivan** — RP VP of Analytics — Executive stakeholder, quarterly reviews
- **Nelson Nagnur** — Platform Architect — Consulted on FHIR gateway design

---

## My actions

- [ ] **Fix Snowflake cost spike** — Optimize materialized views in analytics schema → Target: 16 May 2026
- [ ] **PR review SLA improvement** — Propose buddy-review system in Sprint 25 retro → Target: 14 May 2026
- [ ] **Document Glue partitioning strategy** — Write technical runbook in Confluence → Target: 20 May 2026
- [ ] **Spike: Agentic AI for pipeline recovery** — Research AutoGen/LangGraph patterns → Target: 30 May 2026
- [x] ~~Submit cloud cost report to Gaurav~~ — Completed 8 May 2026
- [x] ~~Deploy FHIR R4 DiagnosticReport endpoint to staging~~ — Completed 5 May 2026
- [ ] **Prepare Sprint 25 planning inputs** — Capacity plan + backlog grooming → Target: 12 May 2026

---

## Open questions

- Should we migrate remaining HL7v2 feeds to FHIR or maintain a dual-protocol gateway? Need architectural decision from Nelson.
- Is there budget approval for a dedicated Snowflake admin role in Q3? Raised with Gaurav on 6 May.
- Client asked about SOC 2 Type II compliance for the data lake — do we have current certification docs?
- Can we use AWS Bedrock (Claude) for automated data quality rule generation? Need InfoSec clearance.
- What is the SLA expectation for the new real-time dashboard — 99.9% or 99.5% uptime?

---

## My 433

### 4 Key Responsibilities
1. **Technical architecture** for RP data platform (AWS + Snowflake)
2. **Team leadership** — 8 engineers, sprint planning, code reviews
3. **Client engagement** — Weekly tech syncs with Priya and Dr. Sullivan
4. **Quality & DevOps** — Pipeline reliability, CI/CD, monitoring

### 3 Priorities This Quarter (Q2 2026)
1. Reduce cloud infrastructure cost by **18%** through optimization
2. Achieve **95% PR review SLA** (within 24 hours)
3. Deliver FHIR R4 API layer to production by **end of June**

### 3 Development Goals
1. Complete **AWS Solutions Architect Professional** certification by Aug 2026
2. Build expertise in **Agentic AI** patterns for data engineering
3. Mentor 2 junior engineers through CitiusTech's **TechLead Academy** program