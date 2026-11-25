import test from 'node:test';
import assert from 'node:assert/strict';
import site from '../src/content.js';
import {findings, people, roles} from '../src/data.js';
import {act, correlate, initial, summary} from '../src/engine.js';

test('related findings correlate into incidents; every finding lands in exactly one', () => {
  const inc = correlate(findings);
  assert.equal(inc.reduce((s, i) => s + i.findings.length, 0), findings.length);
  const top = inc[0];
  assert.deepEqual(top.findings.map((f) => f.id), ['F01', 'F02', 'F03', 'F04'], 'login, API calls, bucket change and spike are one incident');
  assert.equal(top.p, 'P1');
  const late = inc.find((i) => i.findings.some((f) => f.id === 'F16'));
  assert.equal(late.findings.length, 1, 'a probe hours later is not merged into the morning probes');
});

test('priority rewards criticality and corroboration: a public marketing bucket ranks below customer exports', () => {
  const inc = correlate(findings);
  const mk = inc.find((i) => i.resources.includes('s3/marketing-assets'));
  assert.equal(mk.p, 'P4');
  for (let i = 1; i < inc.length; i += 1) assert.ok(inc[i - 1].score >= inc[i].score);
});

test('summaries only cite the incident’s own findings and are drafts', () => {
  for (const inc of correlate(findings)) { const s = summary(inc); assert.equal(s.steps.length, inc.findings.length); }
});

test('triage needs the right role and a reason; closing a case needs the lead', () => {
  const ctx = (s) => ({roles, actor: people[s.role]});
  let s = initial(roles);
  assert.match(act(s, {type: 'benign', id: 'INC-05', reason: 'scan'}, ctx(s)).error, /reason|Explain/);
  s = act(s, {type: 'benign', id: 'INC-05', reason: 'Internet scanner noise on staging'}, ctx(s)).state;
  assert.equal(s.status['INC-05'].s, 'benign');
  s = act(s, {type: 'case', id: 'INC-01'}, ctx(s)).state;
  assert.equal(act(s, {type: 'case', id: 'INC-01'}, ctx(s)).ok, false);
  assert.match(act(s, {type: 'caseState', id: 'INC-01', value: 'closed', reason: 'Key rotated and bucket policy reverted'}, ctx(s)).error, /lead/);
  const lead = act(s, {type: 'role', role: 'lead'}, ctx(s)).state;
  assert.equal(act(lead, {type: 'caseState', id: 'INC-01', value: 'closed', reason: 'Key rotated and bucket policy reverted'}, ctx(lead)).state.cases['INC-01'].state, 'closed');
  const aud = act(s, {type: 'role', role: 'auditor'}, ctx(s)).state;
  assert.equal(act(aud, {type: 'ack', id: 'INC-10'}, ctx(aud)).ok, false);
  assert.equal(s.log.length, 2);
});

test('founder and contact', () => {
  assert.equal(site.team[0].name, 'David Emeka');
  assert.equal(site.email, 'david@securemesh.live');
});
