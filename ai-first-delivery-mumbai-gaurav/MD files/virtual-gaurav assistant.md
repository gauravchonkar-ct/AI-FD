---
Title: "AI-First Delivery Program – Comprehensive Training Notes"
Source: "CitiusTech AI-First Delivery Program – Mumbai Batch-5"
Date: "May 2026"
Purpose: "Knowledge base for virtual personal assistant & post-training reference"
Tags:
  - GenAI
  - Delivery Management
  - Value Stream Mapping
  - Agentic AI
  - Forward Deployed Engineers
  - AACE Network
  - AI Agent Cost Model
---

# 🤖 AI-First Delivery Program – Comprehensive Training Notes

> *These notes have been elaborated from handwritten shorthand captured during a two-day training program designed for delivery managers in software engineering. The goal of this document is to serve as a rich, searchable knowledge base that can train a virtual personal assistant and act as a quick-reference guide for applying GenAI techniques to delivery management methodologies.*

---

## My Notes

---

### 🗓️ DAY 1 — Foundations of AI-First Delivery

---

#### 1. Enterprise-Grade AI – Governance & Traceability

Building AI at the enterprise level is fundamentally different from prototyping. Every AI system deployed in production **must** include:

- **Traceability** — Full audit trail of inputs, model calls, and outputs.
- **Explainability** — The ability to explain *why* the AI made a particular decision or recommendation.
- **Validation** — Automated checks against expected behavior, business rules, and compliance constraints.

Use an **AI harness** (a governance wrapper around your AI pipelines) that enforces these three pillars. Think of it like CI/CD for AI — no model output reaches production without being traced, explained, and validated.

The **DORA AI Capabilities Model (2025)** identifies seven foundational capabilities that organizations must cultivate to maximize AI's positive impact:

| # | Capability | Description |
|---|-----------|-------------|
| 1 | Clear and communicated AI stance | Ambiguity creates risk; a clear policy gives psychological safety for experimentation |
| 2 | Healthy data ecosystems | High-quality, accessible, unified internal data |
| 3 | AI-accessible internal data | Connect AI to internal docs and codebases to move from generic to specialized |
| 4 | Strong version control practices | AI increases velocity of change; version control is the critical safety net |
| 5 | Working in small batches | Counteracts the risk of AI generating large, unstable changes |
| 6 | User-centric focus | Ensures AI outputs serve real user needs, not just technical metrics |
| 7 | Quality internal platforms | Automated, secure pathways that allow AI benefits to scale |

> 💡 **Key Insight from DORA:** *"AI's primary role in software development is that of an amplifier. It magnifies the strengths of high-performing organizations and the dysfunctions of struggling ones."*

---

#### 2. Control AI Output

