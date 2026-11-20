// SecureMesh rules: correlate authorised findings into incidents (same resource or identity within two hours,
// or linked by a shared actor), score priority from severity, asset criticality, corroborating signals and
// confidence, draft an evidence summary for analysts, and manage cases. Read-only: no automated responses.
import {assets} from './data.js';

export const can = (roles, roleId, perm) => !!roles.find((r) => r.id === roleId)?.can.includes(perm);
const WINDOW = 120;

/** Union-find over findings: linked when they share a resource or actor within the window. */
export function correlate(findings) {
  const parent = findings.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < findings.length; i += 1) for (let j = i + 1; j < findings.length; j += 1) {
    const a = findings[i]; const b = findings[j];
    const near = Math.abs(a.t - b.t) <= WINDOW;
    const shared = a.resource === b.resource || a.actor === b.actor || a.actor === b.resource || b.actor === a.resource;
    if (near && shared) parent[find(i)] = find(j);
  }
  const groups = {};
  findings.forEach((f, i) => { (groups[find(i)] ||= []).push(f); });
  return Object.values(groups).map((fs) => incident(fs.sort((a, b) => a.t - b.t))).sort((a, b) => b.score - a.score);
}

function incident(fs) {
  const resources = [...new Set(fs.map((f) => f.resource))];
  const crit = Math.max(...resources.map((r) => assets[r]?.crit ?? 1));
  const sev = Math.max(...fs.map((f) => f.severity));
  const sources = [...new Set(fs.map((f) => f.source))];
  const types = [...new Set(fs.map((f) => f.type))];
  const conf = fs.reduce((s, f) => s + f.confidence, 0) / fs.length;
  const corroboration = 1 + 0.25 * (types.length - 1) + 0.15 * (sources.length - 1);
  const score = Math.min(100, Math.round((sev / 10) * (crit / 3) * corroboration * conf * 100));
  const p = score >= 60 ? 'P1' : score >= 35 ? 'P2' : score >= 15 ? 'P3' : 'P4';
  return {id: `INC-${fs[0].id.slice(1)}`, findings: fs, resources, crit, sev, sources, types, conf, corroboration, score, p, start: fs[0].t, end: fs.at(-1).t, duplicates: fs.length - types.length};
}

/** Evidence summary drafted from the correlated findings — a starting point for the analyst, not a verdict. */
export function summary(inc) {
  const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const steps = inc.findings.map((f) => `${fmt(f.t)} ${f.type} on ${f.resource} (${f.source})`);
  const lead = inc.types.length > 1 ? `${inc.findings.length} findings from ${inc.sources.join(', ')} appear related: they share ${inc.resources.length === 1 ? 'a resource' : 'an identity or address'} within ${Math.max(1, Math.round((inc.end - inc.start) / 60) || 1)} hour(s).` : `${inc.findings.length} finding${inc.findings.length > 1 ? 's' : ''} of one type (${inc.types[0]}).`;
  const crit = inc.crit === 3 ? 'At least one affected asset is business-critical.' : inc.crit === 2 ? 'Affected assets are moderately important.' : 'Affected assets are low criticality.';
  return {lead, crit, steps, suggest: inc.p === 'P1' ? 'Suggested next step for the analyst: verify with the asset owner and review access logs for the affected identity.' : inc.p === 'P4' ? 'Likely background noise; consider a documented suppression rule if it recurs.' : 'Suggested next step: confirm whether the change was planned.'};
}

export function initial(roles) { return {status: {}, cases: {}, suppress: [], log: [], role: roles[0].id}; }
const now = () => new Date().toISOString();

export function act(state, a, {roles, actor}) {
  const fail = (error) => ({state, ok: false, error});
  if (a.type === 'role') return {state: {...state, role: a.role}, ok: true};
  const allow = (p) => can(roles, state.role, p);
  const log = (id, summaryText, patch) => ({ok: true, state: {...state, ...patch, log: [{at: now(), actor, role: state.role, id, summary: summaryText}, ...state.log]}});
  const why = (a.reason || '').trim();
  switch (a.type) {
    case 'ack':
      if (!allow('triage')) return fail('Only analysts and the SOC lead triage incidents.');
      return log(a.id, 'Acknowledged', {status: {...state.status, [a.id]: {s: 'acknowledged', by: actor}}});
    case 'benign':
      if (!allow('triage')) return fail('Only analysts and the SOC lead triage incidents.');
      if (why.length < 10) return fail('Explain why this is benign (at least 10 characters) — it is kept for audit.');
      return log(a.id, `Marked benign — ${why}`, {status: {...state.status, [a.id]: {s: 'benign', by: actor, reason: why}}, suppress: a.rule ? [...state.suppress, {type: a.rule, by: actor, reason: why}] : state.suppress});
    case 'case': {
      if (!allow('case')) return fail('Only analysts and the SOC lead open cases.');
      if (state.cases[a.id]) return fail('A case is already open for this incident.');
      return log(a.id, 'Case opened', {cases: {...state.cases, [a.id]: {state: 'investigating', notes: [], by: actor}}, status: {...state.status, [a.id]: {s: 'case', by: actor}}});
    }
    case 'note': {
      if (!allow('case')) return fail('Only analysts and the SOC lead add case notes.');
      const c = state.cases[a.id]; if (!c) return fail('Open a case first.');
      if ((a.text || '').trim().length < 5) return fail('Write a note.');
      return log(a.id, `Note: ${a.text.trim()}`, {cases: {...state.cases, [a.id]: {...c, notes: [...c.notes, {by: actor, text: a.text.trim(), at: now()}]}}});
    }
    case 'caseState': {
      const c = state.cases[a.id]; if (!c) return fail('Open a case first.');
      if (a.value === 'closed' && !allow('close')) return fail('Only the SOC lead closes cases.');
      if (!allow('case')) return fail('Only analysts and the SOC lead update cases.');
      if (!['investigating', 'contained', 'closed'].includes(a.value)) return fail('Unknown case state.');
      if (a.value === 'closed' && why.length < 10) return fail('Add a closing summary (at least 10 characters).');
      return log(a.id, `Case ${a.value}${why ? ` — ${why}` : ''}`, {cases: {...state.cases, [a.id]: {...c, state: a.value, closing: why || c.closing}}});
    }
    default: return fail('Unknown action.');
  }
}
