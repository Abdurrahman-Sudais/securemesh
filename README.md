# SecureMesh

**Security alerts that deserve attention.**

SecureMesh is a proposed defensive security monitoring platform for enterprise IT departments, SaaS companies and managed security service providers. It would consolidate authorised security findings, correlate them into incidents, prioritise alerts and draft evidence-based summaries for analyst review. It is read-only: security professionals evaluate findings and decide every response.

> SecureMesh is a proposed product. Features, integrations and AWS services are planned until implemented and verified. Pricing is illustrative, and the prototype uses fictional data. Founder: **David Emeka**. Website: `securemesh.live` · contact: `david@securemesh.live`.

## Design

The look is an operations room: deep indigo with a faint grid, a living node mesh, cyan signal and violet focus, console frames with corner brackets, Chakra Petch for display type, Inter for text and Share Tech Mono for labels.

- **Hero:** a split-word headline and a node mesh that draws itself; signals pulse along the edges and a target bracket locks onto the incident.
- **From noise to signal:** toggle between 16 raw findings and 8 correlated incidents; findings glide into their incidents with view transitions.
- **Capabilities:** all seven core features plus the differentiator, in bracketed console tiles with a pointer spotlight.
- **Transparent priority:** a live calculator using the same formula as the prototype.
- **Defensive by design:** read-only, no automated response, drafts not verdicts, reasons for every decision.
- **Who it's for:** target customers and decision-makers.
- **Pricing:** environments and data-volume sliders.
- **Technology:** the planned AWS architecture (GuardDuty, Security Hub, CloudWatch, Lambda, Bedrock, S3) with each service's role and the AWS Activate description.
- **Closing sections:** founder, progress and the demo-request form, FAQ, contact form with a topic picker.
- **Interactions:** a reticle cursor whose brackets lock onto targets, magnetic buttons, tilt, blur-in reveals and a cyan scroll-progress bar.

## Prototype (`/app`)

The triage console covers one synthetic day: 16 findings from GuardDuty, Security Hub and CloudWatch, using documentation IP ranges.

- **Correlation:** findings sharing a resource or identity within two hours become one incident; duplicates are merged.
- **Priority:** severity × asset criticality × corroboration × confidence, shown in full for every incident (P1–P4).
- **Evidence summaries:** a timeline drafted only from the incident's findings, labelled as a draft for review.
- **Analyst decisions:** acknowledge, open a case, or mark benign with a required reason. No automated response.
- **Cases:** investigating, contained and closed (closing needs the SOC lead and a summary), with notes.
- **Other tabs:** all findings with source filters, a dashboard, and an audit trail with CSV export for the lead and CISO.
- **Roles:** Security Analyst, SOC Lead, CISO and Auditor.

Every decision in the prototype is made by a person and written to a log. Changes persist in the browser's `localStorage`, and motion is skipped for visitors who prefer reduced motion. All pages are server-rendered and readable without JavaScript.

## Structure

```
src/content.js      site facts and founder
src/data.js         fictional data and roles
src/engine.js       the prototype's rules (pure functions, tested)
src/aws.js          the planned AWS architecture shown on the home page
src/forms.js        demo-request and contact form rules and HubSpot payloads (tested)
src/fx.js           interaction layer: reveals, cursor, magnetic and tilt effects, progress bar
src/App.jsx         marketing pages · src/Console.jsx the prototype
docs/architecture.md  planned AWS architecture and design rules
docs/crm-plan.md      HubSpot forms, properties and pipeline
```

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build   # Vite build, server render, static prerender of /, /app, /privacy, /terms and 404.html
npm test        # node --test
```

The output in `dist/` is fully static. Configs are included for Netlify/Cloudflare (`public/_headers`, `public/_redirects`) and Vercel (`vercel.json`).

Until HubSpot is configured, the forms keep requests in the browser and open a pre-filled email. To connect it, set `VITE_HUBSPOT_PORTAL_ID`, `VITE_HUBSPOT_FORM_GUID` and `VITE_HUBSPOT_CONTACT_FORM_GUID` (see `.env.example`), and update the privacy notice first.