AI outputs are probabilistic, not deterministic. In enterprise settings — especially in healthcare (CitiusTech's core domain) — uncontrolled outputs create compliance risk (HIPAA, GxP, HITRUST).

**Strategies to control AI output:**
- **Guardrails** — Define hard boundaries on what the AI can and cannot say or do.
- **Output validation layers** — Post-processing checks that verify structure, accuracy, and policy compliance.
- **Structured prompts** — Constrain the model's degrees of freedom using templates, schemas, and few-shot examples.
- **Human-in-the-loop (HITL) checkpoints** — For high-stakes outputs, route through human review before action.
- **Temperature and creativity controls** — Lower temperature settings for factual, compliance-sensitive tasks.

---

#### 3. Be Hands-On in Building AI

Delivery managers can no longer afford to be "above" the technology. The training's core message is clear:

> 🔑 **"In the AI world, every engineer is a manager and every manager is an engineer."**

This means:
- **Managers** must understand how to prompt, evaluate, and build simple agents.
- **Engineers** must understand business context, cost implications, and client value.
- The boundary between the two roles is dissolving, and those who resist this shift will find themselves unable to lead effectively.

This is not optional upskilling to be done in extra time — it is **reskilling for your current job**.

---

#### 4. AI Knowledge as Context

Applying knowledge to solve problems using AI is about providing the right **context**. AI doesn't replace domain expertise — it *requires* it as input.

The value of a delivery manager shifts from "knowing how to code" to:
- **Knowing what problem to solve** and how to frame it for AI.
- **Knowing what good output looks like** so you can evaluate AI responses.
- **Knowing the business domain** so you can provide the context that makes AI outputs relevant.

Without context, AI is generic. With the right context, AI becomes a domain specialist.

---

#### 5. Evaluating Engineers in the AI Era

Traditional metrics like lines of code, story points completed, or years of experience are becoming insufficient. The new evaluation criteria for engineers should include:

- **How many agents have they built?** — Demonstrates practical AI capability.
- **What guardrails and safeguards have they implemented?** — Shows maturity and production-readiness.
- **Quality of their prompts and specifications** — Prompt engineering is the new coding.
- **Digital footprint** — Review their contributions, experiments, and published work using available AI tools.
- **Solution architecture skills** — Can they design systems where AI and humans collaborate effectively?

> The shift is from measuring *output volume* to measuring *AI-augmented impact*.

---

#### 6. Challenge the Status Quo

Start questioning existing processes. As a delivery manager, **call out problems** with existing organization or client processes, even when they're long-established. Every inefficiency is a potential AI opportunity.

Ask yourself and your team:
- *"Why are we doing this step manually?"*
- *"What would this process look like if we designed it today with AI?"*
- *"Is this step adding value, or is it just how we've always done it?"*

This mindset is the starting point for **Value Stream Mapping** (covered later).

---

#### 7. Human + Agent Collaboration Model

When humans and AI agents work together, the **specification becomes the most important artifact**. The collaboration model works as follows:

- **Humans** define the intent, set the specifications, and validate the outputs.
- **Agents** adhere to those specifications with **lower creativity** and **higher objectivity**.
- The goal is to **achieve the objective precisely**, not to be creative.

This means investing heavily in clear, detailed specs. A vague spec produces vague AI output. A precise spec produces precise, reliable results.

---

#### 8. Experience vs. AI Wisdom

> *"Knowledge and wisdom to use AI tools has reduced the importance of traditional experience in software development."*

This is a provocative but important observation. A 2-year engineer with strong AI skills can now outperform a 10-year engineer who hasn't adapted. However, this doesn't *devalue* experience — it **redefines** it:

- **Old experience** = "I've seen this problem before and I know the manual solution."
- **New experience** = "I know how to frame this problem for AI, validate the output, and integrate it into the delivery pipeline."

The highest-value professionals combine deep domain knowledge *with* AI fluency.

---

#### 9. ⭐ Dual-Model Development Approach (Key Principle)

> 📐 **"Plan First → Iterate using Model 1 → Evaluate using Model 2. Never use the same model to iterate AND evaluate."**

**Why this matters:**
- Using the same model to generate and evaluate creates **confirmation bias** — the model is unlikely to catch its own errors or blind spots.
- Using a different model for evaluation introduces a fresh perspective and catches issues that the first model's training biases might miss.

**Example workflow:**
1. **Plan** — Define the spec, acceptance criteria, and evaluation rubric.
2. **Iterate with Model 1** (e.g., Claude Sonnet) — Generate code, content, or architecture.
3. **Evaluate with Model 2** (e.g., GPT-5) — Review, critique, and score the output against the rubric.

This mirrors the **maker-checker principle** in financial services and software QA — the person who creates should not be the same person who approves.

---

#### 10. Developer Artifacts for AI-Led Development

AI-led development produces a different set of artifacts than traditional development. The core artifacts are:

| Artifact | Purpose | Format |
|----------|---------|--------|
| Specification Document | Capture **intent** — what the AI should achieve | Word / PDF |
| Markdown (MD) File | Structured **input** for AI — context, constraints, examples | `.md` |
| Code | Generated **output** — the actual deliverable | `.py` / `.js` / `.ts` |
| Documentation | Technical & user **docs** — auto-generated from code and specs | Auto-generated |
| Evaluation / Test Details | **Validation** — test cases, acceptance criteria, eval scores | Test suite |
| Version Control | **Governance** — full history, traceability, rollback capability | Git |

> 📌 **Note:** The MD file is the new "source of truth" for AI-led development. It's both human-readable and machine-parseable — making it the ideal bridge between human intent and AI execution.

---

#### 11. Three Key Goals for Delivery Managers

| # | Goal | How | Develops |
|---|------|-----|----------|
| 1 | Conduct value stream analysis for AI interventions in productivity and throughput | Developing your technical skills | 🛠️ Technical Capability |
| 2 | Effectively engage with clients on AI | Bringing value to your customer | 🤝 Client Relationships |
| 3 | Mentor and groom engineering teams | Exercising your leadership | 👥 Leadership |

These three goals form the **triangle of AI-first delivery leadership**: technical depth, client value, and team development.

---

#### 12. Building vs. Using Agents — Two Different Skills

| Dimension | Building Agents | Using Agents |
|-----------|----------------|--------------|
| Core Skill | Software engineering, prompt engineering, data pipelines | Workflow design, prompt crafting, output validation |
| Focus | Architecture, guardrails, testing, deployment | Business process integration, adoption |
| Role | AI/ML Engineer, Platform Engineer | Delivery Manager, Business Analyst, End User |
| Outcome | A working agent system | Business value from the agent |

Both are valuable. As a delivery manager, you need to understand both — **build enough to evaluate**, **use enough to lead**.

---

#### 13. Domain Agents Require Client Data

Building agents for business requires **data** so that the agent can learn. A services company like CitiusTech **cannot build domain/business agents on its own** — it must build the agent **with the client**.

- **Marketplace data** creates generic agents that lack specificity.
- **Client-specific data** creates agents relevant to the customer's exact context.
- This is a **key selling point** for managed services: *"We don't just deliver code — we build intelligent agents trained on your data."*

> ⚠️ **Implication:** Client data partnerships, data-sharing agreements, and privacy frameworks become prerequisites for building domain agents.

---

#### 14. Process Mapping Rules

Before applying AI to any process, you must map it with precision:

> **Rule:** If 1 Action → 1 Role → 1 Time, then it is a **Step**.
> If any of these multiplies, it is a **Task** (which needs decomposition).

**Why this matters for AI:**
- **Steps** are atomic, well-defined, and automatable.
- **Tasks** are composite and need to be broken into Steps before AI can be applied.
- You can only automate what you can precisely define.

---

#### 15. Value Stream Mapping (VSM) Classification

Value Stream Mapping classifies every step in a process into three categories:

| Category | Abbreviation | Description | AI Strategy |
|----------|-------------|-------------|-------------|
| Value-Added | VA | Directly creates value for the customer | Enhance with AI for speed and quality |
| Non-Value-Added | NVA | Creates no value — pure waste | **Eliminate** or automate |
| Essential Non-Value-Added | ENVA | No direct value but necessary (compliance, audit, etc.) | **Optimize** with AI tools |

According to **DORA's Value Stream Management Guide**, VSM helps "visualize the entire flow of work, from idea to production, and identify bottlenecks and areas for improvement." It is a cornerstone of lean software development and a key enabler of Continuous Delivery.

---

### 🗓️ DAY 2 — Application, Frameworks & Economics

---

#### 16. ⚠️ Anti-Pattern: Don't Use AI for Everything

> 🚫 **"Use AI to make utilities. Don't make AI the utility."**

This is one of the most common anti-patterns in AI adoption. AI should be a **tool within your workflow**, not the workflow itself.

**Signs of this anti-pattern:**
- Every feature request gets an "add AI" tag without clear value analysis.
- Teams use AI for tasks that are faster done manually.
- AI is used as a blanket solution rather than a targeted intervention.

**The correct approach:** Use AI for specific, high-impact, well-defined tasks where it demonstrably outperforms manual work.

---

#### 17. Eliminate → Redirect → Optimize (ERO) Methodology

After classifying process steps using VSM, apply the **ERO methodology** in this order:

| Step | Target | Action | Example |
|------|--------|--------|---------|
| 1. **Eliminate** | Non-Value-Added (NVA) steps | Remove entirely | Redundant approval loops, duplicate data entry |
| 2. **Redirect** | Remaining NVA steps | Route to automated/AI paths | Manual status reporting → AI-generated dashboards |
| 3. **Optimize** | Essential Non-Value-Added (ENVA) steps | Improve using AI tools | Compliance checks → AI-assisted validation |

> Only after completing ERO on waste should you look at improving **Value-Added** steps with AI.

---

#### 18. Skilling vs. Upskilling — The Right Mindset

> 📌 **"Learning GenAI tools is SKILLING to do your current job — not UPSKILLING done in extra time for a future job."**

This reframing is **critical for team adoption**:
- **Old framing:** *"Learn AI in your spare time so you're ready for the future."* → Creates resistance, feels like extra burden.
- **New framing:** *"Learning AI is part of doing your job today, like learning a new IDE or framework."* → Creates urgency and relevance.

Budget time for AI learning within sprint capacity, not outside of it.

---

#### 19. Motivation for GenAI Adoption

> ❌ **Fear of losing your job is NOT the right motivator** for the team to skill on GenAI technology.

Fear-based motivation leads to:
- Anxiety and resistance rather than genuine engagement.
- Superficial adoption ("check the box") without real skill development.
- Cultural damage and loss of psychological safety.

**Instead, use positive motivators:**
- 🚀 **Empowerment** — "AI makes you 10x more capable."
- ⚡ **Efficiency** — "Eliminate the boring parts of your job."
- 📈 **Career growth** — "AI skills are the most in-demand capability."
- 🎯 **Relevance** — "Stay at the cutting edge of your profession."

---

#### 20. Goal, Governance, and Goodwill (3G Framework)

Organizations can be transformed with three elements:

| Element | Description | Best Practice |
|---------|-------------|---------------|
| 🎯 **Goal** | SMART goals defined by the team | Ask the team to use GenAI itself to define their SMART goals |
| 📏 **Governance** | Time-bound rules agreed by the team | Rules should ensure goals are met; reviewed and revised periodically |
| 🤝 **Goodwill** | Trust, psychological safety, and collaborative spirit | Build a culture where experimentation is safe and failure is a learning opportunity |

**Goal vs. Target — An Important Distinction:**
- **Target** = Set when the environment and all parameters are exactly known. (e.g., "Fix 100 bugs this sprint.")
- **Goal** = Set when there are unknowns and requires adaptation. (e.g., "Reduce customer-reported defects by 30% using AI-assisted testing.")

Goals require judgment, adaptation, and leadership. Targets only require execution.

---

#### 21. Concurrent Agent Work

AI-based agents should work **in parallel** with humans, not sequentially:

| While You Are... | Your Agent Is... |
|-------------------|-------------------|
| In a client meeting | Drafting the meeting summary |
| Reviewing code | Running automated test cases |
| Planning the sprint | Analyzing velocity trends and suggesting improvements |
| On a break | Processing data and generating reports |

This concurrent model is the **true productivity multiplier** — it's not about AI replacing tasks, but AI doing tasks *simultaneously* alongside human work.

---

#### 22. Three Areas of Opportunity in Value Stream Mapping

As an engineering manager, identifying opportunities for improving processes is the most important value you deliver. Run value stream mapping across these three areas:

| Area | Focus | Impact Level | Requires |
|------|-------|-------------|----------|
| 1. Engineering Productivity | Improve utilization — individual efficiency | 🟢 Quick wins | Internal initiative |
| 2. Workflow Productivity | Improve velocity / release frequency — team throughput | 🟡 Medium-term | Team alignment |
| 3. Transformational Backlog | AI-native workflows — rethink processes from scratch | 🔴 High impact, long-term | **Customer consent** |

> 💡 **Area 3** is where the real competitive advantage lies, but it requires client partnership, trust, and co-investment. Areas 1 and 2 can be started immediately as internal initiatives.

**Ask the right questions and cut the noise** to identify the correct process for optimal value stream.

---

#### 23. Resource Loading & Productivity Curves for AI Projects

When planning resource loading for AI-enabled projects, follow this lifecycle:

```
PRE-LAUNCH          EXECUTION              POST-EXECUTION
    │                    │                       │
    ▼                    ▼                       ▼
Get baseline       Track REAL              Share actual
productivity ──►   productivity ──►         curve back to
curve from         curve; measure           Practice/CoE
Practice/CoE       DELTA with               with learnings
    │              baseline                      │
    ▼                                            ▼
Factor in                                  CoE corrects
LEARNING TIME                              baseline for
before ramp-up                             future projects
```

**Key principles:**
- **Don't assume instant productivity** — Factor in the learning curve before ramping up resources.
- **Measure the delta** — The gap between planned and actual productivity is the most valuable data point.
- **Close the loop** — Sharing actuals back to the Practice/CoE creates an **organizational learning loop** where each project improves the next estimate.
- **Governance during execution** — Continuously track and compare, don't wait until the end.

---

#### 24. Forward Deployed Engineers (FDEs)

Forward Deployed Engineers are **engineers embedded directly on a project to tune AI solutions for peak performance** within the client's specific environment.

**Origin & Evolution:**
- **Pioneered by Palantir** in the early 2010s under the internal designation "Delta."
- At its peak, Palantir had more FDEs than software engineers building the product.
- **Now adopted by:** OpenAI, Anthropic, Scale AI, Databricks, Deloitte, ServiceNow + Accenture.
- FDE hiring interest has grown **800% since January 2026** (per Financial Times).

> 💬 *"Unlike traditional software engineers who create single capabilities for many customers, FDEs focus on enabling many capabilities for a single customer."*
> — **Bob McGrew**, former CTO of OpenAI, Pioneer of FDE at Palantir

**What FDEs do:**
- Work alongside client teams and make real-time adjustments.
- Ensure the AI platform evolves in lockstep with the business.
- Bridge the gap between AI pilots and AI in production.
- Handle complex integration with legacy systems, compliance, and data environments.

**For CitiusTech context:** FDEs are essential when deploying AI in healthcare client environments with complex compliance requirements (HIPAA, GxP), fragmented data systems, and specialized clinical workflows.

> ⚠️ **Key stat from MIT research:** 95% of enterprise AI pilots produce zero measurable return. FDEs exist to close that gap.

---

#### 25. 💰 AI Agent Cost Model

Understanding the economics of autonomous AI agents is critical for delivery managers who need to build business cases and manage client expectations.

**The Core Formula:**

```
Unit Cost of Work = Total Cost / Units of Work Delivered

Where:
Total Cost = Build Cost + Run Cost

Build Cost = Engineering Labor
           + Dev & QA Infrastructure
           + Licenses
           + Token Cost (during development)

Run Cost   = Licenses
           + Maintenance Labor
           + Token Cost (in production)
           + Production Infrastructure
```

**Token Cost Estimation Framework:**

| Query Complexity | Tokens per Query | × Input Pattern | = Token Estimate |
|-----------------|------------------|-----------------|------------------|
| Simple | Low (~500-1K) | 1-shot | Baseline |
| Medium | Medium (~2K-5K) | 2-shot | 2-3× Baseline |
| Complex | High (~5K-15K) | 3-shot | 4-6× Baseline |

**For Semi-Autonomous Agents:** Add **HITL (Human-in-the-Loop) cost** — the human time spent reviewing, approving, or correcting agent outputs.

**Industry Context (2025-2026):**
- Enterprise LLM spending reached **$8.4 billion** in H1 2025.
- **96%** of enterprises reported costs exceeding initial projections.
- Production agents make **3–10× more LLM calls** than simple chatbots.
- A single unconstrained agent solving a software engineering task can cost **$5–8 per task** in API fees alone.
- Smart **model routing** (using cheaper models for simple subtasks) can cut costs by **up to 80%**.
- The cost model has three layers: **Fixed costs** (platform, storage, monitoring) + **Variable costs** (tokens, API calls, storage) + **Failure tax** (retries, escalations, rework).

> 📌 **Rule of thumb:** Budget for 3× your estimated token cost in the first 3 months of production — the gap between demo and production is always larger than expected.

---

---

## My Links References

| # | Resource | URL | Why It Matters |
|---|----------|-----|----------------|
| 1 | **METR.org** | [metr.org](https://metr.org) | AI agent capability benchmarks; task-completion time horizons showing exponential increase in what agents can do |
| 2 | **AI.com** | [ai.com](https://www.ai.com) | OpenAI / ChatGPT portal — explore latest frontier models and capabilities |
| 3 | **DORA VSM Guide** | [dora.dev/guides/value-stream-management](https://dora.dev/guides/value-stream-management/) | Google's definitive guide to Value Stream Mapping for software delivery |
| 4 | **DORA AI Capabilities Model 2025** | [PDF Link](https://services.google.com/fh/files/misc/2025_dora_ai_capabilities_model.pdf) | The 7 foundational capabilities that amplify AI's positive impact |
| 5 | **Stanford HAI 2026 AI Index** | [hai.stanford.edu](https://hai.stanford.edu/ai-index/2026-ai-index-report) | Most comprehensive annual report on AI's technical progress, economic influence, and societal impact |
| 6 | **FDE Playbook** | [forwarddeployedengineer.site](https://www.forwarddeployedengineer.site/) | Complete guide to the Forward Deployed Engineer model with Bob McGrew's insights |
| 7 | **Forbes: When Are FDEs Essential?** | [forbes.com](https://www.forbes.com/sites/peterbendorsamuel/2026/04/30/when-are-forward-deployed-engineers-essential-and-when-are-they-not/) | Nuanced analysis of when FDEs add value vs. when they're overkill |
| 8 | **AI Agent Cost Model (nNode)** | [nnode.ai](https://www.nnode.ai/blog/2026-04-05-real-cost-of-ai-agents-in-production-practical-cost-model) | Practical production cost model: fixed + variable + failure tax |
| 9 | **AI Agent Benchmarks 2026 (CodeSOTA)** | [codesota.com/agentic](https://www.codesota.com/agentic) | SWE-bench, security audits, and autonomous task horizon benchmarks |
| 10 | **MIT AI Agent Index 2025** | [aiagentindex.mit.edu](https://aiagentindex.mit.edu/) | Documentation of 30 state-of-the-art AI agents — origins, capabilities, safety features |
| 11 | **VSM as AI Superpower (Lean.org)** | [tech.lean.org](https://tech.lean.org/journal/value-stream-mapping-is-your-missing-ai-superpower) | How VSM enables effective AI adoption; DORA archetype analysis |
| 12 | **Agent Cost Optimization (Zylos)** | [zylos.ai](https://zylos.ai/research/2026-04-12-ai-agent-cost-optimization-token-budget-model-routing) | Deep dive on token budgets, model routing, caching, and AI FinOps |

---

---

## My Network  (AACE Framework)

For each area of opportunity identified through Value Stream Mapping, you need a **network of SMEs** to draw upon. The training introduced the **AACE Framework** — a tiered model for building and maintaining your professional knowledge network.

### The Four Tiers

| Tier | Name | Response Time | Network Size | Contact Frequency | Profile |
|------|------|:------------:|:------------:|:-----------------:|---------|
| **A** | 🤖 Ask AI | **30 seconds** | Unlimited | Always on | Your AI copilot — first line for factual queries, brainstorming, and drafting |
| **A** | 🏃 Alpha Network | **4 hours** | **5 people** | Every **15 days** | SMEs who pick up your call and help immediately. Practical, accessible. Need NOT be heads of Practices or CoE |
| **C** | 📧 Charlie Network | **24 hours** | **5 people** | As needed | SMEs who respond to email next day. Better depth than Alpha. Won't pick up the phone but provide thorough written responses |
| **E** | 🎓 Echo Network | **Variable** (days) | **5 people** | Quarterly+ | Domain experts — gold-standard quality. Difficult to reach, but if and once they respond, the quality is the highest in the field |

### How to Build Your AACE Network

1. **Start with existing relationships** — People you've worked on projects with who demonstrated deep expertise.
2. **Attend internal tech talks and guilds** — Identify who asks the sharpest questions or gives the best talks.
3. **Engage on collaboration channels** (Slack / Teams) — Notice who consistently provides valuable insights.
4. **Offer value first** — Share articles, tools, or insights before you ask for help.
5. **Be specific in your asks** — SMEs respond better to precise, well-framed questions.

### How to Maintain Your AACE Network

| Tier | Maintenance Strategy |
|------|---------------------|
| AI | Keep your AI tools updated; curate custom prompts and knowledge bases |
| Alpha | Schedule regular **15-minute check-ins**; share wins and challenges |
| Charlie | Send occasional articles, insights, or tool recommendations via email |
| Echo | Engage at conferences, publish papers/articles that catch their attention |

### My AACE Network Tracker

| Name | Tier | Domain Expertise | Last Contact | Next Contact |
|------|------|-----------------|-------------|-------------|
| Santosh W | Alpha | Enterprise Support  | May 7 2026 | May 28 |
| Jagadeesh C | Alpha | Cloud Engineering | May 4 2026 | May 18 |
| Vinay R | Alpha | DevOps  | May 3 2026 | May 19 |
| Gaurav S | Alpha | QA  | May 7 2026 | May 28 |
| Deepesh S| Alpha | Cyber Security | May 7 2026 | May 28 |
| Kanan M | Alpha | InterOp | May 7 2026 | May 28 |
| *[To be filled]* | Charlie | | | |
| *[To be filled]* | Charlie | | | |
| *[To be filled]* | Charlie | | | |
| *[To be filled]* | Charlie | | | |
| *[To be filled]* | Charlie | | | |
| *[To be filled]* | Echo | | | |
| *[To be filled]* | Echo | | | |
| *[To be filled]* | Echo | | | |
| *[To be filled]* | Echo | | | |
| *[To be filled]* | Echo | | | |

---

---

## My Actions

### Actions from Training Notes

| # | Action Item | Owner | Due Date | Status | Priority |
|---|------------|-------|----------|--------|----------|
| 1 | Review SKSKDK | Gaurav | 10-May-2026 | ⬜ Pending | 🔴 High |
| 2 | Check [www.ai.com](https://www.ai.com) — explore latest models and capabilities | Gaurav | 17-May-2026 | ⬜ Pending | 🟡 Medium |
| 3 | Read METR.org research papers — especially task-completion time horizons | Gaurav | 17-May-2026 | ⬜ Pending | 🔴 High |

### Suggested Actions from Training Content

| # | Action Item | Owner | Due Date | Status | Priority |
|---|------------|-------|----------|--------|----------|
| 4 | Identify 3 value stream candidates in current projects for AI intervention | Gaurav | 24-May-2026 | ⬜ Pending | 🔴 High |
| 5 | Build AACE Network — identify 5 Alpha, 5 Charlie, 5 Echo contacts | Gaurav | 31-May-2026 | ⬜ Pending | 🔴 High |
| 6 | Run ERO (Eliminate → Redirect → Optimize) exercise on one delivery workflow | Gaurav | 31-May-2026 | ⬜ Pending | 🟡 Medium |
| 7 | Build first AI agent using dual-model approach (Iterate with Model 1 + Evaluate with Model 2) | Gaurav | 07-Jun-2026 | ⬜ Pending | 🟡 Medium |
| 8 | Define SMART goals for GenAI adoption with team — use GenAI itself to draft the goals | Gaurav | 24-May-2026 | ⬜ Pending | 🔴 High |
| 9 | Create AI agent cost model (Build + Run + HITL) for one client use case | Gaurav | 07-Jun-2026 | ⬜ Pending | 🟡 Medium |
| 10 | Share these training notes with team (Bhooshan, Swarup, Vikram, Mayuresh) and conduct a knowledge transfer session | Gaurav | 17-May-2026 | ⬜ Pending | 🟡 Medium |
| 11 | Evaluate team members on agent-building capability — establish a baseline scorecard | Gaurav | 31-May-2026 | ⬜ Pending | 🟡 Medium |
| 12 | Identify potential FDE candidates for future client AI deployments | Gaurav | 14-Jun-2026 | ⬜ Pending | 🟢 Low |

---

---

## Open Questions

### Q1: How does an agent learn?

**Context:** Raised during the Day 1 discussion on building domain agents that require client data.

**Exploration — Key Learning Mechanisms for AI Agents:**

| Method | How It Works | When to Use |
|--------|-------------|-------------|
| **Fine-Tuning** | Retrain the base model on domain-specific data | When you have large, labeled datasets and need deep specialization |
| **RAG (Retrieval-Augmented Generation)** | Retrieve relevant documents at query time and inject into prompt | When knowledge changes frequently; most common enterprise pattern |
| **In-Context Learning (Few-Shot)** | Provide examples in the prompt itself | Quick experiments; when you have limited data |
| **RLHF (Reinforcement Learning from Human Feedback)** | Humans rate outputs; model learns preferences | For fine-tuning behavior, tone, and quality |
| **Tool-Use Learning** | Agent learns which tools to call and when, based on outcomes | For agentic systems that interact with APIs, databases, and services |
| **Memory Systems** | Agent stores and retrieves past interactions for continuity | For long-running agents that need to remember context across sessions |

**Resources to explore:**
- [METR.org](https://metr.org) — Task-completion time horizons and agent capability research
- [Stanford HAI 2026 Report](https://hai.stanford.edu/ai-index/2026-ai-index-report) — Chapter 2: Technical Performance
- [MIT AI Agent Index](https://aiagentindex.mit.edu/) — 30 agents documented with evaluation methodologies

---

### Q2: How to create detailed notes from shorthand notes?

**Context:** A meta-question raised during the training itself — and this very document is the answer!

**Suggested Workflow (Using the Dual-Model Approach):**

1. **Capture** — Take raw shorthand notes in Markdown format during the session.
2. **Elaborate with Model 1** — Feed the raw notes to an AI (e.g., Claude) with the prompt: *"Elaborate these shorthand training notes into comprehensive, well-structured documentation. Add context and explanation where notes are brief."*
3. **Evaluate with Model 2** — Feed the elaborated output to a different AI (e.g., GPT) with the prompt: *"Review these training notes for accuracy, completeness, and clarity. Flag any areas that seem incorrect or need more detail."*
4. **Human Review** — The author reviews, corrects, adds personal context, and finalizes.
5. **Version Control** — Store in Git for traceability and future updates.

> ✅ **This workflow was used to create this very document** — proving the concept works.

---

### Q3: What is the right governance model for AI agents in production?

**Context:** Implied from the 3G Framework discussion and the emphasis on enterprise-grade AI governance.

**Exploration areas:**
- **Monitoring** — Real-time dashboards tracking agent performance, error rates, and cost.
- **Cost Controls** — Token budgets, rate limits, and alerts when spending exceeds thresholds.
- **Output Validation** — Automated checks before agent outputs reach end users.
- **Escalation Paths** — Clear rules for when agents should hand off to humans.
- **Audit Trails** — Complete logs of every agent decision, input, and output for compliance.
- **Periodic Reviews** — Scheduled reviews of agent performance against SMART goals.

---

### Q4: How to measure ROI of AI interventions in delivery workflows?

**Context:** Essential for Goal 2 (effectively engaging with clients on AI) and for justifying AI investments.

**Suggested measurement framework:**
- **Before/After VSM Comparison** — Map the value stream before and after AI intervention; quantify the reduction in NVA and ENVA steps.
- **Effort Savings** — Hours saved per sprint/release cycle.
- **Velocity Improvement** — Story points delivered per sprint (before vs. after).
- **Quality Metrics** — Defect density, change failure rate, mean time to recovery.
- **Cost Per Unit of Work** — Using the AI Agent Cost Model formula from Section 25.
- **Developer Satisfaction** — Survey-based NPS on tooling and workflow improvements.

---

### Q5: How to convince clients to share data for building domain agents?

**Context:** Building meaningful domain agents requires client data, but clients are understandably cautious about sharing sensitive information.

**Suggested approach:**
- **Data Privacy Frameworks** — Present clear data handling policies, encryption standards, and compliance certifications (HIPAA, SOC 2, ISO 27001).
- **Anonymization & De-identification** — Offer to work with anonymized data where possible.
- **Federated Learning** — Propose models where the data never leaves the client's environment.
- **Start with a POC** — Demonstrate value with a small, low-risk dataset before asking for broader access.
- **Shared Ownership** — Position the agent as a jointly-owned asset built on their data, giving them IP rights.
- **Reference Case Studies** — Show examples of similar clients who benefited from data-sharing partnerships.

---



## My 433

4 ideas which can help client's SDLC / Business outcomes :

Idea 1 - In Radiology partners AI enabled forecasting can help improve scheduling for radiologists at specfic sites based on the modality specializations and past performance of the radiologist, exam volume during that time of the year, RVUs etc

Idea 2 - Leverage AI enabled automations for triaging of Citrix support related tickets

Idea 3 - Introduce AIDLC to the new project oppurtunity of implementing Admin portal for Mosiac OS platform

Idea 4 - Create a Client/Arcadia SME Agent with context from confluence / JIRA and other training and knowledge material
----------------------------------------------------------------
3 Ideas which can help the team :

Idea 1 - Auto create MD files for existing legacy code or third party tools/APIs which can serve as a knowledge base for agents 

Idea 2 - Procure fixed number of Copilot Studio licenses for all team for 3 months. Drive the team to create thier own automations using Power Automate etc + AI (if required) . Review automations and decide of whose licenses need to continue

Idea 3 - Convert client domain related trainings to Pod casts and evalutions in form of interactive interviews 

-----------------------------------------------------------------

3 Ideas to help me in my work :

Idea 1 - Improved Margin forecasting and discrepancies. Use historical data of leave patterns, NHs, visa renewals information etc to better predict LE and margin imapct. Look at utilization patterns, unexplained margin drops etc to identify discrepancies

Idea 2 - PTO Helper : Power Automate based flow which runs post PTO to help summarize important emails based on sender, prirotity tagging, personal tagging etc and after understanding the context from historical emails from the same sender/subject. Idenity emails which indicate pending approvals etc

Idea 3 - Client News letter : Power Automate based flow which looks for key updates related to the client or client's specfic business areas and creates a summary and porabable imapct on CT's current enagement 



---

## 📄 About This Document

| Field | Detail |
|-------|--------|
| **Origin** | Handwritten shorthand notes captured during the CitiusTech AI-First Delivery Program (Mumbai Batch-5) |
| **Elaborated Using** | GenAI (dual-model approach: generation + evaluation) with human review and supplementary research |
| **Purpose** | Serve as a comprehensive knowledge base for a virtual personal assistant and as a quick-reference training guide |
| **Author** | Gaurav Chonkar, AVP-II – Delivery Lead, CitiusTech |
| **Date** | May 2026 |
| **Version** | 1.0 |
| **Format** | Markdown (.md) — human-readable and machine-parseable |


> *This document itself is a demonstration of the training's core principle: use AI to elaborate and structure knowledge, then validate with human expertise. The raw notes were ~800 words. This elaborated version is ~4,000+ words of actionable, structured knowledge.*

---

*End of Document*
