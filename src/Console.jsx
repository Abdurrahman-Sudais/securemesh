import React, {useEffect, useState} from 'react';
import {flushSync} from 'react-dom';
import site from './content.js';
import {ORG, assets, findings, hhmm, people, roles} from './data.js';
import {act, can, correlate, initial, summary} from './engine.js';
import {vt} from './fx.js';
import {Logo} from './App.jsx';

const KEY = 'securemesh-console-v1';
const INC = correlate(findings);
const SRC = ['GuardDuty', 'Security Hub', 'CloudWatch'];
const cls = (s) => `src s-${s.replace(/\s/g, '').toLowerCase()}`;

export default function Console() {
  const [state, setState] = useState(() => initial(roles));
  const [tab, setTab] = useState('inc');
  const [sel, setSel] = useState(INC[0].id);
  const [msg, setMsg] = useState('');
  const [why, setWhy] = useState('');
  const [note, setNote] = useState('');
  const [src, setSrc] = useState('all');
  useEffect(() => { try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s?.status) setState(s); } catch { /* ignore */ } }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } }, [state]);

  const actor = people[state.role];
  const allow = (p) => can(roles, state.role, p);
  const run = (a, after) => { const r = act(state, a, {roles, actor}); setMsg(r.ok ? '' : r.error); if (r.ok) { setState(r.state); after?.(); } };
  const go = (t) => vt(() => flushSync(() => { setTab(t); setMsg(''); }));
  const pick = (id) => vt(() => flushSync(() => { setSel(id); setWhy(''); setNote(''); setMsg(''); }));
  const cur = INC.find((i) => i.id === sel); const sm = summary(cur); const st = state.status[cur.id]; const cs = state.cases[cur.id];
  const open = INC.filter((i) => !['benign'].includes(state.status[i.id]?.s) && state.cases[i.id]?.state !== 'closed');
  const exportCsv = () => {
    const rows = [['incident', 'priority', 'score', 'findings', 'resources', 'status', 'case', 'reason'], ...INC.map((i) => [i.id, i.p, i.score, i.findings.map((f) => f.id).join(' '), i.resources.join(' '), state.status[i.id]?.s || 'new', state.cases[i.id]?.state || '', state.status[i.id]?.reason || state.cases[i.id]?.closing || ''])]
      .map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(','));
    const log = ['', '"time","actor","role","incident","action"', ...state.log.map((l) => [l.at, l.actor, l.role, l.id, l.summary].map((x) => `"${String(x).replace(/"/g, '""')}"`).join(','))];
    const url = URL.createObjectURL(new Blob([[...rows, ...log].join('\n')], {type: 'text/csv'})); const a = document.createElement('a'); a.href = url; a.download = 'securemesh-audit.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="cn">
      <header className="cn-top">
        <a href="/" className="brand" aria-label="Back to the SecureMesh website"><Logo size={26} /><span>SecureMesh</span></a>
        <span className="mono">{ORG.name} · {ORG.window}</span>
        <label className="cn-role">Signed in as <select value={state.role} onChange={(e) => run({type: 'role', role: e.target.value})}>{roles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select></label>
        <button className="btn ghost sm" onClick={() => { setState(initial(roles)); setMsg(''); }}>Reset</button>
      </header>
      <p className="cn-banner">Synthetic findings · read-only · summaries are drafts for analyst review · no automated response</p>
      <main className="cn-main">
        <div className="cn-head"><h1>{site.app.title}</h1><div className="cn-tabs" role="tablist">{[['inc', 'Incidents'], ['raw', 'Findings'], ['cases', 'Cases'], ['dash', 'Dashboard'], ['audit', 'Audit']].map(([id, l]) => <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => go(id)}>{l}</button>)}</div></div>
        {msg && <p className="cn-err" role="alert">{msg}</p>}

        {tab === 'inc' && (<div className="cn-grid">
          <aside className="cn-card"><h2>Queue <small>{open.length} open</small></h2><ul className="queue">{INC.map((i) => { const s = state.status[i.id]?.s || 'new'; return <li key={i.id}><button className={`${i.id === sel ? 'on' : ''} p-${i.p}`} onClick={() => pick(i.id)}><span className="pill">{i.p}</span><span><b>{i.types[0]}</b><small>{i.id} · {i.findings.length} finding{i.findings.length > 1 ? 's' : ''} · {s}</small></span><span className="sc">{i.score}</span></button></li>; })}</ul></aside>
          <section className="cn-card detail" style={{viewTransitionName: 'detail'}}>
            <p className="mono">{cur.id} · {hhmm(cur.start)}–{hhmm(cur.end)} · {cur.resources.join(', ')}</p>
            <h2><span className={`pill p-${cur.p}`}>{cur.p}</span> {cur.types[0]}</h2>
            <div className="why"><h3>Why this priority</h3><dl>
              <div><dt>Highest severity</dt><dd>{cur.sev.toFixed(1)} / 10</dd></div>
              <div><dt>Asset criticality</dt><dd>{['', 'Low', 'Medium', 'Critical'][cur.crit]}</dd></div>
              <div><dt>Corroboration</dt><dd>×{cur.corroboration.toFixed(2)} <small>{cur.types.length} signal types · {cur.sources.length} sources</small></dd></div>
              <div><dt>Confidence</dt><dd>{Math.round(cur.conf * 100)}%</dd></div>
              <div><dt>Score</dt><dd><b>{cur.score}</b></dd></div></dl>
              {cur.duplicates > 0 && <p className="fine">{cur.duplicates} duplicate finding{cur.duplicates > 1 ? 's' : ''} merged.</p>}</div>
            <div className="draft"><h3>Evidence summary <em>draft · review before use</em></h3><p>{sm.lead} {sm.crit}</p><ol>{sm.steps.map((s) => <li key={s}>{s}</li>)}</ol><p className="sug">{sm.suggest}</p></div>
            <h3>Findings</h3>
            <ul className="fl">{cur.findings.map((f) => <li key={f.id}><time>{hhmm(f.t)}</time><span className={cls(f.source)}>{f.source}</span><div><b>{f.type}</b><small>{f.detail}</small><code>{f.resource} · actor {f.actor} · sev {f.severity} · conf {Math.round(f.confidence * 100)}%</code></div></li>)}</ul>
          </section>
          <aside className="cn-card"><h2>Analyst decision</h2>
            <p className="state">Status: <b>{st?.s || 'new'}</b>{st?.by ? ` · by ${st.by}` : ''}</p>
            {st?.reason && <p className="fine">Reason: “{st.reason}”</p>}
            <div className="acts">
              <button className="btn sm" disabled={!allow('triage') || !!st} onClick={() => run({type: 'ack', id: cur.id})}>Acknowledge</button>
              <button className="btn sm" disabled={!allow('case') || !!cs} onClick={() => run({type: 'case', id: cur.id})}>Open a case</button>
            </div>
            <label className="lbl">Mark benign — reason (required)<textarea rows="3" value={why} onChange={(e) => setWhy(e.target.value)} disabled={!allow('triage')} placeholder="e.g. Planned penetration test, ticket CHG-1042" /></label>
            <button className="btn ghost sm" disabled={!allow('triage')} onClick={() => run({type: 'benign', id: cur.id, reason: why}, () => setWhy(''))}>Mark benign</button>
            {cs && <div className="case"><h3>Case · {cs.state}</h3>
              <div className="acts">{['investigating', 'contained', 'closed'].filter((x) => x !== cs.state).map((x) => <button key={x} className="btn ghost sm" disabled={!allow('case')} onClick={() => run({type: 'caseState', id: cur.id, value: x, reason: why}, () => setWhy(''))}>{x === 'closed' ? 'Close (uses reason above)' : `Mark ${x}`}</button>)}</div>
              <label className="lbl">Case note<input value={note} onChange={(e) => setNote(e.target.value)} disabled={!allow('case')} placeholder="What you checked" /></label>
              <button className="btn ghost sm" disabled={!allow('case')} onClick={() => run({type: 'note', id: cur.id, text: note}, () => setNote(''))}>Add note</button>
              <ul className="notes">{cs.notes.map((n, i) => <li key={i}><b>{n.by}</b> {n.text}</li>)}</ul></div>}
            {!allow('triage') && <p className="fine">The {roles.find((r) => r.id === state.role).label} role can view incidents but not triage them.</p>}
          </aside>
        </div>)}

        {tab === 'raw' && (<section className="cn-card"><h2>All findings <small>as received, read-only</small></h2>
          <div className="chips">{['all', ...SRC].map((s) => <button key={s} className={src === s ? 'on' : ''} onClick={() => setSrc(s)}>{s === 'all' ? 'All sources' : s}</button>)}</div>
          <table className="tbl"><thead><tr><th scope="col">Time</th><th scope="col">Source</th><th scope="col">Finding</th><th scope="col">Resource</th><th scope="col">Actor</th><th scope="col">Sev</th><th scope="col">Incident</th></tr></thead>
            <tbody>{findings.filter((f) => src === 'all' || f.source === src).map((f) => { const inc = INC.find((i) => i.findings.includes(f)); return <tr key={f.id}><td>{hhmm(f.t)}</td><td><span className={cls(f.source)}>{f.source}</span></td><th scope="row">{f.type}</th><td><code>{f.resource}</code></td><td><code>{f.actor}</code></td><td>{f.severity}</td><td><button className="link" onClick={() => { setSel(inc.id); go('inc'); }}>{inc.id}</button></td></tr>; })}</tbody></table>
          <p className="fine">Addresses are from documentation ranges (203.0.113.0/24, 198.51.100.0/24).</p></section>)}

        {tab === 'cases' && (<section className="cn-card"><h2>Cases</h2>{Object.keys(state.cases).length ? <ul className="cases">{Object.entries(state.cases).map(([id, c]) => { const i = INC.find((x) => x.id === id); return <li key={id}><span className={`pill p-${i.p}`}>{i.p}</span><div><b>{id} · {i.types[0]}</b><small>{c.state} · opened by {c.by} · {c.notes.length} note{c.notes.length === 1 ? '' : 's'}{c.closing ? ` · “${c.closing}”` : ''}</small></div><button className="btn ghost sm" onClick={() => { setSel(id); go('inc'); }}>Open</button></li>; })}</ul> : <p className="fine">No cases yet. Open one from an incident.</p>}</section>)}

        {tab === 'dash' && (<div className="dash">
          <section className="cn-card"><h2>Open incidents by priority</h2><div className="bars">{['P1', 'P2', 'P3', 'P4'].map((p) => { const n = open.filter((i) => i.p === p).length; return <div key={p} className={`p-${p}`}><span>{p}</span><i style={{'--w': `${(n / INC.length) * 100}%`}} /><b>{n}</b></div>; })}</div></section>
          <section className="cn-card"><h2>Findings by source</h2><div className="bars">{SRC.map((s) => { const n = findings.filter((f) => f.source === s).length; return <div key={s}><span>{s}</span><i style={{'--w': `${(n / findings.length) * 100}%`}} /><b>{n}</b></div>; })}</div></section>
          <section className="cn-card"><h2>Assets with findings</h2><ul className="assets">{Object.entries(assets).map(([a, m]) => { const n = findings.filter((f) => f.resource === a).length; return n ? <li key={a} className={`c${m.crit}`}><code>{a}</code><small>{m.env} · {m.owner}</small><b>{n}</b></li> : null; })}</ul></section>
          <section className="cn-card"><h2>Noise reduction</h2><dl className="kpis"><div><dt>Findings</dt><dd>{findings.length}</dd></div><div><dt>Incidents</dt><dd>{INC.length}</dd></div><div><dt>Benign (with reason)</dt><dd>{Object.values(state.status).filter((s) => s.s === 'benign').length}</dd></div><div><dt>Cases open</dt><dd>{Object.values(state.cases).filter((c) => c.state !== 'closed').length}</dd></div></dl></section>
        </div>)}

        {tab === 'audit' && (<section className="cn-card"><h2>Audit trail</h2><p className="fine">Every triage and case decision, with who made it and why. {allow('export') ? '' : 'Exports are available to the SOC lead and CISO.'}</p>
          {allow('export') && <button className="btn sm" onClick={exportCsv}>Export audit report (CSV)</button>}
          <ul className="log">{state.log.map((l, i) => <li key={i}><time>{new Date(l.at).toLocaleTimeString()}</time><b>{l.actor}</b><span>{roles.find((r) => r.id === l.role)?.label}</span><code>{l.id}</code>{l.summary}</li>)}{!state.log.length && <li className="fine">No decisions yet.</li>}</ul></section>)}
      </main>
    </div>
  );
}
