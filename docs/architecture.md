# Architecture

Status: **proposed**. The website and the prototype run entirely in the browser on fictional data. None of the AWS services below are deployed or connected.

## Today: browser-only prototype

- Vite + React, server-rendered to static HTML for every route (`scripts/prerender.mjs`).
- Synthetic security findings and asset data live in `src/data.js`; correlation, priority scoring, evidence summaries and case rules are pure functions in `src/engine.js`, tested with `node --test`.
- Changes persist in `localStorage`; roles are switched in the UI, not authenticated.

## Why AWS

SecureMesh is a proposed defensive monitoring platform for enterprise IT teams, SaaS companies and managed security providers. It works on a continuous stream of findings from authorised sources, which must be consolidated, explained and kept as protected records. Designing on AWS lets it read findings where they already live, process them as they arrive and store them with strict access controls.

## Proposed production service

| Stage | Services | What happens |
|---|---|---|
| 1. Findings | Amazon GuardDuty, AWS Security Hub | Threat detection findings and aggregated security findings are read from the customer’s authorised accounts, read-only. |
| 2. Operational signals | Amazon CloudWatch | Operational alarms and logs add context, such as a deployment or an outage at the same time. |
| 3. Process & correlate | AWS Lambda | Findings are normalised, de-duplicated and correlated into incidents by resource, identity and time. |
| 4. Summarise | Amazon Bedrock | Evidence summaries are drafted from the correlated findings for analysts to review. |
| 5. Protected records | Amazon S3 | Findings, incidents, case notes and audit reports are stored encrypted with restricted access. |
| Across every stage | AWS Lambda, AWS KMS, Amazon Cognito, AWS CloudTrail | AWS Lambda runs ingestion and correlation; AWS KMS encrypts security records; Amazon Cognito separates analyst, lead and auditor roles; AWS CloudTrail records access to protected data |

### Services and their role

- **Amazon GuardDuty** — Supplies threat-detection findings from the customer's authorised AWS accounts.
- **AWS Security Hub** — Aggregates security findings and control results across accounts.
- **Amazon Bedrock** — Drafts analyst-facing evidence summaries from correlated findings.
- **Amazon CloudWatch** — Provides operational alarms and logs as context for incidents.
- **Amazon S3** — Stores findings, incidents, case notes and audit reports as protected records.
- **AWS Lambda** — Runs alert ingestion, normalisation, de-duplication and correlation.
- **Amazon Cognito** — Authenticates users and enforces role-based access.
- **AWS KMS** — Encrypts security records with customer-specific keys.
- **AWS CloudTrail** — Keeps an audit trail of access to protected resources.

The same lists live in `src/aws.js` and are shown on the home page (`#technology`).

### Design rules

1. **Defensive and read-only.** SecureMesh reads authorised findings; it does not scan, probe or take automated response actions.
2. **Analysts decide.** Security professionals evaluate every incident and determine the response.
3. **Scores show their working.** Priority comes from severity, asset criticality, correlated signals and confidence — each factor shown.
4. **Least privilege.** Role-based access, encrypted records and an audit log of every analyst action.

## Website lead capture

The pilot and contact forms post to HubSpot (see `docs/crm-plan.md`). If a server-side intake is needed later, Amazon API Gateway + AWS Lambda can validate submissions and Amazon SES can notify the founder.
