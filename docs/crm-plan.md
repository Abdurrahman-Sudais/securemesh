# CRM plan: pilot requests and contact messages

Status: **proposed**. Without HubSpot configured, pilot requests are kept in the browser and both forms open a pre-filled email to the founder.

## Where leads come from

| Source | Component | HubSpot form |
|---|---|---|
| Home `#pilot` | `src/PilotForm.jsx` | Pilot request (`VITE_HUBSPOT_FORM_GUID`) |
| Home `#contact` | `src/ContactForm.jsx` | Contact (`VITE_HUBSPOT_CONTACT_FORM_GUID`) |

Validation and payloads live in `src/forms.js` (tested in `tests/forms.test.mjs`).

## HubSpot set-up

1. Create two HubSpot forms with the fields below, and the custom contact properties marked *custom*.
2. Set `VITE_HUBSPOT_PORTAL_ID`, `VITE_HUBSPOT_FORM_GUID` and `VITE_HUBSPOT_CONTACT_FORM_GUID` (see `.env.example`), then rebuild.
3. Update the privacy notice with the confirmed processor and retention period **before** going live.

### Pilot request

| Form field | HubSpot property | Type |
|---|---|---|
| Full name | `firstname`, `lastname` | standard |
| Work email | `email` | standard |
| Company | `company` | standard |
| Company size | `company_size` | custom, dropdown (1–10, 11–50, 51–200, 201–1,000, 1,000+ employees) |
| Organisation type | `organisation_type` | custom, dropdown (Enterprise IT department, SaaS company, Managed security service provider, Other) |
| Primary use case | `primary_use_case` | custom, dropdown (Alert triage and prioritisation, Consolidating security findings, Incident summaries, Case management, Audit reporting, Other) |
| Environments and alert volume | `environment_detail` | custom, single-line text |
| Message | `enquiry_message` | custom, multi-line text |
| Consent (required) | `legalConsentOptions.consent` | sent as consent |

### Contact

| Form field | HubSpot property | Type |
|---|---|---|
| Name | `firstname`, `lastname` | standard |
| Email | `email` | standard |
| Company (optional) | `company` | standard |
| Topic | `contact_topic` | custom, dropdown (Product question, Demo request, Data sources and integrations, Security and data handling, Partnerships, Other) |
| Message | `enquiry_message` | custom, multi-line text |
| Consent (required) | `legalConsentOptions.consent` | sent as consent |

The hidden `website` field on both forms is a honeypot: if it is filled, nothing is sent.

## Pipelines (suggested)

- **Pilots:** Demo request → Qualified (team with GuardDuty/Security Hub findings) → Demo → Pilot scoped (one environment, read-only) → Pilot live → Customer.
- **Contact:** route by `contact_topic`; technical and security questions get a written answer before any call.

Owner: David Emeka, Founder. Reply target: two working days.
